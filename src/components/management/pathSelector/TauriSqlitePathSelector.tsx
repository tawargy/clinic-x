import { useState } from "react";
import { invoke } from "@tauri-apps/api/core";

function TauriSqlitePathSelector() {
  const [dbPath, setDbPath] = useState<string>("");
  const [error, setError] = useState<string>("");

  const handleSelectPath = async () => {
    try {
      // Open a directory selection dialog
      // const selected = await dialog.open({
      //   directory: true,
      //   multiple: false,
      // });
      // if (selected) {
      //   const path = Array.isArray(selected) ? selected[0] : selected;
      //   setDbPath(path);
      //   // Call Rust function to set the DB path
      //   await invoke("set_db_path", { path });
      //   // Optionally initialize the database
      //   await invoke("init_db_with_path");
      //  }
    } catch (err) {
      setError("Failed to set database path");
      console.error(err);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Database Location</h2>
      <div className="flex gap-4 items-center">
        <input
          type="text"
          value={dbPath}
          readOnly
          className="flex-1 p-2 border rounded"
          placeholder="Select database location..."
        />
        <button
          onClick={handleSelectPath}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Select Path
        </button>
      </div>
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </div>
  );
}

export default TauriSqlitePathSelector;
