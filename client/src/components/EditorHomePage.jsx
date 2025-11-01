import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { Button } from '@material-tailwind/react';
import axios from 'axios';
import { BlogCard } from './Card';

const EditorHomePage = () => {
  const currUser = useSelector((state) => state.currUser?.currUser);

  // State to hold the fetched projects
  const [projects, setProjects] = useState([]);
  // State to manage form visibility
  const [isFormVisible, setIsFormVisible] = useState(false);
  // State to manage form input
  const [formData, setFormData] = useState({
    projectId: '',
  });

  // Reference to the form container
  const formRef = useRef(null);

  useEffect(() => {
    // Fetch data when component mounts
    axios
      .post('http://localhost:5501/project/get', {
        editor: currUser?.name,
      })
      .then((response) => {
        setProjects(response.data.data);
      })
      .catch((error) => {
        console.error('Error fetching projects:', error);
      });
  }, [currUser?.name]); // Trigger the effect when currUser?.name changes

  // const handleJoinProject = (projectId) => {
  //   const editorUsername = currUser?.name;
  //   axios
  //     .post("http://localhost:5501/project/join", {
  //       projectId,
  //     })
  //     .then((response) => {
  //       // Update projects state after successful join
  //       setProjects((prevProjects) =>
  //         prevProjects.map((project) =>
  //           project.projectId === projectId
  //             ? { ...project, editorUsername }
  //             : project
  //         )
  //       );
  //       setIsFormVisible(false); // Hide the form after joining
  //     })
  //     .catch((error) => {
  //       console.error("Error joining project:", error);
  //     });
  // };

  const handleJoinProject = (projectId) => {
    const editorUsername = currUser?.name;
    axios
      .post('http://localhost:5501/project/join', {
        projectId,
      })
      .then((response) => {
        // Fetch updated list of projects after join
        axios
          .post('http://localhost:5501/project/get', {
            editor: currUser?.name,
          })
          .then((response) => {
            setProjects(response.data.data); // Update projects state with new data
          })
          .catch((error) => {
            console.error('Error fetching projects after join:', error);
          });

        setIsFormVisible(false); // Hide the form after joining
      })
      .catch((error) => {
        console.error('Error joining project:', error);
      });
  };

  const handleFormChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleJoinProject(formData.projectId);
  };

  const handleOutsideClick = (e) => {
    if (formRef.current && !formRef.current.contains(e.target)) {
      setIsFormVisible(false);
    }
  };

  useEffect(() => {
    if (isFormVisible) {
      document.addEventListener('mousedown', handleOutsideClick);
    } else {
      document.removeEventListener('mousedown', handleOutsideClick);
    }

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [isFormVisible]);

  const tp = true;

  return (
    <div className="mb-auto">
      {/* Existing JSX code for header and project cards */}
      <div className="bg-orange-400 p-4 mx-auto my-5 max-w-lg rounded-lg shadow-md text-center">
        <h1 className="animate-fadeInUp text-white text-3xl font-bold mb-2">
          Welcome, {currUser?.name}!
        </h1>
        <p className="animate-fadeInUp text-gray-800 text-base">
          Exciting projects await your editing mastery!
        </p>
      </div>

      <div className="grid grid-cols-4 gap-4 p-7">
        {projects
          .filter((project) => project.isComplete)
          .map((project) => (
            <div key={project._id} className="mb-2">
              <BlogCard
                projectName={project.projectName}
                projectDescription={project.projectDescription}
                channelUsername={project.channelUsername}
                isComplete={tp}
                projectId={project.projectId}
                fun={setProjects}
                state={projects}
              />
            </div>
          ))}
      </div>
      {/* Join New Project Button */}
      <div className="flex items-center justify-center py-7 bg-gray-100">
        <div className="text-center mr-6">
          <div className="text-lg font-semibold text-gray-800">
            Step into new projects and make your mark 💪
          </div>
        </div>
        <div>
          <Button
            variant="text"
            color="orange"
            className="flex items-center gap-2"
            onClick={() => setIsFormVisible(true)}
          >
            Join New Project{' '}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="h-5 w-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3"
              />
            </svg>
          </Button>
        </div>
      </div>

      {/* Popup Form */}
      {isFormVisible && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
          style={{
            transition: 'opacity 0.3s ease-in-out',
            opacity: 1,
          }}
        >
          <div
            ref={formRef}
            className="bg-white p-8 rounded-lg shadow-lg transform transition-transform duration-300 ease-in-out"
            style={{
              animation: 'slideIn 0.3s ease-in-out',
              maxWidth: '80vw',
            }}
          >
            <h2 className="text-2xl font-bold mb-4">Join a Project</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Enter Project ID
                </label>
                <input
                  type="text"
                  name="projectId"
                  value={formData.projectId}
                  onChange={handleFormChange}
                  className="w-full px-3 py-2 border rounded-lg"
                  required
                />
              </div>
              <div className="flex justify-end">
                <Button
                  variant="text"
                  color="gray"
                  className="mr-4"
                  onClick={() => setIsFormVisible(false)}
                >
                  Cancel
                </Button>
                <Button variant="filled" color="orange" type="submit">
                  Join
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditorHomePage;
