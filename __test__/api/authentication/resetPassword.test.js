import axios from "axios";
import resetPassword from "../../../api/authentication/resetPassword";

jest.mock("axios");

describe("resetPassword function", () => {
  it("should reset the password successfully", async () => {
    const mockResponse = {
      status: 200,
      data: {
        message: "Password reset successfully",
      },
    };

    axios.patch.mockResolvedValue(mockResponse);

    const requestData = {
      otp: "123456",
      password: "newPassword123",
      passwordConfirm: "newPassword123",
    };

    const result = await resetPassword(requestData);

    expect(result).toEqual(mockResponse.data);
  });

  it("should throw an error for invalid OTP", async () => {
    const errorMessage = "Invalid OTP";

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
      otp: "000000",
      password: "newPassword123",
      passwordConfirm: "newPassword123",
    };

    try {
      await resetPassword(requestData);
    } catch (error) {
      expect(error.message).toEqual(errorMessage);
    }
  });
});
