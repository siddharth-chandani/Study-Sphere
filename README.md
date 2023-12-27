# Study Sphere
  - [Overview](#overview)
  - [Distinctiveness and Complexity](#distinctiveness-and-complexity)
  - [Models](#models)
  - [Routes](#routes)
    - [Login `/login`](#login-login)
    - [Register `/register`](#register-register)
    - [Change Password `/change_password`](#change-password-change_password)
    - [Logout `/logout`](#logout-logout)
    - [Index `/`](#index-)
    - [Add Video `/add`](#add-video-add)
    - [Video `/view/<videoId>`](#video-viewvideoid)
    - [Saved Videos `/saved`](#saved-videos-saved)
    - [Notifications](#notifications)
      - [Notifications menu](#notifications-menu)
  - [Files and directories](#files-and-directories)
  - [How to run the application](#how-to-run-the-application)
  - [Important note](#important-note)
  - [Features I would like to improve/add](#features-i-would-like-to-improveadd)

## Overview

I have built an online platform for teachers and students, where teachers can add unlisted YouTube videos and make them visible to selected students. The website has lots of different features, which I will summarise below (see [Routes](#routes)).

My web application was built using Django, JavaScript and Bootstrap.

## Distinctiveness and Complexity

According the the specification, my project must adhere to the following guidelines: 

> Your web application must be sufficiently distinct from the other projects in this course (and, in addition, may not be based on the old CS50W Pizza project), and more complex than those.

I believe that my project meets this requirement for the following reasons: 

1. My project is based on an original idea, that solves a real-life personal problem which has no similarity to any of the projects built as part of the CS50W course. 
2. The website is built with different user types: admin, student and teacher.
3. I built a simple [notification](#notifications) system, which notifies students of new videos whenever a teacher uploads it for his students (i.e. it will only notify to those students which has access to that video). The notifications section is completely responsive and updates dynamically using JavaScript.
4. On the [Add Video](#add-video-add)  page I challenged myself to build functionality that allows users to add a new field to the `Topic` model using JavaScript.

> Your web application must utilize Django (including at least one model) on the back-end and JavaScript on the front-end.

My application was built using Django, including 8 models on the back-end and uses 8 different JavaScript scripts to make dynamic updates on the front-end. All generated information is saved in a database (SQLite by default).

> Your web application must be mobile-responsive

Every page and feature of the web application is mobile-responsive and this is achieved using Bootstrap and custom CSS. 


[Back to Top](#cs50-final-project---Study-Sphere)


## Models

There are 6 models for the DanceApp database:

1. `User` - An extension of Django's `AbstractUser` model. Stores the logic for account type (staff, student or teacher). Stores the profile picture URL and total unread notifications for the user.
2. `Topic` - Stores names of topics covered in video.
3. `Video` - Stores videos uploaded by teachers. Holds many relationships with other models (`Topic`, `User`). The `student_access` field determines which videos are visible to each student. The `teachers` field keeps record of teachers who posted that video. This model is used in the `/videos` API route, when we make a `GET` request.
4. `Comment` - Stores comments made by users on a video and creates a relationship with `Video` and `User`.
5. `Save` - Stores videos saved by users and creates a relationship with `Video` and `User`.
6. `Notifications` - Stores notifications for users and creates a relationship with `Video` and `User`.

[Back to Top](#cs50-final-project---Study-Sphere) 

## Routes

### Login `/login`

User can log into the website using a valid username and password.

### Register `/register`

User must enter their username, email address, first name, surname, password and confirm password. The page has the following validation:

1. The password must match the confirm password field
2. There is no existing user with the username provided

If the details are valid, a new user is created in the `User` model with `is_student` flag set to `True`. A student instance of the user is created using the `Student` model.

### Change Password `/change_password`

The user can change their password, and the page has the following validation: 

1. Your password can’t be too similar to your other personal information.
2. Your password must contain at least 8 characters.
3. Your password can’t be a commonly used password.
4. Your password can’t be entirely numeric.

If the details are valid, the password will be changed, and the user is redirected to [Index](#index-) with a success message.

### Logout `/logout`

If the user clicks 'Logout' in the navigation bar, it will log the user out and redirect to the [Login](#login-login) page

### Index `/`

This page makes a `GET` request to the `/videos` API route to get all available videos for the logged in user. Then, the page uses `fetch` in JavaScript to get the JSON video data to display the videos using HTML. The API route uses the following logic:

1. Teacher and admin users can see all videos in the database
2. Students can only see the videos which teachers have made available to them

This page is completely responsive as I have defined various CSS properties.

### Add Video `/add`

This page is visible only to teachers and is used to add a new video to the database. The user enters a YouTube URL and using JavaScript, we extract the YouTube ID and make a `GET` request to the YouTube Data API. 

The teacher must fill in the `Topic`, `Teacher(s)`, `Student access` and `Class date` fields. The `Student access` field holds the logic for which videos each student can see. 

The teacher is able to add a new topic by making a `POST` request to the `addtopic` API route, which adds the new topic name to the database. This entire process is done using JavaScript `fetch` to update the page dynamically.

When the teacher submits the form, a new instance in the `Video` model is saved.

### Video `/view/<videoId>`

This page can be accessed by clicking on a video from the [Index](#index-) page. It includes an embedded YouTube video and basic information about the video, and the user is able to carry out the following actions:

- Student users can add or remove the video from their 'Saved Videos', by clicking the heart icon. This makes a `POST` request to the `/save/{videoId}` API route and `fetch` is used to update the heart icon using JavaScript. 
- All users can add comments on that video:
  - Comments are added with a full page reload after submitting the form (using the `/add_comment` route)  

The embedded video, and entire page are completely responsive. 

### Saved Videos `/saved`

This page is only visible for student users and displays the videos they have selected to be part of their saved videos on the [Video](#video-viewvideoid) page. It works in a similar way to the homepage, but instead it makes a GET request to the `/saved` route to get the JSON data to update the page.

[Back to Top](#cs50-final-project---Study-Sphere) 

### Notifications

When the user logs in, they can see a notification icon in the navigation bar. This number displays the number of 'new' notifications they have, and comes from the `unread_notifications` field on the `User` model. 

#### Notifications menu

In the notifications menu, unread notifications are shown in the popover with 'clear noti' button.

When the user clicks on the 'clear noti' button, the `unread_notifications` field is set to 0 using a `PUT` request to the API route `/noti` and JavaScript is used to update the notification icon and changes in popover's body.

## Files and directories 

Summary of files created by me:

- `StudySphere` - main application directory.
  - `static/StudySphere` contains all static content.
    - `images` contains 'no profile picture' image, logo and login icon.
    - `css` contains CSS file.
    - `js` - all JavaScript files used in project.
      - `add.js` - script that is used in `video.html` template.
      - `index.js` - shared script that is imported into `videos.js` and `saved_videos.js` to retrieve all available videos for logged in user.
      - `view.js` - script that is used in `video.html` template.
  - `templates/StudySphere` contains all application templates.
    - `change_password.html` - template for [Change Password](#change-password-change_password) page.
    - `index.html` - template for [Index](#index-) (homepage) which displays all available videos for logged-in user.
    - `layout.html` - base template. All other templates extend it.
    - `login.html` - template for [Login](#login-login) page.
    - `add.html` - template for [Add Video](#add-video-add) page where teachers can add a new video using YouTube Data API.
    - `register.html` - template for [Register](#register-register) page.
    - `view.html` - template for individual [Video](#video-viewvideoid) page with embedded YouTube video.
  - `__init__.py` - generated by Django.
  - `admin.py` - used to determine models which will be used in the Django Admin Interface.
  - `apps.py` - generated by Django.
  - `models.py` defines the models used to add to and update the database using Django.
  - `tests.py` - generated by Django.
  - `urls.py` - defines all application URLs.
  - `views.py` - contains all application views.
- `capstone` - project directory
  - `__init__.py`
  - `asgi.py` - generated by Django
  - `settings.py` - generated by Django, also contains logic for messages, `notification_processor`, obtaining the API key from the .env file
  - `urls.py` - contains project URLs.
  - `wsgi.py` - generated by Django
- `db.sqlite3` - database
- `manage.py` - generated by Django.
- `requirements.txt` - packages required in order for the application to run successfully.

[Back to Top](#cs50-final-project---Study-Sphere)

## How to run the application

1. Copy the repo to your system.
2. Verify you have Python and Django installed on your system. If not you will need to install them.
3. Make sure that you have the packages installed from the `requirements.txt` file.
4. Run the following to start up the Django web server:
   ```python
   python manage.py runserver 
   ```
5. Visit the website in your browser. 
   - Use the following credentials to log in as a teacher:
     ```
     username: Sid
     password: nothing
     ```
   - Use the following credentials to log in a student with available videos: 
     ```
     username: Ayu
     password: nothing
     ```
   - Or, create a new student account by clicking Register in the nav bar.

[Back to Top](#cs50-final-project---Study-Sphere) 

## Important note

The solution I have built isn't perfect, as it displays unlisted YouTube videos on the website. The student users can easily go and watch the videos on YouTube and share the links with others. This project is a 'low-cost' solution for teachers with a few students that they trust. It's for people who don't have enough students to make it worthwhile paying for an expensive video-hosting subscription.

[Back to Top](#cs50-final-project---Study-Sphere) 

## Features I would like to improve/add


- [ ] Allow different sorting on index page (most recent, oldest)
- [ ] Date validation on New Video form
- [ ] Deploy application somewhere
- [ ] Edit comment
- [ ] Able to edit saved videos list from index / saved videos page
- [ ] Make 'Add Comment' work using JavaScript only
- [ ] Make notifications icon (total notifications) update in real time
- [ ] Change register student to be a single sign on link with email
- [ ] Change register student to be a single sign on link with email (and remove register teacher page)

[Back to Top](#cs50-final-project---Study-Sphere) 
