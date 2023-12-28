import axios from 'axios';
import { ADDRESS } from '@env';

async function signUp(userData) {
  let { userType } = userData;

  // if the user didn't provide is rule make it landord
  // than the backend will handle this error because the api should have a userType to know where to send the req
  if (userType === '') {
    userType = 'landlord';
  }
  try {
    const response = await axios.post(
      `http://${ADDRESS}:3000/api/v1/${userType}s/signup`,
      userData,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
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

export default signUp;
