import useSWR from "swr";
import fetcher from "@/libs/fetcher";

const useUser = (username: string) => {
  const { data, error } = useSWR(
    username ? `http://localhost:8000/user/${username}` : null,
    fetcher
  );

  return {
    data,
    isLoading: !data && !error,
    error,
  };
};

export default useUser;
