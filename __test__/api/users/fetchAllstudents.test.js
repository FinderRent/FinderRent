import axios from "axios";
import { fetchAllstudents } from "../../../utils/http";

jest.mock("axios");

describe("fetchAllstudents", () => {
  const BACKEND_URL = "https://finder-rent-backend.vercel.app/api/v1";

  beforeEach(() => {
    jest.clearAllMocks(); // Clear mocks before each test
  });

  it("should fetch all students with userType filter and return data when successful", async () => {
    const filter = { userType: "student" };
    const mockData = [{ id: 1, name: "John Doe" }];

    axios.get.mockResolvedValueOnce({
      status: 200,
      data: { data: mockData },
    });

    const result = await fetchAllstudents(filter);

    expect(axios.get).toHaveBeenCalledWith(`${BACKEND_URL}/users`, {
      params: { userType: "student" },
    });
    expect(result).toEqual(mockData);
  });

  it("should throw an error when the response status is not 200", async () => {
    const filter = { userType: "student" };
    const mockErrorResponse = { message: "Error occurred" };

    axios.get.mockResolvedValueOnce({
      status: 400,
      data: { data: mockErrorResponse },
    });

    await expect(fetchAllstudents(filter)).rejects.toThrow("Error occurred");
  });

  it("should throw an error with the error message when the request fails", async () => {
    const filter = { userType: "student" };
    const errorMessage = "Network Error";

    axios.get.mockRejectedValueOnce(new Error(errorMessage));

    await expect(fetchAllstudents(filter)).rejects.toThrow(errorMessage);
  });

  it("should not make an API call when no filter is provided", async () => {
    const result = await fetchAllstudents();

    expect(axios.get).not.toHaveBeenCalled();
    expect(result).toBeUndefined();
  });
});
