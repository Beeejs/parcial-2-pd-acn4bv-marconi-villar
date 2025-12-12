import { createContext, useContext, useEffect, useState } from 'react';
/* Context */
import { AuthContext } from './AuthContext';
import { ProductData } from './ProductContext';

export const CartData = createContext({});


const CartContext = ({ children }) =>
{
  const [cart, setCart] = useState([]);
  const { user } = useContext(AuthContext);
  const { memoryProducts } = useContext(ProductData);

  const refreshCart = async () => {
    if(!user) return;

    const token =  await user.getIdToken();
    const response = await fetch('/cart/get', {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const { data } = await response.json();
    
    const updatedCartItems = data.map(cartItem => {
      const product = memoryProducts.find(
        (product) => product.docId === cartItem.idProducto
      );

      // Si se encuentra el producto devuelve un nuevo objeto combinado
      if (product) {
        return {
          ...cartItem,
          img: product.img,
          title: product.title,
          price: product.price,
        };
      }
      
      // Si no se encuentra, devuelve el elemento del carrito original
      return cartItem;
    });

    setCart(updatedCartItems);
  }

  useEffect(() => {
    if(!user) return;
    
    (async() => {
      await refreshCart();
    })();
  }, [user, memoryProducts]);

  return (
    <CartData.Provider value={{ cart, setCart, refreshCart }}>
      {children}
    </CartData.Provider>
  );
};

export default CartContext;