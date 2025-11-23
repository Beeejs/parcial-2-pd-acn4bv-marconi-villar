/* Express */
import express from "express";
/* Controllers */
import { getProducts } from "../controllers/productController.js";
/* Middlewares */
import { verifyToken } from "../middlewares/auth.js";

const productRouter = express.Router();

productRouter.get("/getAll", verifyToken, getProducts);

export default productRouter;