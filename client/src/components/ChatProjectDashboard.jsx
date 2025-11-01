import React, { useEffect, useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import VideoPlayer from './VideoPlayer';
import EditorForm from './EditorForm';

const socket = io('127.0.0.1:5505');

const ChatInterface = ({ currReceiver, projectId }) => {
  const [messages, setMessages] = useState([]);
  const [newMessages, setNewMessages] = useState([]);
  const newMessagesRef = useRef(newMessages);
  const [inputText, setInputText] = useState('');
  const currUser = useSelector((state) => state.currUser.currUser);
  const isEditor = useSelector((state) => state.currUser.isEditor);
  const currProjectId = useSelector((state) => state.currProject.projectId);
  const chatHistoryRef = useRef(null);

  const handleInputChange = (e) => {
    setInputText(e.target.value);
  };

  useEffect(() => {
    newMessagesRef.current = newMessages;
  }, [newMessages]);

  useEffect(() => {
    socket.on('addMessage', ({ message, sender }) => {
      if (message === '') return;
      setNewMessages((prevMessages) => [...prevMessages, { sender, message }]);
      setMessages((prevMessages) => [...prevMessages, { sender, message }]);
    });

    return () => {
      socket.off('addMessage');
    };
  }, [messages]);

  const sendMessage = () => {
    if (inputText.trim() === '') return;
    const messageData = {
      message: inputText,
      sender: currUser.name,
      roomId: projectId,
      projectId: projectId,
    };
    if (isEditor) {
      messageData.editorUsername = currUser.name;
      messageData.channelUsername = currReceiver;
    } else {
      messageData.editorUsername = currReceiver;
      messageData.channelUsername = currUser.name;
    }
    socket.emit('sendMessage', messageData);
    setInputText('');
  };

  useEffect(() => {
    if (chatHistoryRef.current) {
      chatHistoryRef.current.scrollTop = chatHistoryRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (chatHistoryRef.current) {
      chatHistoryRef.current.focus();
    }
  }, []);

  useEffect(() => {
    const fetcher = async () => {
      const resp = await fetch(`http://localhost:5501/chat/fetch`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          projectId: projectId,
        }),
      });
      const res = await resp.json();
      setMessages(res?.data);
    };
    fetcher();
    return () => {
      const adder = async () => {
        const filtered = newMessagesRef.current.filter(
          (m) => m.sender === currUser.name
        );
        const resp = await fetch(`http://localhost:5501/chat/add`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            arr: filtered,
            projectId: projectId,
          }),
        });
        const res = await resp.json();
        if (res?.ok != true) {
          alert('Chat Not Saved!!');
        }
      };
      adder();
    };
  }, []);

  return (
    <div className="flex flex-col " style={{ height: '90vh' }}>
      <div
        id="chat-history"
        ref={chatHistoryRef}
        className="max-h-full bg-gray-300 flex-grow overflow-y-scroll mb-4 p-4 border border-gray-700 rounded-lg"
      >
        {messages.map((msg, index) => (
          <div key={index} className="message text-white-400 mr-2">
            <span className="sender text-black-400 mr-2 font-bold">
              {msg.sender}
            </span>
            : {msg.message}
          </div>
        ))}
      </div>
      <div className="flex">
        <input
          type="text"
          value={inputText}
          onChange={handleInputChange}
          placeholder="Type a message..."
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              sendMessage();
            }
          }}
          className="flex-grow px-2 py-1 rounded-l border border-gray-300"
        />
        <button
          onClick={sendMessage}
          className="px-4 py-1 bg-blue-500 text-white rounded-r"
        >
          Send
        </button>
      </div>
    </div>
  );
};

const Form = ({ projectId }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const isEditor = useSelector((state) => state.currUser.isEditor);

  const handleUpload = async (e) => {
    e.preventDefault();
    const resp1 = await fetch(
      `http://localhost:5501/video/get?projectId=${projectId}`,
      { method: 'GET' }
    );
    const Videop = await resp1.json();
    const Video = Videop.video;

    const resp2 = await fetch(`http://localhost:5501/youtube/upload`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title,
        description,
        cloudinaryUrl: Video.url,
      }),
    });

    const data = await resp2.json();
    if (data.ok) {
      window.location = data.authUrl;
    } else {
      alert('Something went wrong');
    }
  };
  const handleUpload2 = () => {};
  return (
    <form
      className="rounded px-4 pt-6 pb-8 mb-4  mx-auto"
      onSubmit={isEditor ? handleUpload2 : handleUpload}
    >
      <div className="mb-4">
        <label
          className="block text-gray-700 text-sm font-bold mb-2"
          htmlFor="title"
        >
          Title
        </label>
        <input
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          type="text"
          name="title"
          placeholder="Title"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>
      <div className="mb-6">
        <label
          className="block text-gray-700 text-sm font-bold mb-2"
          htmlFor="description"
        >
          Description
        </label>
        <input
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
          type="text"
          name="description"
          id="description"
          placeholder="Enter a description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>
      <div className="flex items-center justify-center">
        <button
          className=" bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          type="submit"
        >
          Upload
        </button>
      </div>
    </form>
  );
};

const ChatProjectDashboard = () => {
  const projectId = useSelector((state) => state.currProject.projectId);
  const isEditor = useSelector((state) => state.currUser.isEditor);
  const isLogin = useSelector((state) => state.currUser.isLogin);
  const currUser = useSelector((state) => state.currUser.currUser);
  const [currProject, setCurrProject] = useState(null);
  const [videoLink, setVideoLink] = useState('');
  const [currReceiver, setCurrReceiver] = useState(null);
  const nav = useNavigate();

  useEffect(() => {
    const fetchProjectData = async () => {
      const res = await fetch(
        `http://localhost:5501/project/getbyId?projectId=${projectId}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            projectId,
          }),
        }
      );
      const data = await res.json();
      setCurrProject(data?.data);
      setCurrReceiver(
        isEditor ? data?.data?.channelUsername : data?.data?.editorUsername
      );
      socket.emit('join', {
        channelUsername: data?.data?.channelUsername,
        editorUsername: data?.data?.editorUsername,
        projectId,
        roomId: projectId,
      });
    };
    fetchProjectData();
  }, []);

  useEffect(() => {
    if (!isLogin) {
      nav('/login');
    }
  }, [isLogin, nav]);

  useEffect(() => {
    socket.on('joinAlso', ({ channelUsername, editorUsername, roomId }) => {
      if (
        channelUsername === currUser?.name ||
        editorUsername === currUser?.name
      ) {
        socket.emit('finalJoin', { channelUsername, editorUsername, roomId });
      }
    });

    return () => {
      socket.off('joinAlso');
    };
  }, [currUser]);

  useEffect(() => {
    const fetchVideoLink = async () => {
      const resp1 = await fetch(
        `http://localhost:5501/video/get?projectId=${projectId}`,
        { method: 'GET' }
      );
      const Videop = await resp1.json();
      const Video = Videop.video;

      const resp2 = await fetch(`http://localhost:5501/stream/streaming`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...Video }),
      });
      const streamResp = await resp2.json();
      setVideoLink(streamResp.videoUrl);
    };
    fetchVideoLink();
  }, [projectId]);

  const videoPlayerOptions = {
    controls: true,
    responsive: true,
    fluid: false,
    sources: [
      {
        src: videoLink,
        type: 'application/x-mpegURL',
      },
    ],
  };

  const handlePlayerReady = (player) => {
    // You can handle player events here, for example:
    player.on('waiting', () => {
      videojs.log('player is waiting');
    });

    player.on('dispose', () => {
      videojs.log('player will dispose');
    });
  };

  return (
    <>
      <h1 className="bg-orange-400 p-4 mx-auto my-5 max-w-lg rounded-lg shadow-md text-center animate-fadeInUp text-white text-3xl font-bold mb-2">
        {isEditor
          ? `${currProject?.projectName} of ${currProject?.channelUsername}`
          : `${currProject?.projectName} by ${currProject?.editorUsername}`}
      </h1>
      <div className="h-screen w-screen p-2 flex flex-row">
        <div className="w-2/3  h-full">
          <div className="mb-4">
            <ChatInterface currReceiver={currReceiver} projectId={projectId} />
          </div>
        </div>
        <div className="w-1/3 h-full">
          <div className="mb-4 h-1/2">
            {videoLink && (
              <VideoPlayer
                options={videoPlayerOptions}
                onReady={handlePlayerReady}
              />
            )}
          </div>
          <div className="mb-4 h-1/2">
            {/* <h2 className="text-xl font-semibold text-center">{`Upload ${!isEditor?'to channel':'above'}`}</h2> */}
            {isEditor ? <EditorForm /> : <Form projectId={projectId} />}
          </div>
        </div>
      </div>
    </>
  );
};

export default ChatProjectDashboard;
