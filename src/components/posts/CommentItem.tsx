import { useRouter } from "next/router";
import { useCallback, useMemo, useState } from "react";
import { AiFillHeart, AiOutlineHeart, AiOutlineMessage } from "react-icons/ai";
import { formatDistanceToNowStrict } from "date-fns";

import useLoginModal from "@/hooks/useLoginModal";

import Avatar from "../Avatar";
import Image from "next/image";
import useLike from "@/hooks/useLike";
interface CommentItemProps {
  data: Record<string, any>;
  username: string
}

const CommentItem: React.FC<CommentItemProps> = ({ data = {}, username }) => {
  const router = useRouter();
  const loginModal = useLoginModal();
  const [hasLiked, setHasLiked] = useState(data.liked);
  const [totalLiked, setTotalLiked] = useState(data.totalLiked);

  const goToUser = useCallback(
    (ev: any) => {
      ev.stopPropagation();
      router.push(`/users/${username}`);
    },
    [router, username]
  );

  const onLike = useCallback(
    async (ev: any) => {
      ev.stopPropagation();
      useLike(data.commentId, !hasLiked, true);
      setHasLiked(!hasLiked);
      if (hasLiked) {
        setTotalLiked(totalLiked - 1);
      } else {
        setTotalLiked(totalLiked + 1);
      }
    },
    [loginModal, hasLiked]
  );

  const LikeIcon = hasLiked ? AiFillHeart : AiOutlineHeart;

  const timePassed = data.timePassed;

  return (
    <div
      className="
        border-b-[1px] 
        border-neutral-800 
        p-5 
        cursor-pointer 
        hover:bg-neutral-900 
        transition
      "
    >
      <div className="flex flex-row items-start gap-3">
        <div className="w-12 h-12">
          <Avatar username={username} />
        </div>
        <div>
          <div className="flex flex-row items-center gap-2">
            <p
              onClick={goToUser}
              className="
                text-white 
                font-semibold 
                cursor-pointer 
                hover:underline
            "
            >
              {data.profileName}
            </p>
            <span
              onClick={goToUser}
              className="
                text-neutral-500
                cursor-pointer
                hover:underline
                hidden
                md:block
            "
            >
              @{data.username}
            </span>
            <span className="text-neutral-500 text-sm">{timePassed}</span>
          </div>
          <div className="text-white mt-1">{data.body}</div>
          <div className="flex-wrap mt-3 gap-3">
            <div className="grid grid-cols-2 gap-3">
              {data.imageUrl.map((url: string, index: number) => (
                <div key={index}>
                  <Image
                    height={480}
                    width={480}
                    alt={""}
                    src={
                      url
                        ? `http://localhost:8000/file/${encodeURIComponent(
                            url
                          )}?folder=comment`
                        : "/images/placeholder.png"
                    }
                  />
                </div>
              ))}
            </div>
          </div>
          <div className="flex flex-row items-center mt-3 gap-10">
            <div
              className="
                flex 
                flex-row 
                items-center 
                text-neutral-500 
                gap-2 
                cursor-pointer 
                transition 
                hover:text-sky-500
            "
            >
              <AiOutlineMessage size={20} />
              <p>{data.totalComment}</p>
            </div>
            <div
              onClick={onLike}
              className="
                flex 
                flex-row 
                items-center 
                text-neutral-500 
                gap-2 
                cursor-pointer 
                transition 
                hover:text-red-500
            "
            >
              <LikeIcon color={hasLiked ? "red" : ""} size={20} />
              <p>{totalLiked}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommentItem;
