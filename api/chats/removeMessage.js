import axios from "axios";

async function removeMessage(messageId) {
  try {
    const response = await axios.delete(
      `https://finder-rent-backend.vercel.app/api/v1/messages/${messageId}`
    );

    const responseData = response.data;

    if (response.status !== 204) {
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

export default removeMessage;
