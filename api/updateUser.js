import axios from 'axios';
import { ADDRESS } from '@env';

async function updateUser({
  userType,
  avatar,
  firstName,
  lastName,
  age,
  phone,
  academic,
  department,
  yearbook,
  email,
  token,
}) {
  try {
    const formData = new FormData();

    formData.append('userType', userType);
    formData.append('firstName', firstName);
    formData.append('lastName', lastName);
    formData.append('age', age);
    formData.append('phone', phone);
    formData.append('academic', academic);
    formData.append('department', department);
    formData.append('yearbook', yearbook);
    formData.append('email', email);

    if (avatar) {
      const localUri = avatar;
      const filename = localUri.split('/').pop();

      const match = /\.(\w+)$/.exec(filename);
      const type = match ? `image/${match[1]}` : 'image';

      formData.append('avatar', {
        uri: localUri,
        name: filename,
        type,
      });
    }

    const response = await axios.patch(
      `http://${ADDRESS}:3000/api/v1/users/updateMe`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
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

export default updateUser;
