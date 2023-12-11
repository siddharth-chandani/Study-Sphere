from django.contrib.auth.models import AbstractUser
from django.db import models
from embed_video.fields import EmbedVideoField


# Create your models here.
class User(AbstractUser):
    pass
    # Flag that determines whether the user is a student or teacher
    is_student = models.BooleanField('student status', default=False)
    is_teacher = models.BooleanField('teacher status', default=False)
    profile_picture = models.URLField(max_length=700, blank=True)
    unread_notifications = models.IntegerField(default=0)

    def __str__(self):
        if (self.is_student):
            return f"{self.first_name} {self.last_name} (Student)"
        elif (self.is_teacher):
            return f"{self.first_name} (Teacher)"
        else:
            return f"{self.username} (Other)"

    class Meta: 
        # Orders users by first name
        ordering = ['first_name']

class Topic(models.Model):
    name=models.CharField(max_length=50)
    
    def __str__(self):
        return f"Topic: {self.name}" 
    

class Video(models.Model):
    user = models.ForeignKey(User,on_delete=models.CASCADE, related_name="vid_usr")
    video = EmbedVideoField()  # same like models.URLField()
    timestamp = models.DateTimeField(auto_now_add=True)
    class_date = models.DateField()
    title=models.CharField(max_length=150)
    desc=models.CharField(max_length=250)
    teachers=models.ManyToManyField(User ,blank=True,symmetrical=False, related_name="vid_teachers")
    student_access=models.ManyToManyField(User ,blank=True,symmetrical=False, related_name="vid_students")
    topics=models.ManyToManyField(Topic ,blank=True,symmetrical=False, related_name="vid_topics")


    def __str__(self):
        return f"{self.title} uploaded by {self.user.username}"    
    

    class Meta:
        ordering = ['-class_date']

class Comment(models.Model):
    comm=models.CharField(max_length=250)
    time =  models.DateTimeField(auto_now_add=True)
    video=models.ForeignKey(Video, blank=True,  on_delete=models.CASCADE, related_name="comm_vid")
    user=models.ForeignKey(User, on_delete=models.CASCADE, related_name="comm_usr")

    class Meta: 
    # Orders comment by most recent first, by default
        ordering = ['-time']

class Save(models.Model):
    video=models.ManyToManyField(Video, blank=True, related_name="saved_vid")
    user=models.OneToOneField(User, on_delete=models.CASCADE, related_name="save_usr")

    def __str__(self):
        return f"Saved videos of user: {self.user}"

class Noti(models.Model):
    generated_by=models.ForeignKey(User, on_delete=models.CASCADE, related_name="noti_gen")
    body=models.CharField(max_length=250)
    students=models.ManyToManyField(User ,blank=True,symmetrical=False, related_name="noti_stdnts")
    time =  models.DateTimeField(auto_now_add=True)
    
    class Meta: 
    # Orders comment by most recent first, by default
        ordering = ['-time']

    def __str__(self):
        return f"{self.body} "
