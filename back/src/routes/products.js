/* Express */
import express from "express";
/* Controllers */
import { getProducts } from "../controllers/productController.js";

const productRouter = express.Router();

productRouter.get("/getAll", getProducts);

export default productRouter;