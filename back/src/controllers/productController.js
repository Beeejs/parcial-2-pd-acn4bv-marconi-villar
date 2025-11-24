// api/controllers/products.js

// Importa la instancia de Firestore desde tu archivo de configuración
import { db } from '../database/firebase.js';

const NAME_COLLECTION = 'productos';

// getAll
export const getProducts = async (req, res) => {
  try {
    const filters = { ...req.query } // { search, platform, genre, category, topSell }
    let productsRef = db.collection(NAME_COLLECTION);
    let query = productsRef;
    
    // Filtro por Plataforma
    if (filters.platform) {
      query = query.where('platform', '==', filters.platform);
    }

    // Filtro por Género
    if (filters.genre) {
      query = query.where('genre', '==', filters.genre);
    }

    // Filtro por Categoría
    if (filters.category) {
      query = query.where('category', '==', filters.category);
    }
    
    // Filtro por Top Sell
    if (filters.topSell) {
      const isTopSell = filters.topSell.toLowerCase() === 'true';
      query = query.where('topSell', '==', isTopSell);
    }
    
    if (filters.search) {        
      // Busqueda del titulo por rango
      query = query
        .where('title', '>=', filters.search)
        .where('title', '<=', filters.search + '\uf8ff');
    }
    
    const snapshot = await query.get();
    
    if (snapshot.empty && (Object.keys(filters).length > 0)) {
      // Si hay filtros y la respuesta es vacía, devolvemos 200 con un array vacío
      return res.status(200).json({
        status: true,
        message: 'Productos obtenidos correctamente',
        data: []
      });
    }

    const products = snapshot.docs.map(doc => ({
      docId: doc.id ,
      ...doc.data()
    }));

    res.status(200).json({
      status: true,
      message: 'Productos obtenidos correctamente',
      data: products
    }); 

  } catch (error) {
    console.log(error)
    res.status(500).json({ status: false, message: 'Error interno del servidor' });
  }
};

// getOne
export const getProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const ref = db.collection(NAME_COLLECTION).doc(id);
    const snapshot = await ref.get();

    if (!snapshot.exists) {
      return res.status(200).json({
        status: false,
        data: [],
        message: "Producto no encontrado"
      });
    }

    return res.status(200).json({
      status: true,
      message: "Producto obtenido correctamente",
      data: {
        docId: snapshot.id,
        ...snapshot.data()
      }
    });

  } catch (e) {
    console.error(e);
    return res.status(500).json({
      status: false,
      message: "Error interno del servidor"
    });
  }
};

// create
export const createProduct = async (req, res) => {
  try {
    const productRef = await db.collection(NAME_COLLECTION).add(req.body);
    res.status(200).json({ status: true, message: 'Producto creado correctamente', data: { docId: productRef.id, ...req.body } });
  } catch (error) {
    console.log(error)
    res.status(500).json({ status: false, message: 'Error interno del servidor' });
  }
};

// update
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body }; // clonamos
    
    // SI ES CONSOLA borramos platform y genre
    if (updateData.category === 'consoles') {
      updateData.platform = admin.firestore.FieldValue.delete();
      updateData.genre = admin.firestore.FieldValue.delete();
    }

    const docRef = db.collection(NAME_COLLECTION).doc(id);

    await docRef.update(updateData);

    const snapshot = await docRef.get();

    if (!snapshot.exists) {
      return res.status(200).json({
        status: false,
        message: 'Producto no encontrado'
      });
    }

    res.status(200).json({
      status: true,
      message: 'Producto actualizado correctamente',
      data: {
        docId: snapshot.id,
        ...snapshot.data()
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ status: false, message: 'Error interno del servidor' });
  }
};

