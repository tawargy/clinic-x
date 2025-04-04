import React, { useEffect, useState } from "react";
import { useClinic } from "../../contextApi/clinicContext";
import { useAppSettings } from "../../contextApi/appContext";
import { formatDate } from "../../utils/date";
import { followupNames } from "../../utils/followupNames";
import { getLastAppointmentWrapperApi } from "../../api/appointmentWrapper";
import { getFeeAndServicesApi } from "../../api/feeAndServices";
import { TAppointmentWrapper } from "../../types";

interface EventFormProps {
  selectedDate: Date;
  onAddAppoimtmentDate: (data: any) => void;
  onCancel: () => void;
  patientId: string;
}

const CalendarEvent: React.FC<EventFormProps> = ({
  selectedDate,
  onCancel,
  onAddAppoimtmentDate,
  patientId,
}) => {
  const { patientInfo } = useClinic();
  const { darkMode } = useAppSettings();
  const [description, setDescription] = useState("");
  const [followups, setFollowups] = useState<string[]>(["First Folloup"]);
  const [lastAppointmentWrapper, setLastAppointmentWrapper] = useState<
    TAppointmentWrapper | undefined
  >();
  const [appointmentType, setAppointmentType] = useState("new");

  const getFollowupsIds = async () => {
    try {
      const res = await getFeeAndServicesApi();
      if (res) {
        const followupsIds = res.followups.map((f) => f.followup_name);
        setFollowups(followupsIds);
      }
    } catch (e) {
      console.log(e);
    }
  };
  useEffect(() => {
    getFollowupsIds();
    getLastAppointmentWrapperApi(patientId, setLastAppointmentWrapper);
  }, []);

  useEffect(() => {
    if (lastAppointmentWrapper?.appointment_status === "Open") {
      const followupAppo = Number(
        lastAppointmentWrapper?.followup_appointments.length,
      );
      const folloIndex = followupAppo === 0 ? 0 : followupAppo;
      const value = followups[folloIndex];
      if (value) {
        setAppointmentType(value);
      }
    }
  }, [lastAppointmentWrapper, followups]);
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddAppoimtmentDate({
      appointment_type: appointmentType,
      description,
    });
  };
  const handleAppointmentTypeChange = (
    e: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    setAppointmentType(e.target.value);
  };
  return (
    <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
      <h2 className="text-xl font-bold mb-4">
        Add Patient for {formatDate(selectedDate)}
      </h2>

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Patient Name *
          </label>
          <input
            type="text"
            id="title"
            value={patientInfo?.name}
            disabled
            className={`${darkMode ? " border-gray-600 text-gray-500 placeholder-gray-400" : "bg-gray-50 border-gray-300 text-gray-900"}
               border text-lg rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-4 p-2.5 transition-colors duration-200`}
            required
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Appointment Type *
          </label>
          <select
            id="title"
            value={appointmentType}
            onChange={handleAppointmentTypeChange}
            className="w-full text-gray-500 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="new">New</option>
            {followups.map((followup, index) => (
              <option
                key={index}
                value={followup}
                disabled={
                  lastAppointmentWrapper?.appointment_status === "Open"
                    ? false
                    : true
                }
              >
                {followupNames(followup)}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-6">
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Description (optional)
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="text-gray-500 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={3}
          />
        </div>

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Save Event
          </button>
        </div>
      </form>
    </div>
  );
};

export default CalendarEvent;
