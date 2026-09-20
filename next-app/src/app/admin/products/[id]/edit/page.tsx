"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Plus,
  Trash2,
  Save,
  Loader2,
  ImagePlus,
  AlertTriangle,
  X,
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
        <Loader2 className="w-8 h-8 animate-spin text-brand-rose" />
        <span className="ml-3 text-gray-500">Loading product...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/products"
            className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h2 className="text-3xl font-display font-bold text-gray-900">
              Edit Product
            </h2>
            <p className="text-gray-500 text-sm">{id}</p>
          </div>
        </div>
        <button
          type="button"
          onClick={handleDelete}
          disabled={deleting}
          className="flex items-center gap-2 px-4 py-2.5 bg-red-500/10 text-red-400 border border-red-500/20 rounded-xl hover:bg-red-500/20 transition-colors disabled:opacity-50"
        >
          {deleting ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <AlertTriangle className="w-4 h-4" />
          )}
          {deleting ? "Deleting..." : "Delete Product"}
        </button>
      </div>

      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        onSubmit={handleSubmit}
        className="space-y-6"
      >
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl text-sm">
            {error}
          </div>
        )}

        {/* Basic Information */}
        <div className="bg-white shadow-sm border border-gray-200 rounded-2xl p-6 space-y-5">
          <h3 className="text-lg font-semibold text-gray-900">
            Basic Information
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-gray-800 mb-1.5">
                Product Name *
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="Chocolate Truffle Cake"
                className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-brand-rose outline-none transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-800 mb-1.5">
                Slug
              </label>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="chocolate-truffle-cake"
                className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-brand-rose outline-none transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-800 mb-1.5">
              Short Description
            </label>
            <input
              type="text"
              value={shortDescription}
              onChange={(e) => setShortDescription(e.target.value)}
              placeholder="Rich Belgian chocolate ganache with dark chocolate layers"
              className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-brand-rose outline-none transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-800 mb-1.5">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              placeholder="Full product description..."
              className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-brand-rose outline-none transition-colors resize-none"
            />
          </div>
        </div>

        {/* Category & Tags */}
        <div className="bg-white shadow-sm border border-gray-200 rounded-2xl p-6 space-y-5">
          <h3 className="text-lg font-semibold text-gray-900">
            Category &amp; Classification
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-gray-800 mb-1.5">
                Category *
              </label>
              <select
                value={category}
                onChange={(e) =>
                  setCategory(e.target.value as "cakes" | "flowers" | "combos")
                }
                className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 text-gray-900 focus:border-brand-rose focus:ring-1 focus:ring-brand-rose outline-none transition-colors"
              >
                <option value="cakes">Cakes</option>
                <option value="flowers">Flowers</option>
                <option value="combos">Combos</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-800 mb-1.5">
                Flavour
              </label>
              <input
                type="text"
                value={flavour}
                onChange={(e) => setFlavour(e.target.value)}
                placeholder="chocolate, vanilla..."
                className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-brand-rose outline-none transition-colors"
              />
            </div>
          </div>

          {/* Multi-Category Assignment Section */}
          <div className="bg-rose-50/30 border border-brand-rose/20 rounded-2xl p-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <label className="block text-base font-bold text-gray-900">
                  Assign Categories (Multiple Selection)
                </label>
                <p className="text-xs text-gray-500">
                  Choose 1 or more categories where this product should appear on the website. Old and new products can belong to multiple categories!
                </p>
              </div>
              <span className="self-start sm:self-auto px-3 py-1 rounded-full text-xs font-bold bg-brand-rose text-white shadow-xs">
                {selectedSubcategories.length} {selectedSubcategories.length === 1 ? 'Category' : 'Categories'} Selected
              </span>
            </div>

            {/* Selected Categories Badges Ribbon */}
            {selectedSubcategories.length > 0 && (
              <div className="flex flex-wrap items-center gap-1.5 p-3 bg-white rounded-xl border border-gray-200">
                <span className="text-xs font-semibold text-gray-500 mr-1">Active:</span>
                {selectedSubcategories.map((cat) => (
                  <span
                    key={cat}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-rose-50 text-brand-rose border border-brand-rose/30"
                  >
                    <span>{cat}</span>
                    <button
                      type="button"
                      onClick={() => setSelectedSubcategories(selectedSubcategories.filter((s) => s !== cat))}
                      className="hover:bg-brand-rose hover:text-white rounded-full p-0.5 transition-colors cursor-pointer"
                      title="Remove category"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
                <button
                  type="button"
                  onClick={() => setSelectedSubcategories([])}
                  className="text-xs text-gray-400 hover:text-red-600 underline ml-2 cursor-pointer font-medium"
                >
                  Clear all
                </button>
              </div>
            )}

            {/* Category Groups Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
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
                  <div key={group.title} className="bg-white rounded-xl border border-gray-200 shadow-xs overflow-hidden flex flex-col">
                    <div className="px-4 py-3 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <h4 className="text-xs font-bold text-gray-800 uppercase tracking-wider">{group.title}</h4>
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
                        className="text-[11px] font-semibold text-brand-rose hover:underline cursor-pointer"
                      >
                        {isAllInGroupSelected ? 'Deselect All' : 'Select All'}
                      </button>
                    </div>

                    <div className="p-3.5 space-y-2 max-h-[200px] overflow-y-auto custom-scrollbar">
                      {group.items.map((item) => {
                        const isChecked = isItemActive(item);

                        return (
                          <label
                            key={item}
                            className={`flex items-center gap-2.5 p-2 rounded-lg text-xs font-medium cursor-pointer transition-colors ${
                              isChecked
                                ? 'bg-rose-50/70 text-gray-900 font-semibold border border-brand-rose/25'
                                : 'text-gray-700 hover:bg-gray-50'
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
                              className="w-4 h-4 rounded border-gray-300 text-brand-rose focus:ring-brand-rose/20 cursor-pointer"
                            />
                            <span className="leading-tight flex-1">{item}</span>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-gray-800 mb-1.5">
                Tags (comma-separated)
              </label>
              <input
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="bestseller, birthday, anniversary"
                className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-brand-rose outline-none transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-800 mb-1.5">
                Delivery Options (comma-separated)
              </label>
              <input
                type="text"
                value={deliveryOptions}
                onChange={(e) => setDeliveryOptions(e.target.value)}
                placeholder="2hr, 4hr, same-day, next-day"
                className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-brand-rose outline-none transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Flags */}
        <div className="bg-white shadow-sm border border-gray-200 rounded-2xl p-6 space-y-5">
          <h3 className="text-lg font-semibold text-gray-900">Product Flags</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
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
                className={`flex items-center gap-3 px-4 py-3 rounded-xl border transition-colors ${
                  value
                    ? "bg-brand-rose/10 border-brand-rose/30 text-brand-rose"
                    : "bg-white border-gray-200 text-gray-500 hover:border-gray-500"
                }`}
              >
                <div
                  className={`w-10 h-5 rounded-full relative transition-colors ${
                    value ? "bg-brand-rose" : "bg-gray-200"
                  }`}
                >
                  <div
                    className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${
                      value ? "translate-x-5" : "translate-x-0.5"
                    }`}
                  />
                </div>
                <span className="text-sm font-medium">{label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Variants */}
        <div className="bg-white shadow-sm border border-gray-200 rounded-2xl p-6 space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">
              Variants ({variants.length})
            </h3>
            <button
              type="button"
              onClick={addVariant}
              className="flex items-center gap-2 px-3 py-2 text-sm bg-brand-rose/10 text-brand-rose rounded-lg hover:bg-brand-rose/20 transition-colors"
            >
              <Plus className="w-4 h-4" /> Add Variant
            </button>
          </div>

          <div className="space-y-3">
            <div className="hidden md:grid grid-cols-[1fr_1fr_1fr_1fr_0.7fr_40px] gap-3 text-xs text-gray-500 uppercase tracking-wider px-1">
              <span>Weight</span>
              <span>Price (₹)</span>
              <span>Compare At (₹)</span>
              <span>SKU</span>
              <span>Stock</span>
              <span></span>
            </div>

            {variants.map((v, idx) => (
              <div
                key={idx}
                className="grid grid-cols-1 md:grid-cols-[1fr_1fr_1fr_1fr_0.7fr_40px] gap-3 bg-gray-100 rounded-xl p-3 md:p-2"
              >
                <input
                  type="text"
                  value={v.weight}
                  onChange={(e) => updateVariant(idx, "weight", e.target.value)}
                  placeholder="500g"
                  className="bg-white border border-gray-200 rounded-lg px-3 py-2 text-gray-900 shadow-sm focus:ring-2 focus:ring-brand-rose/20 text-sm focus:border-brand-rose outline-none"
                />
                <input
                  type="number"
                  value={v.price}
                  onChange={(e) => updateVariant(idx, "price", e.target.value)}
                  placeholder="499"
                  className="bg-white border border-gray-200 rounded-lg px-3 py-2 text-gray-900 shadow-sm focus:ring-2 focus:ring-brand-rose/20 text-sm focus:border-brand-rose outline-none"
                />
                <input
                  type="number"
                  value={v.compareAtPrice}
                  onChange={(e) =>
                    updateVariant(idx, "compareAtPrice", e.target.value)
                  }
                  placeholder="649"
                  className="bg-white border border-gray-200 rounded-lg px-3 py-2 text-gray-900 shadow-sm focus:ring-2 focus:ring-brand-rose/20 text-sm focus:border-brand-rose outline-none"
                />
                <input
                  type="text"
                  value={v.sku}
                  onChange={(e) => updateVariant(idx, "sku", e.target.value)}
                  placeholder="CK-CT-500"
                  className="bg-white border border-gray-200 rounded-lg px-3 py-2 text-gray-900 shadow-sm focus:ring-2 focus:ring-brand-rose/20 text-sm focus:border-brand-rose outline-none"
                />
                <input
                  type="number"
                  value={v.stock}
                  onChange={(e) => updateVariant(idx, "stock", e.target.value)}
                  placeholder="50"
                  className="bg-white border border-gray-200 rounded-lg px-3 py-2 text-gray-900 shadow-sm focus:ring-2 focus:ring-brand-rose/20 text-sm focus:border-brand-rose outline-none"
                />
                <button
                  type="button"
                  onClick={() => removeVariant(idx)}
                  disabled={variants.length === 1}
                  className="p-2 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed self-center"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Image URLs */}
        <div className="bg-white shadow-sm border border-gray-200 rounded-2xl p-6 space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Image URLs</h3>
            <button
              type="button"
              onClick={addImageUrl}
              className="flex items-center gap-2 px-3 py-2 text-sm bg-brand-rose/10 text-brand-rose rounded-lg hover:bg-brand-rose/20 transition-colors"
            >
              <ImagePlus className="w-4 h-4" /> Add Image
            </button>
          </div>

          <div className="space-y-3">
            {imageUrls.map((url, idx) => (
              <div key={idx} className="flex gap-3">
                <input
                  type="text"
                  value={url}
                  onChange={(e) => updateImageUrl(idx, e.target.value)}
                  placeholder="/images/my-cake.png or https://..."
                  className="flex-1 bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-brand-rose outline-none transition-colors"
                />
                {url && (
                  <div className="w-12 h-12 rounded-xl border border-gray-200 overflow-hidden flex-shrink-0 bg-gray-100 flex items-center justify-center">
                    <img src={url} alt="Preview" className="w-full h-full object-cover" onError={(e) => { e.currentTarget.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="%239ca3af" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>'; e.currentTarget.className = "w-6 h-6 object-contain opacity-50"; }} />
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => removeImageUrl(idx)}
                  disabled={imageUrls.length === 1}
                  className="p-3 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Submit */}
        <div className="flex items-center justify-end gap-4">
          <Link
            href="/admin/products"
            className="px-6 py-3 bg-gray-100 text-gray-600 rounded-xl hover:text-gray-900 border border-gray-200 transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-6 py-3 bg-brand-rose text-white font-medium rounded-xl hover:bg-brand-rose/90 transition-colors shadow-lg shadow-brand-rose/20 disabled:opacity-50"
          >
            {saving ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Save className="w-5 h-5" />
            )}
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </motion.form>
    </div>
  );
}
