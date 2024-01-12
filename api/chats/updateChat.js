import axios from "axios";
import { ADDRESS } from "@env";

async function updateChat({ messageText: lastMessage, chatId }) {
  if (!lastMessage) {
    lastMessage = "image";
  }

  try {
    const response = await axios.patch(
      `https://${ADDRESS}:3000/api/v1/chats/update/${chatId}`,
      { lastMessage },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const responseData = response.data;

    if (response.status !== 200) {
      throw new Error(responseData.message);
    }

    return responseData;
  } catch (err) {
    throw new Error(err.response?.data?.message);
  }
}

export default updateChat;
