import axios from "axios";

// const BACKEND_URL = "http://10.0.0.53:3000/api/v1";
const BACKEND_URL = "http://192.168.1.246:3000/api/v1";
// const BACKEND_URL = "http://172.20.10.3:3000/api/v1";
// const BACKEND_URL = "http://192.168.1.193:3000/api/v1";
// const BACKEND_URL = "http://192.168.134.87:3000/api/v1";
// const BACKEND_URL = "http://192.168.1.214:3000/api/v1";
// const BACKEND_URL = "http://10.100.102.96:3000/api/v1";
// const BACKEND_URL = "https://finder-rent-backend.vercel.app/api/v1";

export async function fetchAllApartments(filter) {
  // console.log("req", filter);

  const { lat, lng } = filter.coordinates || {};
  const distance = filter.distance || 1.0;

  const url = filter.coordinates
    ? `/apartments/apartments-within/${distance}/center/${lat},${lng}/unit/km`
    : "/apartments";

  try {
    const params = {};
    if (filter) {
      if (filter.apartmentType) {
        params.apartmentType = filter.apartmentType;
      }
      if (filter.owner) {
        params.owner = filter.owner;
      }
      if (filter.sort) {
        params.sort = filter.sort;
      }
      if (filter.floor) {
        params.floor = filter.floor;
      }
      if (filter.numberOfRooms) {
        params.numberOfRooms = filter.numberOfRooms;
      }
      if (filter.totalCapacity) {
        params.totalCapacity = filter.totalCapacity;
      }
    }

    const response = await axios.get(BACKEND_URL + url, { params });

    const responseData = response.data.data;

    if (response.status !== 200) {
      throw new Error(responseData.message);
    }

    return responseData;
  } catch (err) {
    throw new Error(err.message);
  }
}

export async function getDistances(coordinates) {
  const { lat, lng } = coordinates || {};
  try {
    const response = await axios.get(
      BACKEND_URL + `/apartments/distances/${lat},${lng}/unit/km`
    );

    const responseData = response.data.data;

    if (response.status !== 200) {
      throw new Error(responseData.message);
    }

    return responseData;
  } catch (err) {
    throw new Error(err.message);
  }
}

////////
export async function fetchAllstudents(filter) {
  try {
    const params = {};
    if (filter) {
      if (filter.userType) {
        params.userType = filter.userType;
      }

      const response = await axios.get(BACKEND_URL + "/users", { params });

      const responseData = response.data.data;

      if (response.status !== 200) {
        throw new Error(responseData.message);
      }

      return responseData;
    }
  } catch (err) {
    throw new Error(err.message);
  }
}

export async function fetchUser(userID) {
  const response = await axios.get(BACKEND_URL + `/users/${userID}`);
  return response.data.data;
}

export async function addFavourite(apartmentID, userID) {
  const dataForApartment = {
    userID: userID,
    action: "add",
  };

  const dataForUser = {
    apartmentID: apartmentID,
    action: "add",
  };

  const response1 = await axios.patch(
    BACKEND_URL + `/apartments/${apartmentID}`,
    dataForApartment
  );

  const response2 = await axios.patch(
    BACKEND_URL + `/users/${userID}`,
    dataForUser
  );

  return true;
}

export async function removeFavourite(apartmentID, userID) {
  const dataForApartment = {
    userID: userID,
    action: "remove",
  };

  const dataForUser = {
    apartmentID: apartmentID,
    action: "remove",
  };
  const response1 = await axios.patch(
    BACKEND_URL + `/apartments/${apartmentID}`,
    dataForApartment
  );

  const response2 = await axios.patch(
    BACKEND_URL + `/users/${userID}`,
    dataForUser
  );
  return true;
}

export async function checkIfFavourite(apartmentID, userID) {
  const response = await axios.get(
    BACKEND_URL + `/apartments/${apartmentID}/${userID}`
  );
  return response.data.data;
}

export async function addApartment(apartment) {
  try {
    const response = await axios.post(BACKEND_URL + `/apartments`, apartment, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    const responseData = response.data.data;

    if (response.status !== 201) {
      throw new Error(responseData.message);
    }

    return responseData;
  } catch (err) {
    throw new Error(err.response.data.message);
  }
}

export async function updateEditedApartment(apartment) {
  try {
    const response = await axios.patch(BACKEND_URL + `/apartments`, apartment);
    return response.data.data;
  } catch (error) {
    console.error("Error editing apartment:", error);
    throw error;
  }
}
