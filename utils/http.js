import axios from "axios";

// const BACKEND_URL = "http://10.0.0.53:3000/api/v1";
// const BACKEND_URL = "http://192.168.1.246:3000/api/v1";
// const BACKEND_URL = "http://172.20.10.3:3000/api/v1";
// const BACKEND_URL = "http://192.168.1.193:3000/api/v1";
// const BACKEND_URL = "http://192.168.134.87:3000/api/v1";
const BACKEND_URL = "https://finder-rent-backend.vercel.app/api/v1";

// export function storeAllApartments(apartments) {
//   axios.post(BACKEND_URL + "/apartments", data);
// }

export async function fetchAllApartments() {
  const response = await axios.get(BACKEND_URL + "/apartments");
  return response.data.data;
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
