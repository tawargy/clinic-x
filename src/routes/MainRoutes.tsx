import { lazy, Suspense } from "react";
import MainLayout from "../layouts/MainLayout";
import Error from "../pages/Error";

const Home = lazy(() => import("../pages/Home"));
const AddPatient = lazy(() => import("../pages/AddPatient"));
const Patient = lazy(() => import("../pages/Patient"));
const Agenda = lazy(() => import("../pages/Agenda"));
const Management = lazy(() => import("../pages/Management"));

const MainRoutes = {
  path: "/",
  element: <MainLayout />,
  errorElement: <Error />,
  children: [
    {
      index: true,
      element: (
        <Suspense fallback={<div>Loading...</div>}>
          <Home />
        </Suspense>
      ),
    },
    {
      path: "add-patient",
      element: (
        <Suspense fallback={<div>Loading...</div>}>
          <AddPatient />
        </Suspense>
      ),
    },
    {
      path: "patient/:id",
      element: (
        <Suspense fallback={<div>Loading...</div>}>
          <Patient />
        </Suspense>
      ),
    },
    {
      path: "agenda",
      element: (
        <Suspense fallback={<div>Loading...</div>}>
          <Agenda />
        </Suspense>
      ),
    },
    {
      path: "manage",
      element: (
        <Suspense fallback={<div>Loading...</div>}>
          <Management />
        </Suspense>
      ),
    },
  ],
};

export default MainRoutes;
