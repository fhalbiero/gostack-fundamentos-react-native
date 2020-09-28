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
       const response = await AsyncStorage.getItem(APP_KEY);

       if (response) {
          setProducts([...JSON.parse(response)]);
       }
    }

    loadProducts();
  }, []);


  const updateStorage = useCallback(async () => {
     await AsyncStorage.setItem(APP_KEY, JSON.stringify(products));
  }, [products]);


  const addToCart = useCallback(async (product:Product) => {
      const productExists = products.find( p => p.id === product.id );

      if (productExists) {
        setProducts( products.map( p =>
            p.id === product.id ? {...product, quantity: p.quantity + 1} : p
        ));
        await updateStorage();

        return;
      }

      setProducts([...products, { ...product, quantity: 1}]);

      await updateStorage();
  }, [products]);


  const increment = useCallback(async (id:string) => {
    setProducts( products.map( product =>
        product.id === id ? {...product, quantity: product.quantity + 1} : product
    ));

    await updateStorage();
  }, [products]);


  const decrement = useCallback(async id => {
    setProducts( products.map( product =>
      product.id === id ? {...product, quantity: product.quantity - 1} : product
  ));

  await updateStorage();
  }, [products]);


  const value = useMemo(() => (
    { products, addToCart, increment, decrement }
  ), [products, addToCart, increment, decrement] );

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
