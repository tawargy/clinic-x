import MainLayout from "../layouts/MainLout";
import Error from "../pages/Error";

import Home from "../pages/Home";
import AddPatient from "../pages/AddPatient";
import PatientBasicInfo from "../pages/PatientBasicInfo";
import Calender from "../pages/Calender";
import Appointment from "../pages/Appointment";
import Signin from "../pages/Signin";

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
      path: "calender",
      element: <Calender />,
    },

    {
      path: "appointment/:id",
      element: <Appointment />,
    },
  ],
};

export default MainRoutes;
