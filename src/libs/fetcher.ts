import axios from "axios";
import Cookies from "js-cookie";

const fetcher = async (url: string) => {
  try {
    const token = Cookies.get("authToken");

    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    throw error;
  }
};

export default fetcher;
