import { BiLogOut } from 'react-icons/bi';
import { BsHouseFill, BsBellFill } from 'react-icons/bs';
import { FaUser } from 'react-icons/fa';
import Cookies from "js-cookie";

import useCurrentUser from '@/hooks/useCurrentUser';

import SidebarItem from './SidebarItem';
import SidebarLogo from './SidebarLogo';
import SidebarTweetButton from './SidebarTweetButton';
import { useRouter } from 'next/router';

const Sidebar = () => {
  const { data:  currentUser} = useCurrentUser();
  const router = useRouter();

  const signOut = () => {
    Cookies.remove("authToken");
    window.location.reload();
  }

  const items = [
    {
      icon: BsHouseFill,
      label: 'Home',
      href: '/',
    },
    {
      icon: FaUser,
      label: 'Profile',
      href: `/users/${currentUser?.username}`,
      auth: true,
    },
  ]

  return (
    <div className="col-span-1 h-full pr-4 md:pr-6">
        <div className="flex flex-col items-end">
          <div className="space-y-2 lg:w-[230px]">
            <SidebarLogo />
            {items.map((item) => (
              <SidebarItem
                key={item.href}
                auth={item.auth}
                href={item.href} 
                icon={item.icon} 
                label={item.label}
              />
            ))}
            {currentUser && <SidebarItem onClick={() => signOut()} icon={BiLogOut} label="Logout" />}
            <SidebarTweetButton />
          </div>
        </div>
      </div>
  )
};

export default Sidebar;
