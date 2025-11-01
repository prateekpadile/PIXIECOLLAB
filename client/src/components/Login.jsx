import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { intialize } from '../features/userSlice.js';
const Login = () => {
  const dispatch = useDispatch();
  const nav = useNavigate();
  const isLogin = useSelector((state) => state.currUser.isLogin);
  const [login, setLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    channelUserName: '',
    channelPasswd: '',
    name: '',
    type: 'editor',
    passwordConfirm: '',
  });

  const toggleForm = () => {
    setLogin(!login);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleTypeChange = (e) => {
    setFormData({ ...formData, type: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let response;
      if (login) {
        if (formData.type === 'channel') {
          response = await axios.post('http://localhost:5501/channel/login', {
            email: formData.email,
            password: formData.password,
          });
          dispatch(
            intialize({
              isEditor: response.data.data.isEditor,
              currUser: response.data.data.channel,
              isLogin: response.data.status === 'success',
            })
          );
        } else if (formData.type === 'editor') {
          response = await axios.post('http://localhost:5501/editor/login', {
            email: formData.email,
            password: formData.password,
          });
          dispatch(
            intialize({
              isEditor: response.data.data.isEditor,
              currUser: response.data.data.editor,
              isLogin: response.data.status === 'success',
            })
          );
        }
      } else {
        if (formData.type === 'channel') {
          response = await axios.post('http://localhost:5501/channel/signup', {
            channelUserName: formData.channelUserName,
            channelPasswd: formData.channelPasswd,
            name: formData.name,
            email: formData.email,
            password: formData.password,
            passwordConfirm: formData.passwordConfirm,
            TYPE: formData.type,
          });
          dispatch(
            intialize({
              isEditor: response.data.data.isEditor,
              currUser: response.data.data.channel,
              isLogin: response.data.status === 'success',
            })
          );
        } else if (formData.type === 'editor') {
          response = await axios.post('http://localhost:5501/editor/signup', {
            name: formData.name,
            email: formData.email,
            password: formData.password,
            passwordConfirm: formData.passwordConfirm,
            TYPE: formData.type,
          });
          dispatch(
            intialize({
              isEditor: response.data.data.isEditor,
              currUser: response.data.data.editor,
              isLogin: response.data.status === 'success',
            })
          );
        }
      }
      // Assuming the token is received in the response
      const token = response.data.token;
      // Store token in local storage
      localStorage.setItem('token', token);
      // Redirect user or update UI
      // create alert after successful login
      alert('Login successful!');
      nav('/');
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    if (isLogin == true) {
      nav('/');
    }
  }, []);
  return (
    <div className="flex justify-center items-center h-screen bg-orange-200">
      <div className="bg-gray-100 p-6 rounded shadow-md w-96">
        <h2 className="text-2xl font-bold mb-4">
          {login ? 'Login' : 'Sign Up'}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700">Type</label>
            <div>
              <input
                type="radio"
                id="editor"
                name="type"
                value="editor"
                checked={formData.type === 'editor'}
                onChange={handleTypeChange}
              />
              <label htmlFor="editor" className="ml-2 mr-4">
                Editor
              </label>
              <input
                type="radio"
                id="channel"
                name="type"
                value="channel"
                checked={formData.type === 'channel'}
                onChange={handleTypeChange}
              />
              <label htmlFor="channel" className="ml-2">
                Channel
              </label>
            </div>
          </div>
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700">
              Email
            </label>
            <input
              type="email"
              id="email"
              className="form-input mt-1 block w-full"
              onChange={handleChange}
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block text-gray-700">
              Password
            </label>
            <input
              type="password"
              id="password"
              className="form-input mt-1 block w-full"
              onChange={handleChange}
            />
          </div>
          {!login && formData.type === 'channel' && (
            <>
              <div className="mb-4">
                <label
                  htmlFor="channelUserName"
                  className="block text-gray-700"
                >
                  Channel UserName
                </label>
                <input
                  type="text"
                  id="channelUserName"
                  className="form-input mt-1 block w-full"
                  onChange={handleChange}
                />
              </div>
              <div className="mb-4">
                <label htmlFor="channelPasswd" className="block text-gray-700">
                  Channel Password
                </label>
                <input
                  type="password"
                  id="channelPasswd"
                  className="form-input mt-1 block w-full"
                  onChange={handleChange}
                />
              </div>
            </>
          )}
          {!login && (
            <>
              <div className="mb-4">
                <label htmlFor="name" className="block text-gray-700">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  className="form-input mt-1 block w-full"
                  onChange={handleChange}
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="confirmPassword"
                  className="block text-gray-700"
                >
                  Confirm Password
                </label>
                <input
                  type="password"
                  id="passwordConfirm"
                  className="form-input mt-1 block w-full"
                  onChange={handleChange}
                />
              </div>
            </>
          )}
          <button
            type="submit"
            className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
          >
            {login ? 'Login' : 'Sign Up'}
          </button>
        </form>
        <p
          className="mt-4 text-center text-gray-700 cursor-pointer"
          onClick={toggleForm}
        >
          {login
            ? "Don't have an account? Sign Up"
            : 'Already have an account? Login'}
        </p>
      </div>
    </div>
  );
};

export default Login;
