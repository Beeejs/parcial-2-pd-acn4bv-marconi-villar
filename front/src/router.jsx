/* React router dom */
import { createBrowserRouter } from "react-router-dom";
/* Pages */
import Layout from "./Layout";
import Home from "./pages/Home";
import Products from "./pages/Products";
import AuthPage from "./pages/Auth";
import ProductABM from "./pages/ProductABM";
import ErrorPage from "./pages/Error";
import ProductForm from "./components/products/ProductForm";
import ContactPage from "./pages/Contact";
import ProductDetail from "./pages/ProductDetail";

export const router = createBrowserRouter([
  {
    path: "/auth",
    element: <AuthPage/>
  },
  {
    element: <Layout/>,
    children: [
      {
        path: "/",
        element: <Home/>
      },
      {
        path: "/products",
        element: <Products/>
      },
      {
        path: "/productAbm",
        element: <ProductABM/>
      },
      {
        path: "/products/new",
        element: <ProductForm />,
      },
      {
        path: "/products/:id",
        element: <ProductForm />,
      },
      {
        path: "/productDetail/:id",
        element: <ProductDetail />,
      },
      {
        path: '/contact',
        element: <ContactPage/>
      }
    ]
  },
  {
    path: '/error',
    element: <ErrorPage/>
  }
])
