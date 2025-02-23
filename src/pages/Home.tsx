import { invoke } from "@tauri-apps/api/core";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

type TPatient = {
  id: string;
  name: string;
};

function Home() {
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

  const onChangeHandler = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    console.log(input);
    //debounce
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
  return (
    <div>
      <div className={"flex gap-4"}>
        <div className="w-1/4 bg-gray-300">
          <h3>Queue</h3>
          {queue &&
            queue.map((p) => (
              <p key={p.id}>
                <Link to={`/appointment/${p.id}`}>{p.name}</Link>
              </p>
            ))}
        </div>
        <div className="w-1/2 bg-gray-500 p-4 text-center">
          <div>
            <input
              type="text"
              placeholder="Enter a name"
              onChange={onChangeHandler}
            />
            <div>
              {searchResult &&
                searchResult.map((p) => (
                  <p key={p.id}>
                    <Link to={p.id}>{p.name}</Link>
                  </p>
                ))}
            </div>
          </div>
          <div className="flex gap-4 my-8 justify-center items-center">
            <div className="w-[70px] h-[70px] bg-blue-400">
              <Link to={"/add-patient"}>ADD</Link>
            </div>
            <div className="w-[70px] h-[70px] bg-red-200">AI</div>
          </div>
        </div>
        <div className="w-1/4 bg-gray-500">
          <h3>Recently</h3>
          {recently &&
            recently.map((p) => (
              <p key={p.id}>
                <Link to={`/patient-basic-info/${p.id}`}>{p.name}</Link>
              </p>
            ))}
        </div>
      </div>
    </div>
  );
}

export default Home;
