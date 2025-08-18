import { createBrowserRouter } from "react-router-dom";

import RootLayout from "./RootLayout";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Genero from "./pages/Genero";      
import Detalhes from "./pages/Detalhes";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      { index: true, element: <Login /> },
      { path: "/home", element: <Home /> },
      { path: "/genero/:nome", element: <Genero /> },   
      { path: "/detalhes/:id", element: <Detalhes /> },
    ],
  },
]);

export default router;







