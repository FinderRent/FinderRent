import axios from "axios";

async function forgotPasswordEmail({ email }) {
  try {
    const response = await axios.post(
      `https://finder-rent-backend.vercel.app/api/v1/users/forgotPassword`,
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

export default forgotPasswordEmail;
