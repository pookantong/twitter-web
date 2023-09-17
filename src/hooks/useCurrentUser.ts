import useSWR from 'swr';

import fetcher from '@/libs/fetcher';

const useCurrentUser = () => {
  const { data, error, isLoading, mutate } = useSWR(
    "http://localhost:8000/user",
    fetcher
  );
  return {
    data,
    error,
    isLoading,
    mutate
  }
};

export default useCurrentUser;
