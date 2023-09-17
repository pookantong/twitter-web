import Image from "next/image";
import { useRouter } from "next/router";
import { useCallback } from "react";

import useUser from "@/hooks/useUser";
import profilePic from "/src/public/images/placeholder.png";

interface AvatarProps {
  username: string;
  isLarge?: boolean;
  hasBorder?: boolean;
}

const Avatar: React.FC<AvatarProps> = ({ username, isLarge, hasBorder }) => {
  const router = useRouter();

  const { data: fetchedUser } = useUser(username);

  const onClick = useCallback(
    (event: any) => {
      event.stopPropagation();
      const url = `/users/${username}`;
      router.push(url);
    },
    [router, username]
  );

  return (
    <div
      className={`
        ${hasBorder ? "border-4 border-black" : ""}
        ${isLarge ? "h-32" : "h-12"}
        ${isLarge ? "w-32" : "w-12"}
        rounded-full 
        hover:opacity-90 
        transition 
        cursor-pointer
        relative
      `}
    >
      <Image
        fill
        style={{
          objectFit: "cover",
          borderRadius: "100%",
        }}
        alt={fetchedUser ? fetchedUser.name : null}
        onClick={onClick}
        src={
          fetchedUser?.profilePictureName
            ? `http://localhost:8000/file/${encodeURIComponent(
                fetchedUser.profilePictureName
              )}?folder=profile`
            : profilePic
        }
      />
    </div>
  );
};

export default Avatar;
