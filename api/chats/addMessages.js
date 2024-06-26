import { ADDRESS } from "@env";

async function addMessages(message) {
  const { senderId, messageText, chatId, replyingTo, tempImageUri } = message;

  try {
    const formData = new FormData();

    formData.append("chatId", chatId);
    formData.append("senderId", senderId);
    formData.append("messageText", messageText);

    if (replyingTo) {
      const replyingToJson = JSON.stringify(replyingTo);
      formData.append("replyingTo", replyingToJson);
    }

    if (tempImageUri !== "" || tempImageUri) {
      const localUri = tempImageUri;
      const filename = localUri.split("/").pop();

      const match = /\.(\w+)$/.exec(filename);
      const type = match ? `image/${match[1]}` : "image";

      formData.append("image", {
        uri: localUri,
        name: filename,
        type,
      });
    }

    const response = await fetch(
      `https://finder-rent-backend.vercel.app/api/v1/messages`,
      {
        method: "POST",
        body: formData,
      }
    );

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
