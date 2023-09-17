import fetcher from "@/libs/fetcher";
import fetcherPatch from "@/libs/fetcherPatch";
import { useEffect, useState } from "react";

const useLike = (id: string, hasLiked: boolean, isComment?: boolean) => {
  const url = `http://localhost:8000/${
    isComment ? "comment" : "post"
  }/${id}?liked=${hasLiked}`;
  fetcherPatch(url);
};

export default useLike;
