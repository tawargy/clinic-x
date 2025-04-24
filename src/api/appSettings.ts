import { invoke } from "@tauri-apps/api/core";
export const verifyActivationApi = async () => {
  try {
    const res = await invoke<boolean>("verify_activation");
    console.log("res activation", res);
    return res;
  } catch (e) {
    console.log("error activation", e);
  }
};

export const patientsCountApi = async () => {
  try {
    const res = await invoke<number>("get_patients_count");
    console.log("res patients count", res);
    return res;
  } catch (e) {
    console.log("error patients count", e);
  }
};

// DataBase Backup
export const getDbBackupPathApi = async () => {
  try {
    const res = await invoke<string | null>("get_db_backup_path");
    console.log("res patients count", res);
    return res || "";
  } catch (e) {
    console.log("error patients count", e);
  }
};
export const addDbBackupPathApi = async (backupPath: string) => {
  try {
    const res = await invoke<string>("add_db_backup_path", {
      backupPath,
    });
    console.log("res patients count", res);
    return res;
  } catch (e) {
    console.log("error patients count", e);
  }
};
export const updateDbBackupPathApi = async (backupPath: string) => {
  try {
    const res = await invoke<string>("set_db_backup_path", {
      backupPath,
    });
    console.log("res patients count", res);
    return res;
  } catch (e) {
    console.log("error patients count", e);
  }
};

export const dbBackup = async (targetBackupPath: string) => {
  try {
    if (!targetBackupPath) {
      return;
    }

    const res = await invoke<string>("backup_sqlite_db", {
      targetBackupPath,
    });
    console.log("DB backup result:", res);
  } catch (err) {
    console.log(err);
  }
};
