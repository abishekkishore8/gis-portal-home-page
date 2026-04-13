import { createBrowserRouter } from "react-router";
import { HomePage } from "./pages/HomePage";
import { VillagesPage } from "./pages/VillagesPage";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: HomePage,
  },
  {
    path: "/villages",
    Component: VillagesPage,
  },
]);
