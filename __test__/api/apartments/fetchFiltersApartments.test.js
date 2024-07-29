import axios from "axios";
import { fetchAllApartments } from "../../../utils/http";

jest.mock("axios");

describe("fetchFiltersApartments function", () => {
  const BACKEND_URL = "https://finder-rent-backend.vercel.app/api/v1";

  it("should fetch apartments with filters", async () => {
    const mockResponse = {
      status: 200,
      data: {
        data: [
          { id: 1, name: "Apartment 1" },
          { id: 2, name: "Apartment 2" },
        ],
      },
    };

    axios.get.mockResolvedValue(mockResponse);

    const filter = {
      coordinates: { lat: 12.34, lng: 56.78 },
      distance: 2.0,
      apartmentType: "studio",
      owner: "owner123",
      sort: "price",
      floor: 3,
      numberOfRooms: 2,
      totalCapacity: 4,
    };

    const result = await fetchAllApartments(filter);

    expect(result).toEqual(mockResponse.data.data);

    // Verify the URL
    expect(axios.get).toHaveBeenCalledWith(
      `${BACKEND_URL}/apartments/apartments-within/${filter.distance}/center/${filter.coordinates.lat},${filter.coordinates.lng}/unit/km`,
      expect.any(Object) // Use expect.any(Object) to focus on params
    );

    // Verify the params object separately
    const axiosCall = axios.get.mock.calls[0];
    expect(axiosCall[1].params).toEqual({
      apartmentType: "studio",
      owner: "owner123",
      sort: "price",
      floor: 3,
      numberOfRooms: 2,
      totalCapacity: 4,
    });
  });
});
