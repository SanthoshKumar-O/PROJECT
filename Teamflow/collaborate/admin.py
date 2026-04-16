from django.contrib import admin
from.models import Project,ProjectMember,Task,ProjectFile

@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display=("id","project_name","created_by","created_at")
    search_fields=("project_name",)
    list_filter=("created_at",)

@admin.register(ProjectMember)
class ProjectMemberAdmin(admin.ModelAdmin):
    list_display=("project","user","role","joined_at")
    list_filter=("role","joined_at")
    
@admin.register(Task)
class TaskAdmin(admin.ModelAdmin):
    list_display = ("id", "title", "project", "assigned_to", "status", "deadline")
    list_filter = ("status", "deadline")
    search_fields = ("title",)
    
@admin.register(ProjectFile)
class ProjectFileAdmin(admin.ModelAdmin):
    list_display = ("id", "project", "uploaded_by", "uploaded_at")

