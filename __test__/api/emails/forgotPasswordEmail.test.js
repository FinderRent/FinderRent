import axios from "axios";
import forgotPasswordEmail from "../../../api/emails/forgotPasswordEmail";

jest.mock("axios");

describe("forgotPasswordEmail function", () => {
  it("should send the forgot password email successfully", async () => {
    const mockResponse = {
      status: 200,
      data: {
        message: "Email sent successfully",
      },
    };

    axios.post.mockResolvedValue(mockResponse);

    const requestData = {
      email: "john.doe@example.com",
    };

    const result = await forgotPasswordEmail(requestData);

    expect(result).toEqual(mockResponse.data);
  });

  it("should throw an error for an invalid email", async () => {
    const errorMessage = "Invalid email address";

    const mockErrorResponse = {
      response: {
        status: 400,
        data: {
          message: errorMessage,
        },
      },
    };

    axios.post.mockRejectedValue(mockErrorResponse);

    const requestData = {
      email: "invalid-email",
    };

    try {
      await forgotPasswordEmail(requestData);
    } catch (error) {
      expect(error.message).toEqual(errorMessage);
    }
  });
});
