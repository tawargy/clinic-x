import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Input from "../comman/formFaild/Input";
import { X, Edit2 } from "lucide-react";
import { TEmployee } from "../../types";
import { employeeInit } from "../../initData";
import { toastError, toastSuccess } from "../../utils/toastify";
import {
  addEmployeeApi,
  deleteEmployeeApi,
  getEmployeesApi,
  updateEmployeeApi,
} from "../../api/employee";

const employeesInit: TEmployee[] = [
  {
    id: "",
    name: "",
    phone: "",
    address: "",
    salary: "",
    role: "",
    n_id: "",
  },
];
function Employees() {
  const [employees, setEmployees] = useState<TEmployee[]>(employeesInit);
  const [isShowForm, setIsShowForm] = useState(false);

  useEffect(() => {
    getEmployees();
  }, []);
  const {
    register,
    handleSubmit,
    reset,

    formState: { errors },
  } = useForm<TEmployee>({
    mode: "onBlur",
    defaultValues: employeeInit,
  });

  const addEmployee = async (data: TEmployee) => {
    try {
      const res = await addEmployeeApi(data);
      console.log(res);
      toastSuccess("The Employee added successfuly");
    } catch (e) {
      console.error("Error added employee:", e);
      toastError("The Employee not added!");
    }
  };
  const updateEmployee = async (data: TEmployee) => {
    try {
      const res = await updateEmployeeApi(data);
      console.log(res);
      toastSuccess("The Employee updated successfuly");
    } catch (e) {
      console.error("Error update employee:", e);
      toastError("The Employee not updated!");
    }
  };
  const getEmployees = async () => {
    try {
      const res = await getEmployeesApi();
      res && setEmployees(res);
      console.log(res);
    } catch (e) {
      console.error("Error get employees:", e);
    }
  };
  const deleteEmployee = async (id: string) => {
    try {
      const res = await deleteEmployeeApi(id);
      console.log(res);
      toastSuccess("The Employee deleted successfuly");
    } catch (e) {
      console.error("Error delete employee:", e);
      toastError("The Employee deleted faild");
    }
  };
  const onSaveHandler = async (data: TEmployee) => {
    if (data.id === "") {
      await addEmployee(data);
    } else {
      await updateEmployee(data);
    }

    await getEmployees();
    setIsShowForm(false);
    reset(employeeInit);
  };

  const onEditHandler = (id: string) => {
    const [employee] = employees.filter((emp) => emp.id === id);
    reset(employee);
    setIsShowForm(true);
  };
  const onDeleteHandler = async (id: string) => {
    await deleteEmployee(id);
    await getEmployees();
  };
  return (
    <div>
      <h3 className="mb-4">Employees:</h3>
      <div className="flex gap-8 w-full">
        {isShowForm ? (
          <form
            className="w-1/2 flex flex-col  gap-1 "
            onSubmit={handleSubmit(onSaveHandler)}
          >
            <Input
              label="Name"
              name="name"
              register={register}
              error={errors.name?.message}
            />

            <Input
              label="N.ID"
              name="n_id"
              register={register}
              error={errors.n_id?.message}
            />

            <Input
              label="Phone"
              name="phone"
              register={register}
              error={errors.phone?.message}
            />

            <Input
              label="Address"
              name="address"
              register={register}
              error={errors.address?.message}
            />

            <Input
              label="Role"
              name="role"
              register={register}
              error={errors.role?.message}
            />

            <Input
              label="Salary"
              name="salary"
              register={register}
              error={errors.salary?.message}
            />
            <div className="flex justify-around mt-8 ">
              <button
                type="submit"
                className="bg-green-500 px-8 py-6 w-1/3  rounded-lg hover:bg-green-700"
              >
                Save
              </button>
              <button
                className="bg-red-500 px-8 py-6 w-1/3 rounded-lg hover:bg-red-700 "
                onClick={() => {
                  setIsShowForm(false);
                  reset(employeeInit);
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <div className="w-1/2">
            <button
              onClick={() => setIsShowForm(true)}
              className="text-blue-500 hover:text-blue-600 mt-2"
            >
              + Add Employee
            </button>
          </div>
        )}
        <div className="w-1/2  h-[calc(100vh-300px)]  overflow-y-auto custom-scrollbar">
          {employees.map(
            (emp) =>
              emp.id && (
                <div key={emp.id}>
                  <div className="border border-gray-600 rounded-lg p-2 mb-2 relative">
                    <div className="flex items-center gap-4 py-1 absolute top-0 right-0">
                      <button onClick={() => onEditHandler(emp.id)}>
                        <Edit2
                          className="text-blue-300 hover:text-blue-500"
                          size={18}
                        />
                      </button>
                      <button onClick={() => onDeleteHandler(emp.id)}>
                        <X className="text-red-300 hover:text-red-500" />
                      </button>
                    </div>
                    <h4 className="py-1">{emp.name.toUpperCase()}</h4>
                    <p className="text-sm text-gray-400">{emp.n_id}</p>
                    <p className="flex gap-6">
                      <span>{emp.phone}</span>
                      <span>{emp.address}</span>
                    </p>
                    <p className="flex gap-6">
                      <span>{emp.salary}</span>
                      <span>{emp.role}</span>
                    </p>
                  </div>
                </div>
              ),
          )}
        </div>
      </div>
    </div>
  );
}

export default Employees;
