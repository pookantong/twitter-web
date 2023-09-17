import fetcher from "@/libs/fetcher";

const usePosts = (page = 1, limit = 10, username: string) => {
  const url = `http://localhost:8000/post/?page=${page}&limit=${limit}&username=${username}`;

  const fetchData = async () => {
    try {
      const data = await fetcher(url);
      return { data, error: null, isLoading: false, mutate: null };
    } catch (error) {
      return { data: null, error, isLoading: false, mutate: null };
    }
  };

  return {
    fetchData,
  };
};

export default usePosts;
