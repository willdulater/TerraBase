import { useAuth0 } from "@auth0/auth0-react";
import Cookies from "universal-cookie";
import { useState } from "react";
import { toast } from "react-hot-toast";
import "./style.css";

// Importing Icons
import {
  Cog6ToothIcon,
  ArrowLeftOnRectangleIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";

const NavTray = ({ setSelectedMode }) => {
  const { logout } = useAuth0();
  const cookies = new Cookies();

  const clearCookies = async () => {
    cookies.remove("token");
  };

  return (
    <div className="w-full flex flex-col ">
      {/* Divider */}
      

      {/* Navigation Buttons */}
      <div className="flex flex-col space-y-1 px-3">
        {/* Discord Button */}
     {/*   <SidebarButton
          icon="discord-icon.png"
          label="Join Discord"
          onClick={() => window.open("https://discord.gg/c2q3EdQ5Tm")}
          hoverColor="hover:bg-[#7289da]"
          textColor="group-hover:text-white"
        />
        */}


        {/* Logout Button */}
        <SidebarButton
          icon="logout.svg"
          label="Log Out"
          onClick={() => {
            clearCookies().then(() =>
              logout({ returnTo: window.location.origin })
            );
          }}
          hoverColor="hover:bg-red-500"
          textColor="group-hover:text-white"
        />
      </div>

      {/* Extra Bottom Spacing for Consistency */}
      <div className="h-6"></div>
    </div>
  );
};

// Reusable Sidebar Button Component
const SidebarButton = ({ icon, label, onClick, hoverColor, textColor }) => {
  return (
    <div
      className={`flex items-center gap-4 px-4 py-3 w-full rounded-lg cursor-pointer group ${hoverColor || "hover:bg-gray-800"} transition-all duration-300`}
      onClick={onClick}
    >
      <img
        src={icon}
        alt={`${label} Icon`}
        className="w-6 h-6 filter group-hover:brightness-0 group-hover:invert transition-all duration-300"
      />
      <p className={`text-sm ${textColor || "group-hover:text-gray-100"} transition-all duration-300`}>
        {label}
      </p>
    </div>
  );
};

export default NavTray;
