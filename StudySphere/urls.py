from django.urls import path
from . import views

urlpatterns = [
    path("", views.index, name="StudyHome"),
    path("view/<int:id>", views.view, name="view"),
    path("saved", views.saved, name="SavedVid"),
    path("search", views.search, name="Search"),

    
    # API Routes
    path("add", views.add, name="AddVid"),
    path("addtopic", views.AddTopic, name="AddTopic"),
    path("save/<int:id>", views.save, name="save"),
    path("post_comm/<int:id>", views.post_comm, name="post_comm"),
    path("noti", views.noti, name="noti"),


    #Account Routes
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register"),
    path("change_password", views.change_password, name="change_password"),



]

