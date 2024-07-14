import axios from "axios";
import login from "../../api/authentication/login";

// Mock Axios for testing
jest.mock("axios");

describe("login function", () => {
  it("should login successfully", async () => {
    const mockResponse = {
      status: 200,
      data: {
        token: "mockToken",
        userId: "mockUserId",
      },
    };

    axios.post.mockResolvedValue(mockResponse);

    const loginData = {
      email: "test@example.com",
      password: "password123",
      pushToken: "mockPushToken",
    };

    const result = await login(loginData);

    expect(result).toEqual(mockResponse.data);
  });

  it("should throw an error for unsuccessful login", async () => {
    const errorMessage = "Invalid credentials";

    const mockErrorResponse = {
      response: {
        status: 401,
        data: {
          message: errorMessage,
        },
      },
    };

    axios.post.mockRejectedValue(mockErrorResponse);

    const loginData = {
      email: "test@example.com",
      password: "wrongPassword",
      pushToken: "mockPushToken",
    };

    try {
      await login(loginData);
    } catch (error) {
      expect(error.message).toEqual(errorMessage);
    }
  });
});
