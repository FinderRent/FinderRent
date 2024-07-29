import axios from "axios";
import fetchAllApartment from "../../../api/apartments/fetchAllApartments";
// import fetchAllApartment from "../../../api/apartments/fetchAllApartment"; // Adjust the import path as needed

jest.mock("axios");

describe("fetchAllApartment function", () => {
  it("should fetch apartment data successfully", async () => {
    const mockResponse = {
      status: 200,
      data: [
        {
          id: "1",
          name: "Apartment 1",
          location: "Location 1",
        },
        {
          id: "2",
          name: "Apartment 2",
          location: "Location 2",
        },
      ],
    };

    axios.get.mockResolvedValue(mockResponse);

    const result = await fetchAllApartment();

    expect(result).toEqual(mockResponse.data);
  });

  it("should throw an error for a failed request", async () => {
    const errorMessage = "Request failed with status code 404";

    const mockErrorResponse = {
      response: {
        status: 404,
        data: {
          message: errorMessage,
        },
      },
    };

    axios.get.mockRejectedValue(mockErrorResponse);

    try {
      await fetchAllApartment();
    } catch (error) {
      expect(error.message).toEqual(errorMessage);
    }
  });

  it("should throw an error for a non-200 status code", async () => {
    const mockResponse = {
      status: 500,
      data: {
        message: "Internal Server Error",
      },
    };

    axios.get.mockResolvedValue(mockResponse);

    try {
      await fetchAllApartment();
    } catch (error) {
      expect(error.message).toEqual("Internal Server Error");
    }
  });

  it("should throw an error for a network error", async () => {
    const errorMessage = "Network Error";

    axios.get.mockRejectedValue(new Error(errorMessage));

    try {
      await fetchAllApartment();
    } catch (error) {
      expect(error.message).toEqual(errorMessage);
    }
  });
});
