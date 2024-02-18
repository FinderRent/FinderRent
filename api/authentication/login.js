import axios from "axios";

async function login({ email, password, pushToken }) {
  try {
    const response = await axios.post(
      `https://finder-rent-backend.vercel.app/api/v1/users/login`,
      { email, password, pushToken },
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

export default login;
