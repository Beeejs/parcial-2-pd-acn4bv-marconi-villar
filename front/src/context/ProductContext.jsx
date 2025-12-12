import { createContext, useEffect, useState } from 'react';

export const ProductData = createContext({});


const ProductContext = ({ children }) =>
{
  const [totalProducts, setTotalProducts] = useState(0);
  const [memoryProducts, setMemoryProducts] = useState([]);

  useEffect(() => {
    (async() => {
      const response = await fetch('/products/getAll', {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer token`,
        },
      });

      const { data } = await response.json();
      setMemoryProducts(data);
    })();
  }, []);

  return (
    <ProductData.Provider value={{ totalProducts, setTotalProducts, memoryProducts }}>
      {children}
    </ProductData.Provider>
  );
};

export default ProductContext;
