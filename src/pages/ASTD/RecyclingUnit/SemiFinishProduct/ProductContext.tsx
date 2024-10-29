// ProductContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Products } from '../../../../types/settings';
import { getProductTypeList } from '../../../../APICalls/ASTD/settings/productType';

interface ProductContextProps {
  isOpen: boolean;
  products: Products[];
  loading: boolean;
  error: string | null;
  setIsOpen: (isOpen: boolean) => void;
  fetchProducts: () => void;
  onSuccess: () => void;
}

const ProductContext = createContext<ProductContextProps | undefined>(undefined);

export const ProductProvider = ({ children }: { children: ReactNode }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [products, setProducts] = useState<Products[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = async () => {
    try {
      const response = await getProductTypeList();
      const fetchedProducts = response.data;
      setProducts(fetchedProducts);
    } catch (err) {
      console.error('Error fetching product types:', err);
      setError('Failed to load product types.');
    } finally {
      setLoading(false);
    }
  };

  const onSuccess = () => {
    fetchProducts();
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <ProductContext.Provider value={{ isOpen, products, loading, error, setIsOpen, fetchProducts, onSuccess }}>
      {children}
    </ProductContext.Provider>
  );
};

export const useProductContext = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProductContext must be used within a ProductProvider');
  }
  return context;
};
