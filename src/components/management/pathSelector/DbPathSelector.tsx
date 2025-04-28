import { useEffect, useState } from "react";
import { useAppSettings } from "../../../contextApi/appContext";
import { save } from "@tauri-apps/plugin-dialog";

import {
  addDbBackupPathApi,
  updateDbBackupPathApi,
} from "../../../api/appSettings";
import { toastSuccess, toastError } from "../../../utils/toastify";

function DbPathSelector() {
  const { darkMode, dbBackupPath } = useAppSettings();
  const [dbPath, setDbPath] = useState<string>("");

  useEffect(() => {
    setDbPath(dbBackupPath);
  }, []);

  const selectDbPathHandler = async () => {
    try {
      const selectedPath = await save({
        filters: [
          {
            name: "SQLite Database",
            extensions: ["db"],
          },
        ],
        defaultPath: "clinicX-database.db",
      });

      if (selectedPath) {
        setDbPath(selectedPath);
      }
    } catch (err) {
      console.log(err);
    }
  };
  const onAddPathHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      if (dbBackupPath === "") {
        updateDbBackupPathApi(dbPath);
      } else {
        addDbBackupPathApi(dbPath);
      }

      toastSuccess("Database path added successfully");
    } catch (err) {
      toastError("Error adding database path");
    }
  };

  return (
    <div
      className={`${darkMode ? "bg-gray-800" : "bg-white"} mt-4 rounded-lg shadow-md py-4 px-2 transition-colors duration-200`}
    >
      <h2 className=" font-semibold py-2">Database Backup Location</h2>
      <form onSubmit={onAddPathHandler}>
        <div className="flex gap-4 items-center">
          <input
            type="text"
            value={dbPath}
            readOnly
            placeholder="Select database backup location..."
            className={`${darkMode ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400" : "bg-gray-50 border-gray-300 text-gray-900"}
           w-[80%] border text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500  pl-4 p-2.5 transition-colors duration-200`}
          />

          <button
            type="button"
            onClick={selectDbPathHandler}
            className="px-4 py-2  bg-blue-400 text-white rounded hover:bg-blue-500"
          >
            Select Path
          </button>
        </div>
        <div className="flex justify-center">
          <button
            type="submit"
            className="w-1/3 bg-blue-400 hover:bg-blue-500 text-white px-4 py-2 rounded mt-4"
          >
            Add
          </button>
        </div>
      </form>
    </div>
  );
}

export default DbPathSelector;
