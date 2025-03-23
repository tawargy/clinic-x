import { useState } from "react";
import { useAppSettings } from "../../../contextApi/appContext";

type TVeesAndServices = {
  vees: number;
  followups: TFolloup[];
  services: TService[];
};
type TFolloup = {
  followup_name: string;
  followup_vees: number;
};
type TService = {
  service_name: string;
  service_vees: number;
};

function VeesAndServices() {
  const [veesAndServices, setVeesAndServices] = useState<TVeesAndServices>({
    vees: 0,
    followups: [{ followup_name: "followup_1", followup_vees: 10 }],
    services: [],
  });
  const [services, setServices] = useState<TService[]>([]);
  const [followups, setFollowups] = useState<TFolloup[]>([
    { followup_name: "followup_1", followup_vees: 0 },
  ]);

  const submetHandler = (e: React.FormEvent) => {
    e.preventDefault();

    const updatedVeesAndServices = {
      ...veesAndServices,
      followups: followups,
      services: services,
    };

    setVeesAndServices(updatedVeesAndServices);
    console.log(updatedVeesAndServices);
  };

  const { darkMode } = useAppSettings();
  return (
    <div>
      <h2>Vees And Services</h2>
      <form className="w-1/3" onSubmit={submetHandler}>
        <label htmlFor="vees" className="block w-full mt-4">
          Vees
          <input
            type="number"
            id="vees"
            className={`${darkMode ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400" : "bg-gray-50 border-gray-300 text-gray-900"} border text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-4 p-2.5 transition-colors duration-200`}
            onChange={(e) =>
              setVeesAndServices({
                ...veesAndServices,
                vees: Number(e.target.value),
              })
            }
          />
        </label>

        <div className="mt-4">
          {followups.map((f, index) => (
            <div className="flex gap-4" key={index}>
              <label
                htmlFor={f.followup_name}
                className="block w-full mt-2"
                key={index}
              >
                {f.followup_name.replace("_", " ")}
                <input
                  className={`${darkMode ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400" : "bg-gray-50 border-gray-300 text-gray-900"} border text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-4 p-2.5 transition-colors duration-200`}
                  type="number"
                  id={f.followup_name}
                  name={f.followup_name}
                  value={f.followup_vees}
                  onChange={(e) => {
                    const updatedFollowups = [...followups];
                    updatedFollowups[index] = {
                      ...f,
                      followup_vees: Number(e.target.value),
                    };
                    setFollowups(updatedFollowups);
                  }}
                />
              </label>

              {index === followups.length - 1 && followups.length > 1 && (
                <button
                  type="button"
                  className="text-red-500"
                  onClick={(e) => {
                    e.preventDefault();

                    setFollowups(followups.filter((_, i) => i !== index));
                  }}
                >
                  x
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={() => {
              const followupLength = followups.length;
              const followupName = `followup_${followupLength + 1}`;
              setFollowups([
                ...followups,
                { followup_name: followupName, followup_vees: 0 },
              ]);
            }}
            className="text-blue-500 hover:text-blue-600 mt-2"
          >
            + Add Followup
          </button>
        </div>
        <div className="mt-4">
          <label htmlFor="services" className="block">
            Services
          </label>

          {services.map((service, index) => (
            <div className="flex gap-2" key={index}>
              <input
                type="text"
                className={`${
                  darkMode
                    ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                    : "bg-gray-50 border-gray-300 text-gray-900"
                } border text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full mb-2 pl-4 p-2.5 transition-colors duration-200`}
                value={service.service_name}
                placeholder="Service name"
                onChange={(e) => {
                  const updatedServices = [...services];
                  updatedServices[index] = {
                    ...service,
                    service_name: e.target.value,
                  };
                  setServices(updatedServices);
                }}
              />
              <input
                type="number"
                className={`${
                  darkMode
                    ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                    : "bg-gray-50 border-gray-300 text-gray-900"
                } border text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full mb-2 pl-4 p-2.5 transition-colors duration-200`}
                value={service.service_vees}
                placeholder="Vees"
                onChange={(e) => {
                  const updatedServices = [...services];
                  updatedServices[index] = {
                    ...service,
                    service_vees: Number(e.target.value),
                  };
                  setServices(updatedServices);
                }}
              />
              <button
                type="button"
                className="text-red-500"
                onClick={(e) => {
                  e.preventDefault();
                  setServices(services.filter((_, i) => i !== index));
                }}
              >
                x
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => {
              setServices([
                ...services,
                { service_name: "", service_vees: 0 }, // Initialize with empty name and 0 vees
              ]);
            }}
            className="text-blue-500 hover:text-blue-600 mt-2"
          >
            + Add Service
          </button>
        </div>
        <button type="submit">Save</button>
      </form>
    </div>
  );
}

export default VeesAndServices;
