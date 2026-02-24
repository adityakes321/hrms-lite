from datetime import date as date_cls

from django.db.models import Count, Q
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response

from .models import Employee, Attendance
from .serializers import (
    EmployeeSerializer,
    AttendanceSerializer,
    AttendanceSummarySerializer,
)


def api_response(data=None, message: str | None = None, success: bool = True, status_code=status.HTTP_200_OK):
    payload: dict = {"success": success}
    if data is not None:
        payload["data"] = data
    if message:
        payload["message"] = message
    return Response(payload, status=status_code)


@api_view(["GET", "POST"])
def employees_view(request):
    if request.method == "GET":
        employees = Employee.objects.all().order_by("created_at")
        serializer = EmployeeSerializer(employees, many=True)
        return api_response(serializer.data)

    # POST
    serializer = EmployeeSerializer(data=request.data)
    if serializer.is_valid():
        employee = serializer.save()
        return api_response(EmployeeSerializer(employee).data, "Employee created", status.HTTP_201_CREATED)

    return api_response(serializer.errors, "Invalid data", success=False, status_code=status.HTTP_400_BAD_REQUEST)


@api_view(["DELETE"])
def employee_detail_view(request, employee_id: str):
    try:
        employee = Employee.objects.get(employee_id=employee_id)
    except Employee.DoesNotExist:
        return api_response(None, "Employee not found", success=False, status_code=status.HTTP_404_NOT_FOUND)

    if request.method == "DELETE":
        employee.delete()
        return api_response(message="Employee deleted", status_code=status.HTTP_204_NO_CONTENT)


@api_view(["POST"])
def attendance_create_view(request):
    serializer = AttendanceSerializer(data=request.data)
    if serializer.is_valid():
        record = serializer.save()
        return api_response(AttendanceSerializer(record).data, "Attendance recorded", status.HTTP_201_CREATED)

    return api_response(serializer.errors, "Invalid data", success=False, status_code=status.HTTP_400_BAD_REQUEST)


@api_view(["GET"])
def attendance_by_employee_view(request, employee_id: str):
    try:
        employee = Employee.objects.get(employee_id=employee_id)
    except Employee.DoesNotExist:
        return api_response(None, "Employee not found", success=False, status_code=status.HTTP_404_NOT_FOUND)

    records = Attendance.objects.filter(employee=employee).order_by("-date")
    serializer = AttendanceSerializer(records, many=True)
    return api_response(serializer.data)


@api_view(["GET"])
def attendance_summary_view(request, employee_id: str):
    try:
        employee = Employee.objects.get(employee_id=employee_id)
    except Employee.DoesNotExist:
        return api_response(None, "Employee not found", success=False, status_code=status.HTTP_404_NOT_FOUND)

    total_present = Attendance.objects.filter(
        employee=employee,
        status=Attendance.STATUS_PRESENT,
    ).count()

    summary = {"employee_id": employee.employee_id, "total_present": total_present}
    serializer = AttendanceSummarySerializer(summary)
    return api_response(serializer.data)


@api_view(["GET"])
def attendance_today_summary_view(request):
    today = date_cls.today()

    present_today = Attendance.objects.filter(date=today, status=Attendance.STATUS_PRESENT).count()
    absent_today = Attendance.objects.filter(date=today, status=Attendance.STATUS_ABSENT).count()

    return api_response({"date": today.isoformat(), "present_today": present_today, "absent_today": absent_today})


@api_view(["GET", "POST"])
def auth_api_key_stub_view(request):
    # This endpoint is not part of HRMS Lite. Return JSON to avoid frontend JSON parse errors.
    return api_response({"api_key": None}, "Not implemented", success=False, status_code=status.HTTP_200_OK)


@api_view(["GET", "POST"])
def auth_admin_config_stub_view(request):
    # This endpoint is not part of HRMS Lite. Return JSON to avoid frontend JSON parse errors.
    return api_response({"enabled": False}, "Not implemented", success=False, status_code=status.HTTP_200_OK)


