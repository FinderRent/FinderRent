import axios from "axios";
import { ADDRESS } from "@env";

async function changePassword({
  token,
  passwordCurrent,
  password,
  passwordConfirm,
}) {
  try {
    const response = await axios.patch(
      `http://${ADDRESS}:3000/api/v1/users/updateMyPassword`,
      {
        passwordCurrent,
        password,
        passwordConfirm,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const responseData = response.data;

    if (!response.status === 200) {
      throw new Error(responseData.message);
    }

    return responseData;
  } catch (err) {
    throw new Error(err.response.data.message);
  }
}

export default changePassword;
