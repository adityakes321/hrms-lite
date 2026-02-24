import api from "./api";
import type { AttendanceRecord, AttendanceSummary, AttendanceTodaySummary, ApiResponse } from "@/types";

export const attendanceService = {
  async markAttendance(record: Omit<AttendanceRecord, "_id" | "created_at">): Promise<AttendanceRecord> {
    const res = await api.post<ApiResponse<AttendanceRecord>>("/api/attendance", record);
    return res.data.data!;
  },

  async getByEmployee(employeeId: string): Promise<AttendanceRecord[]> {
    const res = await api.get<ApiResponse<AttendanceRecord[]>>(`/api/attendance/${employeeId}`);
    return res.data.data || [];
  },

  async getSummary(employeeId: string): Promise<AttendanceSummary> {
    const res = await api.get<ApiResponse<AttendanceSummary>>(`/api/attendance/${employeeId}/summary`);
    return res.data.data!;
  },

  async getTodaySummary(): Promise<AttendanceTodaySummary> {
    const res = await api.get<ApiResponse<AttendanceTodaySummary>>("/api/attendance/today/summary");
    return res.data.data!;
  },
};
