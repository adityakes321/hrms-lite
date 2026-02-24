import { useEffect, useState } from "react";
import AddEmployeeForm from "@/components/AddEmployeeForm";
import EmployeeTable from "@/components/EmployeeTable";
import LoadingSpinner from "@/components/LoadingSpinner";
import ErrorAlert from "@/components/ErrorAlert";
import { employeeService } from "@/services/employeeService";
import type { Employee } from "@/types";

const Employees = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchEmployees = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await employeeService.getAll();
      setEmployees(data);
    } catch {
      setError("Failed to load employees. Is the backend running?");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchEmployees(); }, []);

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Employees</h2>
      <AddEmployeeForm onSuccess={fetchEmployees} />
      {error && <ErrorAlert message={error} />}
      {loading ? <LoadingSpinner /> : <EmployeeTable employees={employees} onRefresh={fetchEmployees} />}
    </div>
  );
};

export default Employees;
