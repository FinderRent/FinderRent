import axios from "axios";

async function removeMessage(messageId) {
  try {
    const response = await axios.delete(
      `https://finder-rent-backend.vercel.app/api/v1/messages/${messageId}`
    );

    const responseData = response.data;

    if (!response.status === 200) {
      throw new Error(responseData.message);
    }

    return responseData;
  } catch (err) {
    throw new Error(err);
  }
}

export default removeMessage;
