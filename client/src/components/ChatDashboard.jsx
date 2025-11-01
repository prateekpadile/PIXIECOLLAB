import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import VideoPlayer from './VideoPlayer';
import { useRef } from 'react';

const socket = io('127.0.0.1:5505');

const ChatInterface = ({ currReceiver, projectId }) => {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const currUser = useSelector((state) => state.currUser.currUser);
  const isEditor = useSelector((state) => state.currUser.isEditor);
  const chatHistoryRef = React.useRef(null);

  const handleInputChange = (e) => {
    setInputText(e.target.value);
  };

  socket.on('addMessage', ({ message, sender }) => {
    if (message === '') return;
    setMessages([...messages, { sender: sender, message: message }]);
  });

  const sendMessage = () => {
    if (inputText.trim() === '') return;
    if (isEditor) {
      socket.emit('sendMessage', {
        editorUsername: currUser.name,
        channelUsername: currReceiver.name,
        message: inputText,
        sender: currUser.name,
        roomId: projectId,
      });
    } else {
      socket.emit('sendMessage', {
        editorUsername: currReceiver.name,
        channelUsername: currUser.name,
        message: inputText,
        sender: currUser.name,
        roomId: projectId,
      });
    }
    setInputText('');
  };

  useEffect(() => {
    chatHistoryRef.current.scrollTop = chatHistoryRef.current.scrollHeight;
  }, [messages]);

  useEffect(() => {
    chatHistoryRef.current.focus();
  });

  return (
    <>
      <div
        id="chat-history"
        ref={chatHistoryRef}
        className="h-4/5 overflow-y-scroll mb-4 p-4 flex-col flex justify-between"
        style={{
          border: '1px solid #ddd',
          borderRadius: '8px',
          padding: '10px',
        }}
      >
        {messages.map((msg, index) => (
          <div key={index} className="message">
            <span
              className="sender"
              style={{ color: '#aaa', marginRight: '5px' }}
            >
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
          style={{ borderTopLeftRadius: '8px', borderBottomLeftRadius: '8px' }}
        />
        <button
          onClick={sendMessage}
          className="px-4 py-1 bg-blue-500 text-white rounded-r"
          style={{
            borderTopRightRadius: '8px',
            borderBottomRightRadius: '8px',
          }}
        >
          Send
        </button>
      </div>
    </>
  );
};

const Friend = ({ friend, setCurrReceiver, setProjectId }) => {
  const isEditor = useSelector((state) => state.currUser.isEditor);
  const { channelUsername, editorUsername, projectId } = friend;

  return (
    <div
      className="text-black cursor-pointer"
      onClick={() => {
        setProjectId(projectId);
        if (isEditor) {
          setCurrReceiver(channelUsername);
          socket.emit('join', { ...friend, roomId: projectId });
        } else {
          setCurrReceiver(editorUsername);
          socket.emit('join', { ...friend, roomId: projectId });
        }
      }}
    >
      <div className="p-2 m-1 border border-black rounded transform transition-transform hover:scale-105">
        {isEditor ? (
          <span>{channelUsername}:</span>
        ) : (
          <span>{editorUsername}:</span>
        )}
        <span className="ml-1 font-extrabold">{projectId}</span>
      </div>
    </div>
  );
};
const Form = ({ projectId }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

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
        title: title,
        description: description,
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

  return (
    <form
      className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 max-w-md mx-auto"
      onSubmit={handleUpload}
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
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>
      <div className="flex items-center justify-between">
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          type="submit"
        >
          Upload
        </button>
      </div>
    </form>
  );
};

const ChatDashboard = () => {
  const isLogin = useSelector((state) => state.currUser.isLogin);
  const isEditor = useSelector((state) => state.currUser.isEditor);
  const currUser = useSelector((state) => state.currUser.currUser);
  const [videoLink, setVideoLink] = useState('');
  const [currReceiver, setCurrReceiver] = useState(null);
  const [friends, setFriends] = useState([]);
  const [inputText, setInputText] = useState('');
  const [projectId, setProjectId] = useState('');
  const handleInputChange = (event) => {
    setInputText(event.target.value);
  };
  const sendMessage = () => {
    if (inputText.trim() === '') return;
    setMessages([...messages, { sender: 'You', message: inputText }]);
    setInputText('');
    // Call your backend or processing logic here
  };

  const nav = useNavigate();
  useEffect(() => {
    if (!isLogin) {
      nav('/login');
    }
  });

  socket.on('joinAlso', ({ channelUsername, editorUsername, roomId }) => {
    if (
      channelUsername === currUser?.name ||
      editorUsername === currUser?.name
    ) {
      socket.emit('finalJoin', { channelUsername, editorUsername, roomId });
    }
  });

  useEffect(() => {
    const func = async () => {
      const res = await fetch('http://localhost:5501/project/get', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(
          isEditor
            ? { editor: currUser?.name, channel: null }
            : { editor: null, channel: currUser?.name }
        ),
      });
      const data = await res.json();
      setFriends(data.data);
    };
    func();
  }, []);

  const playerRef = useRef(null);
  //to get videoLink I will need the url of the stored video for this project(from database using projectId) and also the name of video and also will need the

  useEffect(() => {
    const func = async () => {
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
    func();
  }, [projectId]);

  const videoPlayerOptions = {
    controls: true,
    responsive: true,
    fluid: true,
    sources: [
      {
        src: videoLink,
        type: 'application/x-mpegURL',
      },
    ],
  };

  const handlePlayerReady = (player) => {
    playerRef.current = player;

    // You can handle player events here, for example:
    player.on('waiting', () => {
      videojs.log('player is waiting');
    });

    player.on('dispose', () => {
      videojs.log('player will dispose');
    });
  };

  return (
    <div className="h-screen w-screen flex flex-row">
      <div className="w-1/3 h-full overflow-y-auto">
        {friends.length === 0 ? (
          <div className="p-4">You have no friends. How unfortunate!</div>
        ) : (
          friends.map((friend) => (
            <Friend
              friend={friend}
              key={friend.id} // Use a unique identifier as the key
              setCurrReceiver={setCurrReceiver}
              setProjectId={setProjectId}
            />
          ))
        )}
      </div>
      <div className="w-2/3 h-full flex flex-col">
        {currReceiver && (
          <>
            <ChatInterface currReceiver={currReceiver} projectId={projectId} />
          </>
        )}
      </div>
      <div className="w-1/3 h-full" id="videojs">
        <div className="p-2">Chatting with: {currReceiver}</div>
        <VideoPlayer options={videoPlayerOptions} onReady={handlePlayerReady} />
        {!isEditor ? <Form projectId={projectId} /> : <div></div>}
      </div>
    </div>
  );
};

export default ChatDashboard;
