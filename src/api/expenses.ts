import { invoke } from "@tauri-apps/api/core";
import { TExpenses } from "../types";

export const addExpensesApi = async (data: TExpenses) => {
  try {
    const res = await invoke<TExpenses>("add_expenses", { data });
    return res;
  } catch (e) {
    console.error("Error adding expenses:", e);
    throw e;
  }
};

export const getExpensesByMonthApi = async (month: string) => {
  try {
    const res = await invoke<TExpenses>("get_expenses_by_month", { month });
    console.log("Expenses for month:", month, res);

    return res;
  } catch (e) {
    console.error("Error getting expenses:", e);
    throw e;
  }
};

export const updateExpensesByIdApi = async (id: string, data: TExpenses) => {
  try {
    const res = await invoke<boolean>("update_expenses_by_id", { id, data });
    return res;
  } catch (e) {
    console.error("Error updating expenses:", e);
    throw e;
  }
};
