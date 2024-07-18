import axios from "axios";

async function deleteChat(chatId) {
  try {
    const response = await axios.delete(
      // `https://finder-rent-backend.vercel.app/api/v1/chats/${chatId}`
      `http://192.168.1.214:3000/api/v1/chats/${chatId}`
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

export default deleteChat;
