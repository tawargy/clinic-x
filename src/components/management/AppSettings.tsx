import { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import DbPathSelector from "./pathSelector/DbPathSelector";
import { useAppSettings } from "../../contextApi/appContext";
import { verifyActivationApi } from "../../api/appSettings";
import { BadgeCheck } from "lucide-react";
import { getVersion } from "@tauri-apps/api/app";
import { toastSuccess } from "../../utils/toastify";

function AppSettings() {
  const { darkMode, activation } = useAppSettings();
  const [serial, setSerial] = useState<string>("");
  const [key, setKey] = useState("");
  const [isVerify, setIsVerify] = useState(false);
  //const [error, setError] = useState<string>("");
  //const [loading, setLoading] = useState(true);

  const [version, setVersion] = useState("Loading...");

  useEffect(() => {
    // Fetch the app version when the component mounts
    getVersion()
      .then((version) => {
        setVersion(version);
      })
      .catch((err) => {
        console.error("Failed to get app version:", err);
        setVersion("Error loading version");
      });
  }, []);
  const getSerial = async () => {
    const hash = await invoke<string>("serial_hash");
    console.log("Hash:", hash);
    setSerial(hash);
  };

  const getVerify = async () => {
    try {
      const res = await verifyActivationApi();
      console.log("V:", res);
      res && setIsVerify(res);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    getSerial();
    getVerify();
  }, []);

  const keySubmitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // try {
    //   const res = await invoke<string>("set_public_key", {
    //     publicKey: key,
    //   });
    //   console.log("res", res);
    //   toastSuccess("Success key, The App is Active");
    // } catch (e) {
    //   console.log("error", e);

    //   toastSuccess("Faild key, The App is Not Active");
    // }

    try {
      const res = await invoke<string>("set_public_key", {
        publicKey: key,
      });
      console.log("res", res);

      // Check if the response indicates success
      if (res === "Public key added successfully" || !res.includes("Invalid")) {
        toastSuccess("Success key, The App is Active");

        // Re-fetch the verification status after successful activation
        setTimeout(async () => {
          activation();
          setIsVerify(true);
        }, 500); // Small delay to ensure the database changes are complete
      } else {
        toastSuccess("Failed key, The App is Not Active");
      }
    } catch (e) {
      console.log("error", e);
      toastSuccess("Failed key, The App is Not Active");
    }
  };
  return (
    <div>
      <div
        className={`${darkMode ? "bg-gray-800" : "bg-white"} rounded-lg shadow-md py-4 px-2 transition-colors duration-200`}
      >
        <p className="flex gap-2 py-4">
          <span>Version:</span>
          <span>{version}</span>
        </p>
        <h3 className="flex flex-col lg:flex-row gap-4 mt-4">
          <span>App serial number:</span>
          <span
            className={`${darkMode ? "text-yellow-600" : "text-black"} text-sm lg:text-lg`}
          >
            {serial}
          </span>
        </h3>
        {isVerify ? (
          <h4 className="py-4 flex gap-4">
            <span>Verification </span>
            <BadgeCheck className="text-green-500" size={22} />
          </h4>
        ) : (
          <form onSubmit={keySubmitHandler} className="mt-4 ">
            <div className="flex gap-2 items-center">
              <label htmlFor="key">Key:</label>
              <input
                type="text"
                name="key"
                id="key"
                value={key}
                onChange={(e) => setKey(e.target.value)}
                className={`${darkMode ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400" : "bg-gray-50 border-gray-300 text-gray-900"}
             w-[80%] border text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500  pl-4 p-2.5 transition-colors duration-200`}
              />
              <button
                type="submit"
                className="py-2 px-4  bg-blue-400 hover:bg-blue-500 rounded"
              >
                Add
              </button>
            </div>
          </form>
        )}
      </div>
      <DbPathSelector />
    </div>
  );
}

export default AppSettings;
