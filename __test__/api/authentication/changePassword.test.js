import axios from "axios";
import changePassword from "../../../api/authentication/changePassword";

// Mock Axios for testing
jest.mock("axios");

describe("changePassword function", () => {
  it("should change the password successfully", async () => {
    const mockResponse = {
      status: 200,
      data: {
        message: "Password updated successfully",
      },
    };

    axios.patch.mockResolvedValue(mockResponse);

    const requestData = {
      token: "mockToken",
      passwordCurrent: "oldPassword123",
      password: "newPassword123",
      passwordConfirm: "newPassword123",
    };

    const result = await changePassword(requestData);

    expect(result).toEqual(mockResponse.data);
  });

  it("should throw an error for invalid current password", async () => {
    const errorMessage = "Incorrect current password";

    const mockErrorResponse = {
      response: {
        status: 400,
        data: {
          message: errorMessage,
        },
      },
    };

    axios.patch.mockRejectedValue(mockErrorResponse);

    const requestData = {
      token: "mockToken",
      passwordCurrent: "wrongPassword",
      password: "newPassword123",
      passwordConfirm: "newPassword123",
    };

    try {
      await changePassword(requestData);
    } catch (error) {
      expect(error.message).toEqual(errorMessage);
    }
  });
});
