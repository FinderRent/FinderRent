import axios from "axios";

async function newChat({ senderId, receiverId }) {
  console.log(senderId, receiverId);
  try {
    const response = await axios.post(
      `https://finder-rent-backend.vercel.app/api/v1/chats`,
      { senderId, receiverId },
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

export default newChat;
