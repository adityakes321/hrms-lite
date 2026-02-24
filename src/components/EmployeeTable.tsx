import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Trash2, CalendarCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { employeeService } from "@/services/employeeService";
import type { Employee } from "@/types";
import EmptyState from "./EmptyState";

interface EmployeeTableProps {
  employees: Employee[];
  onRefresh: () => void;
}

const EmployeeTable = ({ employees, onRefresh }: EmployeeTableProps) => {
  const navigate = useNavigate();
  const [deleting, setDeleting] = useState<string | null>(null);

  const handleDelete = async (employeeId: string) => {
    setDeleting(employeeId);
    try {
      await employeeService.delete(employeeId);
      toast.success("Employee deleted");
      onRefresh();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to delete");
    } finally {
      setDeleting(null);
    }
  };

  if (employees.length === 0) return <EmptyState message="No employees found" />;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">All Employees</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Employee ID</TableHead>
              <TableHead>Full Name</TableHead>
              <TableHead className="hidden sm:table-cell">Email</TableHead>
              <TableHead className="hidden md:table-cell">Department</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {employees.map((emp) => (
              <TableRow key={emp.employee_id} className="hover:bg-accent/50">
                <TableCell className="font-medium">{emp.employee_id}</TableCell>
                <TableCell>{emp.full_name}</TableCell>
                <TableCell className="hidden sm:table-cell">{emp.email}</TableCell>
                <TableCell className="hidden md:table-cell">{emp.department}</TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => navigate(`/attendance/${emp.employee_id}`)}
                    >
                      <CalendarCheck className="h-4 w-4" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Employee?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This will permanently delete {emp.full_name} and all their attendance records.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(emp.employee_id)}
                            disabled={deleting === emp.employee_id}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            {deleting === emp.employee_id ? "Deleting..." : "Delete"}
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default EmployeeTable;
