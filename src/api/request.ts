import { invoke } from "@tauri-apps/api/core";
import { TRequest } from "../types";

export const addRequsetApi = async (requests: TRequest[]) => {
  try {
    const res = await invoke("add_request", {
      requests,
    });
    return res as string;
  } catch (e) {
    console.error("Faild to add request");
  }
};
export const getRequsetsApi = async (id: string) => {
  try {
    const res = await invoke("get_request_by_id", {
      requestId: id,
    });
    return res;
  } catch (e) {
    console.error("Faild to add request");
  }
};
