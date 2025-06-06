# Generated by Django 4.2.7 on 2024-07-18 03:50

from django.db import migrations, models
import django.utils.timezone


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0002_topic_useraccount_is_teacher_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='video',
            name='img',
            field=models.CharField(default=django.utils.timezone.now, max_length=150),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name='video',
            name='embedId',
            field=models.CharField(max_length=50),
        ),
    ]
