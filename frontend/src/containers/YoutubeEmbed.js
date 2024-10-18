import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { FaUserAlt, FaCalendarAlt } from "react-icons/fa";
import { formatDistanceToNow } from 'date-fns';
import { toast } from "react-toastify";
import LikeButton from "./LikeButton";


const YoutubeEmbed = ( {email} ) => {
  const { embedId } = useParams();

  const [isteacher, setIsteacher] = useState(false);
  const [vidDetails, setVidDetails] = useState({});
  const [usrDetails, setUsrDetails] = useState({});
  const [comm, setComm] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [saved, setSaved] = useState(null);

    useEffect(() => {

        axios.get(`${process.env.REACT_APP_API_URL}/api/gettype/${email}`,{ withCredentials: true })  
        .then(response => {
          if (response.data['res'] === "true") {
            setIsteacher(true)
          }
        })
        .catch(error => {
            console.error('There was an error fetching the data!', error);
        });

        const params = {
            email: email,
          };

axios.get(`${process.env.REACT_APP_API_URL}/api/view/${embedId}`, { params })
  .then((response)=>{
    console.log(response.data);
    setVidDetails(response.data['vidDetails'])
    setUsrDetails(response.data['usrDetails'])
    setComm(response.data['comm'])
    setSaved(response.data['saved'])
    setTeachers(response.data['vidDetails']['teachers'])
  })

// eslint-disable-next-line 
    }, [])

    const onSubmit = (e) => {

      e.preventDefault();

      const postComm = document.getElementById('post-comm').value;

      const commData={
        email:email,
        postComm:postComm,
        embedId:embedId
      }

      axios.post(`${process.env.REACT_APP_API_URL}/api/post_comm`,commData)
      .then(response => {
          if(response.data['message']==='Comment added successfully.'){
                  toast.success(response.data['message']);
                  
                  document.getElementById('post-comm').value="";
  
          } else {
            toast.error(response.data['message']);
          }
        })
        .catch(error => {
          console.error('There was an error making the POST request!', error);
        });

    }


  

  return (
    <>

      <div class="container-fluid mx-2" style={{maxWidth: 1500}}>

        <div class="mx-auto my-4" style={{maxWidth: 896}}>
          <div class="video-container">
            <iframe
              width="100%"
              height="500"
              src={`https://www.youtube.com/embed/${embedId}`}
              loading="lazy"
              frameborder="0"
              allowfullscreen
              title="Embedded youtube"
            ></iframe>
          </div>
        </div>

        <div class="row">
        <div class="col-12 col-md-11 px-4 px-md-1 mx-sm-auto" style={{maxWidth: 900}}>
            
            <div class="d-flex justify-content-between video-page-title ">
                <h1 >{vidDetails['title']}</h1>
                <div id="heart-btn">
                  {isteacher?<></>
                  :saved!==null && <LikeButton email={email} embedId={embedId} saved={saved} />
                  }
                </div>
            </div>

            <p style={{maxWidth: 700}}>{vidDetails['desc']}</p>

            <div id="video-details-mobile" class="fw-bold border-bottom pt-2 pb-1">Video details</div>
            <div class="d-flex py-2 videopage-icons border-bottom ml-2">
                <div class="pb-2"><FaCalendarAlt className="pr-1 mb-1"/> { vidDetails['class_date']} </div>
                <div class="d-flex pb-2 justify-content-end ml-auto">
                    {teachers.map( (name,index)=>(
                      <div class="pr-2 mx-2" key={index}><FaUserAlt className="pr-1"/>{ name }</div>
                    ) )}
                </div>
            </div>

        </div>
    </div>

    <div class="row">
        <div class="col-12 col-md-11 px-4 px-md-1 mx-sm-auto" style={{maxWidth: 900}}>
            
            <div class="pt-3" id="comment_counter_text">
               {comm.length>0?
                  <> {comm.length} comment(s) </>:
                  <>Be the first to leave a comment!</>}
              
            </div>


            <div class="d-flex p-4 border-bottom">
                <img class="circular-picture comment-picture mr-2" src={usrDetails['profile_picture']} alt="profilepic"/>
               <form onSubmit={(e) => onSubmit(e)}>
                    <textarea id="post-comm" rows="2" type="text" name="cmt" placeholder=" Add a public comment" ></textarea>
                        <br/>
                        <button type="submit" class="btn btn-dark btn-sm mt-2" >Post Comment</button>
              </form>   
            </div>

            <div class="comments mt-2" style={{fontSize: 14}}>
                {comm.map( (comment,ind)=>(

                    <div class="comment-item d-flex" key={ind} id={`comment-${comment.pk}`}>
                        <img class="circular-picture comment-picture mr-2" src={comment.user_pfp} alt="pfp"/>
                        <div class="d-flex flex-column">
                            <div class="d-flex">
                                <div class="comment-name fw-bold">{ comment.user_fullname }</div>
                                <div class="comment-time text-muted mx-2">{ formatDistanceToNow(new Date(comment.time), { addSuffix: true }) }</div>
                            </div>
                            <div class="comment-text">{ comment.comm }</div>
                        </div>
                    </div>
                ) )}

            </div>

        </div>
    </div>


      </div>
    </>
  );
};

export default YoutubeEmbed;
