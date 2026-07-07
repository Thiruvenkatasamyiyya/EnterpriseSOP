import React from "react";
import { useNavigate } from "react-router-dom";
import { useLogoutMutation } from "../redux/features/authApi";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";

const SideBar = () => {
  const navigate = useNavigate();
  const [logout,{isSuccess,isLoading,isError}] = useLogoutMutation()
  
  const {isAuthenticated} = useSelector((state)=> state.auth)
  function handleLogout() {
    logout()
    isSuccess && toast.success("Logged Out Successfully")
    setTimeout(() => window.location.reload(), 2000)
  }
  return (
    <div className=" bg-blue-900 h-screen p-4 flex flex-col justify-between text-white">
      <div>
        <h1 className=" text-2xl font-bold ">SOP Agent</h1>
        <hr className="border-white my-5" />
        <div className="flex flex-col gap-3">
          <div
            className="bg-blue-500 px-5 py-2 rounded-md"
            onClick={() => navigate("/")}
          >
            <span className="font-bold">Chat</span>
          </div>
          <div
            className="bg-blue-500 px-5 py-2 rounded-md"
            onClick={() => navigate("/admin")}
          >
            <span className="font-bold">Admin Control</span>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-4">
        <div
          className="px-5 py-2 bg-blue-500 rounded-md"
          onClick={() => navigate("/login")}
        >
          <span className="  ">Login</span>
        </div>
        <div
          className={`px-5 py-2 bg-blue-500 rounded-md ${!isAuthenticated && "hidden"}`}
          onClick={handleLogout}
        >
          <span className="  ">Logout</span>
        </div>
      </div>
    </div>
  );
};

export default SideBar;
