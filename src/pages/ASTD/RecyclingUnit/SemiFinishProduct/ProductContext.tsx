import React, { createContext, useContext, useReducer, ReactNode, useEffect } from 'react';
import { Products, ProductSubType, ProductAddon } from '../../../../interfaces/productTypes';
import { getProductTypeList } from '../../../../APICalls/ASTD/settings/productType';

type State = {
  products: Products[];
  loading: boolean;
  error: string | null;
};

type Action =
  | { type: 'FETCH_INIT' }
  | { type: 'FETCH_SUCCESS'; payload: Products[] }
  | { type: 'FETCH_FAILURE'; payload: string }
  | { type: 'UPDATE_PRODUCT'; payload: Products }
  | { type: 'ADD_PRODUCT'; payload: Products }
  | { type: 'UPDATE_SUB_PRODUCT'; payload: { productTypeId: string; subProduct: ProductSubType } }
  | { type: 'ADD_SUB_PRODUCT'; payload: { productTypeId: string; subProduct: ProductSubType } }
  | { type: 'DELETE_SUB_PRODUCT'; payload: { productTypeId: string; subProductId: string } }
  | { type: 'UPDATE_ADDON'; payload: { productTypeId: string; subProductId: string; addon: ProductAddon } }
  | { type: 'ADD_ADDON'; payload: { productTypeId: string; subProductId: string; addon: ProductAddon } }
  | { type: 'DELETE_ADDON'; payload: { productTypeId: string; subProductId: string; addonId: string } }
  | { type: 'DELETE_PRODUCT'; payload: string };

const initialState: State = {
  products: [],
  loading: false,
  error: null,
};

function productReducer(state: State, action: Action): State {
  switch (action.type) {
    case 'FETCH_INIT':
      return { ...state, loading: true, error: null };
    case 'FETCH_SUCCESS':
      return { ...state, loading: false, products: action.payload };
    case 'FETCH_FAILURE':
      return { ...state, loading: false, error: action.payload };
    case 'UPDATE_PRODUCT':
      return {
        ...state,
        products: state.products.map((product) =>
          product.productTypeId === action.payload.productTypeId ? { ...product, ...action.payload } : product
        ),
      };
    case 'ADD_PRODUCT':
      return {
        ...state,
        products: [...state.products, action.payload],
      };
    case 'UPDATE_SUB_PRODUCT':
      return {
        ...state,
        products: state.products.map((product) =>
          product.productTypeId === action.payload.productTypeId
            ? {
                ...product,
                productSubType: product.productSubType?.map((subProduct) =>
                  subProduct.productSubTypeId === action.payload.subProduct.productSubTypeId
                    ? { ...subProduct, ...action.payload.subProduct }
                    : subProduct
                ),
              }
            : product
        ),
      };
    case 'ADD_SUB_PRODUCT':
      return {
        ...state,
        products: state.products.map((product) =>
          product.productTypeId === action.payload.productTypeId
            ? { ...product, productSubType: [...(product.productSubType || []), action.payload.subProduct] }
            : product
        ),
      };
    case 'DELETE_SUB_PRODUCT':
      return {
        ...state,
        products: state.products.map((product) =>
          product.productTypeId === action.payload.productTypeId
            ? {
                ...product,
                productSubType: product.productSubType?.filter(
                  (subProduct) => subProduct.productSubTypeId !== action.payload.subProductId
                ),
              }
            : product
        ),
      };
    case 'UPDATE_ADDON':
      return {
        ...state,
        products: state.products.map((product) =>
          product.productTypeId === action.payload.productTypeId
            ? {
                ...product,
                productSubType: product.productSubType?.map((subProduct) =>
                  subProduct.productSubTypeId === action.payload.subProductId
                    ? {
                        ...subProduct,
                        productAddonType: subProduct.productAddonType?.map((addon) =>
                          addon.productAddonTypeId === action.payload.addon.productAddonTypeId
                            ? { ...addon, ...action.payload.addon }
                            : addon
                        ),
                      }
                    : subProduct
                ),
              }
            : product
        ),
      };
    case 'ADD_ADDON':
      return {
        ...state,
        products: state.products.map((product) =>
          product.productTypeId === action.payload.productTypeId
            ? {
                ...product,
                productSubType: product.productSubType?.map((subProduct) =>
                  subProduct.productSubTypeId === action.payload.subProductId
                    ? {
                        ...subProduct,
                        productAddonType: [...(subProduct.productAddonType || []), action.payload.addon],
                      }
                    : subProduct
                ),
              }
            : product
        ),
      };
    case 'DELETE_ADDON':
      return {
        ...state,
        products: state.products.map((product) =>
          product.productTypeId === action.payload.productTypeId
            ? {
                ...product,
                productSubType: product.productSubType?.map((subProduct) =>
                  subProduct.productSubTypeId === action.payload.subProductId
                    ? {
                        ...subProduct,
                        productAddonType: subProduct.productAddonType?.filter(
                          (addon) => addon.productAddonTypeId !== action.payload.addonId
                        ),
                      }
                    : subProduct
                ),
              }
            : product
        ),
      };
    case 'DELETE_PRODUCT':
      return {
        ...state,
        products: state.products.filter((product) => product.productTypeId !== action.payload),
      };
    default:
      throw new Error(`Unhandled action type: ${action}`);
  }
}

const ProductContext = createContext<{
  state: State;
  refetch: () => void;
  dispatch: React.Dispatch<Action>;
} | undefined>(undefined);

export const ProductProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(productReducer, initialState);

  const fetchProducts = async () => {
    dispatch({ type: 'FETCH_INIT' });
    try {
      const response = await getProductTypeList();
      dispatch({ type: 'FETCH_SUCCESS', payload: response.data });
    } catch (error) {
      dispatch({ type: 'FETCH_FAILURE', payload: 'Error fetching products' });
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const value = { state, refetch: fetchProducts, dispatch };
  return <ProductContext.Provider value={value}>{children}</ProductContext.Provider>;
};

export const useProductContext = () => {
  const context = useContext(ProductContext);
  if (context === undefined) {
    throw new Error('useProductContext must be used within a ProductProvider');
  }
  return context;
};
