/* Dotenv */
import 'dotenv/config';
/* Express */
import express from 'express';
/* Path */
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
/* Routes */
import productRouter from './api/routes/products.js';
import userRouter from './api/routes/users.js';
import cartRouter from './api/routes/cart.js';

const app = express();
const PORT = process.env.PORT || 3001;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Servir el contenido estático
app.use(express.static(path.join(__dirname, 'dist')));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas
app.use('/products', productRouter);
app.use('/users', userRouter);
app.use('/cart', cartRouter);

// Cualquier ruta que no sea back, devolvera el index.html
app.get('/{*splat}', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running at => http://localhost:${PORT}`);
});
