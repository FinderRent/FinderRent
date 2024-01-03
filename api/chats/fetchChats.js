import { ADDRESS } from '@env';
import axios from 'axios';

async function fetchChats(ouid) {
  console.log(ouid);
  try {
    const response = await axios.get(
      `http://${ADDRESS}:3000/api/v1/students/${ouid}`
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

export default fetchChats;
