import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-4  bottom-0 w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mt-4 text-sm text-gray-400 text-center flex justify-center items-center">
          <img className="h-8 w-auto" src="/icon.png" alt="Pixie" />
          <p className="ml-2">&copy; 2024 PixieColab. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
