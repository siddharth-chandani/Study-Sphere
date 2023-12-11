from django.contrib import admin

# Register your models here.
from embed_video.admin import AdminVideoMixin
from .models import User,Video,Noti,Save,Comment,Topic

class MyModelAdmin(AdminVideoMixin, admin.ModelAdmin):
    pass

admin.site.register(Video, MyModelAdmin)
admin.site.register(User)
admin.site.register(Noti)
admin.site.register(Comment)
admin.site.register(Save)
admin.site.register(Topic)