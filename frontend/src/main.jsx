import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import Pokemons from "./Pokemons";

import { createBrowserRouter, RouterProvider, Route } from "react-router-dom";
import PokemonDetail from "./PokemonDetail";
import Login from "./Login";
import Register from "./Register";
import RootLayout from "./Root";
import HomePage from "./HomePage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        path: "/pokemon/:pokemonId",
        element: <PokemonDetail />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/register",
        element: <Register />,
      },
      {
        path: "/home",
        element: <HomePage />,
      },
      {
        path: "/",
        element: <Pokemons />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
