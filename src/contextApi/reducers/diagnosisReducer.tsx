import { TDiagnosis } from "../../types";

const diagnosisReducer = (state: TDiagnosis[], action: any) => {
  switch (action.type) {
    case "ADD_DIAGNOSIS":
      return [...state, action.payload];
    case "REMOVE_DIAGNOSIS":
      return state.filter((_, index) => index !== action.payload);

    case "RESET":
      return [];
    default:
      return state;
  }
};

export default diagnosisReducer;
