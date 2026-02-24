from django.urls import path

from . import views

urlpatterns = [
    path("employees", views.employees_view, name="employees"),
    path("employees/<str:employee_id>", views.employee_detail_view, name="employee-detail"),
    path("attendance", views.attendance_create_view, name="attendance-create"),
    path("attendance/<str:employee_id>", views.attendance_by_employee_view, name="attendance-by-employee"),
    path("attendance/<str:employee_id>/summary", views.attendance_summary_view, name="attendance-summary"),
]


