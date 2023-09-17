import React, { useEffect, useState, useRef } from "react";
import usePosts from "@/hooks/usePosts";
import PostItem from "./PostItem";

interface PostFeedProps {
  username?: string;
}

const PostFeed: React.FC<PostFeedProps> = ({ username }) => {
  const [page, setPage] = useState<number>(1);
  const limit = 10;
  const [posts, setPosts] = useState<Record<string, any>[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  if (!username) {
    username = "";
  }
  const { fetchData } = usePosts(page, limit, username);

  const observer = useRef<IntersectionObserver | null>(null);

  const loadMorePosts = async () => {
    setIsLoading(true);
    try {
      const { data } = await fetchData();
      if (data && data.posts) {
        setPosts([...posts, ...data.posts]);
        setPage(page + 1);
      }
    } catch (error) {
      console.error("Error fetching more posts:", error);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    observer.current = new IntersectionObserver(
      (entries: IntersectionObserverEntry[]) => {
        const firstEntry = entries[0];
        if (firstEntry && firstEntry.isIntersecting) {
          loadMorePosts();
        }
      }
    );

    const loadMoreTrigger = document.querySelector("#load-more-trigger");
    if (loadMoreTrigger && observer.current) {
      observer.current.observe(loadMoreTrigger);
    }

    return () => {
      if (observer.current) {
        observer.current.disconnect();
      }
    };
  }, [page]);

  return (
    <>
      {posts.map((post: Record<string, any>, index: number) => (
        <PostItem key={post.postId} data={post} />
      ))}
      {isLoading && <div>Loading more posts...</div>}
      <div id="load-more-trigger" style={{ height: "10px" }}></div>
    </>
  );
};

export default PostFeed;
