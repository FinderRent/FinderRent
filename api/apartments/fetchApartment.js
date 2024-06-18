import axios from "axios";

async function fetchApartment(id) {
  try {
    const response = await axios.get(
      `https://finder-rent-backend.vercel.app/api/v1/apartments/${id}`
    );

    const responseData = response.data;

    if (response.status !== 200) {
      throw new Error(responseData.message);
    }

    return responseData;
  } catch (err) {
    throw new Error(err);
  }
}

export default fetchApartment;
