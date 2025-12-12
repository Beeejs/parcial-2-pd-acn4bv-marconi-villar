import express from 'express';
/* Controller */
import cartController from '../controllers/cartController.js';

const cartRouter = express.Router();

cartRouter.get('/get', cartController.getCart);
cartRouter.post('/add', cartController.addToCart);
cartRouter.post('/item/:itemId', cartController.updateCartItem);
cartRouter.post('/delete/:itemId', cartController.deleteCartItem);
cartRouter.post('/clear', cartController.clearCart);

export default cartRouter;