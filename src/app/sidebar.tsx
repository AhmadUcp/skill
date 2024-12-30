"use client"; // Mark this file as a Client Component

import React from "react";
import { usePathname } from "next/navigation"; // Use next/navigation for client-side routing

const Sidebar: React.FC = () => {
  const pathname = usePathname(); // This gets the current path name

  const isActive = (path: string) => {
    return pathname === path ? 'text-white' : 'text-gray-300'; // Check if the current path matches
  };

  return (
    <div className="bg-gray-900 text-white w-64 h-screen flex flex-col py-5 px-4 fixed">
      <div className="text-lg font-bold mb-8">
        <span className="text-purple-500">SideBar</span>
      </div>
      <nav className="flex flex-col gap-4">
        <a href="/" className={`hover:text-white ${isActive("/")}`}>
          Dashboard
        </a>
        <a href="/leaderboard" className={`hover:text-white ${isActive("/leaderboard")}`}>
          Leaderboard
        </a>
        <a href="/jobs" className={`hover:text-white ${isActive("/jobs")}`}>
          Jobs
        </a>
        <a href="/courses" className={`hover:text-white ${isActive("/courses")}`}>
          Courses
        </a>
        <a href="/reports" className={`hover:text-white ${isActive("/reports")}`}>
          Reports
        </a>
      </nav>
    </div>
  );
};

export default Sidebar;

