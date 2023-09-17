import useSWR from 'swr';

import fetcher from '@/libs/fetcher';

const usePost = (postId: string) => {
  const { data, error, isLoading, mutate } = useSWR(
    postId ? `http://localhost:8000/post/${postId}` : null,
    fetcher
  );

  return {
    data,
    error,
    isLoading,
    mutate
  }
};

export default usePost;
