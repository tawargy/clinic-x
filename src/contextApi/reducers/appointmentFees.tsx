import { TAppointmentFees } from "../../types";

const appointmentFeesReducer = (state: TAppointmentFees, action: any) => {
  switch (action.type) {
    case "SET_FEE":
      return {
        ...state,
        fee: action.payload,
      };
    case "ADD_SERVICE":
      return {
        ...state,
        services: [...state.services, action.payload],
      };
    case "REMOVE_SERVICE":
      return {
        ...state,
        services: state.services.filter((_, index) => index !== action.payload),
      };
    case "UPDATE_SERVICE":
      return {
        ...state,
        services: state.services.map((service, index) =>
          index === action.payload.index ? action.payload.service : service,
        ),
      };
    case "RESET":
      return action.payload;
    default:
      return state;
  }
};
export default appointmentFeesReducer;
