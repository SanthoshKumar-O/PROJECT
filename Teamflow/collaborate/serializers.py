from rest_framework import serializers
from .models import Project,ProjectMember,Task,ProjectFile
from django.conf import settings
from django.contrib.auth import get_user_model
User=get_user_model()

class ProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = "__all__"
        read_only_fields = ["created_by"]

from django.contrib.auth import get_user_model
User = get_user_model()

from django.contrib.auth import get_user_model
User = get_user_model()

class ProjectMemberSerializer(serializers.ModelSerializer):
    username = serializers.CharField(write_only=True)
    user = serializers.CharField(source="user.username", read_only=True)

    class Meta:
        model = ProjectMember
        fields = ["id", "project", "username", "user", "role"]

    def validate(self, data):
        username = data.get("username")
        project = data.get("project")

        try:
            user = User.objects.get(username=username)
        except User.DoesNotExist:
            raise serializers.ValidationError({"username": "User not found"})

        if ProjectMember.objects.filter(project=project, user=user).exists():
            raise serializers.ValidationError("User already added")

        data["user"] = user
        return data

    def create(self, validated_data):
        validated_data.pop("username")
        return ProjectMember.objects.create(**validated_data)
    

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
    def validate(self,data):
        username=data.get("assigned_to")
        project=data.get("project")
        if username:
            try:
                user=User.objects.get(username=username)
            except User.DoesNotExist:
                raise serializers.ValidationError({"assigned_to":"User not found"})
            if not ProjectMember.objects.filter(project=project,user=user).exists():
                raise serializers.ValidationError("User is not part of this project.")
                
            data["assigned_to"]=user
        return data
    def create(self, validated_data):
        return Task.objects.create(**validated_data)

    def update(self, instance, validated_data):
        return super().update(instance, validated_data)
        
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
