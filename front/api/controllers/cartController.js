const getCart = async (req, res) => {
  try {
    const { authorization } = req.headers;

    const response = await fetch(`${process.env.API_URL}/api/cart`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authorization.split(' ')[1]}`
      }
    });

    const data = await response.json();
    res.status(response.status || 999).json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: false, message: 'Error interno del servidor' });
  }
};

const addToCart = async (req, res) => {
  try {
    const { authorization } = req.headers;

    const response = await fetch(`${process.env.API_URL}/api/cart/add`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authorization.split(' ')[1]}`
      },
      body: JSON.stringify(req.body)
    });

    const data = await response.json();
    res.status(response.status || 999).json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: false, message: 'Error interno del servidor' });
  }
};

const updateCartItem = async (req, res) => {
  try {
    const { itemId } = req.params;
    const { authorization } = req.headers;

    const response = await fetch(`${process.env.API_URL}/api/cart/item/${itemId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authorization.split(' ')[1]}`
      },
      body: JSON.stringify(req.body) // { quantity: X } u otros campos si los agregás
    });

    const data = await response.json();
    res.status(response.status || 999).json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: false, message: 'Error interno del servidor' });
  }
};

const deleteCartItem = async (req, res) => {
  try {
    const { itemId } = req.params;
    const { authorization } = req.headers;

    const response = await fetch(`${process.env.API_URL}/api/cart/delete/${itemId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authorization.split(' ')[1]}`
      }
    });

    const data = await response.json();
    res.status(response.status || 999).json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: false, message: 'Error interno del servidor' });
  }
};

const clearCart = async (req, res) => {
  try {
    const { authorization } = req.headers;

    const response = await fetch(`${process.env.API_URL}/api/cart/clear`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authorization.split(' ')[1]}`
      }
    });

    const data = await response.json();
    res.status(response.status || 999).json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: false, message: 'Error interno del servidor' });
  }
};

export default {
  getCart,
  addToCart,
  updateCartItem,
  deleteCartItem,
  clearCart
};
