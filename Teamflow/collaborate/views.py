from django.shortcuts import render
from rest_framework import viewsets, permissions
from rest_framework.exceptions import PermissionDenied,ValidationError
from .models import Project, ProjectMember, Task, ProjectFile
from rest_framework.decorators import action
from rest_framework.response import Response
from .serializers import (
    ProjectSerializer,
    ProjectMemberSerializer,
    TaskSerializer,
    ProjectFileSerializer,
)
from .permissions import IsProjectMember, IsProjectOwner, CanEditTask

class ProjectViewsets(viewsets.ModelViewSet):
    serializer_class=ProjectSerializer
    permission_classes=[permissions.IsAuthenticated]
    def get_queryset(self):
        """
        returns the projects in which the user belongs to
        """
        return Project.objects.filter(members__user=self.request.user).distinct()
    
    def perform_create(self,serializer):
        project=serializer.save(created_by=self.request.user)
        
        ProjectMember.objects.create(project=project,user=self.request.user,role="OWNER")
    
    def get_permissions(self):
        if self.action in ["update","partial_update","destroy"]:
            return [permissions.IsAuthenticated(),IsProjectOwner()]
        return super().get_permissions()
    
class ProjectMemberViewsets(viewsets.ModelViewSet):
    serializer_class = ProjectMemberSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        project_id = self.request.query_params.get("project")
        queryset = ProjectMember.objects.filter(
            project__created_by=self.request.user
        )
        if project_id:
            queryset = queryset.filter(project_id=project_id)
        return queryset

    def perform_create(self, serializer):
        serializer.save()
    
class TaskViewsets(viewsets.ModelViewSet):
    serializer_class = TaskSerializer
    permission_classes = [permissions.IsAuthenticated, IsProjectMember, CanEditTask]

    def get_queryset(self):
        return Task.objects.filter(
            project__members__user=self.request.user
        ).distinct()

    def perform_create(self, serializer):
        project = serializer.validated_data["project"]

        if not ProjectMember.objects.filter(
            project=project, user=self.request.user
        ).exists():
            raise PermissionDenied("You are not a project member")

        serializer.save()

    def perform_update(self, serializer):
        task = serializer.instance
        project = task.project
        user = self.request.user

        # Must be project member
        if not ProjectMember.objects.filter(project=project, user=user).exists():
            raise PermissionDenied("You are not a project member")

        # If updating assignment → only OWNER
        if "assigned_to" in serializer.validated_data:
            if not ProjectMember.objects.filter(
                project=project, user=user, role="OWNER"
            ).exists():
                raise PermissionDenied("Only owner can assign tasks")

        # If updating status → only assigned user OR owner
        if "status" in serializer.validated_data:
            if not (
                task.assigned_to == user or
                ProjectMember.objects.filter(
                    project=project, user=user, role="OWNER"
                ).exists()
            ):
                raise PermissionDenied("Only assigned user or owner can update status")

        serializer.save()

    @action(detail=False, methods=["get"])
    def board(self, request):
        queryset = self.get_queryset()
        project_id = request.query_params.get("project")

        if project_id:
            queryset = queryset.filter(project_id=project_id)

        data = {
            "TODO": [],
            "IN_PROGRESS": [],
            "COMPLETED": []
        }

        for task in queryset:
            data[task.status].append({
                "id": task.id,
                "title": task.title,
                "assigned_to": task.assigned_to.username if task.assigned_to else None
            })

        return Response(data)
        
class ProjectFileViewsets(viewsets.ModelViewSet):
    serializer_class=ProjectFileSerializer
    permission_classes=[permissions.IsAuthenticated,IsProjectMember]
    def get_queryset(self):
        return ProjectFile.objects.filter(project__members__user=self.request.user)
    def perform_create(self,serializer):
        serializer.save(uploaded_by=self.request.user)
        
        
