import axios from 'axios';
import { ADDRESS } from '@env';

async function signUp({
  userType,
  firstName,
  lastName,
  age,
  academic,
  department,
  yearbook,
  gender,
  email,
  password,
  passwordConfirm,
}) {
  try {
    const response = await axios.post(
      `https:${ADDRESS}/api/v1/students/signup`,
      {
        userType,
        firstName,
        lastName,
        age,
        academic,
        department,
        yearbook,
        gender,
        email,
        password,
        passwordConfirm,
      },
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
