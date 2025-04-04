import { invoke } from "@tauri-apps/api/core";
import { TPatientInfo } from "../types";

export async function getRecentlyApi() {
  try {
    const recently = await invoke<TPatientInfo[]>("get_recently");
    return recently;
  } catch (e) {
    console.log(e);
  }
}
