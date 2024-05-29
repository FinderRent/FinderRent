import axios from "axios";

async function fetchAllApartment(apartmentType = null) {
  try {
    const params = {};
    if (apartmentType) {
      params.apartmentType = apartmentType;
    }

    const response = await axios.get(
      `https://finder-rent-backend.vercel.app/api/v1/apartments`,
      { params }
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

export default fetchAllApartment;
