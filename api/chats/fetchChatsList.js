import axios from "axios";
import { ADDRESS } from "@env";

async function fetchChatsList(id) {
  try {
    const response = await axios.get(
      `http://${ADDRESS}:3000/api/v1/chats/${id}`
    );

    const responseData = response.data;

    if (response.status !== 200) {
      throw new Error(responseData.message);
    }

    return responseData;
  } catch (err) {
    throw new Error(err);
  }
}

export default fetchChatsList;
