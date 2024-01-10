import axios from "axios";
import { ADDRESS } from "@env";

async function resetPassword({ otp, password, passwordConfirm }) {
  try {
    const response = await axios.patch(
      `http://${ADDRESS}:3000/api/v1/users/resetPassword`,
      { otp, password, passwordConfirm },
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
    throw new Error(err.response.data.message);
  }
}

export default resetPassword;
