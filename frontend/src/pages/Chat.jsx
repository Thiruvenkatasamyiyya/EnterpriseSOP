import { useState } from "react";
import { askQuestion } from "../api/api";
import SideBar from "../components/SideBar";
import ChartBoard from "../components/ChartBoard";
export default function Chat() {

  return (
    <div className="grid grid-cols-12">
      <div className="col-span-2">
        <SideBar/>
      </div>
      <div className="col-span-10">
        <ChartBoard/>
      </div>
    </div>
  );
}
