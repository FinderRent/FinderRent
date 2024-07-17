import axios from "axios";

async function updateUser({
  userType,
  avatar,
  firstName,
  lastName,
  age,
  phone,
  academic,
  coordinates,
  department,
  yearbook,
  hobbies,
  funFact,
  email,
  token,
}) {
  try {
    const formData = new FormData();
    formData.append("userType", userType);
    formData.append("firstName", firstName);
    formData.append("lastName", lastName);
    formData.append("age", age);
    formData.append("academic", academic);
    formData.append("coordinates", JSON.stringify(coordinates));
    formData.append("department", department);
    formData.append("yearbook", yearbook);
    formData.append("email", email);

    if (hobbies) {
      formData.append("hobbies", hobbies);
    }
    if (funFact) {
      formData.append("funFact", funFact);
    }
    if (phone) {
      formData.append("phone", phone);
    }
    if (avatar) {
      const localUri = avatar;
      const filename = localUri.split("/").pop();

      const match = /\.(\w+)$/.exec(filename);
      const type = match ? `image/${match[1]}` : "image";

      formData.append("avatar", {
        uri: localUri,
        name: filename,
        type,
      });
    }
    const response = await axios.patch(
      `https://finder-rent-backend.vercel.app/api/v1/users/updateMe`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );

    const responseData = response.data;

    if (response.status !== 200) {
      throw new Error(responseData.message);
    }

    return responseData;
  } catch (err) {
    if (err.response && err.response.data) {
      throw new Error(err.response.data.message);
    } else {
      throw new Error(err.message);
    }
  }
}

export default updateUser;
