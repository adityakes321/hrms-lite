import api from "./api";
import type { Employee, ApiResponse } from "@/types";

export const employeeService = {
  async getAll(): Promise<Employee[]> {
    const res = await api.get<ApiResponse<Employee[]>>("/api/employees");
    return res.data.data || [];
  },

  async create(employee: Omit<Employee, "_id" | "created_at">): Promise<Employee> {
    const res = await api.post<ApiResponse<Employee>>("/api/employees", employee);
    return res.data.data!;
  },

  async delete(employeeId: string): Promise<void> {
    await api.delete(`/api/employees/${employeeId}`);
  },
};
