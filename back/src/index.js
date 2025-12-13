/* Dotenv */
import 'dotenv/config';
/* Express */
import express from 'express';
/* Cors */
import cors from 'cors';
/* Rutas */
import productRouter from './routes/products.js';
import userRouter from './routes/users.js';
import cartRouter from './routes/cart.js';
/* Middlewares */
import { errorHandler } from './middlewares/errrorHandler.js';

// Configuracion
const PORT = process.env.PORT || 3000;
const app = express();
app.use(cors(
  {
    origin: 'http://localhost:3001',
    credentials: true
  }
))
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas
app.use('/api/products', productRouter);
app.use('/api/users', userRouter);
app.use('/api/cart', cartRouter);

// Middleware de manejo de errores
app.use(errorHandler);

// Listen
app.listen(PORT, () => {
  console.log(`Server running at => http://localhost:${PORT}`);
});
