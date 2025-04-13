import { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import TauriSqlitePathSelector from "./pathSelector/TauriSqlitePathSelector";

function AppSettings() {
  const [biosSerial, setBiosSerial] = useState<string>("");
  const [systemInfo, setSystemInfo] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState(true);

  const getBiosSerials = async () => {
    console.log("Starting to fetch data..."); // Debug log

    try {
      // Try bios_serial first
      try {
        console.log("Fetching BIOS serial...");
        const biosRes = await invoke<string>("bios_serial");
        console.log("BIOS Response:", biosRes);
        setBiosSerial(biosRes);
      } catch (biosError) {
        console.error("BIOS Serial Error:", biosError);
        setError(`BIOS Error: ${biosError}`);
      }

      // Try system_info separately
      try {
        console.log("Fetching System Info...");
        const sysRes = await invoke<string>("system_info");
        console.log("System Info Response:", sysRes);
        setSystemInfo(sysRes);
      } catch (sysError) {
        console.error("System Info Error:", sysError);
        setError((prev) => `${prev}\nSystem Info Error: ${sysError}`);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getBiosSerials();
  }, []);
  return (
    <div>
      <h2>AppSettings</h2>
      <TauriSqlitePathSelector />
      {/* <div>Status: {loading ? "Loading..." : "Done"}</div>

      <div>
        <h3>BIOS Serial:</h3>
        {biosSerial ? <p>{biosSerial}</p> : <p>No BIOS serial available</p>}
      </div>

      <div>
        <h3>System Info:</h3>
        {systemInfo ? <p>{systemInfo}</p> : <p>No system info available</p>}
      </div>

      {error && (
        <div style={{ color: "red", marginTop: "20px" }}>
          <h3>Errors:</h3>
          <pre>{error}</pre>
        </div>
      )} */}
    </div>
  );
}

export default AppSettings;
