document.addEventListener('DOMContentLoaded', function() {

document.querySelector('#add-vid-form').addEventListener('submit', submit);
});

function ShowInpt() {
    document.querySelector('#new-topic-btn').className='d-none';
    document.querySelector('#add-new-topic').className='d-block';
    document.querySelector('#new-topic-name').value='';
}
function SaveTopic() {
    document.querySelector('#add-new-topic').className='d-none';
    var newtopic=document.querySelector('#new-topic-name').value;
    
    fetch('/addtopic', {
        method: 'POST',
        body: JSON.stringify({
            name:newtopic
        })
      })
      .then(response => response.json())
      .then(result => {
          // Print result
          console.log(result);
          document.querySelector('#new-topic-btn').className='btn btn-primary mt-2 d-block';
          if (result.message=='New Topic Added.'){
            const div = document.createElement('div');
            div.className='form-check form-check-inline';
            div.innerHTML=`<input class="form-check-input" type="checkbox" name="topics" value="${newtopic}">
            <label class="form-check-label" for="inlineCheckbox">${newtopic}</label>`;
            document.querySelector('#add-topic').appendChild(div);
          }
          else{
            document.querySelector('#add-new-topic-msg').innerHTML=result.message;
          }


      });

}

function submit(event) {
    event.preventDefault();
    var vid_url=document.querySelector('#vid-url').value;
    var vid_title=document.querySelector('#vid-title').value;
    var desc=document.querySelector('#desc').value;
    var class_date=document.querySelector('#vid-cls-date').value;
    var tpcs=document.getElementsByName('topics');
    var topics=[]
    for(var topic of tpcs){
        if (topic.checked){
            topics.push(topic.value);
        }
    }
    if (topics.length == 0){
        document.querySelector('#topic-msg').innerHTML='** Please select atleast 1 topic **';
        return;
    }
    var tea=document.getElementsByName('teachers');
    var teachers=[]
    for(var t of tea){
        if (t.checked){
            teachers.push(t.value);
        }
    }
    if (teachers.length == 0){
        document.querySelector('#teacher-msg').innerHTML='** Please select atleast 1 teacher **';
        return;
    }
    var stu=document.getElementsByName('students');
    var students=[]
    for(var s of stu){
        if (s.checked){
            students.push(s.value);
        }
    }
    if (students.length == 0){
        document.querySelector('#student-msg').innerHTML='** Please select atleast 1 student **';
        return;
    }
    fetch('/add', {
        method: 'POST',
        body: JSON.stringify({
            vid_url: vid_url,
            vid_title: vid_title,
            class_date: class_date,
            desc: desc,
            topics: topics,
            teachers: teachers,
            students: students
        })
      })
      .then(response => response.json())
      .then(result => {
          // Print result
          console.log(result);
          window.location.href = "/";

      });
}