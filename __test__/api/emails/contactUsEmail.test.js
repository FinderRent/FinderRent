import axios from "axios";
import contactUsEmail from "../../../api/emails/contactUsEmail";

jest.mock("axios");

describe("contactUsEmail function", () => {
  it("should send the contact us email successfully", async () => {
    const mockResponse = {
      status: 200,
      data: {
        message: "Email sent successfully",
      },
    };

    axios.post.mockResolvedValue(mockResponse);

    const requestData = {
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@example.com",
      subject: "Subject",
      message: "This is a test message.",
    };

    const result = await contactUsEmail(requestData);

    expect(result).toEqual(mockResponse.data);
  });

  it("should throw an error for missing required fields", async () => {
    const errorMessage = "Required fields are missing";

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
      firstName: "",
      lastName: "Doe",
      email: "john.doe@example.com",
      subject: "Subject",
      message: "This is a test message.",
    };

    try {
      await contactUsEmail(requestData);
    } catch (error) {
      expect(error.message).toEqual(errorMessage);
    }
  });
});
