import axios from "axios";
import { ADDRESS } from "@env";

async function getMessages(chatId) {
  try {
    const response = await axios.get(
      `https://${ADDRESS}:3000/api/v1/messages/${chatId}`
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

export default getMessages;
