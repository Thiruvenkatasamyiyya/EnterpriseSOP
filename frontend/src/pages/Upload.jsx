import { useState } from "react";
import SideBar from "../components/SideBar";
import AdminUpload from "../components/AdminUpload"

export default function Upload() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="relative min-h-screen">
      <div className="grid grid-cols-12 h-screen">
        <div
          className={`
            fixed top-0 left-0 h-full bg-gray-100 z-20 transform transition-transform duration-300
            w-64  md:col-span-2 
            ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          `}
        >
          <SideBar />

          <button
            className="absolute top-1/2 -right-4 transform -translate-y-1/2 bg-blue-500 text-white p-1 rounded-full md:hidden"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? "◀" : "▶"}
          </button>
        </div>
        <div className="hidden md:block md: col-span-2">
          <SideBar/>
        </div>

        <div className={`col-span-12 ${sidebarOpen ? "md:opacity-50" : "md:opacity-100"} md:col-span-10 overflow-y-auto`}>
          <AdminUpload/>
        </div>
      </div>

      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 z-10 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}