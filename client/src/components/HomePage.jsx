import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import EditorHomePage from "./EditorHomePage.jsx";
import VideoUpload from "./VideoUpload.jsx";
import { increase, decrease } from "../features/userSlice.js";
import ChannelHomePage from "./ChannelHomePage.jsx";

const HomePage = () => {
  const dispatch = useDispatch();
  const nav = useNavigate();
  const currUser = useSelector((state) => state.currUser.currUser);
  const isEditor = useSelector((state) => state.currUser.isEditor);
  const isLogin = useSelector((state) => state.currUser.isLogin);

  useEffect(() => {
    if (!isLogin) {
      nav("/login");
    }
  }, [isLogin, nav]);

  return (
    // <div className="bg-gray-100 flex flex-col items-center justify-center h-screen">
    //   <div className="text-center mb-8">
    //     <h1 className="text-4xl font-bold text-gray-800 mb-4">
    //       Hello, {currUser?.name}, you are a {isEditor ? 'Editor' : 'Channel'}
    //     </h1>
    //     {isEditor ? <h1>You are an editor</h1> : <h1>You are not an editor</h1>}
    //   </div>
    //   {/* <div className="w-full max-w-lg">
    //     <VideoUpload />
    //   </div> */}
    // </div>
    <div>
      {isEditor ? <EditorHomePage /> : <ChannelHomePage/>}
    </div>
  );
};

export default HomePage;
