import MainLayout from "../layouts/MainLout";
import Error from "../pages/Error";

import Home from "../pages/Home";
import AddPatient from "../pages/AddPatient";
import PatientBasicInfo from "../pages/PatientBasicInfo";
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
      path: "patient-basic-info/:id",
      element: <PatientBasicInfo />,
    },
    {
      path: "agenda",
      element: <Agenda />,
    },

    {
      path: "appointment/:id",
      element: <Appointment />,
    },
  ],
};

export default MainRoutes;
