import axios from "axios";
import signUp from "../../../api/authentication/signUp";

// Mock Axios for testing
jest.mock("axios");

describe("signUp function", () => {
  it("should sign up a student successfully", async () => {
    const mockResponse = {
      status: 200,
      data: {
        token: "mockToken",
        userId: "mockUserId",
      },
    };

    axios.post.mockResolvedValue(mockResponse);

    const studentData = {
      academic: "academic College",
      age: "26",
      coordinates: { lat: 67.2516416588409, lng: 33.78916604217377 },
      department: "department",
      email: "test@example.com",
      firstName: "first",
      gender: "Male",
      lastName: "last",
      password: "password123",
      passwordConfirm: "password123",
      pushToken: "mockPushToken",
      userType: "student",
      yearbook: "Year",
    };

    const result = await signUp(studentData);

    expect(result).toEqual(mockResponse.data);
  });

  it("should sign up a landlord successfully", async () => {
    const mockResponse = {
      status: 200,
      data: {
        token: "mockToken",
        userId: "mockUserId",
      },
    };

    axios.post.mockResolvedValue(mockResponse);

    const landlordData = {
      age: "55",
      email: "test@example.com",
      firstName: "first",
      gender: "Male",
      lastName: "last",
      password: "password123",
      passwordConfirm: "password123",
      pushToken: "mockPushToken",
      userType: "landlord",
    };

    const result = await signUp(landlordData);

    expect(result).toEqual(mockResponse.data);
  });

  it("should throw an error for unsuccessful sign-up", async () => {
    const errorMessage = "User already exists";

    const mockErrorResponse = {
      response: {
        status: 400,
        data: {
          message: errorMessage,
        },
      },
    };

    axios.post.mockRejectedValue(mockErrorResponse);

    const studentData = {
      academic: "Sami Shamoon College of Engineering - Beer Sheva",
      age: "25",
      coordinates: { lat: 65.2516416588409, lng: 32.78916604217377 },
      department: "software",
      email: "test@gmail.com",
      firstName: "maor",
      gender: "Male",
      lastName: "saadia",
      password: "123456",
      passwordConfirm: "123456",
      pushToken: "ExponentPushToken[Paz3mIKE0iTaGI5n6D6GvX]",
      userType: "student",
      yearbook: "Year 3",
    };

    try {
      await signUp(studentData);
    } catch (error) {
      expect(error.message).toEqual(errorMessage);
    }
  });

  it("should throw an error for unsuccessful sign-up for landlord", async () => {
    const errorMessage = "User already exists";

    const mockErrorResponse = {
      response: {
        status: 400,
        data: {
          message: errorMessage,
        },
      },
    };

    axios.post.mockRejectedValue(mockErrorResponse);

    const landlordData = {
      academic: "",
      age: "55",
      coordinates: "",
      department: "",
      email: "land@gmail.com",
      firstName: "maor",
      gender: "Male",
      lastName: "land",
      password: "123456",
      passwordConfirm: "123456",
      pushToken: "ExponentPushToken[Paz3mIKE0iTaGI5n6D6GvX]",
      userType: "landlord",
      yearbook: "",
    };

    try {
      await signUp(landlordData);
    } catch (error) {
      expect(error.message).toEqual(errorMessage);
    }
  });
});
