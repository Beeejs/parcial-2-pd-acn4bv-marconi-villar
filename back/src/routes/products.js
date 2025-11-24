/* Express */
import express from "express";
/* Controllers */
import { getProducts, getProduct, createProduct, updateProduct } from "../controllers/productController.js";
/* Middlewares */
import { verifyToken } from "../middlewares/auth.js";

const productRouter = express.Router();

productRouter.get("/getAll", verifyToken, getProducts);
productRouter.get("/getOne/:id", verifyToken, getProduct);
productRouter.post("/create", verifyToken, createProduct);
productRouter.post("/update/:id", verifyToken, updateProduct);

export default productRouter;