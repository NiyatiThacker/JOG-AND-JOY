import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useCombinedProducts } from '../queries/useCombinedProducts';
import { PRODUCTS } from '../data/productsData';
import ProductCard from '../components/ui/ProductCard';
import SizeGuideModal from '../components/ui/SizeGuideModal';
import QuickViewModal from '../components/ui/QuickViewModal';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import {
  Star,
  Heart,
  ShoppingBag,
  ShieldCheck,
  Truck,
  RotateCcw,
  Ruler,
  ChevronRight,
  Sparkles,
  CheckCircle2,
  Share2
} from 'lucide-react';

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const { combinedProducts, isLoading } = useCombinedProducts();
  const product = combinedProducts.find((p) => String(p.id) === String(id));

  const [activeImage, setActiveImage] = useState(null);
  const [selectedSize, setSelectedSize] = useState('4Y-5Y');
  const [selectedColor, setSelectedColor] = useState('#AEE6FF');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState(null);

  useEffect(() => {
    if (product) {
      setActiveImage(product.image);
      setSelectedSize(product.sizes?.[0] || '4Y-5Y');
      setSelectedColor(product.colors?.[0]?.hex || '#AEE6FF');
      setQuantity(1);
      window.scrollTo(0, 0);
    }
  }, [product]);

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center bg-[#FFF8EC] font-black text-slate-400">Loading Product...</div>;
  }

  if (!product) {
    return <div className="min-h-screen flex items-center justify-center bg-[#FFF8EC] font-black text-slate-800 text-2xl">Product not found.</div>;
  }

  const isFavorited = isInWishlist(product.id);

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(product, selectedSize, selectedColor);
    }
  };

  const handleBuyNow = () => {
    handleAddToCart();
    navigate('/checkout');
  };

  const galleryImages = product.gallery || [product.image];
  const relatedProducts = combinedProducts.filter((p) => p.category === product.category && String(p.id) !== String(product.id));

  return (
    <div className="min-h-screen bg-[#FFF8EC] py-8 pb-24 sm:pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs font-bold text-slate-500 mb-6">
          <Link to="/" className="hover:text-slate-900">Home</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link to="/products" className="hover:text-slate-900">Shop</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-slate-900 font-extrabold line-clamp-1">{product.name}</span>
        </nav>

        {/* Main Product Showcase Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 bg-white rounded-3xl p-6 sm:p-10 shadow-xl border border-slate-100">
          
          {/* Left Column: Image Gallery & Thumbnails */}
          <div className="lg:col-span-6 space-y-4">
            
            {/* Main Active Image Viewport with Zoom */}
            <div className="relative h-96 sm:h-[450px] rounded-2xl overflow-hidden bg-[#FFF8EC] border border-slate-100 group">
              <img
                src={activeImage}
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />

              {/* Badges Overlay */}
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                {product.discount && (
                  <span className="px-3 py-1 rounded-full bg-[#EF4A45] text-white text-xs font-black uppercase tracking-wider shadow-sm">
                    {product.discount}
                  </span>
                )}
                {product.isBestSeller && (
                  <span className="px-3 py-1 rounded-full bg-[#FFD800] text-slate-900 text-xs font-black uppercase tracking-wider shadow-sm">
                    BEST SELLER
                  </span>
                )}
              </div>

              {/* Wishlist Button */}
              <button
                onClick={() => toggleWishlist(product.id)}
                className={`absolute top-4 right-4 p-3 rounded-full backdrop-blur-md transition-all shadow-md ${
                  isFavorited ? 'bg-[#EF4A45] text-white' : 'bg-white/80 text-slate-700 hover:bg-white'
                }`}
              >
                <Heart className={`w-5 h-5 ${isFavorited ? 'fill-white' : ''}`} />
              </button>
            </div>

            {/* Thumbnail Selectors */}
            <div className="flex items-center gap-3 overflow-x-auto pb-2">
              {galleryImages.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(img)}
                  className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-all shrink-0 ${
                    activeImage === img ? 'border-[#EF4A45] ring-2 ring-[#EF4A45]/30' : 'border-slate-200 hover:border-slate-400'
                  }`}
                >
                  <img src={img} alt="Thumbnail" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>

          </div>

          {/* Right Column: Product Meta, Selectors & Actions */}
          <div className="lg:col-span-6 space-y-6">
            
            <div>
              <span className="px-3 py-1 rounded-full bg-[#AEE6FF]/50 text-sky-900 text-xs font-black uppercase tracking-wider">
                {product.category} • {product.ageGroup}
              </span>

              <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight mt-2">
                {product.name}
              </h1>

              {/* Rating & Stock */}
              <div className="flex items-center gap-4 mt-2 text-xs font-bold">
                <div className="flex items-center gap-1 text-amber-500 font-black">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                  <span className="text-slate-800 ml-1">{product.rating} ({product.reviewsCount} reviews)</span>
                </div>
                <span className="text-emerald-600 font-extrabold flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" /> In Stock ({product.stock} units)
                </span>
              </div>
            </div>

            {/* Pricing Section */}
            <div className="flex items-baseline gap-3 p-4 bg-[#FFF8EC] rounded-2xl border border-amber-100">
              <span className="text-3xl font-black text-slate-900">₹{product.price}</span>
              {product.originalPrice && (
                <span className="text-base font-bold text-slate-400 line-through">₹{product.originalPrice}</span>
              )}
              <span className="text-xs font-black text-[#EF4A45] bg-red-100 px-2.5 py-1 rounded-full ml-auto">
                Save ₹{(product.originalPrice || 0) - product.price}
              </span>
            </div>

            {/* Color Swatch Selector */}
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-700 uppercase tracking-wider block">
                Available Colors: <span className="text-slate-900">{product.colors?.find(c => c.hex === selectedColor)?.name}</span>
              </label>
              <div className="flex items-center gap-3">
                {product.colors?.map((col, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedColor(col.hex)}
                    className={`w-9 h-9 rounded-full border-2 border-white shadow-md transition-transform ${
                      selectedColor === col.hex ? 'scale-125 ring-2 ring-[#EF4A45]' : 'hover:scale-110'
                    }`}
                    style={{ backgroundColor: col.hex }}
                    title={col.name}
                  />
                ))}
              </div>
            </div>

            {/* Size Selector + Size Guide Modal Trigger */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-black text-slate-700 uppercase tracking-wider">
                  Select Size (Age):
                </label>
                <button
                  onClick={() => setIsSizeGuideOpen(true)}
                  className="text-xs font-black text-[#EF4A45] hover:underline flex items-center gap-1"
                >
                  <Ruler className="w-3.5 h-3.5" /> Size Guide 📐
                </button>
              </div>

              <div className="flex flex-wrap gap-2">
                {product.sizes?.map((size, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedSize(size)}
                    className={`px-4 py-2.5 rounded-2xl font-extrabold text-xs transition-all ${
                      selectedSize === size
                        ? 'bg-slate-900 text-white shadow-md scale-105'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity Selector */}
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-700 uppercase tracking-wider block">
                Quantity:
              </label>
              <div className="inline-flex items-center bg-slate-100 rounded-2xl p-1 font-black text-sm text-slate-800 border border-slate-200">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="w-9 h-9 rounded-xl hover:bg-white flex items-center justify-center transition-colors"
                >
                  -
                </button>
                <span className="w-12 text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  className="w-9 h-9 rounded-xl hover:bg-white flex items-center justify-center transition-colors"
                >
                  +
                </button>
              </div>
            </div>

            {/* Primary Action Buttons */}
            <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                onClick={(e) => addToCart(product, selectedSize, selectedColor, e)}
                className="py-4 rounded-full bg-[#EF4A45] hover:bg-red-600 text-white font-extrabold text-sm shadow-xl hover:shadow-2xl hover:scale-102 transition-all flex items-center justify-center gap-2"
              >
                <ShoppingBag className="w-5 h-5" /> Add To Bag
              </button>

              <button
                onClick={handleBuyNow}
                className="py-4 rounded-full bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-sm shadow-xl hover:scale-102 transition-all flex items-center justify-center gap-2"
              >
                Buy Now ⚡
              </button>
            </div>

            {/* Guarantees Box */}
            <div className="pt-4 border-t border-slate-100 grid grid-cols-3 gap-2 text-[11px] font-bold text-slate-600">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>100% Bio Cotton</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Truck className="w-4 h-4 text-sky-600 shrink-0" />
                <span>Free Express Delivery</span>
              </div>
              <div className="flex items-center gap-1.5">
                <RotateCcw className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Easy 15-Day Returns</span>
              </div>
            </div>

          </div>

        </div>

        {/* Tabs for Description, Fabric Details, Shipping Info */}
        <div className="mt-12 bg-white rounded-3xl p-6 sm:p-10 shadow-xl border border-slate-100">
          <div className="flex border-b border-slate-100 font-black text-sm text-slate-500 space-x-8 overflow-x-auto pb-1">
            {['description', 'fabric', 'care', 'shipping'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-4 capitalize transition-colors border-b-2 whitespace-nowrap ${
                  activeTab === tab ? 'border-[#EF4A45] text-[#EF4A45]' : 'border-transparent hover:text-slate-900'
                }`}
              >
                {tab === 'description' ? 'Description & Overview' : tab === 'fabric' ? 'Fabric & Material' : tab === 'care' ? 'Care Instructions' : 'Shipping & Returns'}
              </button>
            ))}
          </div>

          <div className="py-6 text-sm text-slate-700 leading-relaxed font-medium">
            {activeTab === 'description' && (
              <p>{product.description}</p>
            )}
            {activeTab === 'fabric' && (
              <p><strong>Fabric Composition:</strong> {product.fabric}. Sourced from certified mills using non-toxic Azo-free dyes. Pre-shrunk fabric ensures no shrinkage after washing.</p>
            )}
            {activeTab === 'care' && (
              <p><strong>Washing Instructions:</strong> {product.care}</p>
            )}
            {activeTab === 'shipping' && (
              <p>Standard delivery takes 3-5 business days across India. Free shipping applies on all orders above ₹999. Hassle-free 15-day return policy.</p>
            )}
          </div>
        </div>

        {/* Related Products Grid */}
        <div className="mt-16 space-y-6">
          <h3 className="text-2xl font-black text-slate-900 tracking-tight">You May Also Like 💫</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.slice(0, 4).map((p) => (
              <ProductCard key={p.id} product={p} onQuickView={setQuickViewProduct} />
            ))}
          </div>
        </div>

      </div>

      {/* Sticky Mobile Add To Cart Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md p-3 border-t border-slate-200 md:hidden flex items-center justify-between gap-3 shadow-2xl">
        <div>
          <span className="text-xs font-bold text-slate-500">Price</span>
          <p className="text-lg font-black text-slate-900">₹{product.price}</p>
        </div>
        <button
          onClick={handleAddToCart}
          className="flex-grow py-3 rounded-full bg-[#EF4A45] text-white font-extrabold text-xs shadow-md flex items-center justify-center gap-1.5"
        >
          <ShoppingBag className="w-4 h-4" /> Add To Bag
        </button>
      </div>

      {/* Size Guide Modal */}
      <SizeGuideModal isOpen={isSizeGuideOpen} onClose={() => setIsSizeGuideOpen(false)} />

      {/* Quick View Modal */}
      {quickViewProduct && (
        <QuickViewModal product={quickViewProduct} onClose={() => setQuickViewProduct(null)} />
      )}
    </div>
  );
}
