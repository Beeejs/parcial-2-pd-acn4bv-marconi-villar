import express from "express";
/* Controllers */
import productController from "../controllers/productController.js";

const productRouter = express.Router();

productRouter.get("/getAll", productController.getProducts);
productRouter.get("/getOne/:id", productController.getProduct);
productRouter.post("/create", productController.createProduct);
productRouter.post("/update/:id", productController.updateProduct);

export default productRouter;