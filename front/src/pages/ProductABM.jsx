import { useState, useMemo, useEffect } from "react";
/* Hooks */
import { useGetData } from "../hooks/useGetData";
import { usePostData } from "../hooks/usePostData";
/* React Router */
import { useNavigate } from "react-router-dom";
/* MUI */
import {
  Button,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableContainer,
  TablePagination,
  IconButton,
  Stack,
  Chip,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import RestoreFromTrashIcon from '@mui/icons-material/RestoreFromTrash';
/* Components */
import Loader from "../components/Loader";
import Swal from 'sweetalert2'

const ProductABM = () => {
  const { action, responseData } = useGetData();
  const [search, setSearch] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [page, setPage] = useState(0);

  const navigate = useNavigate();

  const { action: actionPostUpdate, responseData: responseDataPostUpdate } = usePostData();

  useEffect(() => {
    action("/products/getAll");
  }, []);

  useEffect(() => {
    if(responseDataPostUpdate && responseDataPostUpdate.status === true){
      Swal.fire({
        title: 'Producto actualizado',
        text: 'Se actualizo el estado del producto!',
        icon: 'success',
        confirmButtonText: 'Aceptar'
      })

      // Reload
      action("/products/getAll");
    }

  }, [responseDataPostUpdate])

  const filteredProducts = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return responseData?.data;

    return responseData?.data.filter((p) => {
      return (
        p.title.toLowerCase().includes(term) ||
        (p.platform || "").toLowerCase().includes(term) ||
        (p.category || "").toLowerCase().includes(term)
      );
    });
  }, [responseData?.data, search]);

  const handleChangePage = (_, newPage) => setPage(newPage);

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleNewProduct = () => {
    navigate("/products/new");
  };

  const handleViewProduct = (product) => {
    navigate(`/products/${product.docId}`);
  };

  const handleDeleteProduct = (product) => {
    actionPostUpdate(`/products/update/${product.docId}`, { status: !product.status });
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPage(0); // siempre se vuelve a la primera página cuando cambia el filtro
  };

  return (
    <section className="flex flex-col justify-center items-center gap-12 h-full my-12">
      <aside className="flex flex-col justify-center items-center bg-secondary/60 w-full rounded-md px-8 pt-8 pb-2">
        {/* Header */}
        <div className="flex justify-between items-center md:flex-row flex-col gap-4 w-full mb-6">
          <div className="flex flex-col justify-center items-start gap-2 w-full">
            <h5 className="font-primary text-2xl text-game-flame-oscuro">
              ABM de Productos
            </h5>
            <p className="font-secondary text-primary text-base">
              Gestioná tus juegos y consolas: alta, baja y modificación.
            </p>
          </div>

          <div className="flex justify-start md:justify-end items-center gap-4 w-full">
            {/* Buscador */}
            <TextField
              size="small"
              label="Buscar producto"
              variant="outlined"
              value={search}
              onChange={handleSearchChange}
            />

            {/* Botón Nuevo */}
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleNewProduct}
              classes={{
                root: `
                  !text-secondary
                  !bg-game-flame-oscuro
                  hover:!bg-game-flame-sombra
                  !rounded-md 
                  !font-secondary 
                  !font-semibold 
                  !py-2
                `,
              }}
            >
              Nuevo producto
            </Button>
          </div>
        </div>

        {/* Tabla */}
        <TableContainer sx={{ maxHeight: 450 }}>
          <Table stickyHeader size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 600 }}>ID</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Título</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Plataforma</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Categoría</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Precio</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Estado</TableCell>
                <TableCell sx={{ fontWeight: 600, textAlign: "center" }}>
                  Acciones
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredProducts ? (
                filteredProducts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center">
                      <p className="text-base text-primary font-secondary font-medium">
                        No se encontraron productos.
                      </p>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredProducts
                    .slice(
                      page * rowsPerPage,
                      page * rowsPerPage + rowsPerPage
                    )
                    .map((product) => (
                      <TableRow key={product.docId} hover>
                        <TableCell>{product.docId}</TableCell>
                        <TableCell>{product.title}</TableCell>
                        <TableCell>{product.platform || "-"}</TableCell>
                        <TableCell>{product.category || "-"}</TableCell>
                        <TableCell>
                          $
                          {product.price.toLocaleString("es-AR", {
                            minimumFractionDigits: 0,
                          })}
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={product.status ? "Activo" : "Inactivo"}
                            size="small"
                            sx={{
                              bgcolor: product.status
                                ? "rgba(76, 175, 80, 0.1)"
                                : "rgba(244, 67, 54, 0.1)",
                              color: product.status ? "#2e7d32" : "#c62828",
                              fontFamily: "Poppins, sans-serif",
                            }}
                          />
                        </TableCell>
                        <TableCell align="center">
                          <Stack
                            direction="row"
                            spacing={1}
                            justifyContent="center"
                          >
                            <IconButton
                              size="small"
                              onClick={() => handleViewProduct(product)}
                            >
                              <VisibilityIcon fontSize="small" />
                            </IconButton>
                            <IconButton
                              size="small"
                              color="error"
                              onClick={() => handleDeleteProduct(product)}
                            >
                              {
                                product.status ? (
                                  <DeleteIcon fontSize="small" />
                                ) : (
                                  <RestoreFromTrashIcon fontSize="small" />
                                )
                              }
                            </IconButton>
                          </Stack>
                        </TableCell>
                      </TableRow>
                    ))
                )
              ) : (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    <div className="flex flex-col justify-center items-center gap-6 py-12">
                      <Loader
                        width={"60px"}
                        height={"60px"}
                        borderWidth={"4px"}
                        color={"#CC0000"}
                      />
                      <p className="text-base text-primary font-secondary font-medium">
                        Cargando productos
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Paginación */}
        <TablePagination
          component="div"
          count={filteredProducts?.length || 0}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          rowsPerPageOptions={[5, 10, 25]}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="Filas por página"
        />
      </aside>
    </section>
  );
};

export default ProductABM;

