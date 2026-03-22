import { useState } from "react";
import SideBar from "../components/SideBar";
import AdminUpload from "../components/AdminUpload";

export default function Upload() {


  return (
    <div className="grid grid-cols-12 h-screen">
      <div className="col-span-2 ">
        <SideBar />
      </div>
      <div className="col-span-10 overflow-y-auto">
        <AdminUpload/>
        
      </div>
    </div>
  );
}
