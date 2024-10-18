from django.db import models
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, BaseUserManager

class UserAccountManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError('Users must have an email address')

        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)

        user.set_password(password)
        user.save()

        return user
    
    
    def create_superuser(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError('Users must have an email address')

        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)

        user.set_password(password)
        user.is_admin = True
        user.is_staff = True
        user.is_superuser = True
        user.save()
        return user

class UserAccount(AbstractBaseUser, PermissionsMixin):
    email = models.EmailField(max_length=255, unique=True)
    first_name = models.CharField(max_length=255)
    last_name = models.CharField(max_length=255)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    is_teacher = models.BooleanField(default=False)
    profile_picture = models.URLField(max_length=700, default='https://ngheluatsu.com/resize-image/350x400/Avatar/avatar.jpg')
    unread_notifications = models.IntegerField(default=0)


    objects = UserAccountManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['first_name', 'last_name']

    def get_full_name(self):
        return self.first_name+" "+self.last_name

    def get_short_name(self):
        return self.first_name
    
    def __str__(self):
        return self.email

    def to_dict(self):
        return{
            'email':self.email,
            'first_name':self.first_name,
            'last_name':self.last_name,
            'is_active':self.is_active,
            'is_teacher':self.is_teacher,
            'is_staff':self.is_staff,
            'profile_picture':self.profile_picture,
            'unread_notifications':self.unread_notifications,
        }




class Topic(models.Model):
    name=models.CharField(max_length=50)
    
    def __str__(self):
        return f"Topic: {self.name}" 
    
    def to_dict(self):
        return{
            'topic':self.name
        }
    

class Video(models.Model):
    user = models.ForeignKey(UserAccount,on_delete=models.CASCADE, related_name="vid_usr")
    embedId = models.CharField(max_length=50)
    img = models.CharField(max_length=250)
    timestamp = models.DateTimeField(auto_now_add=True)
    class_date = models.DateField()
    title=models.CharField(max_length=250)
    desc=models.CharField(max_length=1000)
    teachers=models.ManyToManyField(UserAccount,blank=True,symmetrical=False, related_name="vid_teachers")
    student_access=models.ManyToManyField(UserAccount,blank=True,symmetrical=False, related_name="vid_students")
    topics=models.ManyToManyField(Topic ,blank=True,symmetrical=False, related_name="vid_topics")


    def __str__(self):
        return f"{self.title} uploaded by {self.user.first_name}"

    class Meta:
        ordering = ['-class_date']
        
    def to_dict(self):
        return{
            'username':self.user.first_name,
            'embedId':self.embedId,
            'img':self.img,
            'timestamp':self.timestamp,
            'class_date':self.class_date,
            'title':self.title,
            'desc':self.desc,
            'teachers':list(self.teachers.values_list('first_name',flat=True)),
            'student_access':list(self.student_access.values_list('first_name',flat=True)),
            'topics':list(self.topics.values_list('name',flat=True)),

        }

class Comment(models.Model):
    comm=models.CharField(max_length=500)
    time = models.DateTimeField(auto_now_add=True)
    video=models.ForeignKey(Video, blank=True,  on_delete=models.CASCADE, related_name="comm_vid")
    user=models.ForeignKey(UserAccount, on_delete=models.CASCADE, related_name="comm_usr")

    class Meta: 
    # Orders comment by most recent first, by default
        ordering = ['-time']
    
    def to_dict(self):
        return{
            'comm':self.comm,
            'time':self.time,
            'user_fullname':self.user.get_full_name(),
            'user_pfp':self.user.profile_picture,
            
        }

class Save(models.Model):
    video=models.ManyToManyField(Video, blank=True, related_name="saved_vid")
    user=models.OneToOneField(UserAccount, on_delete=models.CASCADE, related_name="save_usr")

    def __str__(self):
        return f"Saved videos of user: {self.user}"

class Noti(models.Model):
    generated_by=models.ForeignKey(UserAccount, on_delete=models.CASCADE, related_name="noti_gen")
    body=models.CharField(max_length=250)
    target=models.ManyToManyField(UserAccount,blank=True,symmetrical=False, related_name="noti_target")
    time =  models.DateTimeField(auto_now_add=True)
    
    class Meta: 
    # Orders comment by most recent first, by default
        ordering = ['-time']

    def __str__(self):
        return f"{self.body} "
    
    def to_dict(self):
        return{
            "generated_by":self.generated_by.first_name.capitalize(),
            "body":self.body,
            
        }
