import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import "./style.css";
import logo2 from "../../img/collegebase-mini.png";

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
        <div className="mb-6">
          <img
            className="logo w-24 h-24 mx-auto mb-2"
            src={logo2}
            alt="Suppal Logo"
          />
          <h1 className="text-2xl font-bold text-gray-800">Welcome to CollegeBase</h1>
          <p className="text-gray-500 text-sm">Log in or sign up to continue</p>
        </div>

        {/* Buttons */}
        <div className="flex flex-col gap-4 mb-6">
          <button
            className="w-full bg-[#0f4d92] text-white py-2 rounded-lg font-semibold shadow-md transition-transform transform hover:scale-105 hover:bg-[#00356b]"
            onClick={() =>
              loginWithRedirect({
                prompt: "login",
              })
            }
          >
            Log In
          </button>
          <button
            className="w-full bg-[#0f4d92] text-white py-2 rounded-lg font-semibold shadow-md transition-transform transform hover:scale-105 hover:bg-[#00356b]"
            onClick={() =>
              loginWithRedirect({
                prompt: "login",
              })
            }
          >
            Sign Up
          </button>
        </div>

        {/* Links for Privacy Policy and Terms of Service */}
        <div className="text-gray-500 text-xs">
          <p>
            By continuing, you agree to our{" "}
            <a
              href="https://www.suppal.ai/privacy-policy.html"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              Privacy Policy
            </a>{" "}
            and{" "}
            <a
              href="https://www.suppal.ai/terms-and-condition.html"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              Terms of Service
            </a>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
