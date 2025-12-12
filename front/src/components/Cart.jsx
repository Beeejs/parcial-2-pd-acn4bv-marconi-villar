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
/* Utils */
import { formattedPrice } from "../utils/helper";

const Cart = ({
  open,
  onClose
}) => {
  const cart = [];

  const total = cart?.reduce((acc, item) => acc + (item.price * item.cantidad), 0) || 0;

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
                    >
                      <RemoveIcon fontSize="small" sx={{ color: "white" }} />
                    </IconButton>
                    <span className="font-secondary text-sm w-6 text-center">
                      {item.cantidad}
                    </span>
                    <IconButton
                      size="small"
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
            /* onClick={onCheckout} */
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
