from rest_framework.permissions import BasePermission
from .models import Project,ProjectMember

class IsProjectMember(BasePermission):
    """
     Allows project access only to a projectmember
    """
    def has_object_permission(self,request,view,obj):
        project=None
        """
         isinstance is used to check whether the object is a project or task or file 
         it checks whether the object is instance of that class
        """
        if isinstance(obj,Project):
            project=obj
        else:
            project=obj.project
        
        return ProjectMember.objects.filter(project=project,user=request.user).exists()

 
class IsProjectOwner(BasePermission):
    """
    Access only to project Owner
    """
    def has_object_permission(self, request, view, obj):
        """
        hasattr check whether the request is for a project or a task or somthing else
        """
        project=obj if hasattr(obj,"created_by") else obj.project
        return project.created_by == request.user

class CanEditTask(BasePermission):
    """
    Owner and Task assignee can only edit task
    """
    def has_object_permission(self, request, view, obj):
        if request.method in ("GET","HEAD","OPTIONS"):
            """
            ProjectMember can view the tasks
            """
            return True
        
        return (obj.project.created_by==request.user or obj.assigned_to==request.user)
