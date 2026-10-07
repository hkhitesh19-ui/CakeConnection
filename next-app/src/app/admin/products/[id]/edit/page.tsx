"use client";

import { useState, useEffect, use, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Plus,
  Trash2,
  Save,
  Loader2,
  AlertTriangle,
  X,
  Upload,
  Camera,
  Check,
} from "lucide-react";
import Link from "next/link";

interface VariantForm {
  weight: string;
  price: string;
  compareAtPrice: string;
  sku: string;
  stock: string;
}

const emptyVariant: VariantForm = {
  weight: "",
  price: "",
  compareAtPrice: "",
  sku: "",
  stock: "0",
};

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export default function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  // Product fields
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [category, setCategory] = useState<"cakes" | "flowers" | "combos">("cakes");
  const [selectedSubcategories, setSelectedSubcategories] = useState<string[]>([]);
  const [subcategoryGroups, setSubcategoryGroups] = useState<{title: string, items: string[]}[]>([]);
  const [flavour, setFlavour] = useState("");
  const [tags, setTags] = useState("");
  const [deliveryOptions, setDeliveryOptions] = useState("");

  // Flags
  const [isAvailable, setIsAvailable] = useState(true);
  const [isFeatured, setIsFeatured] = useState(false);
  const [isNewArrival, setIsNewArrival] = useState(false);
  const [isBestseller, setIsBestseller] = useState(false);

  // Variants
  const [variants, setVariants] = useState<VariantForm[]>([{ ...emptyVariant }]);

  // Images
  const [imageUrls, setImageUrls] = useState<string[]>([""]);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await fetch('/api/admin/categories');
        const data = await res.json();
        if (data.success && data.data) {
          const categories = data.data;
          const grouped = categories.reduce((acc: any, cat: any) => {
            const group = cat.group_name || 'Other';
            if (!acc[group]) acc[group] = [];
            acc[group].push(cat.name);
            return acc;
          }, {});

          const groupsArray = Object.entries(grouped).map(([title, items]) => ({
            title,
            items: items as string[]
          }));
          setSubcategoryGroups(groupsArray);
        }
      } catch (err) {
        console.error("Failed to fetch categories", err);
      }
    }
    fetchCategories();
  }, []);

  // Fetch product data
  useEffect(() => {
    async function fetchProduct() {
      try {
        const res = await fetch(`/api/admin/products?id=${id}`);
        const json = await res.json();
        if (json.success && json.data) {
          const p = json.data;
          setName(p.name || "");
          setSlug(p.slug || "");
          setDescription(p.description || "");
          setShortDescription(p.short_description || p.shortDescription || "");
          setCategory(p.category || "cakes");
          setSelectedSubcategories(p.subcategory ? p.subcategory.split(",").map((s: string) => s.trim()) : []);
          setFlavour(p.flavour || "");
          setTags(
            Array.isArray(p.tags) ? p.tags.join(", ") : p.tags || ""
          );
          setDeliveryOptions(
            Array.isArray(p.delivery_options || p.deliveryOptions)
              ? (p.delivery_options || p.deliveryOptions).join(", ")
              : ""
          );
          setIsAvailable(p.is_available ?? p.isAvailable ?? true);
          setIsFeatured(p.is_featured ?? p.isFeatured ?? false);
          setIsNewArrival(p.is_new_arrival ?? p.isNewArrival ?? false);
          setIsBestseller(p.is_bestseller ?? p.isBestseller ?? false);

          // Variants
          const rawVariants =
            p.product_variations || p.product_variants || p.variants || [];
          if (rawVariants.length > 0) {
            setVariants(
              rawVariants.map((v: any) => ({
                weight: v.weight || "",
                price: String(v.price || ""),
                compareAtPrice: v.compare_at_price || v.compareAtPrice
                  ? String(v.compare_at_price || v.compareAtPrice)
                  : "",
                sku: v.sku || "",
                stock: String(v.stock ?? 0),
              }))
            );
          }

          // Images
          const imgs = Array.isArray(p.images) ? p.images : [];
          if (imgs.length > 0) {
            setImageUrls(imgs.map((img: any) => (typeof img === "string" ? img : img.url || "")));
          }
        } else {
          setError("Product not found");
        }
      } catch (err) {
        setError("Failed to load product");
      } finally {
        setLoading(false);
      }
    }
    fetchProduct();
  }, [id]);

  const handleNameChange = (value: string) => {
    setName(value);
    setSlug(slugify(value));
  };

  const addVariant = () => setVariants([...variants, { ...emptyVariant }]);
  const removeVariant = (index: number) =>
    setVariants(variants.filter((_, i) => i !== index));
  const updateVariant = (index: number, field: keyof VariantForm, value: string) => {
    const updated = [...variants];
    updated[index] = { ...updated[index], [field]: value };
    setVariants(updated);
  };

  const addImageUrl = () => setImageUrls([...imageUrls, ""]);
  const removeImageUrl = (index: number) =>
    setImageUrls(imageUrls.filter((_, i) => i !== index));
  const updateImageUrl = (index: number, value: string) => {
    const updated = [...imageUrls];
    updated[index] = value;
    setImageUrls(updated);
  };

  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>, targetIndex = 0) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Instant local preview so user sees the photo immediately
    const localUrl = URL.createObjectURL(file);
    updateImageUrl(targetIndex, localUrl);

    setUploadingImage(true);
    setError("");
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", "cakes");

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (data.success && data.url) {
        updateImageUrl(targetIndex, data.url);
        setUploadSuccess(true);
        setTimeout(() => setUploadSuccess(false), 3500);
      } else {
        setError(data.message || "Failed to upload image");
      }
    } catch (err: any) {
      setError(err.message || "Network error while uploading image");
    } finally {
      setUploadingImage(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e?: React.FormEvent | React.MouseEvent) => {
    e?.preventDefault?.();
    setError("");

    if (!name.trim()) {
      setError("Product name is required");
      return;
    }

    setSaving(true);
    try {
      const payload = {
        id,
        name,
        slug,
        description,
        shortDescription,
        category,
        subcategory: selectedSubcategories.join(", "),
        flavour,
        tags: tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
        deliveryOptions: deliveryOptions
          .split(",")
          .map((d) => d.trim())
          .filter(Boolean),
        isAvailable,
        isFeatured,
        isNewArrival,
        isBestseller,
        images: imageUrls
          .filter((url) => url.trim())
          .map((url) => ({ url, alt: name })),
        variants: variants.map((v) => ({
          weight: v.weight,
          price: parseFloat(v.price) || 0,
          compareAtPrice: v.compareAtPrice
            ? parseFloat(v.compareAtPrice)
            : undefined,
          sku: v.sku,
          stock: parseInt(v.stock) || 0,
        })),
      };

      const res = await fetch("/api/admin/products", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success) {
        alert("Product updated successfully!");
        router.push("/admin/products");
      } else {
        setError(data.message || "Failed to update product");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this product? This action cannot be undone.")) {
      return;
    }

    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/products?id=${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        alert("Product deleted successfully!");
        router.push("/admin/products");
      } else {
        setError(data.message || "Failed to delete product");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-7 h-7 animate-spin text-brand-rose" />
        <span className="ml-2.5 text-xs text-gray-500 font-medium">Loading product...</span>
      </div>
    );
  }

  return (
    <div className="space-y-3 pb-8">
      {/* Compact Top Header */}
      <div className="flex items-center justify-between gap-3 pb-2 border-b border-gray-200">
        <div className="flex items-center gap-2.5">
          <Link
            href="/admin/products"
            className="p-1.5 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            title="Back to Products"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h2 className="text-xl font-display font-bold text-gray-900 leading-tight">
              Edit Product
            </h2>
            <p className="text-gray-400 text-[11px] font-mono leading-none mt-0.5">{id}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleDelete}
            disabled={deleting}
            className="h-8 px-3 text-xs bg-red-50 text-red-600 border border-red-200 rounded-lg hover:bg-red-100 transition-colors disabled:opacity-50 inline-flex items-center gap-1.5 cursor-pointer font-medium"
          >
            {deleting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <AlertTriangle className="w-3.5 h-3.5" />}
            {deleting ? "Deleting..." : "Delete"}
          </button>
          <Link
            href="/admin/products"
            className="h-8 px-3.5 text-xs bg-gray-100 text-gray-600 rounded-lg hover:text-gray-900 border border-gray-200 transition-colors inline-flex items-center font-medium"
          >
            Cancel
          </Link>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={saving}
            className="h-8 px-4 bg-brand-rose text-white text-xs font-bold rounded-lg hover:bg-brand-rose/90 transition-colors shadow-xs disabled:opacity-50 inline-flex items-center gap-1.5 cursor-pointer"
          >
            {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>

      <motion.form
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        onSubmit={handleSubmit}
        className="space-y-3"
      >
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-3 py-2 rounded-lg text-xs font-medium">
            {error}
          </div>
        )}

        {/* ── ROW 1: Basic Information + Images & Status Flags (Side-by-side) ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
          {/* Column 1: Basic Information (7 cols) */}
          <div className="lg:col-span-7 bg-white rounded-xl border border-gray-200 shadow-xs p-3 space-y-2.5">
            <h3 className="text-xs font-bold text-gray-800 uppercase tracking-wider flex items-center justify-between border-b border-gray-100 pb-1.5">
              <span>Basic Information</span>
              <span className="text-[10px] text-gray-400 font-normal normal-case">Required fields marked *</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div>
                <label className="block text-[11px] font-semibold text-gray-700 mb-0.5">
                  Product Name *
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="e.g. Chocolate Truffle Cake"
                  className="w-full h-8 px-2.5 bg-white border border-gray-200 rounded-lg text-xs text-gray-900 placeholder:text-gray-400 focus:border-brand-rose focus:ring-1 focus:ring-brand-rose/20 outline-none"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-gray-700 mb-0.5">
                  Slug
                </label>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="e.g. chocolate-truffle-cake"
                  className="w-full h-8 px-2.5 bg-white border border-gray-200 rounded-lg text-xs text-gray-900 placeholder:text-gray-400 focus:border-brand-rose focus:ring-1 focus:ring-brand-rose/20 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-gray-700 mb-0.5">
                Short Description
              </label>
              <input
                type="text"
                value={shortDescription}
                onChange={(e) => setShortDescription(e.target.value)}
                placeholder="Brief highlight, e.g. Rich Belgian ganache with dark chocolate layers"
                className="w-full h-8 px-2.5 bg-white border border-gray-200 rounded-lg text-xs text-gray-900 placeholder:text-gray-400 focus:border-brand-rose focus:ring-1 focus:ring-brand-rose/20 outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-gray-700 mb-0.5">
                Full Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={2}
                placeholder="Detailed product story, ingredients, occasion notes..."
                className="w-full px-2.5 py-1.5 bg-white border border-gray-200 rounded-lg text-xs text-gray-900 placeholder:text-gray-400 focus:border-brand-rose focus:ring-1 focus:ring-brand-rose/20 outline-none resize-none"
              />
            </div>
          </div>

          {/* Column 2: Image URLs & Product Flags (5 cols) */}
          <div className="lg:col-span-5 bg-white rounded-xl border border-gray-200 shadow-xs p-3 flex flex-col justify-between space-y-2.5">
            {/* Images */}
            <div className="space-y-2">
              <div className="flex items-center justify-between border-b border-gray-100 pb-1.5">
                <div className="flex items-center gap-2">
                  <h3 className="text-xs font-bold text-gray-800 uppercase tracking-wider">
                    Product Photo &amp; URLs ({imageUrls.filter(Boolean).length})
                  </h3>
                  {uploadSuccess && (
                    <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full flex items-center gap-1 border border-emerald-200">
                      <Check className="w-3 h-3" /> Uploaded!
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {/* Hidden file input */}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleImageFileChange(e, 0)}
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploadingImage}
                    className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-bold text-white bg-brand-rose hover:bg-brand-rose/90 rounded-lg shadow-xs transition-all cursor-pointer disabled:opacity-50"
                  >
                    {uploadingImage ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Upload className="w-3.5 h-3.5" />
                    )}
                    <span>{uploadingImage ? "Uploading..." : "Upload Image"}</span>
                  </button>
                  <button
                    type="button"
                    onClick={addImageUrl}
                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-brand-rose hover:underline cursor-pointer"
                  >
                    <Plus className="w-3 h-3" /> Add URL
                  </button>
                </div>
              </div>

              {/* Large Photo Preview Card + URL inputs side-by-side */}
              <div className="flex gap-2.5 items-start">
                {/* Large Product Photo Preview / Dropzone */}
                <div
                  onClick={() => !uploadingImage && fileInputRef.current?.click()}
                  title="Click to choose a photo from your computer"
                  className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl border-2 border-dashed border-brand-rose/40 hover:border-brand-rose bg-gray-50 overflow-hidden flex-shrink-0 relative group flex items-center justify-center shadow-xs cursor-pointer transition-all"
                >
                  {imageUrls[0]?.trim() ? (
                    <>
                      <img
                        key={imageUrls[0]}
                        src={imageUrls[0]}
                        alt="Main Product Preview"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          e.currentTarget.src = '/images/placeholder-cake.jpg';
                        }}
                      />
                      {uploadingImage ? (
                        <div className="absolute inset-0 bg-black/60 backdrop-blur-[1px] flex flex-col items-center justify-center text-white p-1 text-center">
                          <Loader2 className="w-5 h-5 animate-spin text-brand-rose mb-1" />
                          <span className="text-[10px] font-bold text-white">Saving...</span>
                        </div>
                      ) : (
                        <div className="absolute inset-0 bg-black/45 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white p-1 text-center">
                          <Camera className="w-5 h-5 mb-0.5" />
                          <span className="text-[9px] font-bold">Change Photo</span>
                        </div>
                      )}
                    </>
                  ) : uploadingImage ? (
                    <div className="flex flex-col items-center justify-center p-2 text-center">
                      <Loader2 className="w-6 h-6 animate-spin text-brand-rose mb-1" />
                      <span className="text-[10px] font-bold text-brand-rose">Uploading...</span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center text-gray-400 p-2 text-center group-hover:text-brand-rose transition-colors">
                      <Upload className="w-5 h-5 mb-1 text-brand-rose/60" />
                      <span className="text-[10px] font-bold text-gray-700">Click to Upload</span>
                      <span className="text-[8px] text-gray-400">JPG, PNG, WEBP</span>
                    </div>
                  )}
                  {imageUrls[0]?.trim() && !uploadingImage && (
                    <span className="absolute bottom-1 right-1 bg-black/65 text-white text-[9px] font-bold px-1.5 py-0.5 rounded backdrop-blur-xs">
                      Preview
                    </span>
                  )}
                </div>

                {/* URL Inputs List */}
                <div className="flex-1 min-w-0 space-y-1.5 max-h-[115px] overflow-y-auto pr-1">
                  {imageUrls.map((url, idx) => (
                    <div key={idx} className="flex items-center gap-1.5">
                      <input
                        type="text"
                        value={url}
                        onChange={(e) => updateImageUrl(idx, e.target.value)}
                        placeholder="/images/cakes/... or https://..."
                        className="flex-1 h-7.5 px-2 bg-white border border-gray-200 rounded-md text-xs text-gray-900 placeholder:text-gray-400 focus:border-brand-rose outline-none"
                      />
                      {url && idx > 0 && (
                        <div className="w-7.5 h-7.5 rounded border border-gray-200 overflow-hidden flex-shrink-0 bg-gray-100 flex items-center justify-center">
                          <img
                            src={url}
                            alt={`Thumb ${idx + 1}`}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.currentTarget.src = '/images/placeholder-cake.jpg';
                            }}
                          />
                        </div>
                      )}
                      <button
                        type="button"
                        onClick={() => removeImageUrl(idx)}
                        disabled={imageUrls.length === 1}
                        className="p-1 text-gray-400 hover:text-red-500 rounded disabled:opacity-30 cursor-pointer"
                        title="Remove image"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                  <div className="text-[10px] text-gray-400 italic">
                    💡 Click <b>"Upload Image"</b> or click the photo box to choose an image from your PC.
                  </div>
                </div>
              </div>
            </div>

            {/* Product Flags */}
            <div className="border-t border-gray-100 pt-2">
              <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                Product Visibility &amp; Flags
              </div>
              <div className="grid grid-cols-2 gap-1.5">
                {[
                  { label: "Available", value: isAvailable, setter: setIsAvailable },
                  { label: "Featured", value: isFeatured, setter: setIsFeatured },
                  { label: "New Arrival", value: isNewArrival, setter: setIsNewArrival },
                  { label: "Bestseller", value: isBestseller, setter: setIsBestseller },
                ].map(({ label, value, setter }) => (
                  <button
                    key={label}
                    type="button"
                    onClick={() => setter(!value)}
                    className={`flex items-center justify-between px-2 py-1 rounded-lg border text-xs transition-all cursor-pointer ${
                      value
                        ? "bg-rose-50 border-brand-rose/30 text-brand-rose font-bold"
                        : "bg-gray-50 border-gray-200 text-gray-600 hover:border-gray-300 font-medium"
                    }`}
                  >
                    <span>{label}</span>
                    <div
                      className={`w-5.5 h-3 rounded-full relative transition-colors ${
                        value ? "bg-brand-rose" : "bg-gray-300"
                      }`}
                    >
                      <div
                        className={`absolute top-0.5 w-2 h-2 rounded-full bg-white transition-transform ${
                          value ? "translate-x-3" : "translate-x-0.5"
                        }`}
                      />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── ROW 2: Variants with Price ── */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-xs p-3 space-y-2">
          <div className="flex items-center justify-between border-b border-gray-100 pb-1.5">
            <div className="flex items-center gap-2">
              <h3 className="text-xs font-bold text-gray-800 uppercase tracking-wider">
                Variants &amp; Pricing ({variants.length})
              </h3>
              <span className="text-[11px] text-gray-400">
                (Set weight options, price, compare at price, sku, and stock)
              </span>
            </div>
            <button
              type="button"
              onClick={addVariant}
              className="inline-flex items-center gap-1 px-2.5 py-1 text-xs bg-brand-rose/10 text-brand-rose hover:bg-brand-rose/20 rounded-lg font-bold transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" /> Add Variant
            </button>
          </div>

          <div className="space-y-1.5">
            <div className="hidden md:grid grid-cols-[1.2fr_1.3fr_1.1fr_1.1fr_0.7fr_36px] gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-wider px-2">
              <span>Weight / Size</span>
              <span>After Discount Price (₹) *</span>
              <span>MRP Price (₹)</span>
              <span>SKU</span>
              <span>Stock</span>
              <span></span>
            </div>

            {variants.map((v, idx) => (
              <div
                key={idx}
                className="grid grid-cols-1 md:grid-cols-[1.2fr_1.3fr_1.1fr_1.1fr_0.7fr_36px] gap-2 items-center bg-gray-50/70 hover:bg-gray-50 rounded-lg p-1.5 border border-gray-200/80 transition-colors"
              >
                <div>
                  <span className="text-[10px] text-gray-500 md:hidden block font-medium">Weight</span>
                  <input
                    type="text"
                    value={v.weight}
                    onChange={(e) => updateVariant(idx, "weight", e.target.value)}
                    placeholder="e.g. 500g"
                    className="w-full h-7 px-2 text-xs bg-white border border-gray-200 rounded text-gray-900 placeholder:text-gray-400 focus:border-brand-rose outline-none"
                  />
                </div>
                <div>
                  <span className="text-[10px] text-gray-500 md:hidden block font-medium">After Discount Price (₹)</span>
                  <input
                    type="number"
                    value={v.price}
                    onChange={(e) => updateVariant(idx, "price", e.target.value)}
                    placeholder="499"
                    className="w-full h-7 px-2 text-xs bg-white border border-gray-200 rounded text-gray-900 placeholder:text-gray-400 focus:border-brand-rose outline-none font-semibold"
                  />
                </div>
                <div>
                  <span className="text-[10px] text-gray-500 md:hidden block font-medium">MRP Price (₹)</span>
                  <input
                    type="number"
                    value={v.compareAtPrice}
                    onChange={(e) => updateVariant(idx, "compareAtPrice", e.target.value)}
                    placeholder="549"
                    className="w-full h-7 px-2 text-xs bg-white border border-gray-200 rounded text-gray-900 placeholder:text-gray-400 focus:border-brand-rose outline-none"
                  />
                </div>
                <div>
                  <span className="text-[10px] text-gray-500 md:hidden block font-medium">SKU</span>
                  <input
                    type="text"
                    value={v.sku}
                    onChange={(e) => updateVariant(idx, "sku", e.target.value)}
                    placeholder="CK-CT-500"
                    className="w-full h-7 px-2 text-xs bg-white border border-gray-200 rounded text-gray-900 placeholder:text-gray-400 focus:border-brand-rose outline-none"
                  />
                </div>
                <div>
                  <span className="text-[10px] text-gray-500 md:hidden block font-medium">Stock</span>
                  <input
                    type="number"
                    value={v.stock}
                    onChange={(e) => updateVariant(idx, "stock", e.target.value)}
                    placeholder="50"
                    className="w-full h-7 px-2 text-xs bg-white border border-gray-200 rounded text-gray-900 placeholder:text-gray-400 focus:border-brand-rose outline-none"
                  />
                </div>
                <div className="flex justify-end md:justify-center">
                  <button
                    type="button"
                    onClick={() => removeVariant(idx)}
                    disabled={variants.length === 1}
                    className="p-1 text-gray-400 hover:text-red-500 rounded disabled:opacity-30 cursor-pointer"
                    title="Remove variant"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── ROW 3: Category & Classification (At bottom, NO inner scrollbar) ── */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-xs p-3 space-y-2.5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 border-b border-gray-100 pb-1.5">
            <div>
              <h3 className="text-xs font-bold text-gray-800 uppercase tracking-wider">
                Category &amp; Classification
              </h3>
              <p className="text-[11px] text-gray-500">
                Choose 1 or more categories where this product should appear. All items visible directly without scrolling.
              </p>
            </div>
            <span className="self-start sm:self-auto px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-brand-rose text-white shadow-xs">
              {selectedSubcategories.length} {selectedSubcategories.length === 1 ? 'Category' : 'Categories'} Selected
            </span>
          </div>

          {/* Inline top row: Department, Flavour, Tags, Delivery Options */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 bg-gray-50/70 p-2 rounded-lg border border-gray-200/70">
            <div>
              <label className="block text-[11px] font-semibold text-gray-700 mb-0.5">
                Department Category *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as "cakes" | "flowers" | "combos")}
                className="w-full h-7.5 px-2 bg-white border border-gray-200 rounded-md text-xs text-gray-900 focus:border-brand-rose outline-none cursor-pointer"
              >
                <option value="cakes">Cakes</option>
                <option value="flowers">Flowers</option>
                <option value="combos">Combos</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-gray-700 mb-0.5">
                Flavour
              </label>
              <input
                type="text"
                value={flavour}
                onChange={(e) => setFlavour(e.target.value)}
                placeholder="chocolate, vanilla..."
                className="w-full h-7.5 px-2 bg-white border border-gray-200 rounded-md text-xs text-gray-900 placeholder:text-gray-400 focus:border-brand-rose outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-gray-700 mb-0.5">
                Tags (comma-separated)
              </label>
              <input
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="bestseller, birthday"
                className="w-full h-7.5 px-2 bg-white border border-gray-200 rounded-md text-xs text-gray-900 placeholder:text-gray-400 focus:border-brand-rose outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-gray-700 mb-0.5">
                Delivery Options (comma-sep)
              </label>
              <input
                type="text"
                value={deliveryOptions}
                onChange={(e) => setDeliveryOptions(e.target.value)}
                placeholder="2hr, 4hr, same-day"
                className="w-full h-7.5 px-2 bg-white border border-gray-200 rounded-md text-xs text-gray-900 placeholder:text-gray-400 focus:border-brand-rose outline-none"
              />
            </div>
          </div>

          {/* Active Tags Ribbon */}
          {selectedSubcategories.length > 0 && (
            <div className="flex flex-wrap items-center gap-1.5 p-2 bg-rose-50/40 rounded-lg border border-brand-rose/20">
              <span className="text-[11px] font-bold text-gray-600 mr-1">Active:</span>
              {selectedSubcategories.map((cat) => (
                <span
                  key={cat}
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-white text-brand-rose border border-brand-rose/30 shadow-xs"
                >
                  <span>{cat}</span>
                  <button
                    type="button"
                    onClick={() => setSelectedSubcategories(selectedSubcategories.filter((s) => s !== cat))}
                    className="hover:bg-brand-rose hover:text-white rounded p-0.5 transition-colors cursor-pointer"
                    title="Remove category"
                  >
                    <X className="w-2.5 h-2.5" />
                  </button>
                </span>
              ))}
              <button
                type="button"
                onClick={() => setSelectedSubcategories([])}
                className="text-[11px] text-gray-400 hover:text-red-600 underline ml-2 cursor-pointer font-medium"
              >
                Clear all
              </button>
            </div>
          )}

          {/* 3-Column Subcategory Groups - FULLY EXPANDED, NO INNER SCROLLBAR */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-start">
            {subcategoryGroups.map((group) => {
              const isItemActive = (item: string) => {
                return selectedSubcategories.some((s) => {
                  const sNorm = s.trim().toLowerCase();
                  const itemNorm = item.trim().toLowerCase();
                  if (sNorm === itemNorm) return true;
                  const sSlug = slugify(s);
                  const itemSlug = slugify(item);
                  return sSlug === itemSlug || sSlug.replace(/-cakes?$/, '') === itemSlug.replace(/-cakes?$/, '');
                });
              };

              const groupSelectedCount = group.items.filter((item) => isItemActive(item)).length;
              const isAllInGroupSelected = group.items.length > 0 && groupSelectedCount === group.items.length;

              return (
                <div
                  key={group.title}
                  className="bg-gray-50/50 rounded-xl border border-gray-200 overflow-hidden flex flex-col"
                >
                  <div className="px-3 py-1.5 bg-gray-100/70 border-b border-gray-200 flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <h4 className="text-[11px] font-bold text-gray-800 uppercase tracking-wider">
                        {group.title}
                      </h4>
                      {groupSelectedCount > 0 && (
                        <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-rose-100 text-brand-rose">
                          {groupSelectedCount}
                        </span>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        if (isAllInGroupSelected) {
                          setSelectedSubcategories(selectedSubcategories.filter((s) => !group.items.some(item => {
                            const sNorm = s.trim().toLowerCase();
                            const itemNorm = item.trim().toLowerCase();
                            return sNorm === itemNorm || slugify(s) === slugify(item);
                          })));
                        } else {
                          const newSelection = [...selectedSubcategories];
                          group.items.forEach((item) => {
                            if (!isItemActive(item)) newSelection.push(item);
                          });
                          setSelectedSubcategories(newSelection);
                        }
                      }}
                      className="text-[10px] font-bold text-brand-rose hover:underline cursor-pointer"
                    >
                      {isAllInGroupSelected ? 'Deselect All' : 'Select All'}
                    </button>
                  </div>

                  {/* NO max-h, NO overflow-y-auto: all subcategories visible directly */}
                  <div className="p-2 space-y-0.5">
                    {group.items.map((item) => {
                      const isChecked = isItemActive(item);

                      return (
                        <label
                          key={item}
                          className={`flex items-center gap-2 px-2 py-1 rounded text-[11px] cursor-pointer transition-colors ${
                            isChecked
                              ? 'bg-rose-50 text-brand-rose font-bold border border-brand-rose/25'
                              : 'text-gray-700 hover:bg-white hover:border-gray-200 font-medium'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={(e) => {
                              if (e.target.checked) {
                                if (!isChecked) {
                                  setSelectedSubcategories([...selectedSubcategories, item]);
                                }
                              } else {
                                setSelectedSubcategories(selectedSubcategories.filter((s) => {
                                  const sNorm = s.trim().toLowerCase();
                                  const itemNorm = item.trim().toLowerCase();
                                  return sNorm !== itemNorm && slugify(s) !== slugify(item);
                                }));
                              }
                            }}
                            className="w-3.5 h-3.5 rounded border-gray-300 text-brand-rose focus:ring-brand-rose/20 cursor-pointer"
                          />
                          <span className="leading-tight flex-1 select-none">{item}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom Save Bar */}
        <div className="flex items-center justify-end gap-3 pt-1">
          <Link
            href="/admin/products"
            className="h-8 px-4 text-xs font-semibold bg-gray-100 text-gray-600 rounded-lg hover:text-gray-900 border border-gray-200 transition-colors inline-flex items-center"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="h-8 px-5 bg-brand-rose text-white text-xs font-bold rounded-lg hover:bg-brand-rose/90 transition-colors shadow-xs disabled:opacity-50 inline-flex items-center gap-1.5 cursor-pointer"
          >
            {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </motion.form>
    </div>
  );
}
