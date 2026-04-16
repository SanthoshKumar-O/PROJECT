from django.urls import path,include
from rest_framework.routers import DefaultRouter
from .views import *


router=DefaultRouter()
router.register(r"projects",ProjectViewsets,basename='project')
router.register(r"project-members",ProjectMemberViewsets,basename='project-members')
router.register(r"tasks",TaskViewsets,basename="task")
router.register(r"files",ProjectFileViewsets,basename="project-file")

urlpatterns=[
    path("",include(router.urls)),
]