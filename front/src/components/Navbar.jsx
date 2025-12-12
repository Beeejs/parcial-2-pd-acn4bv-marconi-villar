/* Hooks */
import { useContext, useState } from "react";
/* Components */
import Swal from "sweetalert2";
import Cart from "./Cart.jsx";
/* MUI */
import {
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  IconButton,
  Divider,
  TextField,
  Button,
  Box,
  Badge,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import LogoutIcon from "@mui/icons-material/Logout";
import LoginIcon from '@mui/icons-material/Login';
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
/* React router dom */
import { Link, useNavigate } from "react-router-dom";
/* Constants */
import { navbarLinks } from "../constants/constants";
/* Context */
import { FilterData } from "../context/FilterContext";
/* Services */
import { logout } from "../services/auth.js";
/* Context */
import { AuthContext } from "../context/AuthContext.jsx";

const Navbar = () => {
  const { user } = useContext(AuthContext);
  const { handleSetFilters } = useContext(FilterData);
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);

  const handleOnChange = (e) => {
    const value = e.target.value;
    if (value === "") handleSetFilters({ search: "" });
    setSearch(value);
  };

  const handleSubmitSearch = () => {
    if (!search) {
      Swal.fire({
        title: "Campos",
        text: "El campo de búsqueda está vacío",
        icon: "warning",
        confirmButtonText: "Aceptar",
      });
      return;
    }

    navigate("/products");
    handleSetFilters({ search });
    setMobileOpen(false); // cerrar drawer si viene de mobile
  };

  const handleToggleDrawer = () => {
    setMobileOpen((prev) => !prev);
  };

  const handleLogout = async () => {
    await logout();
    navigate("/auth");
  };

  const handleToggleCart = () => setCartOpen((prev) => !prev);

  return (
    <>
      {/* BARRA PRINCIPAL */}
      <nav className="w-full bg-game-flame-oscuro p-4 rounded-b-md">
        {/* MOBILE HEADER (solo XS/SM) */}
        <div className="flex lg:hidden justify-between items-center">
          <Link to="/" className="font-primary text-xl text-secondary tracking-wide">
            Eternal Games
          </Link>
          <IconButton onClick={handleToggleDrawer} size="large">
            <MenuIcon sx={{ color: "white" }} />
          </IconButton>
        </div>

        {/* DESKTOP NAVBAR */}
        <div className="hidden lg:flex justify-between items-center w-full">
          <div className="flex justify-center items-center gap-8">
            {
              user && (
                <Link
                  to="/productAbm"
                  className="cursor-pointer flex justify-cetner gap-2 items-center font-primary text-base text-white hover:text-gray-200 transition-colors duration-300"
                >
                  ABM Productos
                </Link>
              ) 
            }
            <div className="flex justify-center items-center gap-4">
                {/* Input de búsqueda */}
                <TextField
                  label="Buscar"
                  type="search"
                  size="small"
                  value={search}
                  onChange={handleOnChange}
                  className="font-secondary"
                  InputLabelProps={{
                    className: "!text-primary",
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      backgroundColor: "#FFFFFF",
                      borderRadius: "6px",
                      "& fieldset": {
                        borderColor: "#000", // borde negro
                      },
                      "&:hover fieldset": {
                        borderColor: "#000",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "#CC0000", // rojo oscuro game flame
                      },
                    },
                  }}
                />

                {/* Botón buscar */}
                <Button
                  variant="contained"
                  onClick={handleSubmitSearch}
                  className="!font-secondary !font-medium"
                  sx={{
                    bgcolor: "#555",
                    color: "#fff",
                    "&:hover": {
                      bgcolor: "#333",
                    },
                    borderRadius: "6px",
                    padding: "6px 16px",
                  }}
                >
                  Buscar
                </Button>
            </div>
          </div>
          <div>
            <ul className="flex justify-center items-center gap-8">
              {navbarLinks.map((link) => (
                <li key={link.id}>
                  <Link
                    to={link.url}
                    className="flex justify-cetner gap-2 items-center font-secondary text-base text-white hover:text-gray-200 transition-colors duration-300"
                  >
                    <link.icon fontSize="small" />
                    {link.title}
                  </Link>
                </li>
              ))}
              {
                !user && (
                  <li>
                    <Link
                      to="/auth"
                      className="cursor-pointer flex justify-cetner gap-2 items-center font-secondary text-base text-white hover:text-gray-200 transition-colors duration-300"
                    >
                      <LoginIcon fontSize="small" />
                      Iniciar Sesión
                    </Link>
                  </li>
                )
              }
              <li>
                <IconButton onClick={handleToggleCart} sx={{ color: "white" }}>
                  <Badge
                    badgeContent={0}
                    color="error"
                    sx={{
                      "& .MuiBadge-badge": {
                        fontFamily: "Poppins, sans-serif",
                        fontSize: "0.7rem",
                      },
                    }}
                  >
                    <ShoppingCartIcon />
                  </Badge>
                </IconButton>
              </li>
              <li
                onClick={handleLogout}
                className="cursor-pointer flex justify-cetner gap-2 items-center font-secondary text-base text-white hover:text-gray-200 transition-colors duration-300"
              >
                <LogoutIcon fontSize="small" />
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* DRAWER MOBILE (MUI) */}
      <Drawer
        anchor="left"
        open={mobileOpen}
        onClose={handleToggleDrawer}
        PaperProps={{
          sx: {
            backgroundColor: "#000000CC",
            color: "#FFFFFF",
            width: 260,
          },
        }}
      >
        {/* Header del drawer */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            px: 2,
            py: 1.5,
          }}
        >
          <span className="font-primary text-lg text-game-flame-sombra">Eternal Games</span>
          <IconButton onClick={handleToggleDrawer} size="small">
            <CloseIcon sx={{ color: "white" }} />
          </IconButton>
        </Box>

        <Divider sx={{ borderColor: "rgba(255,255,255,0.2)" }} />

        {/* Buscador en mobile */}
        <Box sx={{ px: 2, py: 2, display: "flex", flexDirection: "column", gap: 1 }}>
          <TextField
            size="small"
            label="Buscar"
            variant="outlined"
            value={search}
            onChange={handleOnChange}
            InputLabelProps={{
              sx: { color: "#ffffff !important" },
            }}
            InputProps={{
              sx: {
                color: "#ffffff",
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "rgba(255,255,255,0.6)",
                },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#CC0000",
                },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#CC0000 !important",
                },
              },
            }}
          />

          <Button
            variant="contained"
            onClick={handleSubmitSearch}
            sx={{
              mt: 1,
              textTransform: "none",
              fontFamily: "Poppins, sans-serif",
              fontWeight: 600,
              bgcolor: "#CC0000",
              color: "#FFF",
              "&:hover": { bgcolor: "#990000" },
            }}
          >
            Buscar
          </Button>
        </Box>

        <Divider sx={{ borderColor: "rgba(255,255,255,0.2)" }} />

        {/* Links */}
        <List>
          {
            user && (
              <ListItemButton
                component={Link}
                to="/productAbm"
                onClick={handleToggleDrawer}
              >
                <ListItemText
                  primary="ABM Productos"
                  primaryTypographyProps={{
                    fontFamily: "SlugsRacer, sans-serif",
                  }}
                />
              </ListItemButton>
            )
          }

          {navbarLinks.map((link) => (
            <ListItemButton
              key={link.id}
              component={Link}
              to={link.url}
              onClick={handleToggleDrawer}
            >
              <ListItemIcon sx={{ color: "white", minWidth: 36 }}>
                <link.icon fontSize="small" />
              </ListItemIcon>
              <ListItemText
                primary={link.title}
                primaryTypographyProps={{
                  fontFamily: "Poppins, sans-serif",
                }}
              />
            </ListItemButton>
          ))}

          <Divider sx={{ borderColor: "rgba(255,255,255,0.2)", my: 1 }} />

          {
            !user && (
              <ListItemButton
                component={Link}
                to="/auth"
                onClick={handleToggleDrawer}
              >
                <ListItemIcon sx={{ color: "white", minWidth: 36 }}>
                  <LoginIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText
                  primary="Iniciar Sesión"
                  primaryTypographyProps={{
                    fontFamily: "Poppins, sans-serif",
                  }}
                />
              </ListItemButton>
            )
          }

          <ListItemButton onClick={handleLogout}>
            <ListItemIcon sx={{ color: "white", minWidth: 36 }}>
              <LogoutIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText
              primary="Logout"
              primaryTypographyProps={{
                fontFamily: "Poppins, sans-serif",
              }}
            />
          </ListItemButton>
           <ListItemButton onClick={handleToggleCart}>
            <ListItemIcon sx={{ color: "white", minWidth: 36 }}>
              <ShoppingCartIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText
              primary="Carrito"
              primaryTypographyProps={{
                fontFamily: "Poppins, sans-serif",
              }}
            />
          </ListItemButton>
        </List>
      </Drawer>

      {/* CART DRAWER */}
      <Cart
        open={cartOpen}
        onClose={handleToggleCart}
      />

    </>
  );
};

export default Navbar;