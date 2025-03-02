import React, { useState } from "react";
import { useClinic } from "../contextApi/clinicContext";
import { useAppSettings } from "../contextApi/appContext";

interface EventFormProps {
  selectedDate: Date;
  onSubmit: (event: {
    patientId: string;
    patientName: string;
    appointmentType: string;
    description: string;
  }) => void;
  onCancel: () => void;
  patientName: string;
  patientId: string;
}

const CalendarEvent: React.FC<EventFormProps> = ({
  selectedDate,
  onSubmit,
  onCancel,
  patientName,
  patientId,
}) => {
  const [description, setDescription] = useState("");
  const [appointmentType, setAppointmentType] = useState("new");
  const { setPatientInfo } = useClinic();
  const { darkMode } = useAppSettings();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    onSubmit({
      patientId,
      patientName,
      appointmentType,
      description,
    });
    setPatientInfo(undefined);
  };
  const handleAppointmentTypeChange = (
    e: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    setAppointmentType(e.target.value);
  };
  return (
    <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
      <h2 className="text-xl font-bold mb-4">
        Add Patient for {selectedDate.toLocaleDateString()}
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
            value={patientName}
            disabled
            className={`${darkMode ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400" : "bg-gray-50 border-gray-300 text-gray-900"} border text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-4 p-2.5 transition-colors duration-200`}
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
            <option value="followup">Follo Up</option>
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
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
