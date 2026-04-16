from rest_framework import serializers
from .models import Project,ProjectMember,Task,ProjectFile
from django.conf import settings
from django.contrib.auth import get_user_model
User=get_user_model()

class ProjectSerializer(serializers.ModelSerializer):
    created_by=serializers.ReadOnlyField(source="created_by.username")
    class Meta:
        model=Project
        fields=[
            "id",
            "project_name",
            "about",
            "created_by",
            "created_at",
        ]

class ProjectMemberSerializer(serializers.ModelSerializer):
    user=serializers.ReadOnlyField(source="user.username")
    class Meta:
        model=ProjectMember
        fields=[
            "id",
            "project",
            "user",
            "role",
            "joined_at"
        ]
        
class TaskSerializer(serializers.ModelSerializer):
    assigned_to=serializers.SlugRelatedField(slug_field="username",queryset=User.objects.all(),required=False,allow_null=True)
    class Meta:
        model=Task
        fields=[
            "id",
            "project",
            "title",
            "description",
            "status",
            "assigned_to",
            "deadline",
            "created_at",
        ]
        
class ProjectFileSerializer(serializers.ModelSerializer):
    uploaded_by = serializers.ReadOnlyField(source="uploaded_by.username")

    class Meta:
        model = ProjectFile
        fields = [
            "id",
            "project",
            "file",
            "uploaded_by",
            "uploaded_at",
        ]
