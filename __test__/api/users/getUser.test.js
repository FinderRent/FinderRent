import axios from "axios";
import getUser from "../../../api/users/getUser";

jest.mock("axios");

describe("getUser function", () => {
  it("should fetch user data successfully", async () => {
    const mockResponse = {
      status: 200,
      data: {
        id: "mockUserId",
        firstName: "John",
        lastName: "Doe",
        email: "john.doe@example.com",
      },
    };

    const ouid = "mockUserId";
    axios.get.mockResolvedValue(mockResponse);

    const result = await getUser(ouid);

    expect(result).toEqual(mockResponse.data);
  });

  it("should throw an error for non-existent user", async () => {
    const errorMessage = "User not found";

    const mockErrorResponse = {
      response: {
        status: 404,
        data: {
          message: errorMessage,
        },
      },
    };

    const ouid = "nonExistentUserId";
    axios.get.mockRejectedValue(mockErrorResponse);

    try {
      await getUser(ouid);
    } catch (error) {
      expect(error.message).toEqual(errorMessage); // Check the error message property
    }
  });
});
