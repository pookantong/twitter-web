import { useCallback, useEffect, useMemo, useState } from "react";
import { BiCalendar } from "react-icons/bi";
import { format } from "date-fns";
import useCurrentUser from "@/hooks/useCurrentUser";
import useUser from "@/hooks/useUser";
import useEditModal from "@/hooks/useEditModal";
import Button from "../Button";
import toast from "react-hot-toast";
import fetcherPatch from "@/libs/fetcherPatch";

interface UserBioProps {
  username: string;
}

const UserBio: React.FC<UserBioProps> = ({ username }) => {
  const { data: currentUser } = useCurrentUser();
  const { data: fetchedUser } = useUser(username);
  const [isFollowing, setIsFollowing] = useState(
    fetchedUser?.isFollow ?? false
  );

  useEffect(() => {
    setIsFollowing(fetchedUser?.isFollow ?? false);
  }, [fetchedUser]);

  const editModal = useEditModal();

  const onFollow = useCallback(async () => {
    try {
      const url = `http://localhost:8000/user/${username}?followStatus=${!isFollowing}`;
      await fetcherPatch(url);
      setIsFollowing(!isFollowing);
      if (isFollowing) {
        fetchedUser.totalFollower -= 1;
      } else {
        fetchedUser.totalFollower += 1;
      }
      toast.success(isFollowing ? "Unfollowed" : "Followed");
    } catch (error) {
      toast.error("Something went wrong");
      setIsFollowing(isFollowing);
    }
  }, [username, isFollowing]);

  const createdAt = useMemo(() => {
    if (!fetchedUser?.joinAt) {
      return null;
    }
    return format(new Date(fetchedUser.joinAt), "MMMM yyyy");
  }, [fetchedUser?.joinAt]);

  return (
    <div className="border-b-[1px] border-neutral-800 pb-4">
      <div className="flex justify-end p-2">
        {currentUser?.username === username ? (
          <Button secondary label="Edit" onClick={editModal.onOpen} />
        ) : (
          <Button
            onClick={onFollow}
            label={isFollowing ? "Unfollow" : "Follow"}
            secondary={!isFollowing}
            outline={isFollowing}
          />
        )}
      </div>
      <div className="mt-8 px-4">
        <div className="flex flex-col">
          <p className="text-white text-2xl font-semibold">
            {fetchedUser?.profileName}
          </p>
          <p className="text-md text-neutral-500">@{fetchedUser?.username}</p>
        </div>
        <div className="flex flex-col mt-4">
          <p className="text-white">{fetchedUser?.bio}</p>
          <div className="flex flex-row items-center gap-2 mt-4 text-neutral-500">
            <BiCalendar size={24} />
            <p>Joined {createdAt}</p>
          </div>
        </div>
        <div className="flex flex-row items-center mt-4 gap-6">
          <div className="flex flex-row items-center gap-1">
            <p className="text-white">{fetchedUser?.totalFollowing}</p>
            <p className="text-neutral-500">Following</p>
          </div>
          <div className="flex flex-row items-center gap-1">
            <p className="text-white">{fetchedUser?.totalFollower || 0}</p>
            <p className="text-neutral-500">Followers</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserBio;
