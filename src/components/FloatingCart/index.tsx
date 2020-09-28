import React, { useMemo }  from 'react';
import { TouchableHighlight } from 'react-native';

import { useNavigation } from '@react-navigation/native';

import FeatherIcon from 'react-native-vector-icons/Feather';
import {
  Container,
  CartPricing,
  CartButton,
  CartButtonText,
  CartTotalPrice,
} from './styles';

import formatValue from '../../utils/formatValue';

import { useCart } from '../../hooks/cart';


interface Product {
  id: string;
  title: string;
  image_url: string;
  price: number;
  quantity: number;
}



const FloatingCart: React.FC = () => {

  const { products } = useCart();

  const cartTotal = useMemo(() => {
    const total = products.reduce((acc, product) => acc + (product.quantity * product.price), 0)

    return formatValue(total);
  }, [products]);


  const totalItensInCart = useMemo(() => {
    const quantity = products.reduce((acc:number, product: Product) => acc + product.quantity, 0);
    return quantity;
  }, [products]);


  const navigation = useNavigation();


  return (
    <Container>
      <CartButton
        testID="navigate-to-cart-button"
        onPress={() => navigation.navigate('Cart')}
      >
        <FeatherIcon name="shopping-cart" size={24} color="#fff" />
        <CartButtonText>{`${totalItensInCart} itens`}</CartButtonText>
      </CartButton>

      <CartPricing>
        <CartTotalPrice>{cartTotal}</CartTotalPrice>
      </CartPricing>
    </Container>
  );
};

export default FloatingCart;
