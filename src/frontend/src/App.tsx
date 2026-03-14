import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
  useRouterState,
} from "@tanstack/react-router";
import { AnimatePresence } from "motion/react";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import BestAntennasMods from "./pages/BestAntennasMods";
import BestBudgetHandhelds2026 from "./pages/BestBudgetHandhelds2026";
import ChirpProgrammingGuide from "./pages/ChirpProgrammingGuide";
import EquipmentReviews from "./pages/EquipmentReviews";
import Home from "./pages/Home";
import Links from "./pages/Links";
import QuanshengUVK5Review from "./pages/QuanshengUVK5Review";
import SatelliteScanningAntennas from "./pages/SatelliteScanningAntennas";
import UVK5LiveMirror from "./pages/UVK5LiveMirror";
import UVK5ViewerPage from "./pages/UVK5ViewerPage";
import Videos from "./pages/Videos";

function RootLayout() {
  const { location } = useRouterState();
  const isStandalone = location.pathname === "/uv-k5-viewer";

  if (isStandalone) {
    return <Outlet />;
  }

  return (
    <div
      style={{ background: "#0a0a0a", minHeight: "100vh", color: "#e0e0e0" }}
    >
      <Navbar />
      <AnimatePresence mode="wait">
        <Outlet />
      </AnimatePresence>
      <Footer />
    </div>
  );
}

const rootRoute = createRootRoute({
  component: RootLayout,
});

const homeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: Home,
});

const videosRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/videos",
  component: Videos,
});

const linksRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/links",
  component: Links,
});

const equipmentReviewsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/equipment-reviews",
  component: EquipmentReviews,
});

const quanshengReviewRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/equipment-reviews/quansheng-uv-k5",
  component: QuanshengUVK5Review,
});

const chirpGuideRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/equipment-reviews/chirp-programming-guide",
  component: ChirpProgrammingGuide,
});

const bestAntennasModsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/equipment-reviews/best-antennas-mods-uv-k5",
  component: BestAntennasMods,
});

const bestBudgetHandheldsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/equipment-reviews/best-budget-handhelds-2026",
  component: BestBudgetHandhelds2026,
});

const satelliteScanningAntennasRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/equipment-reviews/satellite-scanning-antennas",
  component: SatelliteScanningAntennas,
});

const uvk5LiveMirrorRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/equipment-reviews/uv-k5-live-mirror",
  component: UVK5LiveMirror,
});

const uvk5ViewerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/uv-k5-viewer",
  component: UVK5ViewerPage,
});

const routeTree = rootRoute.addChildren([
  homeRoute,
  videosRoute,
  linksRoute,
  equipmentReviewsRoute,
  quanshengReviewRoute,
  chirpGuideRoute,
  bestAntennasModsRoute,
  bestBudgetHandheldsRoute,
  satelliteScanningAntennasRoute,
  uvk5LiveMirrorRoute,
  uvk5ViewerRoute,
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
