import { useState } from "react";
import { askQuestion } from "../api/api";
import SideBar from "../components/sideBar";
import ChartBoard from "../components/ChartBoard";
import Header from "../components/Header";
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
