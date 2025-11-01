import React, { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import { Button } from "@material-tailwind/react";
import axios from "axios";
import { BlogCard } from "./Card";

const ChannelHomePage = () => {
  const currUser = useSelector((state) => state.currUser?.currUser);

  // State to hold the fetched projects
  const [projects, setProjects] = useState([]);
  // State to manage form visibility
  const [isFormVisible, setIsFormVisible] = useState(false);
  // State to manage form inputs
  const [formData, setFormData] = useState({
    projectName: "",
    projectDescription: "",
    editorUsername: "",
  });

  // Reference to the form container
  const formRef = useRef(null);

  useEffect(() => {
    // Fetch data when component mounts
    axios
      .post("http://localhost:5501/project/get", {
        channel: currUser?.name,
      })
      .then((response) => {
        setProjects(response.data.data);
      })
      .catch((error) => {
        console.error("Error fetching projects:", error);
      });
  }, [currUser?.name]); // Trigger the effect when currUser?.name changes

  const handleCreateProject = (data) => {
    axios
      .post("http://localhost:5501/project/add", {
        projectName: data.projectName,
        projectDescription: data.projectDescription,
        channel: currUser?.name,
        editor: data.editorUsername,
      })
      .then((response) => {
        // Update projects state after successful creation
        setProjects((prevProjects) => [...prevProjects, response.data]);
        // Hide the form and reset form data
        setIsFormVisible(false);
        setFormData({
          projectName: "",
          projectDescription: "",
          editorUsername: "",
        });
      })
      .catch((error) => {
        console.error("Error creating project:", error);
      });
  };

  const handleFormChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleCreateProject(formData);
  };

  const handleOutsideClick = (e) => {
    if (formRef.current && !formRef.current.contains(e.target)) {
      setIsFormVisible(false);
    }
  };

  useEffect(() => {
    if (isFormVisible) {
      document.addEventListener("mousedown", handleOutsideClick);
    } else {
      document.removeEventListener("mousedown", handleOutsideClick);
    }

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
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
        Transforming raw footage into polished perfection🎬
        </p>
      </div>

      <div className="grid grid-cols-4 gap-4 p-7">
        {projects
          .filter((project) => project.isComplete)
          .map((project) => (
            <div key={project._id} className="mb-2">
              <BlogCard
                key={project._id} // Ensure each card has a unique key
                projectName={project.projectName}
                projectDescription={project.projectDescription}
                channelUsername={project.editorUsername}
                isComplete={tp}
                projectId={project.projectId}
                fun={setProjects}
                state={projects}
              />
            </div>
          ))}
        {projects
          .filter((project) => !project.isComplete)
          .map((project) => (
            <div key={project._id} className="mb-2">
              <BlogCard
                key={project._id} // Ensure each card has a unique key
                projectName={project.projectName}
                projectDescription={project.projectDescription}
                channelUsername={project.editorUsername}
                isComplete={!tp}
                projectId={project.projectId}
                fun={setProjects}
                state={projects}
              />
            </div>
          ))}
      </div>
      {/* Create Project Button */}
      <div className="flex items-center justify-center py-7 bg-gray-100">
        <div className="text-center mr-6">
          <div className="text-lg font-semibold text-gray-800">
            Seize the opportunity to innovate and influence 🚀
          </div>
        </div>
        <div>
          <Button
            variant="text"
            color="orange"
            className="flex items-center gap-2"
            onClick={() => setIsFormVisible(true)}
          >
            Create a Project{" "}
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
            transition: "opacity 0.3s ease-in-out",
            opacity: 1,
          }}
        >
          <div
            ref={formRef}
            className="bg-white p-8 rounded-lg shadow-lg transform transition-transform duration-300 ease-in-out"
            style={{
              animation: "slideIn 0.3s ease-in-out",
              maxHeight: "80vh",
              overflowY: "auto",
            }}
          >
            <h2 className="text-2xl font-bold mb-4">Create a New Project</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Title
                </label>
                <input
                  type="text"
                  name="projectName"
                  value={formData.projectName}
                  onChange={handleFormChange}
                  className="w-full px-3 py-2 border rounded-lg"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Description
                </label>
                <textarea
                  name="projectDescription"
                  value={formData.projectDescription}
                  onChange={handleFormChange}
                  className="w-full px-3 py-2 border rounded-lg"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Editor ID
                </label>
                <input
                  type="text"
                  name="editorUsername"
                  value={formData.editorUsername}
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
                  Create
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChannelHomePage;
