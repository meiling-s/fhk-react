import { useState, useEffect } from 'react';
import { Products } from '../../../../types/settings';
import { getProductTypeList } from '../../../../APICalls/ASTD/settings/productType';

const useFetchProducts = () => {
  const [products, setProducts] = useState<Products[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await getProductTypeList();
      const fetchedProducts = response.data;
      setProducts(fetchedProducts);
      setError(null); // clear error on success
    } catch (err) {
      console.error('Error fetching product types:', err);
      setError('Failed to load product types.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return { products, loading, error, refetch: fetchProducts };
};

export default useFetchProducts;
