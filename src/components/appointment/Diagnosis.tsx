import { useState } from "react";
import { useAppSettings } from "../../contextApi/appContext";
import DatePicker from "react-datepicker";
import { formatDate } from "../../utils/date";
import { TDiagnosis } from "../../types";
import { ArrowBigLeftDash, ArrowBigRightDash, X } from "lucide-react";

type TProps = {
  addDiagnosis: (d: TDiagnosis) => void;
  setStage: (s: string) => void;
  diagnosis: TDiagnosis[];
  deletedDiagnosis: (i: number) => void;
};
function Diagnosis({
  addDiagnosis,
  setStage,
  diagnosis,
  deletedDiagnosis,
}: TProps) {
  const [title, setTitle] = useState("");
  const [diagnosisType, setDiagnosisType] = useState("acute");
  const [start, setStart] = useState<Date | null>();
  const [end, setEnd] = useState<Date | null>();
  const [ongoing, setOngoing] = useState(false);
  const [comment, setComment] = useState("");
  const { darkMode } = useAppSettings();

  const onChangeHandler = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setComment(() => e.target.value);
    console.log(e.target.value);
  };
  const onSubmitHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = {
      diagnosis_type: diagnosisType,
      diagnosis_title: title,
      start: formatDate(start),
      end: formatDate(end),
      ongoing,
      comment,
    };
    addDiagnosis(data);
    setTitle("");
    setDiagnosisType("non-chronic");
    setStart(null);
    setEnd(null);
    setOngoing(false);
    setComment("");
  };
  const onCheckHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOngoing(e.target.checked);
    setEnd(null);
  };

  return (
    <div>
      <div className="h-[360px]  max-h-[360px] overflow-y-auto custom-scrollbar rounded-lg shadow-md px-4 ">
        <h2>Diagnosis:</h2>
        <div className="flex flex-col gap-4   p-1 pb-2 ">
          {diagnosis.map((d, index) => (
            <div key={index}>
              <div className="border border-gray-300 p-2 rounded-lg relative">
                <button
                  className=" absolute right-1 top-1"
                  onClick={() => deletedDiagnosis(index)}
                >
                  <X className="text-red-500" size={18} />
                </button>
                <p
                  className={`${darkMode ? "text-gray-400" : "text-gray-600"}`}
                >
                  {d.diagnosis_title}
                </p>
                <p
                  className={`${darkMode ? "text-gray-500" : "text-gray-500"} flex gap-4 text-sm`}
                >
                  <span>[{d.start} :</span>
                  <span>{d.end}]</span>
                </p>
                <p
                  className={`${darkMode ? "text-gray-400" : "text-gray-600"} text-sm`}
                >
                  {d.comment}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <form onSubmit={onSubmitHandler}>
        <div className="pt-8">
          <label htmlFor="title">Diagnosis Title</label>
          <input
            type="text"
            id="title"
            name="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className={`${darkMode ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400" : "bg-gray-50 border-gray-300 text-gray-900"}
          border text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-4 p-2.5 transition-colors duration-200`}
          />
        </div>

        <div className="flex gap-6 items-center py-4 ">
          <div className="flex items-center">
            <input
              type="radio"
              id="chronic"
              name="diadnosisType"
              value="chronic"
              onChange={(e) => setDiagnosisType(e.target.value)}
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:bg-gray-700 dark:border-gray-600"
            />
            <label
              htmlFor="chronic"
              className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
            >
              Chronic
            </label>
          </div>

          <div className="flex items-center">
            <input
              type="radio"
              id="acute"
              name="diadnosisType"
              value="acute"
              onChange={(e) => setDiagnosisType(e.target.value)}
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:bg-gray-700 dark:border-gray-600"
            />
            <label
              htmlFor="acute"
              className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
            >
              Acute
            </label>
          </div>
        </div>
        <div className="flex gap-4 py-4">
          <div className="block w-full dark:text-white">
            <span className="block mb-0">start</span>
            <DatePicker
              onChange={(date) => setStart(date)}
              selected={start ? new Date(start) : null}
              dateFormat="dd-MM-yyyy"
              className={`${darkMode ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400" : "bg-gray-50 border-gray-300 text-gray-900"}  block w-full mt-0 mb-1 px-2 py-2 rounded-md focus:outline-none
              border border-gray-400 focus:border-blue-light text-gray-700 bg-gray-100`}
              placeholderText="DD-MM-YYYY"
              showYearDropdown
              scrollableYearDropdown
              yearDropdownItemNumber={100}
            />
          </div>
          <div className="block w-full dark:text-white">
            <span className="block mb-0">end</span>
            <DatePicker
              disabled={ongoing}
              onChange={(date) => setEnd(date)}
              selected={end ? new Date(end) : null}
              dateFormat="dd-MM-yyyy"
              className={`${darkMode ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400" : "bg-gray-50 border-gray-300 text-gray-900"}  block w-full mt-0 mb-1 px-2 py-2 rounded-md focus:outline-none
              border border-gray-400 focus:border-blue-light text-gray-700 bg-gray-100`}
              placeholderText="DD-MM-YYYY"
              showYearDropdown
              scrollableYearDropdown
              yearDropdownItemNumber={100}
            />
          </div>
          <label className="flex items-center space-x-2">
            <span className="text-sm font-medium text-gray-900 dark:text-gray-300">
              ongoing
            </span>
            <input
              type="checkbox"
              checked={ongoing}
              onChange={(e) => onCheckHandler(e)}
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:bg-gray-700 dark:border-gray-600"
            />
          </label>
        </div>
        <textarea
          className={`${darkMode ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400" : "bg-gray-50 border-gray-300 text-gray-900"} border text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-4 p-2.5 transition-colors duration-200`}
          value={comment}
          name="provisional_diagnosis"
          onChange={onChangeHandler}
          placeholder="Comment"
        />
        <div className="flex justify-center">
          <button
            className=" bg-green-500 text-white ml-2 mt-2 text-sm py-2  px-4 rounded-md hover:bg-green-700"
            type="submit"
          >
            Add
          </button>
        </div>
      </form>

      <div className="mt-1 flex justify-between">
        <button className="py-4 px-2" onClick={() => setStage("main")}>
          <ArrowBigLeftDash
            className="text-gray-500 hover:text-gray-400"
            size={40}
          />
        </button>
        <button
          className="  py-4  px-2 "
          onClick={() => setStage("prescription")}
        >
          <ArrowBigRightDash
            className="text-yellow-500 hover:text-yellow-700"
            size={40}
          />
        </button>
      </div>
    </div>
  );
}

export default Diagnosis;
