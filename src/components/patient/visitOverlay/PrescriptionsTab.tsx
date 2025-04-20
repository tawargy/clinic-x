import { useState } from "react";
import { useAppSettings } from "../../../contextApi/appContext";
import { useRequest } from "../../../hooks/useRequest";
import { TAppointment, TRequest } from "../../../types";
import { updateRequestByIdApi } from "../../../api/request";

type TProps = {
  appointment: TAppointment;
};
function PrescriptionsTab({ appointment }: TProps) {
  const { darkMode } = useAppSettings();
  const { requests, requestsId, refetch } = useRequest(appointment.requests);

  const [editingRequestId, setEditingRequestId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<TRequest | null>(null);

  const startEditing = (request: TRequest) => {
    setEditingRequestId(request.id || null);
    setEditForm({ ...request });
  };

  const cancelEditing = () => {
    setEditingRequestId(null);
    setEditForm(null);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    if (!editForm) return;

    setEditForm({
      ...editForm,
      [e.target.name]: e.target.value,
    });
  };

  const saveRequestChanges = async () => {
    if (!editForm || !editingRequestId || !requestsId) return;

    try {
      await updateRequestByIdApi(requestsId, editingRequestId, editForm);
      refetch(); // Refresh the data
      setEditingRequestId(null);
      setEditForm(null);
    } catch (error) {
      console.error("Failed to update request:", error);
    }
  };

  return (
    <div className="grid grid-cols-2 gap-6  pr-2  overflow-y-autoto custom-scrollbar  ">
      <div
        className={`${darkMode ? "bg-gray-700" : "bg-white"} rounded-lg shadow-md p-4 overflow-y-auto custom-scrollbar`}
      >
        <h3
          className={`text-sm font-medium mb-3 ${darkMode ? "text-gray-300" : "text-gray-600"} flex items-center`}
        >
          Prescriptions
        </h3>
        <div className="">
          {appointment &&
            appointment.prescription.map((p, i) => {
              if (!p.name) return null;
              return (
                <div
                  key={i}
                  className={`border ${
                    darkMode
                      ? "border-gray-600 bg-gray-800"
                      : "border-gray-200 bg-gray-50"
                  } p-3 rounded-lg hover:shadow-md transition-shadow duration-200`}
                >
                  <p
                    className={`font-medium ${darkMode ? "text-gray-300" : "text-gray-600"} flex gap-4`}
                  >
                    <span> {p.name}</span>
                  </p>
                  <p
                    className={`${darkMode ? "text-gray-300" : "text-gray-700"} whitespace-pre-wrap text-sm leading-relaxed`}
                  >
                    dosage: <span> {p.dosage}</span>
                  </p>
                  <p
                    className={`${darkMode ? "text-gray-300" : "text-gray-700"} whitespace-pre-wrap text-sm leading-relaxed`}
                  >
                    duration: <span> {p.duration}</span>
                  </p>
                </div>
              );
            })}
        </div>
      </div>

      {/* Requests section (with edit functionality) */}
      <div
        className={`${darkMode ? "bg-gray-700" : "bg-white"} rounded-lg shadow-md p-4`}
      >
        <h3
          className={`text-sm font-medium mb-3 ${darkMode ? "text-gray-300" : "text-gray-600"} flex items-center`}
        >
          Requests
        </h3>

        <div className="max-h-[380px] overflow-y-auto custom-scrollbar">
          {requests &&
            requests.map((r, i) => {
              if (!r.req_name) return null;

              // Show edit form if this request is being edited
              if (r.id === editingRequestId && editForm) {
                return (
                  <div
                    key={i}
                    className={`border ${
                      darkMode
                        ? "border-gray-600 bg-gray-800"
                        : "border-gray-200 bg-gray-50"
                    } p-3 rounded-lg mb-3`}
                  >
                    <div className="flex justify-between">
                      {/* <div className="mb-2">
                        <label
                          className={`text-sm ${darkMode ? "text-gray-300" : "text-gray-600"}`}
                        >
                          Type:
                        </label>
                        <select
                          name="req_type"
                          value={editForm.req_type || ""}
                          onChange={(e) => handleInputChange(e as any)}
                          className={`w-full px-2 py-1 mt-1 rounded  ${
                            darkMode
                              ? "bg-gray-700 text-white"
                              : "bg-white text-gray-800"
                          } border ${darkMode ? "border-gray-600" : "border-gray-300"}`}
                        >
                          <option value="lab" >
                            Lab
                          </option>
                          <option value="imaging">Imaging</option>
                        </select>
                      </div> */}
                      <div className="mb-2">
                        <label
                          className={`text-sm ${darkMode ? "text-gray-300" : "text-gray-600"}`}
                        >
                          Name:
                        </label>
                        <input
                          type="text"
                          name="req_name"
                          value={editForm.req_name || ""}
                          onChange={handleInputChange}
                          className={`w-full px-2 py-1 mt-1 rounded ${
                            darkMode
                              ? "bg-gray-700 text-white"
                              : "bg-white text-gray-800"
                          } border ${darkMode ? "border-gray-600" : "border-gray-300"}`}
                        />
                      </div>

                      <div className="mb-2">
                        <label
                          className={`text-sm ${darkMode ? "text-gray-300" : "text-gray-600"}`}
                        >
                          Date:
                        </label>
                        <input
                          type="date"
                          name="req_date"
                          value={editForm.req_date || ""}
                          onChange={handleInputChange}
                          className={`w-full px-2 py-1 mt-1 rounded ${
                            darkMode
                              ? "bg-gray-700 text-white"
                              : "bg-white text-gray-800"
                          } border ${darkMode ? "border-gray-600" : "border-gray-300"}`}
                        />
                      </div>
                    </div>
                    <div className="mb-2">
                      <label
                        className={`text-sm ${darkMode ? "text-gray-300" : "text-gray-600"}`}
                      >
                        Comment:
                      </label>
                      <textarea
                        name="comment"
                        value={editForm.comment || ""}
                        onChange={handleInputChange}
                        className={`w-full px-2 py-1 mt-1 rounded ${
                          darkMode
                            ? "bg-gray-700 text-white"
                            : "bg-white text-gray-800"
                        } border ${darkMode ? "border-gray-600" : "border-gray-300"}`}
                        rows={2}
                      />
                    </div>
                    <div className="mb-2">
                      <label
                        className={`text-sm ${darkMode ? "text-gray-300" : "text-gray-600"}`}
                      >
                        Result:
                      </label>
                      <textarea
                        name="resualt"
                        value={editForm.resualt || ""}
                        onChange={handleInputChange}
                        className={`w-full px-2 py-1 mt-1 rounded ${
                          darkMode
                            ? "bg-gray-700 text-white"
                            : "bg-white text-gray-800"
                        } border ${darkMode ? "border-gray-600" : "border-gray-300"}`}
                        rows={2}
                      />
                    </div>
                    <div className="flex justify-end space-x-2 mt-3">
                      <button
                        onClick={cancelEditing}
                        className={`px-3 py-1 rounded text-sm ${
                          darkMode
                            ? "bg-gray-600 text-white hover:bg-gray-500"
                            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                        }`}
                      >
                        Cancel
                      </button>
                      <button
                        onClick={saveRequestChanges}
                        className="px-3 py-1 rounded text-sm bg-blue-500 text-white hover:bg-blue-600"
                      >
                        Save
                      </button>
                    </div>
                  </div>
                );
              }

              // Show normal view with edit button
              return (
                <div
                  key={i}
                  className={`border ${
                    darkMode
                      ? "border-gray-600 bg-gray-800"
                      : "border-gray-200 bg-gray-50"
                  } p-3 rounded-lg hover:shadow-md transition-shadow duration-200 mb-3`}
                >
                  <div className="flex justify-between mb-2 text-sm">
                    <span
                      className={`${r.req_type === "imaging" ? "text-blue-500" : "text-yellow-500"}`}
                    >
                      {r.req_type}
                    </span>
                    <span>{r.req_date}</span>
                  </div>
                  <p
                    className={`font-medium ${darkMode ? "text-gray-300" : "text-gray-600"} flex gap-4`}
                  >
                    <span>{r.req_name}</span>
                  </p>
                  <p
                    className={`${darkMode ? "text-gray-300" : "text-gray-700"} whitespace-pre-wrap text-sm leading-relaxed`}
                  >
                    {r.comment}
                  </p>
                  <p
                    className={`${darkMode ? "text-gray-300" : "text-gray-700"} whitespace-pre-wrap text-sm leading-relaxed`}
                  >
                    <span>Result: </span>
                    <span>{r.resualt}</span>
                  </p>
                  <div className="flex justify-end mt-2">
                    <button
                      onClick={() => startEditing(r)}
                      className={`text-xs px-2 py-1 rounded ${
                        darkMode
                          ? "bg-gray-600 hover:bg-gray-500 text-white"
                          : "bg-gray-200 hover:bg-gray-300 text-gray-700"
                      }`}
                    >
                      Edit
                    </button>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
}

export default PrescriptionsTab;
