import { useCallback } from "react";
import { invoke } from "@tauri-apps/api/core";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAppSettings } from "../contextApi/context";
import { IoPersonAddSharp } from "react-icons/io5";
import { PiCalendarCheck } from "react-icons/pi";

type TPatient = {
  id: string;
  name: string;
};

function debounce<T extends (...args: any[]) => void>(
  func: T,
  wait: number,
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;

  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

function Home() {
  const { themeMode } = useAppSettings();
  const [searchResult, setSearchResult] = useState<TPatient | undefined>([]);
  const [queue, setQueue] = useState<TPatient[] | undefined>([]);
  const [recently, setRecently] = useState<TPatient[] | undefined>([]);

  async function getQueueAndRecently() {
    const queue = (await invoke("get_queue")) as TPatient[] | undefined;
    setQueue(queue);
    const recently = (await invoke("get_recently")) as TPatient[] | undefined;
    setRecently(recently);
  }
  useEffect(() => {
    getQueueAndRecently();
  }, []);

  const addPatient = async (input: string) => {
    console.log(input);
    try {
      const res = (await invoke("search_result", { input: input })) as
        | TPatient
        | undefined;
      setSearchResult(res);
      console.log(searchResult);
    } catch (e) {
      console.log(e);
    }
  };

  const debouncedSearch = useCallback(
    debounce((input: string) => {
      addPatient(input);
    }, 500),
    [],
  );
  const onChangeHandler = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    if (input.length < 1) {
      setSearchResult(undefined);
      return;
    }
    debouncedSearch(input);
  };

  const onBlurHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTimeout(() => {
      setSearchResult(undefined);
      e.target.value = "";
    }, 200);
  };
  return (
    <div>
      <div className={"flex gap-4 "}>
        <div className="w-1/4  bg-white  rounded-lg shadow-lg dark:bg-bg-dark  dark:shadow-blue-500/50 ">
          <h3 className="bg-blue-700 text-center py-4 rounded-t-md text-white lg:text-lg">
            Queue
          </h3>
          <div className="lg:px-4">
            {queue &&
              queue.map((p) => (
                <p key={p.id}>
                  <Link
                    className="bg-blue-400 block py-2 my-3 rounded-md  text-center hover:bg-blue-500 hover:text-white lg:font-bold text-sm lg:text-lg "
                    to={`/appointment/${p.id}`}
                  >
                    {p.name}
                  </Link>
                </p>
              ))}
          </div>
        </div>
        <div className="flex flex-col  h-[80vh] w-1/2 bg-white  text-center rounded-lg shadow-lg dark:bg-bg-dark  dark:shadow-blue-500/50 dark:text-gray-100">
          <div>
            <div className="bg-blue-700 py-3 px-2 rounded-t-lg">
              <input
                className=" p-2 rounded-md bg-white  inline-block w-full lg:w-1/2 m-auto text-gray-700 "
                type="text"
                placeholder="Enter Name"
                onChange={onChangeHandler}
                onBlur={onBlurHandler}
              />
            </div>

            <div
              className={`w-1/2 m-auto search-results ${searchResult ? "show" : ""}`}
            >
              {searchResult &&
                searchResult.map((p) => (
                  <p key={p.id}>
                    <Link
                      to={`/patient-basic-info/${p.id}`}
                      className="bg-gray-200 block py-2 mb-2 rounded-md
                      text-center hover:bg-gray-300
                      lg:font-bold text-sm lg:text-lg dark:text-black "
                    >
                      {p.name}
                    </Link>
                  </p>
                ))}
            </div>
          </div>
          <div className="flex h-[100%] gap-2 lg:gap-8 my-8 justify-center items-center">
            <Link
              title="Add Patient"
              className="flex justify-center items-center bg-blue-400 rounded-xl w-[40px] h-[40px] lg:w-[70px] lg:h-[70px] hover:bg-blue-500 "
              to={"/add-patient"}
            >
              <IoPersonAddSharp
                style={{
                  fontSize: "1.5rem",
                  color: `${themeMode ? "#fff" : "#000"}`,
                }}
              />
            </Link>
            <Link
              title="Calender"
              className="flex justify-center items-center bg-blue-400 rounded-xl w-[40px] h-[40px] lg:w-[70px] lg:h-[70px] hover:bg-blue-500 text-black dark:text-white"
              to={"/calender"}
            >
              <PiCalendarCheck
                style={{
                  fontSize: "1.5rem",
                  color: `${themeMode ? "#fff" : "#000"}`,
                }}
              />
            </Link>
            <Link
              title="Ai Assistant"
              to={"/"}
              className="flex items-center justify-center bg-blue-400 rounded-xl w-[40px] h-[40px] lg:w-[70px] lg:h-[70px] hover:bg-blue-500 text-black dark:text-white"
            >
              AI
            </Link>
          </div>
        </div>
        <div className="w-1/4 bg-white rounded-lg shadow-lg dark:bg-bg-dark  dark:shadow-blue-500/50 ">
          <h3 className="bg-blue-700 text-center py-4 rounded-t-md text-white lg:text-lg ">
            Recently
          </h3>
          <div className="lg:px-4">
            {recently &&
              recently.map((p) => (
                <p key={p.id}>
                  <Link
                    className="bg-blue-400 block py-2 my-3 rounded-md  text-center hover:bg-blue-500 hover:text-white lg:font-bold text-sm lg:text-lg "
                    to={`/patient-basic-info/${p.id}`}
                  >
                    {p.name}
                  </Link>
                </p>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
