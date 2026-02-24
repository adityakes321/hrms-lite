from rest_framework import serializers
from .models import Employee, Attendance


class EmployeeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Employee
        fields = ["id", "employee_id", "full_name", "email", "department", "created_at"]

    def validate_email(self, value: str) -> str:
        value = value.lower().strip()
        if Employee.objects.filter(email=value).exists():
            raise serializers.ValidationError("Employee with this email already exists.")
        return value

    def validate_employee_id(self, value: str) -> str:
        value = value.strip()
        if Employee.objects.filter(employee_id=value).exists():
            raise serializers.ValidationError("Employee ID must be unique.")
        return value


class AttendanceSerializer(serializers.ModelSerializer):
    employee_id = serializers.CharField(write_only=True)

    class Meta:
        model = Attendance
        fields = ["id", "employee_id", "date", "status", "created_at"]

    def validate_status(self, value: str) -> str:
        if value not in (Attendance.STATUS_PRESENT, Attendance.STATUS_ABSENT):
            raise serializers.ValidationError("Status must be 'Present' or 'Absent'.")
        return value

    def validate(self, attrs):
        employee_id = attrs.get("employee_id")
        date = attrs.get("date")
        try:
            employee = Employee.objects.get(employee_id=employee_id)
        except Employee.DoesNotExist:
            raise serializers.ValidationError({"employee_id": "Employee not found."})

        if Attendance.objects.filter(employee=employee, date=date).exists():
            raise serializers.ValidationError("Attendance for this employee and date already exists.")

        attrs["employee"] = employee
        return attrs


class AttendanceSummarySerializer(serializers.Serializer):
    employee_id = serializers.CharField()
    total_present = serializers.IntegerField()


