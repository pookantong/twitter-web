import useSWR from "swr";

import fetcher from "@/libs/fetcher";

const useImage = (folder: string, imageName: string) => {
  const { data, error, isLoading, mutate } = useSWR(
    `http://localhost:8000/file/${imageName}?folder=${folder}`,
    fetcher
  );
  return {
    data,
    error,
    isLoading,
    mutate,
  };
};

export default useImage;
