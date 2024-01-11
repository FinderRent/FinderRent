import axios from "axios";
import { ADDRESS } from "@env";

async function sendEmail({ email }) {
  console.log(ADDRESS);
  try {
    const response = await axios.post(
      `http://${ADDRESS}:3000/api/v1/users/forgotPassword`,
      { email },
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

export default sendEmail;
