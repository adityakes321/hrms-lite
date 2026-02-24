export interface Employee {
  _id?: string;
  employee_id: string;
  full_name: string;
  email: string;
  department: string;
  created_at?: string;
}

export interface AttendanceRecord {
  _id?: string;
  employee_id: string;
  date: string;
  status: "Present" | "Absent";
  created_at?: string;
}

export interface AttendanceSummary {
  employee_id: string;
  total_present: number;
}

export interface AttendanceTodaySummary {
  date: string;
  present_today: number;
  absent_today: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}
