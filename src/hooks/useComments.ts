import fetcher from "@/libs/fetcher";

const useComments = (page = 1, limit = 10, postId: string) => {
  const url = `http://localhost:8000/comment/${postId}?page=${page}&limit=${limit}`;

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

export default useComments;
