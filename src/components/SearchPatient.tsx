import React, { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Search, UserPlus } from "lucide-react";
import { debounce } from "../utils/debounce";
import { Patient } from "../types";

interface SearchPatientProps {
  searchTerm: string;
  onSearch: (term: string) => void;
  searchResults: Patient[];
  darkMode: boolean;
}

const SearchPatient: React.FC<SearchPatientProps> = ({
  searchTerm,
  onSearch,
  searchResults,
  darkMode,
}) => {
  const [inputValue, setInputValue] = useState("");
  const navigate = useNavigate();

  const debouncedSearch = useCallback(
    debounce((query: string) => {
      onSearch(query);
    }, 500),
    [onSearch],
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // setVInput(e.target.value);
    const value = e.target.value;
    setInputValue(value);
    if (value.trim() === "") {
      onSearch("");
      return;
    }
    debouncedSearch(value);
    console.log("res2", searchResults);
  };

  return (
    <div className="h-full flex flex-col">
      <div className="relative mb-4">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <Search
            className={`w-5 h-5 ${darkMode ? "text-gray-400" : "text-gray-400"}`}
          />
        </div>
        <input
          type="text"
          className={`${darkMode ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400" : "bg-gray-50 border-gray-300 text-gray-900"} border text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5 transition-colors duration-200`}
          placeholder="Search patients by name or phone..."
          value={inputValue}
          onChange={handleInputChange}
        />
      </div>

      <div className="flex-grow overflow-y-auto pr-1 custom-scrollbar">
        {searchTerm && searchResults.length === 0 ? (
          <div
            className={`text-center py-4 ${darkMode ? "text-gray-400" : "text-gray-500"} transition-colors duration-200`}
          >
            <p>No patients found</p>
          </div>
        ) : searchTerm ? (
          <ul
            className={`divide-y ${darkMode ? "divide-gray-700" : "divide-gray-200"} transition-colors duration-200`}
          >
            {searchResults.map((patient) => (
              <li
                key={patient.id}
                className={` py-3 flex justify-between items-center ${darkMode ? "hover:bg-gray-700" : "hover:bg-gray-50"} px-2 rounded transition-colors duration-200`}
              >
                <div>
                  <h3 className="font-medium">{patient.name}</h3>
                  <p
                    className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"} transition-colors duration-200`}
                  >
                    Age: {patient.age}
                  </p>
                </div>
                <button
                  onClick={() => navigate(`/patient/${patient.id}`)}
                  className={`${darkMode ? "bg-gray-600 text-gray-300" : "bg-gray-200 text-gray-600"}
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
  );
};

export default SearchPatient;
