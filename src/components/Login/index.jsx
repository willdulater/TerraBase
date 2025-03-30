import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import "./style.css";

const Login = () => {
  const { loginWithRedirect } = useAuth0();

  return (
    <div
      className="flex items-center justify-center h-screen"
      style={{
        background: "linear-gradient(to bottom, #f8fafc, #e8f2fc)",
        fontFamily: "'Poppins', sans-serif",
      }}
    >
      {/* Card Container */}
      <div className="bg-white shadow-lg rounded-2xl p-4 max-w-sm w-full text-center">
        {/* Logo */}
        {/* Logo */}
<div className="mb-6">
  <div className="flex justify-center mb-2">
    <div className="w-32 aspect-square">
      <img
        className="w-full h-full object-contain"
        src="terrafind-small.png"
        alt="Suppal Logo"
      />
    </div>
  </div>
  <h1 className="text-2xl font-bold text-gray-800">Welcome to Terra Find</h1>
  <p className="text-gray-500 text-sm">Log in or sign up to continue</p>
</div>


        {/* Buttons */}
        <div className="flex flex-col gap-4 mb-6">
          <button
            className="w-full bg-[#0B3D2E] text-white py-2 rounded-lg font-semibold shadow-md transition-transform transform hover:scale-105 hover:bg-[#0B3D2E]"
            onClick={() =>
              loginWithRedirect({
                prompt: "login",
              })
            }
          >
            Log In
          </button>
          <button
            className="w-full bg-[#0B3D2E] text-white py-2 rounded-lg font-semibold shadow-md transition-transform transform hover:scale-105 hover:bg-[#0B3D2E]"
            onClick={() =>
              loginWithRedirect({
                prompt: "login",
              })
            }
          >
            Sign Up
          </button>
        </div>

       
        
      </div>
    </div>
  );
};

export default Login;
