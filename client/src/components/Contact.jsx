import React from 'react';

const Contact = () => {
  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-4">Contact Us</h1>
      <p className="mb-4">Have a question or want to get in touch? Fill out the form below:</p>
      <form className="grid grid-cols-1 gap-6">
        <label className="block">
          <span className="text-gray-700">Name</span>
          <input type="text" className="p-2 mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" />
        </label>
        <label className="block">
          <span className="text-gray-700">Email</span>
          <input type="email" className="p-2 mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" />
        </label>
        <label className="block">
          <span className="text-gray-700">Message</span>
          <textarea className="p-2 mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"></textarea>
        </label>
        <button type="submit" className="bg-indigo-500 text-white px-4 py-2 rounded-md hover:bg-indigo-600">Submit</button>
      </form>
    </div>
  );
};

export default Contact;
