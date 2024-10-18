from django.urls import path

from . import views
from .views import CsrfTokenView
urlpatterns = [

    #API Routes
    path("email/<str:emailid>", views.email, name="email"),
    path('csrf/', CsrfTokenView.as_view(), name='csrf'),
    # API Routes
    path("getvideos/<str:emailid>", views.getvideos, name="getVideos"),
    path("getsavedvideos/<str:emailid>", views.getsavedvideos, name="getSavedVideos"),
    path("gettype/<str:emailid>", views.getType, name="getType"),
    path("view/<str:embedId>", views.view, name="view"),
    path("add", views.add, name="AddVid"),
    path("info", views.info, name="Info"),
    path("addtopic", views.AddTopic, name="AddTopic"),
    path("save", views.save, name="save"),
    path("post_comm", views.post_comm, name="post_comm"),
    path("clearnoti/<str:emailid>", views.clearnoti, name="clearnoti"),


]
