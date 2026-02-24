import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import type { AttendanceRecord } from "@/types";
import EmptyState from "./EmptyState";

interface AttendanceTableProps {
  records: AttendanceRecord[];
  totalPresent?: number;
  employeeId?: string;
}

const AttendanceTable = ({ records, totalPresent, employeeId }: AttendanceTableProps) => {
  if (records.length === 0) return <EmptyState message="No attendance records found" />;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-base">
          Attendance {employeeId && `— ${employeeId}`}
        </CardTitle>
        {totalPresent !== undefined && (
          <Badge variant="secondary" className="text-xs">
            {totalPresent} days present
          </Badge>
        )}
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {records.map((rec) => (
              <TableRow key={`${rec.employee_id}-${rec.date}`} className="hover:bg-accent/50">
                <TableCell>{rec.date}</TableCell>
                <TableCell>
                  <Badge variant={rec.status === "Present" ? "default" : "destructive"} className="text-xs">
                    {rec.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default AttendanceTable;
