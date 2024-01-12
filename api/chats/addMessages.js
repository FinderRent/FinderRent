import { ADDRESS } from "@env";

async function addMessages(message) {
  const { senderId, messageText, chatId } = message;
  try {
    const formData = new FormData();

    formData.append("chatId", chatId);
    formData.append("senderId", senderId);
    formData.append("messageText", messageText);

    const response = await fetch(`http://${ADDRESS}:3000/api/v1/messages`, {
      method: "POST",
      body: formData,
    });

    const responseData = await response.json();

    if (!response.ok) {
      throw new Error(responseData.message);
    }
    return responseData;
  } catch (err) {
    console.log(err.message);
    throw new Error(err);
  }
}

export default addMessages;
