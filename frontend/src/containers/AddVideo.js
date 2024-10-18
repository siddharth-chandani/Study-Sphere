import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";




const AddVideo = ( {email} ) => {
  const [tops, setTops] = useState([]);
  const [tea, setTea] = useState([]);
  const [stu, setStu] = useState([]);

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/api/info`, {
        withCredentials: true,
      }) //Here "http.../student/"  '/' at the end is important otherwise react can't fetch the drf api & it will throw error.
      .then((response) => {
        console.log(response.data["teachers"]);
        setTops(response.data["topics"]);
        setTea(response.data["teachers"]);
        setStu(response.data["students"]);
      })
      .catch((error) => {
        console.error("There was an error fetching the data!", error);
      });
    // eslint-disable-next-line
  }, []);

  const [added, setAdded] = useState(false);
  const [formData, setFormData] = useState({
    email:email,
    url: "",
    title: "",
    desc: "",
    topics: [],
    teachers: [],
    student_access: [],
    classDate: "",
  });

  const onChangeStr = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

// Handle change for checkboxes (topics, teachers, student_access)
const handleCheckboxChange = (e) => {
  const { name, value, checked } = e.target;

  setFormData((prevFormData) => {
    const updatedArray = checked
      ? [...prevFormData[name], value] // Add value if checked
      : prevFormData[name].filter((item) => item !== value); // Remove if unchecked

    return { ...prevFormData, [name]: updatedArray };
  });
};

  
  const { url, title, desc, topics, teachers, student_access, classDate } = formData;

  const onSubmit = (e) => {
    e.preventDefault();

    if (topics.length === 0){
        document.querySelector('#topic-msg').innerHTML='** Please select atleast 1 topic **';
        return;
    }

    if (teachers.length === 0){
        document.querySelector('#teacher-msg').innerHTML='** Please select atleast 1 teacher **';
        return;
    }

    if (student_access.length === 0){
        document.querySelector('#student-msg').innerHTML='** Please select atleast 1 student **';
        return;
    }

    axios.post(`${process.env.REACT_APP_API_URL}/api/add`,formData)
    .then(response => {
        if(response.data['message']==='Video posted successfully.'){
                toast.success(response.data['message']);
                setAdded(true);

        } else {
          toast.error(response.data['message']);
          document.querySelector("#add-new-topic-msg").innerHTML =
          response.data['message'];
        }
      })
      .catch(error => {
        console.error('There was an error making the POST request!', error);
      });

  };

  if (added) {
    return <Navigate to="/" />;
  }

  const ShowInpt = () => {
    document.querySelector("#new-topic-btn").className = "d-none";
    document.querySelector("#add-new-topic").className = "d-block";
    document.querySelector("#new-topic-name").value = "";
  };

  const SaveTopic = () => {
    document.querySelector("#add-new-topic").className = "d-none";
    var newtopic = document.querySelector("#new-topic-name").value;
    console.log(newtopic)

    axios.post(`${process.env.REACT_APP_API_URL}/api/addtopic`,{name:newtopic})
    .then(response => {
      document.querySelector("#new-topic-btn").className =
      "btn btn-dark mt-2 d-block";
        if(response.data['message']==='New Topic Added.'){
          const div = document.createElement("div");
          div.className = "form-check form-check-inline";
          div.innerHTML = `<input class="form-check-input" type="checkbox" name="topics" value=${newtopic} onChange={handleCheckboxChange}>
            <label class="form-check-label" for="inlineCheckbox">${newtopic}</label>`;
          document.querySelector("#add-topic").appendChild(div);
        } else {
          document.querySelector("#add-new-topic-msg").innerHTML =
          response.data['message'];
        }
      })
      .catch(error => {
        console.error('There was an error making the POST request!', error);
      });

    
  };

  console.log(tops);
  return (
    
    <div className="container mt-5">
      <h1>Add Video</h1>
      <form onSubmit={(e) => onSubmit(e)}>
        <div className="form-group">
          <h5 class="my-2">Video URL: </h5>
          <input
            className="form-control"
            type="text"
            placeholder="Enter Video URL"
            name="url"
            value={url}
            onChange={(e) => onChangeStr(e)}
            required
          />
        </div>
        <h5 class="my-2">Title: </h5>
        <div className="form-group">
          <input
            className="form-control"
            type="text"
            placeholder="Enter Title"
            name="title"
            value={title}
            onChange={(e) => onChangeStr(e)}
            required
          />
        </div>

        <h5 class="my-2">Description: </h5>

        <div className="form-group">
          <textarea
            rows="4"
            cols="60"
            className="form-control"
            type="text"
            placeholder="Enter Video Description*"
            name="desc"
            value={desc}
            onChange={(e) => onChangeStr(e)}
            required
          />
        </div>

        <h5 class="my-2">Topics Covered: </h5>
        <p class="my-2 error" id="topic-msg"></p>

        <div id="add-topic">
          {tops.map((tp, index) => (
            <div class="form-check form-check-inline" key={index}>
              <input
                class="form-check-input"
                type="checkbox"
                name="topics"
                value={tp.topic}
                onChange={handleCheckboxChange}
              />
              <label class="form-check-label" for="inlineCheckbox">
                {tp.topic}
              </label>
            </div>
          ))}
        </div>

        <div id="add-new-topic" class="d-none">
          <input type="text" id="new-topic-name" class="w-100 my-2" />
          <button
            type="button"
            class="btn btn-dark mt-2"
            onClick={SaveTopic}
          >
            Save
          </button>
        </div>
        <p class="my-2 error" id="add-new-topic-msg"></p>

        <button
          id="new-topic-btn"
          type="button"
          class="btn btn-dark mt-2 d-block"
          onClick={ShowInpt}
        >
          Add New Topic
        </button>

        <h5 class="my-2">Teachers: </h5>
        <p class="my-2 error" id="teacher-msg"></p>
        {tea.map((t, index) => (
 
          <div class="form-check" key={index}>
            <input
              class="form-check-input"
              type="checkbox"
              value={t.email}
              name="teachers"
              onChange={handleCheckboxChange}
            />
            <label class="form-check-label" for="flexCheckDefault">
              {t.first_name}
            </label>
          </div>
        ))}

        <h5 class="my-2">Students Access: </h5>
        <p class="my-2 error" id="student-msg"></p>
        {stu.map((s, index) => (
          <div class="form-check" key={index}>
            <input
              class="form-check-input"
              type="checkbox"
              value={s.email}
              name="student_access"
              onChange={handleCheckboxChange}
            />
            <label class="form-check-label" for="flexCheckDefault">
              {s.first_name}
            </label>
          </div>
        ))}

        <h5 class="my-2">Class Date: </h5>
        <div className="form-group">
          <input
            className="form-control"
            type="date"
            placeholder="Enter Class Date"
            name="classDate"
            value={classDate}
            onChange={(e) => onChangeStr(e)}
            required
          />
        </div>

        <div className="form-group"></div>

        <button className="btn btn-dark" type="submit">
          Add Video
        </button>
      </form>
    </div>
  );
};

export default AddVideo;
