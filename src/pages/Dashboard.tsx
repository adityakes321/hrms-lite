import { useEffect, useState } from "react";
import { Users, UserCheck, UserX } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import LoadingSpinner from "@/components/LoadingSpinner";
import ErrorAlert from "@/components/ErrorAlert";
import { employeeService } from "@/services/employeeService";
import { attendanceService } from "@/services/attendanceService";

const Dashboard = () => {
  const [totalEmployees, setTotalEmployees] = useState(0);
  const [presentToday, setPresentToday] = useState<number | null>(null);
  const [absentToday, setAbsentToday] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const [employees, todaySummary] = await Promise.all([
          employeeService.getAll(),
          attendanceService.getTodaySummary(),
        ]);
        setTotalEmployees(employees.length);
        setPresentToday(todaySummary.present_today);
        setAbsentToday(todaySummary.absent_today);
      } catch {
        setError("Failed to load dashboard data. Is the backend running?");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return <LoadingSpinner />;

  const stats = [
    { label: "Total Employees", value: totalEmployees, icon: Users, color: "text-primary" },
    { label: "Present Today", value: presentToday ?? "—", icon: UserCheck, color: "text-success" },
    { label: "Absent Today", value: absentToday ?? "—", icon: UserX, color: "text-destructive" },
  ];

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Dashboard</h2>
      {error && <ErrorAlert message={error} />}
      <div className="grid gap-4 sm:grid-cols-3">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{stat.label}</CardTitle>
              <stat.icon className={`h-5 w-5 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
