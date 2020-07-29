import React, {
  createContext,
  useState,
  useCallback,
  useContext,
  useEffect,
  useMemo
} from 'react';

import AsyncStorage from '@react-native-community/async-storage';


const APP_KEY = '@APPLICATION:products';

interface Product {
  id: string;
  title: string;
  image_url: string;
  price: number;
  quantity: number;
}

interface CartContext {
  products: Product[];
  addToCart(item: Omit<Product, 'quantity'>): void;
  increment(id: string): void;
  decrement(id: string): void;
}

const CartContext = createContext<CartContext | null>(null);

const CartProvider: React.FC = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    async function loadProducts(): Promise<void> {

       const data = await AsyncStorage.getItem(APP_KEY);
       const resolvedData = data && JSON.parse(data);
       setProducts(resolvedData.data);
    }

    loadProducts();
  }, []);

  const updateStorage = useCallback(async () => {
     await AsyncStorage.setItem(APP_KEY, JSON.stringify(products));
  }, [products]);


  const addToCart = useCallback(async (product:Product) => {
      product.quantity = 1;
      setProducts([...products, product]);

      await updateStorage();
  }, [products]);


  const increment = useCallback(async (id:string) => {
    products.forEach((product:Product) => {
      if (product.id === id) {
          product.quantity = product.quantity + 1;
      }
    });

    await updateStorage();
  }, [products]);


  const decrement = useCallback(async id => {
    products.forEach((product:Product) => {
      if (product.id === id) {
          if (product.quantity > 1) {
            product.quantity = product.quantity - 1;
          }
      }
    });
    await updateStorage();
  }, [products]);



  const value = React.useMemo(
    () => ({ products, addToCart, increment, decrement }),
    [products, addToCart, increment, decrement],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

function useCart(): CartContext {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error(`useCart must be used within a CartProvider`);
  }

  return context;
}

export { CartProvider, useCart };
