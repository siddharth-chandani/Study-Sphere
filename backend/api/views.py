import json
from django.db import IntegrityError
from django.http import JsonResponse
from .models import UserAccount,Video,Save,Comment,Noti,Topic
from django.views import View
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.csrf import ensure_csrf_cookie
from django.utils.decorators import method_decorator

# Create your views here.

@method_decorator(ensure_csrf_cookie, name='dispatch')
class CsrfTokenView(View):
    def get(self, request, *args, **kwargs):
        return JsonResponse({'message': 'CSRF cookie set'})

def email(request,emailid):
    if request.method != "GET":
        return JsonResponse({"error": "GET request required."}, status=400)
    
    res=len(UserAccount.objects.filter(email=emailid))
    if res==0:
        return JsonResponse({"res": "OK"}, status=200)
    return JsonResponse({"res": "User already exists"}, status=200)
    
def getType(request,emailid):
    try:
        u=UserAccount.objects.get(email=emailid)
        notis=u.noti_target.all()
        data = [obj.to_dict() for obj in notis]
        res="false"
        if u.is_teacher:
            res= "true"
        return JsonResponse({"res": res,"fname":u.first_name.capitalize(),"notis":data}, status=200) 
    except:
        return JsonResponse({"res": "error"}, status=401)

def getvideos(request,emailid):
    print(emailid)
    try:
        u=UserAccount.objects.get(email=emailid)
        if u.is_teacher:
            Query_set = Video.objects.all()
        else:
            Query_set=Video.objects.filter(student_access=u)
        data = [obj.to_dict() for obj in Query_set]
        return JsonResponse(data, safe=False)
    except:  
        return JsonResponse({"res": "Error"}, status=401)

def getsavedvideos(request,emailid):
    print(emailid)
    try:
        u=UserAccount.objects.get(email=emailid)
        Query_set=u.save_usr.video.all()
        data = [obj.to_dict() for obj in Query_set]
        return JsonResponse(data, safe=False)
    except:  
        return JsonResponse({"res": "Error"}, status=401)
    
    
def view(request,embedId):
    v=Video.objects.get(embedId=embedId)
    comm_set=v.comm_vid.all()
    comm = [obj.to_dict() for obj in comm_set]
    saved=False
    user=UserAccount.objects.get(email=request.GET.get('email')) 
    try:
        if v in user.save_usr.video.all():
            saved=True
    except:
        pass
    print(saved)
    v=v.to_dict()
    u=user.to_dict()
    return JsonResponse({"vidDetails":v,"usrDetails":u,"comm":comm,"saved":saved}, safe=False)
    

# API Functions
@csrf_exempt
def clearnoti(request,emailid):
    u=UserAccount.objects.get(email=emailid)
    u.noti_target.all().delete()
    u.unread_notifications=0
    u.save()
    return JsonResponse({"message": "All Noti Cleared."}, status=201)




@csrf_exempt
def info(request):
    tea=UserAccount.objects.filter(is_teacher=True)
    stu=UserAccount.objects.filter(is_teacher=False)
    tops=Topic.objects.all()
    teachers = [obj.to_dict() for obj in tea]
    students = [obj.to_dict() for obj in stu]
    topics = [obj.to_dict() for obj in tops]
    return JsonResponse({'teachers':teachers,'students':students,'topics':topics}, safe=False)

@csrf_exempt
def add(request):
    data = json.loads(request.body)
    print(data)
    user=UserAccount.objects.get(email=data["email"]) 
    url=data['url'] 
    code=url[url.find('e/')+2:]
    if(code.find('?')!=-1):
        code=code[:code.find('?')]
    thumbnail=f"https://img.youtube.com/vi/{code}/maxresdefault.jpg"
    V=Video(user=user,embedId=code,img=thumbnail,title=data['title'],desc=data['desc'],class_date=data['classDate'])
    V.save()
    for t in data['teachers']:
        V.teachers.add(UserAccount.objects.get(email=t))
        
    for s in data['student_access']:
        V.student_access.add(UserAccount.objects.get(email=s))

    for t in data['topics']:
        V.topics.add(Topic.objects.get(name=t))
    V.save()
    l=V.title.split(' ')
    shortTitle=V.title
    if len(l)>4:
        shortTitle=" ".join(l[:5])+"..."
    N=Noti(generated_by=user,body=f"{user.first_name.capitalize()} uploaded a new video: {shortTitle}")
    N.save()
    for stu in V.student_access.all():
        stu.unread_notifications+=1
        stu.save()
        N.target.add(stu)
    N.save()
    return JsonResponse({"message": "Video posted successfully."}, status=201)

@csrf_exempt
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
def save(request):
    if request.method!='POST':
        return JsonResponse({"error": "Use POST request method ONLY."}, status=400)
    data=json.loads(request.body)
    u=UserAccount.objects.get(email=data["email"])
    v=Video.objects.get(embedId=data["embedId"])
    stat=data['stat']
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


@csrf_exempt
def post_comm(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        u=UserAccount.objects.get(email=data["email"])
        v=Video.objects.get(embedId=data["embedId"])
        comm=data["postComm"]
        C=Comment(comm=comm,user=u,video=v)
        C.save()
        if not u.is_teacher:
            
            l=v.title.split(' ')
            shortTitle=v.title
            if len(l)>4:
                shortTitle=" ".join(l[:5])+"..."
            N=Noti(generated_by=u,body=f'{u.first_name} posted a comment on {shortTitle} Video.')
            N.save()
            for tea in v.teachers.all():
                tea.unread_notifications+=1
                tea.save()
                N.target.add(tea)
            N.save()
        return JsonResponse({"message": "Comment added successfully."}, status=201)
    return JsonResponse({"message": "Error!"}, status=201)
        
