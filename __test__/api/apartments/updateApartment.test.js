import axios from "axios";
import { updateEditedApartment } from "../../../utils/http";

jest.mock("axios");

describe("updateEditedApartment", () => {
  const BACKEND_URL = "https://finder-rent-backend.vercel.app/api/v1";

  beforeEach(() => {
    jest.clearAllMocks(); // Clear mocks before each test
  });

  it("should return updated apartment data when the API call is successful", async () => {
    const apartment = { id: "12345", name: "Test Apartment" };
    const updatedApartmentData = { id: "12345", name: "Updated Apartment" };

    axios.patch.mockResolvedValueOnce({
      data: { data: updatedApartmentData },
    });

    const result = await updateEditedApartment(apartment);

    expect(axios.patch).toHaveBeenCalledWith(
      `${BACKEND_URL}/apartments`,
      apartment
    );
    expect(result).toEqual(updatedApartmentData);
  });

  it("should throw an error when the API call fails", async () => {
    const apartment = { id: "12345", name: "Test Apartment" };
    const errorMessage = "Network Error";

    // Mock console.error to avoid printing in the test output
    const consoleErrorMock = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});

    // Mock a rejected value for axios.patch
    axios.patch.mockRejectedValueOnce(new Error(errorMessage));

    await expect(updateEditedApartment(apartment)).rejects.toThrow(
      errorMessage
    );

    // Check if console.error was called with the correct arguments
    expect(console.error).toHaveBeenCalledWith(
      "Error editing apartment:",
      expect.any(Error)
    );

    // Restore console.error after the test
    consoleErrorMock.mockRestore();
  });
});
