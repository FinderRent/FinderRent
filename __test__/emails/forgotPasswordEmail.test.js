import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import forgotPasswordEmail from "../../api/emails/forgotPasswordEmail";

describe("forgotPasswordEmail", () => {
  let mock;

  beforeEach(() => {
    mock = new MockAdapter(axios);
  });

  afterEach(() => {
    mock.restore();
  });

  it("should send forgot password email successfully", async () => {
    const emailData = {
      email: "john.doe@example.com",
    };

    const mockResponse = {
      message: "Password reset link sent successfully",
    };

    mock
      .onPost(
        "https://finder-rent-backend.vercel.app/api/v1/users/forgotPassword"
      )
      .reply(200, mockResponse);

    const response = await forgotPasswordEmail(emailData);

    expect(response).toEqual(mockResponse);
  });

  it("should throw an error when the status is not 200", async () => {
    const emailData = {
      email: "john.doe@example.com",
    };

    const mockError = {
      message: "Error occurred",
    };

    mock
      .onPost(
        "https://finder-rent-backend.vercel.app/api/v1/users/forgotPassword"
      )
      .reply(400, mockError);

    await expect(forgotPasswordEmail(emailData)).rejects.toThrow(
      "Error occurred"
    );
  });

  it("should throw an error when there is no response data", async () => {
    const emailData = {
      email: "john.doe@example.com",
    };

    mock
      .onPost(
        "https://finder-rent-backend.vercel.app/api/v1/users/forgotPassword"
      )
      .networkError();

    await expect(forgotPasswordEmail(emailData)).rejects.toThrow();
  });
});
