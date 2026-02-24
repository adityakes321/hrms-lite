import { useState } from "react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { employeeService } from "@/services/employeeService";

const employeeSchema = z.object({
  employee_id: z.string().trim().min(1, "Employee ID is required"),
  full_name: z.string().trim().min(1, "Full name is required").max(100),
  email: z.string().trim().email("Invalid email format").max(255),
  department: z.string().trim().min(1, "Department is required").max(100),
});

interface AddEmployeeFormProps {
  onSuccess: () => void;
}

const AddEmployeeForm = ({ onSuccess }: AddEmployeeFormProps) => {
  const [form, setForm] = useState({ employee_id: "", full_name: "", email: "", department: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = employeeSchema.safeParse(form);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) fieldErrors[err.path[0] as string] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setLoading(true);
    try {
      await employeeService.create(result.data as { employee_id: string; full_name: string; email: string; department: string });
      toast.success("Employee added successfully");
      setForm({ employee_id: "", full_name: "", email: "", department: "" });
      setErrors({});
      onSuccess();
    } catch (err: any) {
      const msg = err.response?.data?.message || "Failed to add employee";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Add Employee</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2">
          {[
            { key: "employee_id", label: "Employee ID", placeholder: "EMP001" },
            { key: "full_name", label: "Full Name", placeholder: "John Doe" },
            { key: "email", label: "Email", placeholder: "john@example.com" },
            { key: "department", label: "Department", placeholder: "Engineering" },
          ].map(({ key, label, placeholder }) => (
            <div key={key} className="space-y-1.5">
              <Label htmlFor={key}>{label}</Label>
              <Input
                id={key}
                placeholder={placeholder}
                value={form[key as keyof typeof form]}
                onChange={(e) => handleChange(key, e.target.value)}
              />
              {errors[key] && <p className="text-xs text-destructive">{errors[key]}</p>}
            </div>
          ))}
          <div className="sm:col-span-2">
            <Button type="submit" disabled={loading} className="w-full sm:w-auto">
              {loading ? "Adding..." : "Add Employee"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default AddEmployeeForm;
