import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';

import ProductCard from '../components/ui/ProductCard';
import SizeGuideModal from '../components/ui/SizeGuideModal';
import QuickViewModal from '../components/ui/QuickViewModal';
import { flyToCart } from '../utils/animations';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useCreateReview } from '../queries/useReviews';
import { useProductsList } from '../queries/useProducts';
import { useOrdersList } from '../queries/useOrders';
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

  const { data: productsData, isLoading } = useProductsList();
  const PRODUCTS = productsData?.data || [];
  
  const { data: unfulfilledOrdersData } = useOrdersList({ fulfillmentStatus: 'unfulfilled' });
  const unfulfilledOrders = unfulfilledOrdersData?.data || [];

  const product = PRODUCTS.find((p) => p.id === id) || PRODUCTS[0];

  const [activeImage, setActiveImage] = useState(product?.image);
  const [selectedSize, setSelectedSize] = useState(product?.sizes?.[0] || '4Y-5Y');
  const [selectedColor, setSelectedColor] = useState(product?.colors?.[0]?.hex || '#AEE6FF');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewForm, setReviewForm] = useState({ name: '', rating: 5, comment: '' });
  const [reviewSubmitted, setReviewSubmitted] = useState(false);
  const createReview = useCreateReview();

  useEffect(() => {
    if (product) {
      setActiveImage(product.image);
      setSelectedSize(product.sizes?.[0] || '4Y-5Y');
      setSelectedColor(product.colors?.[0]?.hex || '#AEE6FF');
      setQuantity(1);
      window.scrollTo(0, 0);
    }
  }, [product]);

  if (isLoading || !product) {
    return <div className="min-h-screen bg-[#FFF8EC] py-24 text-center font-bold text-slate-500">Loading Product...</div>;
  }

  // Stock Validation Math
  // 1. Find the current variant based on size/color selection (fallback to first variant if none match exactly)
  const currentVariant = product.variants?.find(v => v.size === selectedSize && v.color === selectedColor) || product.variants?.[0];
  const stockOnHand = currentVariant?.stock || 0;
  
  // 2. Calculate Reserved
  let reservedCount = 0;
  unfulfilledOrders.forEach(order => {
    order.items?.forEach(item => {
      if (item.id === product.id && item.sku === currentVariant?.sku) {
        reservedCount += item.quantity;
      }
    });
  });
  
  const availableStock = Math.max(0, stockOnHand - reservedCount);

  const isFavorited = isInWishlist(product.id);

  const handleAddToCart = (e = null) => {
    if (quantity > availableStock && product.trackQuantity !== false) {
      alert(`Sorry, only ${availableStock} units available.`);
      return;
    }
    if (e) {
      flyToCart(e, product.image);
    }
    for (let i = 0; i < quantity; i++) {
      addToCart(product, selectedSize, selectedColor);
    }
  };

  const handleBuyNow = () => {
    handleAddToCart();
    navigate('/checkout');
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!reviewForm.name || !reviewForm.comment) return;
    
    await createReview.mutateAsync({
      productId: product.id,
      productName: product.name,
      customerName: reviewForm.name,
      rating: reviewForm.rating,
      comment: reviewForm.comment,
      status: 'pending',
      date: new Date().toISOString()
    });
    setReviewSubmitted(true);
    setShowReviewForm(false);
  };

  const galleryImages = product.gallery || [product.image];
  const relatedProducts = PRODUCTS.filter((p) => p.category === product.category && p.id !== product.id);

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
            <div className="relative h-96 sm:h-112.5 rounded-2xl overflow-hidden bg-[#FFF8EC] border border-slate-100 group">
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
                {product.categoryId} • {product.ageGroup}
              </span>

              <h1 className="text-2xl sm:text-4xl font-black text-slate-900 leading-tight">
                {product.title}
              </h1>

              {/* Rating & Stock */}
              <div className="flex items-center gap-4 mt-2 text-xs font-bold">
                <div className="flex items-center gap-1 text-amber-500 font-black">
                  <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
                  <span className="font-extrabold text-slate-900 ml-1">{product.variants?.rating || 4.8}</span>
                  <span className="text-slate-500 font-medium underline decoration-slate-300 underline-offset-4 cursor-pointer hover:text-slate-900 transition-colors">
                    {product.variants?.reviews || 124} Reviews
                  </span>
                </div>
                <span className="text-emerald-600 font-extrabold flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" /> In Stock ({availableStock} units)
                </span>
              </div>
            </div>

            {/* Pricing Section */}
            <div className="flex items-baseline gap-3 p-4 bg-[#FFF8EC] rounded-2xl border border-amber-100">
              <span className="text-3xl font-black text-slate-900">₹{product.basePrice}</span>
              {product.compareAtPrice && (
                <>
                  <span className="text-lg font-bold text-slate-400 line-through">₹{product.compareAtPrice}</span>
                  <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-black uppercase tracking-wider rounded-full">
                    Save ₹{product.compareAtPrice - product.basePrice}
                  </span>
                </>
              )}
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

            {/* Quantity & Actions */}
            <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row gap-4">
              <div className="flex items-center justify-between bg-slate-50 border border-slate-200 rounded-full px-4 py-3 sm:w-32 shrink-0">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="text-2xl font-black text-slate-400 hover:text-slate-900 transition-colors">−</button>
                <span className="font-extrabold text-slate-900 text-lg">{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)} className="text-2xl font-black text-slate-400 hover:text-slate-900 transition-colors">+</button>
              </div>
              
              <div className="flex-1 space-y-3">
                {product.trackQuantity !== false && availableStock <= 5 && availableStock > 0 && (
                  <div className="text-xs font-bold text-[#EF4A45]">Only {availableStock} left in stock - order soon.</div>
                )}
                {product.trackQuantity !== false && availableStock <= 0 && !product.allowBackorder && (
                  <div className="text-xs font-bold text-[#EF4A45]">Currently Out of Stock.</div>
                )}
                
                <div className="flex gap-3">
                  <button
                    onClick={handleAddToCart}
                    disabled={product.trackQuantity !== false && availableStock <= 0 && !product.allowBackorder}
                    className="flex-1 py-4 rounded-full bg-slate-900 text-white font-extrabold text-sm shadow-xl shadow-slate-900/20 hover:bg-slate-800 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ShoppingBag className="w-5 h-5" /> Add To Bag
                  </button>
                  <button
                    onClick={handleBuyNow}
                    disabled={product.trackQuantity !== false && availableStock <= 0 && !product.allowBackorder}
                    className="flex-1 py-4 rounded-full bg-[#EF4A45] text-white font-extrabold text-sm shadow-xl shadow-[#EF4A45]/20 hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Buy It Now
                  </button>
                </div>
              </div>
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
            {['description', 'fabric', 'care', 'shipping', 'reviews'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-4 capitalize transition-colors border-b-2 whitespace-nowrap ${
                  activeTab === tab ? 'border-[#EF4A45] text-[#EF4A45]' : 'border-transparent hover:text-slate-900'
                }`}
              >
                {tab === 'description' ? 'Description & Overview' : tab === 'fabric' ? 'Fabric & Material' : tab === 'care' ? 'Care Instructions' : tab === 'shipping' ? 'Shipping & Returns' : 'Customer Reviews'}
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
            {activeTab === 'reviews' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <div className="flex items-center gap-4">
                    <div className="text-4xl font-black text-slate-900">{product.rating}</div>
                    <div>
                      <div className="flex items-center gap-1 text-amber-500 mb-1">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-amber-400" />
                        ))}
                      </div>
                      <p className="text-xs text-slate-500 font-bold">Based on {product.reviewsCount} reviews</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setShowReviewForm(!showReviewForm)}
                    className="px-6 py-2.5 rounded-full bg-slate-900 text-white font-extrabold text-xs shadow-md hover:bg-slate-800 transition-colors"
                  >
                    Write a Review
                  </button>
                </div>
                
                {showReviewForm && !reviewSubmitted && (
                  <form onSubmit={handleReviewSubmit} className="p-6 bg-slate-50 rounded-2xl border border-slate-100 space-y-4">
                    <h4 className="font-bold text-slate-900">Write your review</h4>
                    <div>
                      <label className="text-xs font-bold text-slate-500 mb-1 block">Your Name</label>
                      <input type="text" required value={reviewForm.name} onChange={e => setReviewForm({...reviewForm, name: e.target.value})} className="w-full px-4 py-2 border border-slate-200 rounded-xl outline-none" />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-500 mb-1 block">Rating</label>
                      <select value={reviewForm.rating} onChange={e => setReviewForm({...reviewForm, rating: Number(e.target.value)})} className="w-full px-4 py-2 border border-slate-200 rounded-xl outline-none">
                        <option value={5}>5 Stars</option>
                        <option value={4}>4 Stars</option>
                        <option value={3}>3 Stars</option>
                        <option value={2}>2 Stars</option>
                        <option value={1}>1 Star</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-500 mb-1 block">Review</label>
                      <textarea required value={reviewForm.comment} onChange={e => setReviewForm({...reviewForm, comment: e.target.value})} className="w-full px-4 py-2 border border-slate-200 rounded-xl outline-none h-24" />
                    </div>
                    <button type="submit" className="px-6 py-2 bg-sky-500 text-white font-bold rounded-xl text-sm">Submit Review</button>
                  </form>
                )}
                
                {reviewSubmitted && (
                  <div className="p-4 bg-emerald-50 text-emerald-600 rounded-xl border border-emerald-100 text-sm font-bold flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5" />
                    Your review has been submitted and is pending moderation.
                  </div>
                )}
                
                <div className="space-y-4">
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-[#AEE6FF] flex items-center justify-center text-sky-900 font-black text-xs">A</div>
                        <span className="font-extrabold text-slate-900 text-sm">Ananya S.</span>
                        <span className="text-[10px] font-bold text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded-full">Verified Buyer</span>
                      </div>
                      <span className="text-xs font-semibold text-slate-400">2 days ago</span>
                    </div>
                    <div className="flex items-center gap-1 text-amber-500 mb-2">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-3 h-3 fill-amber-400" />
                      ))}
                    </div>
                    <p className="text-sm font-medium text-slate-700">Absolutely love the quality! The fabric is so soft and my kid loves wearing it all day. True to size.</p>
                  </div>

                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-[#FFD6BA] flex items-center justify-center text-orange-900 font-black text-xs">R</div>
                        <span className="font-extrabold text-slate-900 text-sm">Rahul M.</span>
                        <span className="text-[10px] font-bold text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded-full">Verified Buyer</span>
                      </div>
                      <span className="text-xs font-semibold text-slate-400">1 week ago</span>
                    </div>
                    <div className="flex items-center gap-1 text-amber-500 mb-2">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-3 h-3 fill-amber-400" />
                      ))}
                    </div>
                    <p className="text-sm font-medium text-slate-700">Great purchase. The color didn't fade after the first wash, which usually happens with other brands. Very satisfied.</p>
                  </div>
                </div>
              </div>
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
          className="grow py-3 rounded-full bg-[#EF4A45] text-white font-extrabold text-xs shadow-md flex items-center justify-center gap-1.5"
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
