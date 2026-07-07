import React, { useEffect, useState } from "react";

import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useResetPasswordMutation } from "../redux/features/authApi";
import Header from "../components/Header";


const ResetPassword = () => {
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [resetPassword, { data, isLoading, error }] = useResetPasswordMutation();

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

    if (password && confirmPassword) {
      const resetData = {
        password,
        confirmPassword
      };

      await resetPassword(resetData);
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
                Password
              </label>
              <input
                type="password"
                id="password_field"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <label htmlFor="email_field" className="text-gray-700 mb-1 mt-3">
                Confirm Password
              </label>
              <input
                type="password"
                id="confirm_password_field"
                name="confirm_password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>


            <button
              type="submit"
              // disabled={isLoading}
              className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition"
            >
              {isLoading ? "updating..." : "Reset Password"}
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

export default ResetPassword;
