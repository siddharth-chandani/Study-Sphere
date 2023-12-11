import json
from django.contrib.auth import authenticate, login, logout
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect, JsonResponse
from django.shortcuts import render,redirect
from django.urls import reverse
from django.contrib.auth.decorators import login_required
from django.views.decorators.csrf import csrf_exempt
from .models import User,Video,Save,Comment,Noti,Topic
from django.core.paginator import Paginator
from django.core import serializers
from django.contrib.auth import update_session_auth_hash
from django.contrib import messages

# Create your views here.


def index(request):
    if request.user.is_authenticated:
        u=User.objects.get(username=request.user.username)
        vid=[]
        if u.is_teacher:
            for v in Video.objects.all():
                vid.append(v)
        else:
            for v in Video.objects.all():
                if u in v.student_access.all():
                    vid.append(v)
        return render(request,'StudySphere/index.html',{'videos':vid}) 
    else:
        return render(request,"StudySphere/login.html")


def saved(request):
    if request.user.is_authenticated:
        u=User.objects.get(username=request.user.username)
        vid=[]
        try:
            vid=u.save_usr.video.all()
        except:
            pass
        return render(request,'StudySphere/index.html',{'videos':vid}) 
    else:
        return render(request,"StudySphere/login.html")


@login_required(login_url='/login')
def view(request,id):
    u=User.objects.get(username=request.user.username)
    v=Video.objects.get(pk=id)
    cmts=Comment.objects.filter(video=v)
    saved_stat=False
    try:
        saved=Save.objects.get(user=u)
        if v in saved.video.all():
            saved_stat=True
    except:
        pass
    return render(request,'StudySphere/view.html',{'v':v,'saved':saved_stat,'cmts':cmts})


def searchMatch(query, vid):
    q=query.lower()
    if q in vid.desc.lower() or q in vid.title.lower() or q in vid.user.username.lower():
        return True
    else:
        for topic in vid.topics.all():
            if q in topic.name.lower():
                return True
        for tea in vid.teachers.all():
            if q in tea.username.lower():
                return True
        return False

def search(request):
    # for getting <input> value use request.GET.get/.post
    # we use name="search" to fetch the input value 

    query= request.GET.get('search')
    u=User.objects.get(username=request.user.username)
    if u.is_teacher:
        access_videos=Video.objects.all()
        print(access_videos)
    else:
        access_videos=[]
        for v in Video.objects.all():
            if u in v.student_access.all():
                access_videos.append(v)

    videos=[]
    for vid in access_videos:
        if searchMatch(query,vid):
            videos.append(vid)
    return render(request,'StudySphere/index.html',{'videos':videos}) 





# API Functions
@csrf_exempt
@login_required(login_url='/login')
def noti(request):
    if request.method=='POST':
        u=User.objects.get(username=request.user.username)
        all_noti={}
        for i,n in enumerate(u.noti_stdnts.all()):
            all_noti[str(i)]=n.body

        return JsonResponse(all_noti)
    elif request.method=='PUT':
        u=User.objects.get(username=request.user.username)
        u.noti_stdnts.all().delete()
        u.unread_notifications=0
        u.save()
        return JsonResponse({"message": "All Noti Cleared."}, status=201)



@csrf_exempt
@login_required(login_url='/login')
def add(request):
    if request.method !='POST':   
        tea=User.objects.filter(is_teacher=True)
        stu=User.objects.filter(is_student=True)
        topics=Topic.objects.all()
        return render(request,'StudySphere/add.html',{'tea':tea,'stu':stu,'topics':topics})
    data = json.loads(request.body)
    user=User.objects.get(username=request.user.username) 
    V=Video(user=user,video=data['vid_url'],title=data['vid_title'],desc=data['desc'],class_date=data['class_date'])
    V.save()
    for t in data['teachers']:
        V.teachers.add(User.objects.get(username=t))
        
    for s in data['students']:
        V.student_access.add(User.objects.get(username=s))

    for t in data['topics']:
        V.topics.add(Topic.objects.get(name=t))
    V.save()
    N=Noti(generated_by=user,body=f"{user.username} uploaded a new video: {V.title}")
    N.save()
    for stu in V.student_access.all():
        stu.unread_notifications+=1
        stu.save()
        N.students.add(stu)
    N.save()
    return JsonResponse({"message": "Video posted successfully."}, status=201)

@csrf_exempt
@login_required(login_url='/login')
def AddTopic(request):
    if request.method!='POST':
        return JsonResponse({"error": "Use POST request method ONLY."}, status=400)
    data=json.loads(request.body)
    name = data['name']
    if name=="":
        return JsonResponse({"message": "Blank cann't be a topic."}, status=201)
    for t in Topic.objects.all():
        if name.lower() == t.name.lower():
            return JsonResponse({"message": "Topic Already Exists."}, status=201)
    T=Topic(name=name)
    T.save()
    return JsonResponse({"message": "New Topic Added."}, status=201)
    


@csrf_exempt
@login_required(login_url='/login')
def save(request,id):
    if request.method!='POST':
        return JsonResponse({"error": "Use POST request method ONLY."}, status=400)
    data=json.loads(request.body)
    u=User.objects.get(username=request.user.username)
    v=Video.objects.get(pk=id)
    stat=data['save_status']
    if stat=='unsave':
        s=Save.objects.get(user=u)
        s.video.remove(v)
        s.save()
    else:
        try:
            s=Save(user=u)
            s.save()
            s.video.add(v)
            s.save()
        except IntegrityError:
            s=Save.objects.get(user=u)
            s.video.add(v)
            s.save()
    return JsonResponse({"message": "Changes Made Successfully."}, status=201)


@login_required(login_url='/login')
def post_comm(request,id):
    if request.method == 'POST':
        u=User.objects.get(username=request.user.username)
        v=Video.objects.get(pk=id)
        comm=request.POST["cmt"]
        C=Comment(comm=comm,user=u,video=v)
        C.save()
    return redirect('view',id=id)



# Login system
def login_view(request):
    if request.method == "POST":

        # Attempt to sign user in
        username = request.POST["username"]
        password = request.POST["password"]
        user = authenticate(request, username=username, password=password)

        # Check if authentication successful
        if user is not None:
            login(request, user)
            return HttpResponseRedirect(reverse("StudyHome"))
        else:
            messages.error(request, 'Invalid username and/or password')
            return HttpResponseRedirect(reverse("login"))
    else:
        if request.user.is_authenticated:
            return HttpResponseRedirect(reverse("StudyHome"))
        else:
            return render(request, "StudySphere/login.html")



def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse("login"))


def register(request):
    if request.method == "POST":
        username = request.POST["username"]
        email = request.POST["email"]
        first_name = request.POST["first_name"]
        last_name = request.POST["last_name"]

        # Ensure password matches confirmation
        password = request.POST["password"]
        confirmation = request.POST["confirmation"]
        if password != confirmation:
            messages.error(request, 'Passwords must match.')

            return render(request, "StudySphere/register.html")

        # Attempt to create new user
        try:
            user = User.objects.create_user(username, email, password)
            user.save()
            user.is_student=True
            user.first_name=first_name
            user.last_name=last_name
            user.save()

        except IntegrityError:
            messages.error(request, 'Username already taken.')
            return render(request, "StudySphere/register.html")

        login(request, user)
        return HttpResponseRedirect(reverse("StudyHome"))
    else:
        return render(request, "StudySphere/register.html")


@login_required(login_url='/login')
def change_password(request):
    if request.method == 'POST':
        user=User.objects.get(username=request.user.username)
        old_pass = request.POST["old_password"]
        new_pass1 = request.POST["new_password1"]
        new_pass2 = request.POST["new_password2"]

        if user.check_password(old_pass) and new_pass1==new_pass2:
            user.set_password(new_pass1)
            user.save()
            update_session_auth_hash(request, user)  # Important! Keeps user logged in still
            messages.success(request, 'Your password was successfully updated!')
            return redirect('StudyHome')
        else:
            messages.error(request, 'Please correct the error(s) below.')

    return render(request, 'StudySphere/change_password.html')
