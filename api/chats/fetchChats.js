import axios from "axios";

async function fetchChats(ouid) {
  try {
    const response = await axios.get(
      `https://finder-rent-backend.vercel.app/api/v1/users/${ouid}`
    );

    const responseData = response.data;

    if (response.status !== 200) {
      throw new Error(responseData.message);
    }

    return responseData;
  } catch (err) {
    if (err.response && err.response.data && err.response.data.message) {
      throw new Error(err.response.data.message);
    }
    throw new Error(err.message);
  }
}

export default fetchChats;
