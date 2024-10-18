from django.contrib import admin

# Register your models here.
from .models import UserAccount,Video,Noti,Save,Comment,Topic

admin.site.register(Video)
admin.site.register(UserAccount)
admin.site.register(Noti)
admin.site.register(Comment)
admin.site.register(Save)
admin.site.register(Topic)