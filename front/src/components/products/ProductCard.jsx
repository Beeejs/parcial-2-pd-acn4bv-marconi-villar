/* MUI */
import { Badge, Button, IconButton } from "@mui/material";
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';

const ProductCard = ({ product }) => {
  const { docId, title, img } = product;

  return (
    <article class="flex flex-col justify-center items-center w-72 h-72 gap-4 bg-secondary/80 rounded-md shadow p-4 hover:scale-105 hover:bg-secondary transition-all duration-300">
      <div className="flex items-center justify-end w-full">
        <IconButton>
          <Badge
            badgeContent={0}
            color="error"
            sx={{
              "& .MuiBadge-badge": {
                fontFamily: "Poppins, sans-serif",
                fontSize: "0.5rem",
              },
            }}
          >
            <AddShoppingCartIcon />
          </Badge>
        </IconButton>
      </div>
      <div class="flex flex-col justify-center items-center gap-2">
        <img src={img || '/sinimagen.png'} className="size-32 rounded-md shadow object-cover" alt="Imagen Producto"/>
        <h6 className='font-secondary text-lg text-center text-primary truncate w-60'>{title}</h6>
        <Button
          type="button"
          variant="contained"
          size="small"
          href={`/productDetail/${docId}`}
        >
          Ver Detalle
        </Button>
      </div>
    </article>
  )
}

export default ProductCard