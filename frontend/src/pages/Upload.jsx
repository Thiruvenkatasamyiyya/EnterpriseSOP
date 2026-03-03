import { useState } from "react";
import SideBar from "../components/sideBar";
import AdminUpload from "../components/AdminUpload";

export default function Upload() {


  return (
    <div className="grid grid-cols-12">
      <div className="col-span-2">
        <SideBar />
      </div>
      <div className="col-span-10">
        <AdminUpload/>
        
      </div>
    </div>
  );
}
