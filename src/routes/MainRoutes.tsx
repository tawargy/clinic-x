import MainLayout from "../layouts/MainLayout";
import Error from "../pages/Error";

import Home from "../pages/Home";
import AddPatient from "../pages/AddPatient";
import Patient from "../pages/Patient";
import Agenda from "../pages/Agenda";
import Management from "../pages/Management";

const MainRoutes = {
  path: "/",
  element: <MainLayout />,
  errorElement: <Error />,
  children: [
    {
      index: true,
      element: <Home />,
    },
    {
      path: "add-patient",
      element: <AddPatient />,
    },
    {
      path: "patient/:id",
      element: <Patient />,
    },
    {
      path: "agenda",
      element: <Agenda />,
    },
    {
      path: "manage",
      element: <Management />,
    },
  ],
};

export default MainRoutes;
