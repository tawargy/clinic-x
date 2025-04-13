import { useEffect, useState, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { debounce } from "../../utils/debounce";
import { Phone, Search, UserPlus } from "lucide-react";

type TSearchPatientProps = {
  searchTerm: string;
  onSearch: (term: string) => void;
  searchResults: TPatient[];
  darkMode: boolean;
};
type TPatient = {
  id: string;
  name: string;
};

function SearchPatient({
  searchTerm,
  onSearch,
  searchResults,
  darkMode,
}: TSearchPatientProps) {
  const [inputValue, setInputValue] = useState("");
  const navigate = useNavigate();
  const componentRef = useRef<HTMLInputElement>(null);

  const debouncedSearch = useCallback(
    debounce((query: string) => {
      onSearch(query);
    }, 300),
    [onSearch],
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        componentRef.current &&
        !componentRef.current.contains(event.target as Node)
      ) {
        setInputValue("");
        onSearch("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onSearch]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    if (value.trim() === "") {
      onSearch("");
      return;
    }
    if (value.length === 1) {
      onSearch(value);
      return;
    }
    debouncedSearch(value);
  };
  const newPaientHandler = () => {
    navigate("/add-patient");
  };
  return (
    <div
      className={`${
        darkMode ? "bg-gray-800 text-white" : "bg-white"
      } rounded-lg shadow-md p-4 transition-colors duration-200 h-[calc(100vh-130px)] flex flex-col`}
    >
      <div className="flex items-center justify-between mb-4">
        <h2
          className={`${darkMode ? "text-gray-400" : "text-gray-500"} md:text-lg font-semibold flex items-center`}
        >
          <Search className="mr-2 text-purple-500" size={20} />
          Search Patients
        </h2>
        <button
          onClick={newPaientHandler}
          className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md flex items-center text-sm transition-colors duration-200"
        >
          <UserPlus className="mr-1" size={16} />
          New Patient
        </button>
      </div>
      <div className="flex-grow overflow-hidden">
        <div className="h-full flex flex-col" ref={componentRef}>
          <div className="relative mb-4">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search
                className={`w-5 h-5 ${
                  darkMode ? "text-gray-400" : "text-gray-400"
                }`}
              />
            </div>
            <input
              type="text"
              className={`${
                darkMode
                  ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                  : "bg-gray-50 border-gray-300 text-gray-900"
              } border text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5 transition-colors duration-200`}
              placeholder="Search patients by name or phone..."
              value={inputValue}
              onChange={handleInputChange}
            />
          </div>

          <div className="flex-grow overflow-y-auto pr-1 custom-scrollbar">
            {searchTerm && searchResults.length === 0 ? (
              <div
                className={`text-center py-4 ${
                  darkMode ? "text-gray-400" : "text-gray-500"
                } transition-colors duration-200`}
              >
                <p>No patients found</p>
              </div>
            ) : searchTerm ? (
              <ul
                className={`divide-y ${
                  darkMode ? "divide-gray-700" : "divide-gray-200"
                } transition-colors duration-200`}
              >
                {searchResults.map((patient) => (
                  <li
                    key={patient.id}
                    className={` py-3 flex justify-between items-center ${
                      darkMode ? "hover:bg-gray-700" : "hover:bg-gray-50"
                    } px-2 rounded transition-colors duration-200`}
                  >
                    <div>
                      <h3 className="font-medium">{patient.name}</h3>
                      <p
                        className={`text-sm flex  pt-2 ${
                          darkMode ? "text-gray-400" : "text-gray-500"
                        } transition-colors duration-200`}
                      >
                        <Phone
                          className={`mr-3 ${
                            darkMode ? "text-gray-400" : "text-gray-500"
                          }`}
                          size={16}
                        />
                        {patient.phone}
                      </p>
                    </div>
                    <button
                      onClick={() => navigate(`/patient/${patient.id}`)}
                      className={`${
                        darkMode
                          ? "bg-gray-600 text-gray-300"
                          : " text-gray-600"
                      }
                       bg-blue-500 hover:bg-blue-600 text-white
                   px-3 py-1 rounded-md flex items-center text-sm transition-colors duration-200`}
                    >
                      <UserPlus className="mr-1" size={16} />
                      {"Info"}
                    </button>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}

export default SearchPatient;
