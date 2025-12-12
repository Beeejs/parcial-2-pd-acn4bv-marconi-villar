import { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
/* MUI */
import { Button, IconButton, Chip } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
/* Components */
import Swal from "sweetalert2";
import Loader from "../components/Loader";
/* Utils */
import { formattedPrice } from "../utils/helper";
/* Hooks */
import { usePostData } from "../hooks/usePostData";
import { useGetData } from "../hooks/useGetData";
/* Context */
import { CartData } from "../context/CartContext";

const ProductDetail = () => {
  const { id } = useParams();
  const { refreshCart } = useContext(CartData);
  const { action, responseData, loading } = useGetData();
  const { action: actionAddProductToCart, responseData: responseDataAddProductToCart } = usePostData();

  const [quantity, setQuantity] = useState(1);

  // Obtener producto
  useEffect(() => {
    if (id) action(`/products/getOne/${id}`);
  }, [id]);

  // Funciones para manejar cantidad
  const handleIncrease = () => setQuantity((q) => q + 1);
  const handleDecrease = () =>
    setQuantity((q) => (q > 1 ? q - 1 : 1));

  const handleAddToCart = async () => {
    actionAddProductToCart("/cart/add", {
      idProducto: id,
      cantidad: quantity,
      fechaAgregado: new Date().toISOString()
    });
  }

  useEffect(() => {
    if(responseDataAddProductToCart)
    {
      refreshCart();
      Swal.fire({
        title: 'Producto agregado al carrito',
        text: 'El producto se ha agregado al carrito!',
        icon: 'success',
        confirmButtonText: 'Aceptar'
      })
    }
  }, [responseDataAddProductToCart])

  return (
    <section className="flex flex-col justify-center items-center gap-12 h-full my-12">
      <div className="w-full flex justify-center items-center h-full bg-white/95 rounded-xl shadow-xl border-2 border-game-flame-oscuro p-8">
        {
          !loading
          ? (
            <div className="flex flex-col justify-center items-center md:flex-row gap-8 w-full">
              <aside className="flex justify-center items-start w-full md:w-1/2">
                <img
                  src={responseData?.data.img || '/sinimagen.png'}
                  alt={responseData?.data.title}
                  className="rounded-lg shadow-md max-h-[420px] object-contain border border-primary/30"
                />
              </aside>

              {/* INFO */}
              <aside className="flex flex-col gap-6 w-full md:w-1/2">

                {/* Título */}
                <div>
                  <h1 className="font-primary text-3xl text-game-flame-oscuro">
                    {responseData?.data.title}
                  </h1>
                  <p className="font-secondary text-primary/70">
                    {responseData?.data.category === "games" ? "Videojuego" : "Consola"}
                  </p>
                </div>

                {/* Chips de info básica */}
                <div className="flex flex-wrap gap-2">
                  {responseData?.data.platform && (
                    <Chip label={`Plataforma: ${responseData?.data.platform}`} color="primary" variant="outlined" className="font-secondary!" />
                  )}
                  {responseData?.data.genre && (
                    <Chip label={`Género: ${responseData?.data.genre}`} color="secondary" variant="outlined" className="font-secondary!"/>
                  )}
                  <Chip
                    label={responseData?.data.status ? "Activo" : "Inactivo"}
                    color={responseData?.data.status ? "success" : "error"}
                    variant="filled"
                    className="font-secondary!"
                  />
                  {responseData?.data.topSell && (
                    <Chip label="Más vendido" color="warning" className="font-secondary!"/>
                  )}
                </div>

                {/* Precio */}
                <h2 className="font-primary text-3xl text-primary">
                  {formattedPrice(responseData?.data.price)}
                </h2>

                {/* Descripción */}
                <p className="font-secondary text-primary/80 leading-relaxed">
                  {responseData?.data.description}
                </p>

                {/* CANTIDAD + BOTONES */}
                <div className="flex items-center gap-6 mt-4">

                  {/* Selector de cantidad */}
                  <div className="flex items-center gap-2 border border-primary/40 px-3 py-2 rounded-md">
                    <IconButton onClick={handleDecrease} size="small">
                      <RemoveIcon />
                    </IconButton>

                    <span className="font-secondary text-lg w-6 text-center">
                      {quantity}
                    </span>

                    <IconButton onClick={handleIncrease} size="small">
                      <AddIcon />
                    </IconButton>
                  </div>

                  {/* Botón agregar al carrito */}
                  <Button
                    variant="contained"
                    startIcon={<AddShoppingCartIcon />}
                    className="!bg-game-flame-oscuro !text-white hover:!bg-game-flame-sombra !rounded-md"
                    onClick={handleAddToCart}
                  >
                    Agregar al carrito
                  </Button>
                </div>
              </aside>
            </div>
          )
          : (
            <div className="flex flex-col justify-center items-center gap-6">
              <Loader
                width={"60px"}
                height={"60px"}
                borderWidth={"4px"}
                color={"#CC0000"}
              />
              <p className="text-base text-primary font-secondary font-medium">
                Cargando producto
              </p>
            </div>
          )
        }
      </div>
    </section>
  );
};

export default ProductDetail;
