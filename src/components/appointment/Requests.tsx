import { useState } from "react";
import { useAppSettings } from "../../contextApi/appContext";
import { ArrowBigLeftDash, ArrowBigRightDash, X } from "lucide-react";

type TRequest = {
  id: string;
  req_date: string;
  req_name: string;
  comment: string;
  req_type: string;
  resualt?: string;
};

type TProps = {
  setStage: (stage: string) => void;
  requstes: TRequest[];
  setRequstes: (req: TRequest[]) => void;
};
function Requests({ setStage, requstes, setRequstes }: TProps) {
  const { darkMode } = useAppSettings();
  const [reqName, setReqName] = useState("");
  const [reqComment, setReqComment] = useState("");
  const [reqType, setReqType] = useState("imaging");
  const onSubmitHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const uuid = Math.random().toString();
    const req: TRequest = {
      id: uuid,
      req_date: new Date().toString(),
      req_name: reqName,
      comment: reqComment,
      req_type: reqType,
    };
    console.log(req);
    setRequstes([...requstes, req]);
    setReqName("");
    setReqComment("");
  };
  const deleteReq = (id: string) => {
    setRequstes(requstes.filter((item) => id !== item.id));
  };
  const imagingReqArr = () => {
    const imaging = requstes.filter((r) => r.req_type === "imaging");
    return (
      <div className="flex flex-col gap-1">
        {imaging.map((img) => (
          <div
            key={img.id}
            className="border border-gray-500 p-2 rounded-lg relative "
          >
            <button
              className=" absolute right-1 top-1"
              onClick={() => deleteReq(img.id)}
            >
              <X className="text-red-500 " size={18} />
            </button>
            <p>Request : {img.req_name}</p>
            <p>{img.comment}</p>
          </div>
        ))}
      </div>
    );
  };
  const lapReqArr = () => {
    const lapArr = requstes.filter((l) => l.req_type === "lap");
    return (
      <div className="flex flex-col gap-1">
        {lapArr.map((lap) => (
          <div
            key={lap.id}
            className="border border-gray-500 p-2 rounded-lg relative"
          >
            <button
              className=" absolute right-1 top-1"
              onClick={() => deleteReq(lap.id)}
            >
              <X className="text-red-500 " size={18} />
            </button>
            <p>Request:{lap.req_name}</p>
            <p>{lap.comment}</p>
          </div>
        ))}
      </div>
    );
  };
  return (
    <div>
      <div>
        <div className="h-[477px] max-h-[477px] overflow-y-auto custom-scrollbar rounded-lg shadow-md  px-4">
          <h2>Requstes</h2>
          <h3 className="pt-4 text-yellow-500">imaging</h3>
          {imagingReqArr()}
          <h3 className="pt-4 text-yellow-500">Lap</h3>
          {lapReqArr()}
        </div>
        <form onSubmit={onSubmitHandler}>
          <div className="flex gap-6 items-center py-4 ">
            <div className="flex items-center">
              <input
                type="radio"
                id="imaging"
                name="reqType"
                value="imaging"
                onChange={(e) => setReqType(e.target.value)}
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:bg-gray-700 dark:border-gray-600"
              />
              <label
                htmlFor="imaging"
                className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
              >
                Imaging
              </label>
            </div>

            <div className="flex items-center">
              <input
                type="radio"
                id="lap"
                name="reqType"
                value="lap"
                onChange={(e) => setReqType(e.target.value)}
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:bg-gray-700 dark:border-gray-600"
              />
              <label
                htmlFor="lap"
                className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
              >
                Lap
              </label>
            </div>
          </div>
          <label>
            Requste
            <input
              className={`${darkMode ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400" : "bg-gray-50 border-gray-300 text-gray-900"}
          border text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-4 p-2.5 transition-colors duration-200`}
              type="text"
              value={reqName}
              onChange={(e) => setReqName(e.target.value)}
            />
          </label>

          <label>
            Comment
            <input
              className={`${darkMode ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400" : "bg-gray-50 border-gray-300 text-gray-900"}
          border text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-4 p-2.5 transition-colors duration-200`}
              type="text"
              value={reqComment}
              onChange={(e) => setReqComment(e.target.value)}
            />
          </label>
          <div className="flex justify-center mt-2">
            <button type="submit" className="bg-green-500 px-4 py-2 rounded-md">
              Add
            </button>
          </div>
        </form>
      </div>
      <div className="mt-4 flex justify-between ">
        <button className="py-4 px-2" onClick={() => setStage("prescription")}>
          <ArrowBigLeftDash
            className="text-gray-500 hover:text-gray-400"
            size={40}
          />
        </button>
        <button className="  py-4  px-2 " onClick={() => setStage("services")}>
          <ArrowBigRightDash
            className="text-yellow-500 hover:text-yellow-700"
            size={40}
          />
        </button>
      </div>
    </div>
  );
}

export default Requests;
