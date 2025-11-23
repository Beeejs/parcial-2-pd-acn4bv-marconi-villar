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