import React, { useState } from 'react';

const EditorForm = () => {
  const [file, setFile] = useState(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [projectId, setProjectId] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('file', file);
    formData.append('name', name);
    formData.append('description', description);
    formData.append('projectId', projectId);

    try {
      const response = await fetch('http://localhost:5501/stream/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        console.log('File uploaded successfully');
      } else {
        console.error('Failed to upload file');
      }
    } catch (error) {
      console.error('Error uploading file', error);
    }
  };

  return (
    <div className=" m-2 bg-gray-100 shadow-md rounded-md">
      <form onSubmit={handleSubmit} className="flex flex-col bg-gray-300">
        <input
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
          name="file"
          className="mb-4 p-1 border border-gray-500 rounded-md  bg-gray-300"
        />
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          name="name"
          placeholder="Video Name"
          className="mb-4 p-1 border border-gray-500 bg-gray-300 rounded-md"
        />
        <input
          type="text"
          value={projectId}
          onChange={(e) => setProjectId(e.target.value)}
          name="projectId"
          placeholder="Project ID"
          className="mb-4 p-1 border border-gray-500 bg-gray-300 rounded-md"
        />
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          name="description"
          placeholder="Video Description"
          className="mb-4 p-1 border border-gray-500 bg-gray-300 rounded-md"
        />
        <input
          type="submit"
          value="Upload"
          className="mb-4 p-1 bg-green-500 text-white rounded-md cursor-pointer hover:bg-green-600"
        />
      </form>
      {/* <h1 className="text-center text-2xl font-semibold text-gray-700 mb-6">
        Video Streaming Example
      </h1>
      <video controls className="w-full border border-gray-300 rounded-md">
        <source src="http://localhost:5501/temp1.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video> */}
    </div>
  );
};

export default EditorForm; 