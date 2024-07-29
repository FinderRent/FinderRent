import axios from "axios";

async function getUser(ouid) {
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
    throw new Error(err.response.data.message);
  }
}

export default getUser;
