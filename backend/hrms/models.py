from django.db import models
import os

_USING_MONGODB = os.environ.get("DJANGO_DATABASE", "sqlite").lower().strip() == "mongodb"
if _USING_MONGODB:
    import django_mongodb_backend.fields


class Employee(models.Model):
    if _USING_MONGODB:
        id = django_mongodb_backend.fields.ObjectIdAutoField(primary_key=True)

    employee_id = models.CharField(max_length=50, unique=True)
    full_name = models.CharField(max_length=255)
    email = models.EmailField(max_length=255, unique=True)
    department = models.CharField(max_length=100)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self) -> str:
        return f"{self.employee_id} - {self.full_name}"


class Attendance(models.Model):
    if _USING_MONGODB:
        id = django_mongodb_backend.fields.ObjectIdAutoField(primary_key=True)

    STATUS_PRESENT = "Present"
    STATUS_ABSENT = "Absent"

    STATUS_CHOICES = [
        (STATUS_PRESENT, "Present"),
        (STATUS_ABSENT, "Absent"),
    ]

    employee = models.ForeignKey(Employee, on_delete=models.CASCADE, related_name="attendance_records")
    date = models.DateField()
    status = models.CharField(max_length=10, choices=STATUS_CHOICES)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("employee", "date")

    def __str__(self) -> str:
        return f"{self.employee.employee_id} - {self.date} - {self.status}"


