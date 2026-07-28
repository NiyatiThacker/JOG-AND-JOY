import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useCombinedProducts } from '../queries/useCombinedProducts';
import { useReviewsList, useCreateReview } from '../queries/useReviews';
import { ordersApi } from '../api/endpoints/orders';

import ProductCard from '../components/ui/ProductCard';
import SizeGuideModal from '../components/ui/SizeGuideModal';
import QuickViewModal from '../components/ui/QuickViewModal';
import { flyToCart } from '../utils/animations';
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
  Share2,
  X
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
  const [showAllColors, setShowAllColors] = useState(false);
  const [showAllSizes, setShowAllSizes] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  
  const createReviewMut = useCreateReview();
  const [reviewForm, setReviewForm] = useState({ rating: 5, title: '', body: '', orderId: '', email: '' });
  const [reviewError, setReviewError] = useState('');
  const [reviewSuccess, setReviewSuccess] = useState(false);
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setReviewError('');
    setIsSubmittingReview(true);
    try {
      const isAdmin = reviewForm.email.toLowerCase() === 'admin@jogandjoy.com';
      let customerName = 'Verified Buyer';

      if (isAdmin) {
        customerName = 'Store Admin';
      } else {
        let order;
        try {
          order = await ordersApi.get(reviewForm.orderId);
        } catch (err) {
          throw new Error('Order not found. Please check your Order ID.');
        }
        
        const orderEmail = order.customerInfo?.email || order.email || '';
        if (orderEmail.toLowerCase() !== reviewForm.email.toLowerCase()) {
          throw new Error('Email does not match this order.');
        }
        
        const hasProduct = order.items?.some(item => String(item.id) === String(product.id) || String(item.productId) === String(product.id));
        if (!hasProduct) {
          throw new Error('This product was not found in the specified order.');
        }
        
        customerName = order.customerInfo?.name || order.shippingAddress?.fullName || 'Verified Buyer';
      }
      
      // Verified! Submit review.
      await createReviewMut.mutateAsync({
        productId: String(product.id),
        rating: reviewForm.rating,
        title: reviewForm.title,
        body: reviewForm.body,
        customerName,
        customerEmail: reviewForm.email,
        orderId: isAdmin ? 'ADMIN-OVERRIDE' : reviewForm.orderId,
        status: isAdmin ? 'approved' : 'pending'
      });
      
      setReviewSuccess(true);
      
    } catch (err) {
      setReviewError(err.message || 'Verification failed. Please check your details.');
    } finally {
      setIsSubmittingReview(false);
    }
  };

  const { data: reviewsData } = useReviewsList({ productId: String(id), status: 'approved' });
  const reviews = reviewsData?.data || [];
  
  const reviewCount = reviews.length;
  const averageRating = reviewCount > 0 
    ? Number((reviews.reduce((acc, r) => acc + (r.rating || 5), 0) / reviewCount).toFixed(1))
    : 0;

  useEffect(() => {
    if (product) {
      setActiveImage(product.image);
      setSelectedSize(product.sizes?.[0] || '4Y-5Y');
      setSelectedColor(product.colors?.[0]?.hex || '#AEE6FF');
      setQuantity(1);
      window.scrollTo(0, 0);
    }
  }, [product]);

  const activeVariantImage = product?.variants?.find(
    (v) => v.colorHex === selectedColor && v.size === selectedSize
  )?.image;

  useEffect(() => {
    if (activeVariantImage) {
      setActiveImage(activeVariantImage);
    } else if (product?.image) {
      setActiveImage(product.image);
    }
  }, [activeVariantImage, product?.image, selectedColor, selectedSize]);

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center bg-[#FFF8EC] font-black text-slate-400">Loading Product...</div>;
  }

  if (!product) {
    return <div className="min-h-screen flex items-center justify-center bg-[#FFF8EC] font-black text-slate-800 text-2xl">Product not found.</div>;
  }

  const siblingProducts = combinedProducts.filter(p => 
    (product.groupId && p.groupId === product.groupId) ||
    (product.groupId && String(p.id) === String(product.groupId)) ||
    (p.groupId && String(p.groupId) === String(product.id)) ||
    String(p.id) === String(product.id)
  );

  const globalColors = [];
  siblingProducts.forEach(sibling => {
    sibling.colors?.forEach(color => {
      if (!globalColors.some(c => c.hex === color.hex)) {
        globalColors.push({ ...color, productId: sibling.id });
      }
    });
  });

  const getVisibleColors = () => {
    if (showAllColors || globalColors.length <= 9) return globalColors;
    const selectedIdx = globalColors.findIndex(c => c.hex === selectedColor);
    if (selectedIdx >= 9) {
      return [...globalColors.slice(0, 8), globalColors[selectedIdx]];
    }
    return globalColors.slice(0, 9);
  };

  const getVisibleSizes = () => {
    if (showAllSizes || !product.sizes || product.sizes.length <= 9) return product.sizes;
    const selectedIdx = product.sizes.findIndex(s => s === selectedSize);
    if (selectedIdx >= 9) {
      return [...product.sizes.slice(0, 8), product.sizes[selectedIdx]];
    }
    return product.sizes.slice(0, 9);
  };

  const activeVariant = product.variants?.find(
    (v) => v.colorHex === selectedColor && v.size === selectedSize
  );

  const displayPrice = activeVariant?.price || product.price;
  const displayStock = activeVariant ? activeVariant.stock : product.stock;

  const isFavorited = isInWishlist(product.id, selectedSize, selectedColor);

  const handleBuyNow = () => {
    addToCart(product, selectedSize, selectedColor, null, quantity, false);
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
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 bg-white rounded-3xl p-6 sm:p-10 shadow-xl border border-slate-100 lg:h-[630px] lg:overflow-hidden">

          {/* Left Column: Image Gallery & Thumbnails */}
          <div className="lg:col-span-6 space-y-4 h-full flex flex-col">

            {/* Main Active Image Viewport with Fixed Universal Dimensions */}
            <div className="relative w-full h-96 sm:h-[450px] rounded-2xl overflow-hidden bg-[#FFF8EC] border border-slate-100 group flex items-center justify-center">
              <img
                src={activeImage}
                alt={product.name}
                className="w-full h-full object-contain mix-blend-darken transition-transform duration-500 group-hover:scale-110"
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
                onClick={() => toggleWishlist(product.id, selectedSize, selectedColor)}
                className={`absolute top-4 right-4 p-3 rounded-full backdrop-blur-md transition-all shadow-md ${isFavorited ? 'bg-[#EF4A45] text-white' : 'bg-white/80 text-slate-700 hover:bg-white'}`}
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
                  className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-all shrink-0 ${activeImage === img ? 'border-[#EF4A45] ring-2 ring-[#EF4A45]/30' : 'border-slate-200 hover:border-slate-400'
                    }`}
                >
                  <img src={img} alt="Thumbnail" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>

          </div>

          {/* Right Column: Product Meta, Selectors & Actions */}
          <div className="lg:col-span-6 space-y-6 h-full lg:overflow-y-auto pr-2 lg:pr-4 pb-4">

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
                    <Star key={i} className={`w-4 h-4 ${i < Math.round(averageRating) ? 'fill-amber-400 text-amber-400' : 'fill-slate-200 text-slate-200'}`} />
                  ))}
                  <span className="text-slate-800 ml-1">{averageRating} ({reviewCount} reviews)</span>
                </div>
                {displayStock > 0 ? (
                  <span className="text-emerald-600 font-extrabold flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" /> In Stock ({displayStock} units)
                  </span>
                ) : (
                  <span className="text-red-500 font-extrabold flex items-center gap-1">
                    <X className="w-4 h-4" /> Out of Stock
                  </span>
                )}
              </div>
            </div>

            {/* Pricing Section */}
            <div className="flex items-baseline gap-3 p-4 bg-[#FFF8EC] rounded-2xl border border-amber-100">
              <span className="text-3xl font-black text-slate-900">₹{displayPrice}</span>
              {product.originalPrice && (
                <span className="text-base font-bold text-slate-400 line-through">₹{product.originalPrice}</span>
              )}
              <span className="text-xs font-black text-[#EF4A45] bg-red-100 px-2.5 py-1 rounded-full ml-auto">
                Save ₹{(product.originalPrice || displayPrice) - displayPrice}
              </span>
            </div>

            {/* Color Swatch Selector */}
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-700 uppercase tracking-wider block">
                Available Colors: {globalColors?.length > 0 && <span className="text-slate-900">{globalColors.find(c => c.hex === selectedColor)?.name}</span>}
              </label>
              {globalColors && globalColors.length > 0 ? (
                <div className="flex flex-wrap items-center gap-3 py-1.5 pl-1.5 pr-4">
                  {getVisibleColors()?.map((col, idx) => (
                    <button
                      key={col.hex}
                      onClick={() => {
                        if (String(col.productId) !== String(product.id)) {
                          navigate(`/product/${col.productId}`);
                        } else {
                          setSelectedColor(col.hex);
                          setShowAllColors(false);
                        }
                      }}
                      className={`w-9 h-9 rounded-full border-2 border-slate-200 shadow-md transition-transform ${selectedColor === col.hex ? 'scale-125 ring-2 ring-[#EF4A45]' : 'hover:scale-110'
                        }`}
                      style={{ backgroundColor: col.hex }}
                      title={col.name}
                    />
                  ))}
                  {!showAllColors && globalColors?.length > 9 && (
                    <button 
                      onClick={() => setShowAllColors(true)}
                      className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-black text-slate-600 hover:bg-slate-200 shadow-sm border border-slate-200 transition-colors"
                    >
                      +{globalColors.length - 9}
                    </button>
                  )}
                </div>
              ) : (
                <div className="inline-flex px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg">
                  <span className="text-xs font-bold text-slate-400">N/A - Single Edition</span>
                </div>
              )}
            </div>

            {/* Size Selector + Size Guide Modal Trigger */}
            <div className="space-y-2">
              <div className="flex items-center justify-between mb-1">
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

              {product.sizes && product.sizes.length > 0 ? (
                <div className="flex flex-wrap gap-2 py-1.5 pl-1.5 pr-4">
                  {getVisibleSizes()?.map((size, idx) => (
                    <button
                      key={size}
                      onClick={() => {
                        setSelectedSize(size);
                        setShowAllSizes(false);
                      }}
                      className={`px-4 py-2.5 rounded-2xl font-extrabold text-xs transition-transform ${selectedSize === size
                        ? 'bg-slate-900 text-white shadow-md scale-105'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        }`}
                    >
                      {size}
                    </button>
                  ))}
                  {!showAllSizes && product.sizes?.length > 9 && (
                    <button 
                      onClick={() => setShowAllSizes(true)}
                      className="px-4 py-2.5 rounded-2xl font-extrabold text-xs bg-slate-100 text-slate-600 hover:bg-slate-200 border border-slate-200 transition-colors"
                    >
                      +{product.sizes.length - 9} More
                    </button>
                  )}
                </div>
              ) : (
                <div className="inline-flex px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg">
                  <span className="text-xs font-bold text-slate-400">N/A - Standard Size</span>
                </div>
              )}
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
                onClick={(e) => addToCart(product, selectedSize, selectedColor, e, quantity, true)}
                disabled={displayStock === 0}
                className={`py-4 rounded-full font-extrabold text-sm shadow-xl transition-all flex items-center justify-center gap-2 ${
                  displayStock === 0
                    ? 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
                    : 'bg-[#EF4A45] hover:bg-red-600 text-white hover:shadow-2xl hover:scale-105'
                }`}
              >
                <ShoppingBag className="w-5 h-5" /> {displayStock === 0 ? 'Out of Stock' : 'Add To Bag'}
              </button>

              <button
                onClick={handleBuyNow}
                disabled={displayStock === 0}
                className={`py-4 rounded-full font-extrabold text-sm shadow-xl transition-all flex items-center justify-center gap-2 ${
                  displayStock === 0
                    ? 'bg-slate-300 text-slate-500 cursor-not-allowed shadow-none'
                    : 'bg-slate-900 hover:bg-slate-800 text-white hover:scale-105'
                }`}
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
            {['description', 'fabric', 'care', 'shipping', 'reviews'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-4 capitalize transition-colors border-b-2 whitespace-nowrap ${activeTab === tab ? 'border-[#EF4A45] text-[#EF4A45]' : 'border-transparent hover:text-slate-900'
                  }`}
              >
                {tab === 'description' ? 'Description & Overview' : tab === 'fabric' ? 'Fabric & Material' : tab === 'care' ? 'Care Instructions' : tab === 'shipping' ? 'Shipping & Returns' : 'Customer Reviews'}
              </button>
            ))}
          </div>

          <div className="py-6 text-sm text-slate-700 leading-relaxed font-medium">
            {activeTab === 'description' && (
              <div className="animate-in fade-in duration-300">
                <p>{product.description || 'Premium product designed for comfort and style.'}</p>
              </div>
            )}
            {activeTab === 'fabric' && (
              <div className="animate-in fade-in duration-300">
                <p><strong>Fabric Composition:</strong> {product.fabric || '100% Bio-Washed Premium Cotton. Sourced from certified mills using non-toxic Azo-free dyes. Pre-shrunk fabric ensures no shrinkage after washing.'}</p>
              </div>
            )}
            {activeTab === 'care' && (
              <div className="animate-in fade-in duration-300">
                <p><strong>Washing Instructions:</strong> {product.care || 'Machine wash cold inside out with similar colors. Do not bleach. Tumble dry low.'}</p>
              </div>
            )}
            {activeTab === 'shipping' && (
              <div className="animate-in fade-in duration-300">
                <p>{product.shipping || 'Standard delivery takes 3-5 business days across India. Free shipping applies on all orders above ₹999. Hassle-free 15-day return policy.'}</p>
              </div>
            )}
            {activeTab === 'reviews' && (
              <div className="space-y-8 animate-in fade-in duration-300">
                {reviewCount === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
                    <div className="w-16 h-16 bg-white rounded-full shadow-sm flex items-center justify-center mb-4">
                      <Star className="w-8 h-8 text-slate-300" />
                    </div>
                    <h4 className="text-lg font-black text-slate-900 mb-2">No reviews yet</h4>
                    <p className="text-sm text-slate-500 max-w-sm mb-6">Be the first to share your thoughts and help others make a decision!</p>
                    <button 
                      onClick={() => setIsReviewModalOpen(true)}
                      className="px-6 py-2.5 bg-slate-900 text-white text-sm font-bold rounded-full hover:bg-[#EF4A45] transition-colors shadow-md"
                    >
                      Write a Review
                    </button>
                  </div>
                ) : (
                  <>
                    {/* Review Summary */}
                    <div className="flex flex-col md:flex-row gap-8 items-start">
                      <div className="flex flex-col items-center justify-center p-6 bg-amber-50 rounded-2xl border border-amber-100 min-w-[200px]">
                        <div className="text-5xl font-black text-slate-900">{averageRating}</div>
                        <div className="flex items-center gap-1 my-2">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className={`w-5 h-5 ${i < Math.round(averageRating) ? 'fill-amber-400 text-amber-400' : 'fill-slate-200 text-slate-200'}`} />
                          ))}
                        </div>
                        <div className="text-xs font-bold text-slate-500">Based on {reviewCount} reviews</div>
                      </div>
                      
                      <div className="flex-1 w-full space-y-2">
                        {[5, 4, 3, 2, 1].map(stars => {
                          const count = reviews.filter(r => r.rating === stars).length;
                          const pct = reviewCount > 0 ? Math.round((count / reviewCount) * 100) : 0;
                          return (
                            <div key={stars} className="flex items-center gap-3 text-xs font-bold text-slate-600">
                              <span className="w-12 text-right">{stars} Stars</span>
                              <div className="flex-1 h-2.5 bg-slate-100 rounded-full overflow-hidden">
                                <div className="h-full bg-amber-400 rounded-full" style={{ width: `${pct}%` }} />
                              </div>
                              <span className="w-8 text-slate-400">{pct}%</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Review List */}
                    <div className="space-y-6">
                      <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
                        <h4 className="font-black text-slate-900 text-lg">Recent Reviews</h4>
                        <button 
                          onClick={() => setIsReviewModalOpen(true)}
                          className="px-4 py-2 bg-slate-100 text-slate-900 hover:bg-slate-200 text-xs font-bold rounded-full transition-colors"
                        >
                          Write a Review
                        </button>
                      </div>
                      
                      {reviews.map((review) => (
                        <div key={review.id} className="border-b border-slate-100 pb-6 last:border-0 last:pb-0">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-[#E6D6FF] flex items-center justify-center font-black text-purple-700">
                                {review.customerName?.charAt(0) || '?'}
                              </div>
                              <div>
                                <div className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                                  {review.customerName || 'Verified Buyer'}
                                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                                </div>
                                <div className="text-xs text-slate-400 font-medium">
                                  {new Date(review.createdAt).toLocaleDateString()}
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-0.5">
                              {[...Array(5)].map((_, i) => (
                                <Star key={i} className={`w-3.5 h-3.5 ${i < review.rating ? 'fill-amber-400 text-amber-400' : 'fill-slate-200 text-slate-200'}`} />
                              ))}
                            </div>
                          </div>
                          <h5 className="font-bold text-slate-800 text-sm mb-1">{review.title}</h5>
                          <p className="text-slate-600 text-sm leading-relaxed">{review.body}</p>
                          
                          {review.merchantReply && (
                            <div className="mt-4 p-4 bg-slate-50 rounded-xl border border-slate-100 text-sm">
                              <div className="font-bold text-slate-900 mb-1 flex items-center gap-1.5">
                                <ShieldCheck className="w-4 h-4 text-accent-green" />
                                Jog & Joy Team
                              </div>
                              <p className="text-slate-600">{review.merchantReply.body}</p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
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
                  <button className="px-6 py-2.5 rounded-full bg-slate-900 text-white font-extrabold text-xs shadow-md hover:bg-slate-800 transition-colors">
                    Write a Review
                  </button>
                </div>
                
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
          onClick={(e) => addToCart(product, selectedSize, selectedColor, e, quantity, true)}
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
      {/* Review Modal */}
      {isReviewModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => { setIsReviewModalOpen(false); setReviewSuccess(false); setReviewForm({ rating: 5, title: '', body: '', orderId: '', email: '' }); }} />
          <div className="relative bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h2 className="text-xl font-black text-slate-900">Write a Review</h2>
              <button onClick={() => { setIsReviewModalOpen(false); setReviewSuccess(false); setReviewForm({ rating: 5, title: '', body: '', orderId: '', email: '' }); }} className="p-2 text-slate-400 hover:bg-slate-200 hover:text-slate-900 rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 max-h-[80vh] overflow-y-auto">
              {reviewSuccess ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-emerald-100 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-black text-slate-900 mb-2">Review Submitted!</h3>
                  <p className="text-sm text-slate-500">Thank you for your feedback. Your review is currently pending moderation and will appear on the site soon.</p>
                  <button onClick={() => { setIsReviewModalOpen(false); setReviewSuccess(false); setReviewForm({ rating: 5, title: '', body: '', orderId: '', email: '' }); }} className="mt-6 px-6 py-2.5 bg-slate-900 text-white font-bold rounded-full hover:bg-[#EF4A45] transition-colors">
                    Close
                  </button>
                </div>
              ) : (
                <form onSubmit={handleReviewSubmit} className="space-y-5">
                  
                  <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 mb-6">
                    <h4 className="font-bold text-blue-900 text-sm mb-1 flex items-center gap-1.5"><ShieldCheck className="w-4 h-4" /> Purchase Verification Required</h4>
                    <p className="text-xs text-blue-700">To ensure authentic reviews, please provide your Order ID and Email address used during checkout.</p>
                  </div>

                  {reviewError && (
                    <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm font-bold border border-red-100 text-center">
                      {reviewError}
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">Order ID *</label>
                      <input required type="text" value={reviewForm.orderId} onChange={e => setReviewForm(prev => ({...prev, orderId: e.target.value}))} placeholder="e.g. ORD-12345" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-slate-900 focus:bg-white outline-none transition-all text-sm font-medium" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">Email Address *</label>
                      <input required type="email" value={reviewForm.email} onChange={e => setReviewForm(prev => ({...prev, email: e.target.value}))} placeholder="Your checkout email" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-slate-900 focus:bg-white outline-none transition-all text-sm font-medium" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">Overall Rating *</label>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map(star => (
                        <button key={star} type="button" onClick={() => setReviewForm(prev => ({...prev, rating: star}))} className="p-1 hover:scale-110 transition-transform">
                          <Star className={`w-8 h-8 ${reviewForm.rating >= star ? 'fill-amber-400 text-amber-400' : 'fill-slate-100 text-slate-200'}`} />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">Review Title *</label>
                    <input required type="text" value={reviewForm.title} onChange={e => setReviewForm(prev => ({...prev, title: e.target.value}))} placeholder="Sum up your experience" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-slate-900 focus:bg-white outline-none transition-all text-sm font-medium" />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">Your Review *</label>
                    <textarea required value={reviewForm.body} onChange={e => setReviewForm(prev => ({...prev, body: e.target.value}))} placeholder="What did you like or dislike?" rows="4" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-slate-900 focus:bg-white outline-none transition-all text-sm font-medium resize-none" />
                  </div>

                  <button disabled={isSubmittingReview} type="submit" className="w-full py-3.5 bg-slate-900 text-white font-black rounded-xl hover:bg-[#EF4A45] transition-colors shadow-lg disabled:opacity-50 flex items-center justify-center gap-2">
                    {isSubmittingReview ? 'Verifying Purchase...' : 'Submit Verified Review'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
