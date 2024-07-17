import PetManagement from "./page/pet-management";
import HomePage from "./page/home";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Layout from "./components/layout";
import LoginPage from "./page/login";
import Cart from "./page/cart";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <HomePage />,
      },
      {
        path: "/cart",
        element: <Cart />,
      },
      {
        path: "/pet-management",
        element: <PetManagement />,
      },
      {
        path: "/login",
        element: <LoginPage />,
      },
    ],
  },
]);
function App() {
  return <RouterProvider router={router} />;
}

export default App;
