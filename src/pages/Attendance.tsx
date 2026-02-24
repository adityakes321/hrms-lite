import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import MarkAttendanceForm from "@/components/MarkAttendanceForm";
import AttendanceTable from "@/components/AttendanceTable";
import LoadingSpinner from "@/components/LoadingSpinner";
import ErrorAlert from "@/components/ErrorAlert";
import { employeeService } from "@/services/employeeService";
import { attendanceService } from "@/services/attendanceService";
import type { Employee, AttendanceRecord } from "@/types";

const Attendance = () => {
  const { employeeId } = useParams<{ employeeId?: string }>();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [totalPresent, setTotalPresent] = useState<number>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchData = async () => {
    setLoading(true);
    setError("");
    try {
      const emps = await employeeService.getAll();
      setEmployees(emps);
      if (employeeId) {
        const [recs, summary] = await Promise.all([
          attendanceService.getByEmployee(employeeId),
          attendanceService.getSummary(employeeId),
        ]);
        setRecords(recs);
        setTotalPresent(summary.total_present);
      } else {
        setRecords([]);
        setTotalPresent(undefined);
      }
    } catch {
      setError("Failed to load data. Is the backend running?");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, [employeeId]);

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Attendance</h2>
      {error && <ErrorAlert message={error} />}
      {loading ? (
        <LoadingSpinner />
      ) : (
        <>
          <MarkAttendanceForm employees={employees} onSuccess={fetchData} />
          {employeeId && (
            <AttendanceTable records={records} totalPresent={totalPresent} employeeId={employeeId} />
          )}
        </>
      )}
    </div>
  );
};

export default Attendance;
