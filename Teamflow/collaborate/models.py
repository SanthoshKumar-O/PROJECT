from django.db import models
from django.conf import settings
# Create your models here.
User=settings.AUTH_USER_MODEL

class Project(models.Model):
    project_name=models.CharField(max_length=200)
    about=models.TextField(blank=True)
    created_at=models.DateTimeField(auto_now_add=True)
    created_by=models.ForeignKey(User,on_delete=models.CASCADE,related_name="created_projects")
    
    def __str__(self):
        return self.project_name


class ProjectMember(models.Model):
    ROLES=(
        ('OWNER','Owner'),
        ('MEMBER','Member')
    )
    project=models.ForeignKey(Project,on_delete=models.CASCADE,related_name="members")
    user=models.ForeignKey(User,on_delete=models.CASCADE,related_name="membership")
    role=models.CharField(max_length=10,choices=ROLES)
    joined_at=models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.user} -> {self.project}"
    
    class Meta:
        unique_together=("project","user")
 
        
class Task(models.Model):
    TASK_CHOICES=(
        ("TODO","To Do"),
        ("IN_PROGRESS","In Progress"),
        ("COMPLETED","Completed")
    )
    project=models.ForeignKey(Project,on_delete=models.CASCADE,related_name="tasks")
    title=models.CharField(max_length=250)
    description=models.TextField(blank=True)
    assigned_to=models.ForeignKey(User,on_delete=models.SET_NULL,null=True,blank=True,related_name="assigned_tasks")
    status=models.CharField(max_length=15,choices=TASK_CHOICES,default="TODO")
    deadline=models.DateTimeField(null=True,blank=True)
    created_at=models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.project} : {self.title}"
    
class ProjectFile(models.Model):
    project=models.ForeignKey(Project,on_delete=models.CASCADE,related_name="files")
    file=models.FileField(upload_to="project_files/")
    uploaded_by=models.ForeignKey(User,on_delete=models.SET_NULL,null=True,related_name="uploaded_files")
    uploaded_at=models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return self.file.name