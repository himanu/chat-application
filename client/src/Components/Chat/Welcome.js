import React from 'react';

function WelcomePage() {
  return (
    <div className="flex-grow bg-gradient-to-br from-blue-500 via-gray-100 to-blue-500 min-h-screen flex flex-col items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Welcome to ChitChat</h1>
        <p className="text-lg text-gray-600 mb-6">Connect, chat, and have fun with friends and family.</p>

        {/* Image (Optional) */}
        <img
          src="/logo.jpeg" // Replace with your image
          alt="Chat illustration"
          className="w-48 h-48 mx-auto rounded-full mb-6"
        />

        {/* <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
          Get Started
        </button> */}
      </div>
    </div>
  );
}

export default WelcomePage;
