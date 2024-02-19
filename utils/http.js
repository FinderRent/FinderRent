import axios from "axios";

// const BACKEND_URL = "http://192.168.1.246:3000/api/v1";
// const BACKEND_URL = "http://172.20.10.3:3000/api/v1";
// const BACKEND_URL = "http://192.168.1.193:3000/api/v1";
const BACKEND_URL = "https://finder-rent-backend.vercel.app/api/v1";

// export function storeAllApartments(apartments) {
//   axios.post(BACKEND_URL + "/apartments", data);
// }

export async function fetchAllApartments() {
  const response = await axios.get(BACKEND_URL + "/apartments");
  return response.data.data;
}
