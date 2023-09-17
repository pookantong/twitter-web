import { useEffect, useRef, useState } from 'react';
import CommentItem from './CommentItem';
import useComments from '@/hooks/useComments';

interface CommentFeedProps {
  postId: string;
}

const CommentFeed: React.FC<CommentFeedProps> = ({ postId }) => {
  const [page, setPage] = useState<number>(1);
  const limit = 10;
  const [comments, setComments] = useState<Record<string, any>[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { fetchData } = useComments(page, limit, postId);

  const observer = useRef<IntersectionObserver | null>(null);

  const loadMoreComments = async () => {
    setIsLoading(true);
    try {
      const { data } = await fetchData();
      if (data && data.comments) {
        setComments([...comments, ...data.comments]);
        setPage(page + 1);
      }
    } catch (error) {
      console.error("Error fetching more commsents:", error);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    observer.current = new IntersectionObserver(
      (entries: IntersectionObserverEntry[]) => {
        const firstEntry = entries[0];
        if (firstEntry && firstEntry.isIntersecting) {
          loadMoreComments();
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
      {comments.map((comment: Record<string, any>) => (
        <CommentItem key={comment.id} data={comment} username={comment.username}/>
      ))}
      {isLoading && <div>Loading more comments...</div>}
      <div id="load-more-trigger" style={{ height: "10px" }}></div>
    </>
  );
};

export default CommentFeed;
