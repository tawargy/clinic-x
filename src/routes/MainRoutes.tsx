import MainLayout from "../layouts/MainLayout";
import Error from "../pages/Error";

import Home from "../pages/Home";
import AddPatient from "../pages/AddPatient";
import Patient from "../pages/Patient";
import Agenda from "../pages/Agenda";
import Appointment from "../pages/Appointment";

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
  ],
};

export default MainRoutes;
