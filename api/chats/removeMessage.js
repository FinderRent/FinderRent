import axios from "axios";
import { ADDRESS } from "@env";

async function removeMessage(messageId) {
  try {
    const response = await axios.delete(
      `http://${ADDRESS}:3000/api/v1/messages/${messageId}`
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
