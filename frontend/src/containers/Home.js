import React, { useEffect, useState } from 'react';
import '../css/index.css'
import axios from 'axios';
import { Link } from "react-router-dom";
import { FaCalendarAlt } from "react-icons/fa";
import { FaUserAlt } from "react-icons/fa";
import { HiMagnifyingGlass } from "react-icons/hi2";
import Spinner from './Spinner'
// import YoutubeEmbed from './YoutubeEmbed';


const Home = ( {email, saved}) => {
  
    const [vid, setVid] = useState([])
    const [allVid, setAllVid] = useState([])
    const [load, setload] = useState(true)
    var path = 'getvideos';
    if(saved){
        path='getsavedvideos';
    }


useEffect(() => {
        axios.get(`${process.env.REACT_APP_API_URL}/api/${path}/${email}`,{ withCredentials: true })  //Here "http.../student/"  '/' at the end is important otherwise react can't fetch the drf api & it will throw error.
      .then(response => {
        console.log(response.data)
        setload(false)
        setVid(response.data);
        setAllVid(response.data);
      })
      .catch(error => {
          console.error('There was an error fetching the data!', error);
      });
      // eslint-disable-next-line 
}, []);

function searchMatch(query,obj) {
    const q=query.toLowerCase();
    if (obj['desc'].toLowerCase().indexOf(q) !== -1 || obj['title'].toLowerCase().indexOf(q) !== -1 || obj['username'].toLowerCase().indexOf(q) !== -1)
        return true;
    else{
        for(let topic of obj['topics']){
            if(topic.toLowerCase().indexOf(q) !== -1)
                return true;
        }
        for(let tea of obj['teachers']){
            if(tea.toLowerCase().indexOf(q) !== -1)
                return true;
        }
    }
    return false;
    
}

function Search(e) {
    var q = document.getElementById('search').value
    if(q.length ===0){
        setVid(allVid)
        setload(false)
    }
    else{
        var new_videos=[]
        for (let index in allVid) {
            if(searchMatch(q,allVid[index])){
                new_videos.push(allVid[index])
            }
        }
        setVid(new_videos);
        setload(false)
    }
}


// console.log("vid:",vid)
// console.log(typeof(vid))
    return(
        load ? <Spinner /> :
    <>
      <nav class="navbar navbar-expand-lg navbar-light d-flex justify-content-center pt-3">
      <div class="d-flex">
          <div class="d-flex ">
              <input class="mr-1 rounded-lg border border-secondary" type="search" placeholder="Search" aria-label="Search" name="search" id="search"/>
              <button onClick={Search} class="btn btn-outline-dark my-sm-0 " style={{width: 48}}><HiMagnifyingGlass/></button>
          </div>
      </div>
  </nav>

<div className='ml-4 d-flex flex-wrap justify-content-center align-items-center col-12 col-lg-11 containerVideos'> 
{vid.length===0? <h2> Nothing to show ! </h2> :
vid.map((item,i) =>(
        //  <div className='col-md-4 d-flex justify-content-center'> 

            <Link key={i} className='text-decoration-none text-dark' to={`/view/${item.embedId}`}>
                <div className="card m-3 shadow border-0" style={{width:360}}>
                    <img src={item.img} alt='...'/>
                    <div className="p-0 card-body text-body">
                      <h6 className="card-video-title card-text font-weight-bold px-3 my-2 py-1">{ item.title }</h6>
                      <div className="card-su1btext bg-gradient-secondary d-flex justify-content-between align-items-center px-2  py-1" style={{height:57.3}}>
                        <div>
                            <FaCalendarAlt className='mb-1' /><span className="mx-2">{item.class_date}</span>
                        </div>
                        <div className="d-flex flex-column justify-content-center align-items-center">
                        {item.teachers.map( (name,ind) =>(
                            <div key={ind} className="pb align-self-start">
                                <FaUserAlt className='mr-2 mb-1'/>{name}
                            </div>
                            ) )}
                            
                        </div>
                      </div>
                    </div>
                </div>
            </Link>

        // </div>        
          ))}  

</div>

    </>)
};


export default Home;
