import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import contactUsEmail from "../../../api/emails/contactUsEmail";

describe("contactUsEmail", () => {
  let mock;

  beforeEach(() => {
    mock = new MockAdapter(axios);
  });

  afterEach(() => {
    mock.restore();
  });

  it("should send contact us email successfully", async () => {
    const formData = {
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@example.com",
      subject: "Test Subject",
      message: "Test Message",
    };

    const mockResponse = {
      message: "Email sent successfully",
    };

    mock
      .onPost("https://finder-rent-backend.vercel.app/api/v1/users/contactUs")
      .reply(200, mockResponse);

    const response = await contactUsEmail(formData);

    expect(response).toEqual(mockResponse);
  });

  it("should throw an error when the status is not 200", async () => {
    const formData = {
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@example.com",
      subject: "Test Subject",
      message: "Test Message",
    };

    const mockError = {
      message: "Error occurred",
    };

    mock
      .onPost("https://finder-rent-backend.vercel.app/api/v1/users/contactUs")
      .reply(400, mockError);

    await expect(contactUsEmail(formData)).rejects.toThrow("Error occurred");
  });

  it("should throw an error when there is no response data", async () => {
    const formData = {
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@example.com",
      subject: "Test Subject",
      message: "Test Message",
    };

    mock
      .onPost("https://finder-rent-backend.vercel.app/api/v1/users/contactUs")
      .networkError();

    await expect(contactUsEmail(formData)).rejects.toThrow();
  });
});
