"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Plus,
  Trash2,
  Save,
  Loader2,
  UploadCloud,
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
  stock: "100000",
};

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export default function NewProductPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [subcategoryGroups, setSubcategoryGroups] = useState<{title: string, items: string[]}[]>([]);

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

  // Product fields
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [category, setCategory] = useState<"cakes" | "flowers" | "combos">("cakes");
  const [selectedSubcategories, setSelectedSubcategories] = useState<string[]>([]);
  const [flavour, setFlavour] = useState("");
  const [tags, setTags] = useState("");

  // Flags
  const [isAvailable, setIsAvailable] = useState(true);
  const [isFeatured, setIsFeatured] = useState(false);
  const [isNewArrival, setIsNewArrival] = useState(false);
  const [isBestseller, setIsBestseller] = useState(false);

  // Variants
  const [variants, setVariants] = useState<VariantForm[]>([
    { weight: "500g", price: "549", compareAtPrice: "", sku: "", stock: "100000" },
    { weight: "1kg", price: "999", compareAtPrice: "", sku: "", stock: "100000" },
    { weight: "1.5kg", price: "1399", compareAtPrice: "", sku: "", stock: "100000" },
    { weight: "2kg", price: "1799", compareAtPrice: "", sku: "", stock: "100000" },
  ]);

  // Images
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [uploadingImage, setUploadingImage] = useState(false);

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

  const removeImageUrl = (index: number) =>
    setImageUrls(imageUrls.filter((_, i) => i !== index));

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    setUploadingImage(true);
    const newUrls = [...imageUrls];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const reader = new FileReader();
      reader.onloadend = () => {
        newUrls.push(reader.result as string);
        if (i === files.length - 1) {
          setImageUrls([...newUrls]);
          setUploadingImage(false);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e?: React.FormEvent | React.MouseEvent) => {
    e?.preventDefault?.();
    setError("");

    if (!name.trim()) {
      setError("Product name is required");
      return;
    }
    if (variants.length === 0 || !variants[0].price) {
      setError("At least one variant with a price is required");
      return;
    }

    setSaving(true);
    try {
      const payload = {
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
        deliveryOptions: [],
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
          compareAtPrice: v.compareAtPrice ? parseFloat(v.compareAtPrice) : undefined,
          sku: v.sku,
          stock: parseInt(v.stock) || 0,
        })),
      };

      const res = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success) {
        alert("Product created successfully!");
        router.push("/admin/products");
      } else {
        setError(data.message || "Failed to create product");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setSaving(false);
    }
  };

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
              New Product
            </h2>
            <p className="text-gray-500">
              Add a new product to your catalogue.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4 w-full sm:w-auto mt-4 sm:mt-0">
          <Link
            href="/admin/products"
            className="px-6 py-2.5 bg-gray-100 text-gray-600 rounded-xl hover:text-gray-900 border border-gray-200 transition-colors"
          >
            Cancel
          </Link>
          <button
            type="button"
            onClick={(e) => handleSubmit(e as any)}
            disabled={saving}
            className="flex items-center gap-2 px-6 py-2.5 bg-brand-rose text-white font-medium rounded-xl hover:bg-brand-rose/90 transition-colors shadow-lg shadow-brand-rose/20 disabled:opacity-50"
          >
            {saving ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Save className="w-5 h-5" />
            )}
            {saving ? "Creating..." : "Create"}
          </button>
        </div>
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
                  Choose 1 or more categories where this product should appear on the website.
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
                const groupSelectedCount = group.items.filter((item) => selectedSubcategories.includes(item)).length;
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
                            setSelectedSubcategories(selectedSubcategories.filter((s) => !group.items.includes(s)));
                          } else {
                            const combined = Array.from(new Set([...selectedSubcategories, ...group.items]));
                            setSelectedSubcategories(combined);
                          }
                        }}
                        className="text-[11px] font-semibold text-brand-rose hover:underline cursor-pointer"
                      >
                        {isAllInGroupSelected ? 'Deselect All' : 'Select All'}
                      </button>
                    </div>

                    <div className="p-3.5 space-y-2 max-h-[200px] overflow-y-auto custom-scrollbar">
                      {group.items.map((item) => {
                        const isChecked = selectedSubcategories.includes(item);

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
                                  setSelectedSubcategories([...selectedSubcategories, item]);
                                } else {
                                  setSelectedSubcategories(selectedSubcategories.filter((s) => s !== item));
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

          <div className="grid grid-cols-1 gap-5">
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

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {variants.map((v, idx) => (
              <div
                key={idx}
                className="bg-white border border-gray-200 rounded-xl p-4 space-y-3 relative group"
              >
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-semibold text-gray-600">Variant {idx + 1}</span>
                  <button
                    type="button"
                    onClick={() => removeVariant(idx)}
                    disabled={variants.length === 1}
                    className="p-1.5 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Weight / Size</label>
                  <input
                    type="text"
                    value={v.weight}
                    onChange={(e) => updateVariant(idx, "weight", e.target.value)}
                    placeholder="e.g. 500g"
                    className="w-full bg-white shadow-sm border border-gray-200 rounded-lg px-3 py-2 text-gray-900 placeholder:text-gray-400 text-sm focus:border-brand-rose outline-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Price (₹)</label>
                    <input
                      type="number"
                      value={v.price}
                      onChange={(e) => updateVariant(idx, "price", e.target.value)}
                      placeholder="499"
                      className="w-full bg-white shadow-sm border border-gray-200 rounded-lg px-3 py-2 text-gray-900 placeholder:text-gray-400 text-sm focus:border-brand-rose outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Compare At</label>
                    <input
                      type="number"
                      value={v.compareAtPrice}
                      onChange={(e) => updateVariant(idx, "compareAtPrice", e.target.value)}
                      placeholder="649"
                      className="w-full bg-white shadow-sm border border-gray-200 rounded-lg px-3 py-2 text-gray-900 placeholder:text-gray-400 text-sm focus:border-brand-rose outline-none"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">SKU</label>
                    <input
                      type="text"
                      value={v.sku}
                      onChange={(e) => updateVariant(idx, "sku", e.target.value)}
                      placeholder="CK-CT-500"
                      className="w-full bg-white shadow-sm border border-gray-200 rounded-lg px-3 py-2 text-gray-900 placeholder:text-gray-400 text-sm focus:border-brand-rose outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Stock</label>
                    <input
                      type="number"
                      value={v.stock}
                      onChange={(e) => updateVariant(idx, "stock", e.target.value)}
                      placeholder="50"
                      className="w-full bg-white shadow-sm border border-gray-200 rounded-lg px-3 py-2 text-gray-900 placeholder:text-gray-400 text-sm focus:border-brand-rose outline-none"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Image URLs */}
        <div className="bg-white shadow-sm border border-gray-200 rounded-2xl p-6 space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Product Images</h3>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {imageUrls.map((url, idx) => (
              <div key={idx} className="relative group aspect-square rounded-xl border border-gray-200 overflow-hidden bg-gray-100">
                <img src={url} alt={`Preview ${idx + 1}`} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button
                    type="button"
                    onClick={() => removeImageUrl(idx)}
                    className="p-2 bg-red-500/20 text-red-400 hover:bg-red-500/40 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}

            <label className="aspect-square rounded-xl border-2 border-dashed border-gray-200 bg-gray-100 hover:bg-gray-50 hover:border-brand-rose transition-colors cursor-pointer flex flex-col items-center justify-center gap-2 group relative">
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                className="hidden"
              />
              {uploadingImage ? (
                <Loader2 className="w-6 h-6 text-brand-rose animate-spin" />
              ) : (
                <>
                  <UploadCloud className="w-8 h-8 text-gray-500 group-hover:text-brand-rose transition-colors" />
                  <span className="text-xs text-gray-500 font-medium">Drop or Click</span>
                </>
              )}
            </label>
          </div>
        </div>


      </motion.form>
    </div>
  );
}
