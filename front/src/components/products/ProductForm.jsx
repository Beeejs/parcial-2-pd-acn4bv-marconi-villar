import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
/* Hooks */
import { useGetData } from "../../hooks/useGetData";
import { usePostData } from "../../hooks/usePostData";
/* MUI */
import {
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  Button,
  Box,
} from "@mui/material";
/* Constantes */
import {
  PLATFORM_OPTIONS,
  GENRE_OPTIONS,
  CATEGORY_OPTIONS,
} from "../../constants/constants";
/* Componentes */
import Swal from 'sweetalert2'

const ProductForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();

 const { action, responseData, loading } = useGetData();
 const { action: actionPostCreate, responseData: responseDataPostCreate, loading: loadingPostCreate } = usePostData();
 const { action: actionPostUpdate, responseData: responseDataPostUpdate, loading: loadingPostUpdate } = usePostData();

 const isNew = !id;
 const [readOnly, setReadOnly] = useState(!isNew); // si hay id arranca solo lectura

  // Titulos
  const title = isNew ? "Nuevo producto" : "Producto";
  const subtitle = isNew
    ? "Cargá un nuevo juego o consola en el catálogo."
    : readOnly
    ? "Revisá la información del producto."
    : "Actualizá la información del producto.";

  // Estado del formulario
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    platform: "",
    category: "",
    genre: "",
    status: true,
    topSell: false,
    img: "",
  });

  // useEffects
  // Pegamos a la api si hay id para buscar el producto
  useEffect(() => {
    if (!id) return;
    action(`/products/getOne/${id}`)
  }, [id]);

  // Si tiene un producto, lo cargamos
  useEffect(() => {
    if (!responseData) return;
    delete responseData.data?.docId
    setFormData(responseData.data);
  }, [responseData])

  useEffect(() => {
    if(responseDataPostCreate && responseDataPostCreate.status === true){
      Swal.fire({
        title: 'Producto creado',
        text: 'Producto creado correctamente!',
        icon: 'success',
        confirmButtonText: 'Aceptar'
      })

      // Redireccionamos a la vista del producto creado
      navigate(`/products/${responseDataPostCreate.data?.docId}`);
    }

    if(responseDataPostUpdate && responseDataPostUpdate.status === true){
      Swal.fire({
        title: 'Producto actualizado',
        text: 'Producto actualizado correctamente!',
        icon: 'success',
        confirmButtonText: 'Aceptar'
      })

      // Redireccionamos a la vista del producto actualizado (actualizar todo)
      navigate(`/products/${responseDataPostUpdate.data?.docId}`);
    }

  }, [responseDataPostCreate, responseDataPostUpdate])

  // Funciones
  const handleChange = (field) => (e) => {
    let value;

    if (e.target.type === "checkbox") {
      value = e.target.checked;
    } else if (field === "price" && e.target.value !== "") {
      value = parseFloat(e.target.value);
    } else {
      value = e.target.value;
    }

    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (readOnly) return;

    // Si es una consola eliminamos el genre y el platform
    if(formData.category === 'consoles'){
      delete formData.genre
      delete formData.platform
    }

    if (isNew) {
      actionPostCreate("/products/create", formData)
      console.log("POST nuevo producto:", formData);
    } else {
      actionPostUpdate(`/products/update/${id}`, formData)
      console.log("EDIT producto:", id, formData);
    }
  };

  const handleEnableEdit = () => {
    setReadOnly(false);
  };

  return (
    <section className="min-h-[calc(100vh-4rem)] w-full flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-3xl bg-secondary/95 border-2 border-game-flame-oscuro shadow-xl rounded-xl p-8 flex flex-col gap-6">
        
        {/* HEADER */}
        <div className="flex flex-col gap-2 mb-2">
          <h1 className="font-primary text-2xl text-game-flame-oscuro tracking-wide">
            {title}
          </h1>
          <p className="font-secondary text-sm text-primary/80">
            {subtitle}
          </p>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">

          {/* Switches */}
          <Box className="flex flex-col md:flex-row gap-4">

            <Box className="flex items-center gap-4">
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.status}
                    onChange={handleChange("status")}
                    disabled={readOnly}
                    color="success"
                  />
                }
                label="Activo"
              />

              <FormControlLabel
                control={
                  <Switch
                    checked={formData.topSell}
                    onChange={handleChange("topSell")}
                    disabled={readOnly}
                    color="warning"
                  />
                }
                label="Más vendido"
              />
            </Box>
          </Box>

          <TextField
            label={loading ? "Cargando..." : "Título"}
            fullWidth
            size="small"
            value={formData.title}
            onChange={handleChange("title")}
            disabled={readOnly}
          />

          <TextField
            label={loading ? "Cargando..." : "Descripción"}
            fullWidth
            multiline
            rows={3}
            size="small"
            value={formData.description}
            onChange={handleChange("description")}
            disabled={readOnly}
          />

          {/* Precio + plataforma */}
          
          {/* Aviso cuando es categoría consolas */}
          {formData.category === "consoles" && (
            <p className="text-xs font-secondary text-game-flame-medio/80 bg-game-flame-medio/10 border border-game-flame-medio/20 px-3 py-2 rounded-md">
              Atención: la categoría <strong>Consolas</strong> no utiliza los campos 
              <strong> Plataforma</strong> ni <strong>Género</strong>. Por eso aparecen deshabilitados.
            </p>
          )}

          <Box className="flex flex-col md:flex-row gap-4">
            <TextField
              label={loading ? "Cargando..." : "Precio"}
              type="number"
              fullWidth
              size="small"
              value={formData.price}
              onChange={handleChange("price")}
              disabled={readOnly}
            />

            <FormControl fullWidth size="small" disabled={readOnly}>
              <InputLabel>{loading ? "Cargando..." : "Plataforma"}</InputLabel>
              <Select
                value={formData.platform}
                onChange={handleChange("platform")}
                label="Plataforma"
                disabled={readOnly || formData.category !== "games"}
              >
                {PLATFORM_OPTIONS.slice(1).map((opt) => (
                  <MenuItem key={opt.id} value={opt.value}>
                    {opt.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          {/* Categoría + Género */}
          <Box className="flex flex-col md:flex-row gap-4">
            <FormControl fullWidth size="small" disabled={readOnly}>
              <InputLabel>{loading ? "Cargando..." : "Categoría"}</InputLabel>
              <Select
                value={formData.category}
                onChange={handleChange("category")}
                label="Categoría"
                disabled={readOnly}
              >
                {CATEGORY_OPTIONS.slice(1).map((opt) => (
                  <MenuItem key={opt.id} value={opt.value}>
                    {opt.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth size="small" disabled={readOnly}>
              <InputLabel>{loading ? "Cargando..." : "Género"}</InputLabel>
              <Select
                value={formData.genre}
                onChange={handleChange("genre")}
                label="Género"
                disabled={readOnly || formData.category !== "games"}
              >
                {GENRE_OPTIONS.slice(1).map((opt) => (
                  <MenuItem key={opt.id} value={opt.value}>
                    {opt.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          {/* Imagen */}
          <TextField
            label={loading ? "Cargando..." : "Imagen URL"}
            fullWidth
            size="small"
            value={formData.img}
            onChange={handleChange("img")}
            disabled={readOnly}
          />

          {/* Preview */}
          {formData.img && (
            <img
              src={formData.img}
              alt="preview"
              className="max-h-48 object-contain mt-2 rounded-md border border-primary/20"
            />
          )}

          {/* Botones */}
          <Box className="flex justify-end gap-3 mt-4">
            <Button
              type="button"
              variant="outlined"
              onClick={() => navigate("/productAbm")}
            >
              {readOnly ? "Volver" : "Cancelar"}
            </Button>

            {readOnly && !isNew && (
              <Button
                type="button"
                variant="contained"
                disabled={loading}
                onClick={handleEnableEdit}
              >
                Modificar
              </Button>
            )}

            {!readOnly && (
              <Button
                type="submit"
                variant="contained"
                disabled={loadingPostCreate || loadingPostUpdate}
                loading={loadingPostCreate || loadingPostUpdate}
                loadingPosition="end"
              >
                {isNew 
                  ?
                    loadingPostCreate
                      ? "Creando"
                      : "Crear producto"
                  : 
                    loadingPostUpdate
                      ? "Guardando"
                      : "Guardar cambios"
                }
              </Button>
            )}
          </Box>
        </form>
      </div>
    </section>
  );
};

export default ProductForm;
