import { invoke } from "@tauri-apps/api/core";
import { TEmployee } from "../types";

export const addEmployeeApi = async (data: TEmployee) => {
  try {
    const res = await invoke<TEmployee>("add_employee", { data });
    return res;
  } catch (e) {
    console.error("Error added employee:", e);
  }
};
export const updateEmployeeApi = async (data: TEmployee) => {
  try {
    const res = await invoke<TEmployee>("update_employee_by_id", {
      id: data.id,
      data,
    });
    return res;
  } catch (e) {
    console.error("Error update employee:", e);
  }
};
export const getEmployeesApi = async () => {
  try {
    const res = await invoke<TEmployee[]>("get_employees", {});
    return res;
  } catch (e) {
    console.error("Error get employees:", e);
  }
};
export const deleteEmployeeApi = async (id: string) => {
  try {
    const res = await invoke<TEmployee[]>("delete_employee", { id });
    return res;
  } catch (e) {
    console.error("Error delete employee:", e);
  }
};
