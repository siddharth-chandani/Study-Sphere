# Generated by Django 4.1.5 on 2023-09-03 19:29

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('StudySphere', '0002_video_title'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='comment',
            name='video',
        ),
        migrations.AddField(
            model_name='comment',
            name='video',
            field=models.ForeignKey(blank=True, default=None, on_delete=django.db.models.deletion.CASCADE, related_name='comm_vid', to='StudySphere.video'),
            preserve_default=False,
        ),
    ]
