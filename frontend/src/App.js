import React, {  useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import { ToastContainer } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";

import Home from "./containers/Home";
import Login from "./containers/Login";
import Signup from "./containers/Signup";
import Activate from "./containers/Activate";
import ResetPassword from "./containers/ResetPassword";
import ResetPasswordConfirm from "./containers/ResetPasswordConfirm";
import Google from "./containers/Google";

import { Provider } from "react-redux";
import store from "./store";

import Layout from "./hocs/Layout";
import Protected from "./containers/Protected";
import YoutubeEmbed from "./containers/YoutubeEmbed";
import AddVideo from "./containers/AddVideo";


const App = () => {
  const [email, setEmail1] = useState("default");

  const setEmail = (id) => {
    setEmail1(id)
  }

  

  return (
    <Provider store={store}>
      <Router>
        <Layout email={email}>
          <Routes>
            <Route path="/" element={<Protected Comp={Home} saved={false} email={email}/>} />
            <Route path="/saved-videos" element={<Home saved={true} email={email}/>} />
            <Route path="/view/:embedId" element={<YoutubeEmbed email={email} />} />
            <Route path="/addvideo" element={<Protected Comp={AddVideo} saved={null} email={email}/>} />
            <Route path="/login" element={<Login setEmail={setEmail} />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/google" element={<Google />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route
              path="/password/reset/confirm/:uid/:token"
              element={<ResetPasswordConfirm />}
            />
            <Route path="activate/:uid/:token" element={<Activate />} />
          </Routes>
          <ToastContainer />
        </Layout>
      </Router>
    </Provider>
  );
};

export default App;
