import axios from "axios";
import Cookies from "js-cookie";

const fetcherPatch = async (url: string, body?: any) => {
  try {
    const token = Cookies.get("authToken");

    const response = await axios.patch(url, body, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    throw error;
  }
};

export default fetcherPatch;
