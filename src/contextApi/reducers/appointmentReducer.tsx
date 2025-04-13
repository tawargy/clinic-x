import { TAppointment } from "../../types";

const appointmentReducer = (state: TAppointment, action: any) => {
  switch (action.type) {
    case "VAITALS":
      return {
        ...state,
        vitals: action.payload,
      };
    case "COMPLAINT":
      return {
        ...state,
        complaint: action.payload,
      };

    case "PRESENT_HISTORY":
      return {
        ...state,
        present_history: action.payload,
      };

    case "EXAMINATION":
      return {
        ...state,
        examination: action.payload,
      };
    case "DIAGNOSIS":
      return {
        ...state,
        provisional_diagnosis: action.payload,
      };
    case "ADD_PRESCRIPTION":
      return {
        ...state,
        prescription: [...state.prescription, action.payload],
      };
    case "REMOVE_PRESCRIPTION":
      return {
        ...state,
        prescription: state.prescription.filter(
          (_, index) => index !== action.payload,
        ),
      };
    case "RESET":
      return action.payload;
    default:
      return state;
  }
};
export default appointmentReducer;
