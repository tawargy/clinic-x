import { TRequest } from "../../types";

const requestsReducer = (state: TRequest[], action: any) => {
  switch (action.type) {
    case "ADD_REQUEST":
      return [...state, action.payload];
    case "REMOVE_REQUEST":
      return state.filter((request) => request.id !== action.payload);

    case "RESET":
      return [];
    default:
      return state;
  }
};

export default requestsReducer;
