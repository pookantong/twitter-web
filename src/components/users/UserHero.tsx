import Image from "next/image";

import useUser from "@/hooks/useUser";

import Avatar from "../Avatar"

interface UserHeroProps {
  username: string;
}

const UserHero: React.FC<UserHeroProps> = ({ username }) => {
  const { data: fetchedUser } = useUser(username);

  return ( 
    <div>
      <div className="bg-neutral-700 h-44 relative">
        {fetchedUser?.coverImageName && (
          <Image src={`http://localhost:8000/file/${encodeURIComponent(
                fetchedUser.coverImageName
              )}?folder=profile`} fill alt="Cover Image" style={{ objectFit: 'cover' }}/>
        )}
        <div className="absolute -bottom-16 left-4">
          <Avatar username={username} isLarge hasBorder />
        </div>
      </div>
    </div>
   );
}
 
export default UserHero;