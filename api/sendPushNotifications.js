// import axios from "axios";

async function sendPushNotification(pushToken, message, title) {
  await fetch("https://exp.host/--/api/v2/push/send", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      to: pushToken,
      title: title,
      body: message,
    }),
  });
}

export default sendPushNotification;
