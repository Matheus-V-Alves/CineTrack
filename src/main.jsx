import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import App from "./App";
import Home from "./pages/Home";
import Search from "./pages/Search";
import DetailsMovie from "./pages/DetailsMovie";
import { Toaster } from "@/components/ui/toaster";
import { ErrorDialog } from "./components/error-dialog";
import { NotFound } from "./components/not-found";
import { SearchProvider } from "./context/SearchContext";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "search",
        element: <Search />,
        children: [
          { path: ":searchTag" },
        ],
      },
    ],
    //errorElement: <ErrorDialog title={'Erro ao carregar a página'}/>,
  },
  {
    path: "movie/:movieId",
    element: <DetailsMovie />,
    //errorElement: <ErrorDialog title={'Erro ao carregar a página'}/>,
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <SearchProvider>
      <RouterProvider router={router} />
      <Toaster />
    </SearchProvider>
  </StrictMode>
);
