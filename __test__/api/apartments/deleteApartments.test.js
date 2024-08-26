import axios from "axios";
import { deleteApartment } from "../../../utils/http";

jest.mock("axios");

describe("deleteApartment", () => {
  const BACKEND_URL = "https://finder-rent-backend.vercel.app/api/v1"; // Mocked backend URL

  beforeEach(() => {
    jest.clearAllMocks(); // Clear mocks before each test
  });

  it("should return response data when deletion is successful with status 204", async () => {
    const apartmentId = "12345";

    axios.delete.mockResolvedValueOnce({
      status: 204,
      data: { success: true },
    });

    const result = await deleteApartment(apartmentId);

    expect(axios.delete).toHaveBeenCalledWith(
      `${BACKEND_URL}/apartments/${apartmentId}`
    );
    expect(result).toEqual({ success: true });
  });

  it("should throw an error when the response status is not 204", async () => {
    const apartmentId = "12345";

    axios.delete.mockResolvedValueOnce({
      status: 400,
      data: { message: "Bad Request" },
    });

    await expect(deleteApartment(apartmentId)).rejects.toThrow("Bad Request");
  });

  it("should throw an error with the message from the response data", async () => {
    const apartmentId = "12345";

    axios.delete.mockRejectedValueOnce({
      response: {
        data: { message: "Apartment not found" },
      },
    });

    await expect(deleteApartment(apartmentId)).rejects.toThrow(
      "Apartment not found"
    );
  });

  it("should throw an error with a general message if no response message exists", async () => {
    const apartmentId = "12345";

    axios.delete.mockRejectedValueOnce(new Error("Network Error"));

    await expect(deleteApartment(apartmentId)).rejects.toThrow("Network Error");
  });
});
