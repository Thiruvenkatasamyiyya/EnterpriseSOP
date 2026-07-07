import React, { useEffect, useState } from "react";

import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useForgetPasswordMutation } from "../redux/features/authApi";
import Header from "../components/Header";

const ForgetPassword = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");

  const [forgetPassword, { data, isLoading, error }] = useForgetPasswordMutation();

  console.log(data, error, isLoading);

  useEffect(() => {
    if (error) {
      toast.error(error?.data?.message);
    }
    if (data) {
      toast.success("Token Sent Successfully");
    }
  }, [error, data]);

  const submitHandler = async (e) => {
    e.preventDefault();

    if (email) {
      const forgetData = {
        email
      };

      await forgetPassword(forgetData);
    } else {
      toast.error("Enter the Credentials");
    }

    if (data) {
      navigate("/");
    }
  };

  return (
    <div className="h-screen grid grid-rows-[auto_1fr]">
      <Header />
      <div className="grid place-items-center  bg-gray-100">
        <div className="bg-white p-6 rounded-xl shadow-lg w-80">
          <form onSubmit={submitHandler} className="flex flex-col gap-4">
            <h2 className="text-2xl font-semibold text-center">Reset Password</h2>

            <div className="flex flex-col">
              <label htmlFor="email_field" className="text-gray-700 mb-1 mt-3">
                Email
              </label>
              <input
                type="email"
                id="email_field"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>


            <button
              type="submit"
              // disabled={isLoading}
              className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition"
            >
              {isLoading ? "Sending..." : "Send"}
            </button>

            <p className="text-sm text-center">
              New user?{" "}
              <a href="/register" className="text-blue-500 hover:underline">
                Register
              </a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ForgetPassword;
