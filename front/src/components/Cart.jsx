import { useContext, useEffect } from "react";
/* MUI */
import {
  Drawer,
  IconButton,
  Button,
  Divider,
  Box,
} from "@mui/material";
/* Icons */
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
/* Context */
import { CartData } from "../context/CartContext";
/* Utils */
import { formattedPrice } from "../utils/helper";
/* Hooks */
import { usePostData } from "../hooks/usePostData";
import Swal from "sweetalert2";

const Cart = ({
  open,
  onClose
}) => {
  const { cart, refreshCart } = useContext(CartData);
  const { action: actionAddProductToCart, responseData: responseDataAddProductToCart } = usePostData();
  const { action: actionUpdateProductToCart, responseData: responseDataUpdateProductToCart } = usePostData();
  const { action: actionDeleteProductToCart, responseData: responseDataDeleteProductToCart } = usePostData();

  const total = cart?.reduce((acc, item) => acc + (item.price * item.cantidad), 0) || 0;

  const handleAddToCart = async (id) => {
    actionAddProductToCart("/cart/add", {
      idProducto: id,
      cantidad: 1,
      fechaAgregado: new Date().toISOString()
    });
  }

  const handleDecreaseFromCart = async (id, cantidad) => {
    if(cantidad <= 1){
      actionDeleteProductToCart(`/cart/delete/${id}`);
      return;
    }
    
    actionUpdateProductToCart(`/cart/item/${id}`, {
      cantidad: cantidad - 1
    });
  }

  const handleDeleteFromCart = async (id) => {
    actionDeleteProductToCart(`/cart/delete/${id}`);
  }

  const handleOnClear = async () => {
    actionDeleteProductToCart("/cart/clear");
  }

  const handleOnFinishPurchase = async () => {
    // Hacemos compra ficticia
    handleOnClear();
    onClose();

    Swal.fire({
      title: 'La compra se ha realizado con éxito',
      text: 'Gracias por su compra!',
      icon: 'success',
      confirmButtonText: 'Aceptar'
    })
  }

  useEffect(() => {
    if(responseDataAddProductToCart || responseDataUpdateProductToCart || responseDataDeleteProductToCart)
    {
      refreshCart();
    }
  }, [responseDataAddProductToCart, responseDataUpdateProductToCart, responseDataDeleteProductToCart])

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          backgroundColor: "#000000CC",
          color: "#FFFFFF",
          width: 360,
        },
      }}
    >
      {/* HEADER */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          px: 2,
          py: 1.5,
        }}
      >
        <div className="flex items-center gap-2">
          <ShoppingCartIcon sx={{ color: "#F97316" }} />
          <h2 className="font-primary text-lg text-white">
            Carrito de compras
          </h2>
        </div>

        <IconButton onClick={onClose} size="small">
          <CloseIcon sx={{ color: "white" }} />
        </IconButton>
      </Box>

      <Divider sx={{ borderColor: "rgba(255,255,255,0.2)" }} />

      {/* LISTA DE ITEMS */}
      <div className="flex-1 overflow-y-auto max-h-[60vh] px-2 py-2">
        {cart?.length === 0 ? (
          <p className="font-secondary text-sm text-gray-300 text-center mt-4">
            Tu carrito está vacío.
          </p>
        ) : (
          cart?.map((item) => (
            <div
              key={item.idProducto}
              className="flex gap-3 items-start bg-black/30 rounded-md p-2 mb-2"
            >
              {/* Imagen */}
              <div className="w-16 h-16 flex-shrink-0">
                <img
                  src={item.img || '/sinimagen.png'}
                  alt={item.title}
                  className="w-full h-full object-cover rounded"
                />
              </div>

              {/* Info */}
              <div className="flex-1 flex flex-col gap-1">
                <p className="font-secondary text-sm font-semibold">
                  {item.title}
                </p>
                <p className="font-secondary text-xs text-gray-300">
                  {item.category === "games" ? "Videojuego" : "Consola"}
                  {item.platform && ` · ${item.platform}`}
                </p>
                <p className="font-secondary text-sm text-game-flame-medio">
                  {formattedPrice(item.price)}
                </p>

                {/* Cantidad + subtotal */}
                <div className="flex items-center justify-between mt-1">
                  {/* Cantidad */}
                  <div className="flex items-center gap-1 border border-gray-500 rounded px-1">
                    <IconButton
                      size="small"
                      onClick={() => handleDecreaseFromCart(item.cartItemId, item.cantidad)}
                    >
                      <RemoveIcon fontSize="small" sx={{ color: "white" }} />
                    </IconButton>
                    <span className="font-secondary text-sm w-6 text-center">
                      {item.cantidad}
                    </span>
                    <IconButton
                      size="small"
                      onClick={() => handleAddToCart(item.idProducto)}
                    >
                      <AddIcon fontSize="small" sx={{ color: "white" }} />
                    </IconButton>
                  </div>

                  {/* Subtotal */}
                  <span className="font-secondary text-xs text-gray-300">
                    Subtotal:{" "}
                    <strong>
                      {formattedPrice(item.price * item.cantidad)}
                    </strong>
                  </span>
                </div>
              </div>

              {/* Borrar */}
              <IconButton
                size="small"
                onClick={() => handleDeleteFromCart(item.cartItemId)}
                sx={{ ml: 0.5 }}
              >
                <DeleteIcon fontSize="small" sx={{ color: "#F87171" }} />
              </IconButton>
            </div>
          ))
        )}
      </div>

      <Divider sx={{ borderColor: "rgba(255,255,255,0.2)" }} />

      {/* FOOTER: TOTAL + BOTONES */}
      <div className="px-3 py-3 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <span className="font-secondary text-sm text-gray-200">
            Total ({cart?.length} ítem{cart?.length !== 1 && "s"})
          </span>
          <span className="font-primary text-xl text-white">
            {formattedPrice(total)}
          </span>
        </div>

        <div className="flex gap-2">
          <Button
            variant="outlined"
            fullWidth
            onClick={handleOnClear}
            sx={{
              textTransform: "none",
              borderColor: "#F87171",
              color: "#F87171",
              "&:hover": { borderColor: "#EF4444", bgcolor: "#7F1D1D" },
              fontFamily: "Poppins, sans-serif",
              fontWeight: 500,
            }}
          >
            Vaciar carrito
          </Button>

          <Button
            variant="contained"
            fullWidth
            onClick={handleOnFinishPurchase}
            sx={{
              textTransform: "none",
              bgcolor: "#CC0000",
              color: "#FFF",
              "&:hover": { bgcolor: "#990000" },
              fontFamily: "Poppins, sans-serif",
              fontWeight: 600,
            }}
          >
            Finalizar compra
          </Button>
        </div>
      </div>
    </Drawer>
  );
};

export default Cart;
