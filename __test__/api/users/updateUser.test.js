import axios from "axios";
import updateUser from "../../../api/updateUser";

// Mock Axios for testing
jest.mock("axios");

describe("updateUser function", () => {
  it("should update user profile successfully", async () => {
    const mockResponse = {
      status: 200,
      data: {
        message: "User profile updated successfully",
      },
    };

    const mockFormData = new FormData();
    mockFormData.append("userType", "student");
    mockFormData.append("firstName", "John");
    mockFormData.append("lastName", "Doe");
    mockFormData.append("age", "25");
    mockFormData.append("academic", "academic College");
    mockFormData.append(
      "coordinates",
      JSON.stringify({ lat: 34.2516416588409, lng: 34.78916604217377 })
    );
    mockFormData.append("department", "software");
    mockFormData.append("yearbook", "department");
    mockFormData.append("email", "john.doe@example.com");

    const token = "mockToken";

    axios.patch.mockResolvedValue(mockResponse);

    const result = await updateUser({
      userType: "student",
      firstName: "John",
      lastName: "Doe",
      age: "27",
      academic: "Sami Shamoon College of Engineering - Beer Sheva",
      coordinates: { lat: 31.2516416588409, lng: 34.78916604217377 },
      department: "software",
      yearbook: "Year",
      hobbies: "Reading, Painting",
      funFact: "I enjoy hiking on weekends.",
      email: "john.doe@example.com",
      phone: "1234567890",
      avatar: "/path/to/avatar.jpg",
      token,
    });

    expect(result).toEqual(mockResponse.data);
  });

  it("should throw an error for failed profile update", async () => {
    const errorMessage = "Update failed";

    const mockErrorResponse = {
      response: {
        status: 400,
        data: {
          message: errorMessage,
        },
      },
    };

    const mockFormData = new FormData();
    mockFormData.append("userType", "student");
    mockFormData.append("firstName", "John");
    mockFormData.append("lastName", "Doe");
    mockFormData.append("email", "john.doe@example.com");

    const token = "mockToken";

    axios.patch.mockRejectedValue(mockErrorResponse);

    try {
      await updateUser({
        userType: "student",
        firstName: "John",
        lastName: "Doe",
        email: "john.doe@example.com",
        token,
        formData: mockFormData,
      });
    } catch (error) {
      expect(error.message).toEqual(errorMessage);
    }
  });
});
