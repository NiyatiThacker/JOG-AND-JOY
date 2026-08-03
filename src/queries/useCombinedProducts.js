import { useMemo } from 'react';
import { useProductsList } from './useProducts';

export function useCombinedProducts() {
  const { data, isLoading } = useProductsList();
  
  const combinedProducts = useMemo(() => {
    const liveProducts = (data?.data || []).map((p, index) => {
      // Map Admin schema to Frontend schema
      let category = p.categoryId || 'All';
      
      // Ensure "Boy" and "Girl" added from Admin match existing "Boys" and "Girls" logic
      // but we will also keep the exact category so both can be checked
      if (category === 'Boy') category = 'Boys';
      if (category === 'Girl') category = 'Girls';

      return {
        id: p.id,
        name: p.title || 'Untitled Product',
        category: category,
        originalCategory: p.categoryId,
        price: p.price || p.basePrice || 0,
        originalPrice: p.originalPrice || p.compareAtPrice,
        isNew: p.isNewArrival || index === 0,
        isBestSeller: index % 2 === 0,
        isTrending: index % 3 === 0 || index === 1,
        isSeasonal: index % 4 === 0 || index === 2,
        image: p.images?.[0] || p.image || 'https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?q=80&w=800&auto=format&fit=crop', // fallback
        gallery: p.images || (p.image ? [p.image] : []),
        description: p.description,
        fabric: p.fabric,
        care: p.care,
        shipping: p.shipping,
        sizes: p.sizes || ['4Y-5Y', '5Y-6Y', '7Y-8Y'],
        colors: p.colors || [],
        variants: p.variants || [],
        groupId: p.groupId || null,
        stock: p.variants?.[0]?.stock || p.stock || 10,
        rating: p.rating || 4.8,
        reviewsCount: p.reviewsCount || 24
      };
    });
    
    // Live products from Admin Panel
    return liveProducts;
  }, [data]);

  return { combinedProducts, isLoading };
}
