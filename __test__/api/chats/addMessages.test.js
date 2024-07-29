import addMessages from "../../../api/chats/addMessages";

// Mock FormData
global.FormData = class {
  constructor() {
    this.data = [];
  }
  append(key, value) {
    this.data.push([key, value]);
  }
};

// Mock fetch
global.fetch = jest.fn();

describe("addMessages", () => {
  const mockMessage = {
    senderId: "123",
    messageText: "Hello",
    chatId: "456",
    replyingTo: { id: "789", text: "Previous message" },
    tempImageUri: "file:///path/to/image.jpg",
  };

  const mockResponse = {
    ok: true,
    json: async () => ({ success: true, data: "Mock Data" }),
  };

  beforeEach(() => {
    fetch.mockClear();
  });

  it("should send the correct form data and return the response data", async () => {
    fetch.mockResolvedValueOnce(mockResponse);

    const result = await addMessages(mockMessage);

    // Check that fetch was called with the correct URL and options
    expect(fetch).toHaveBeenCalledWith(
      "https://finder-rent-backend.vercel.app/api/v1/messages",
      expect.objectContaining({
        method: "POST",
        body: expect.any(FormData),
      })
    );

    // Verify form data
    const formData = fetch.mock.calls[0][1].body;
    expect(formData.data).toContainEqual(["chatId", "456"]);
    expect(formData.data).toContainEqual(["senderId", "123"]);
    expect(formData.data).toContainEqual(["messageText", "Hello"]);
    expect(formData.data).toContainEqual([
      "replyingTo",
      JSON.stringify({ id: "789", text: "Previous message" }),
    ]);
    expect(formData.data).toContainEqual([
      "image",
      expect.objectContaining({
        uri: "file:///path/to/image.jpg",
        name: "image.jpg",
        type: "image/jpg",
      }),
    ]);

    // Check the response
    expect(result).toEqual({ success: true, data: "Mock Data" });
  });

  it("should throw an error if the response is not ok", async () => {
    const errorResponse = {
      ok: false,
      json: async () => ({ message: "Error occurred" }),
    };

    fetch.mockResolvedValueOnce(errorResponse);

    await expect(addMessages(mockMessage)).rejects.toThrow("Error occurred");
  });

  it("should handle empty tempImageUri correctly", async () => {
    fetch.mockResolvedValueOnce(mockResponse);

    const messageWithoutImage = {
      ...mockMessage,
      tempImageUri: "",
    };

    const result = await addMessages(messageWithoutImage);

    const formData = fetch.mock.calls[0][1].body;
    expect(formData.data).not.toContainEqual(["image", expect.any(Object)]);

    expect(result).toEqual({ success: true, data: "Mock Data" });
  });

  it("should handle missing replyingTo correctly", async () => {
    fetch.mockResolvedValueOnce(mockResponse);

    const messageWithoutReplyingTo = {
      ...mockMessage,
      replyingTo: null,
    };

    const result = await addMessages(messageWithoutReplyingTo);

    const formData = fetch.mock.calls[0][1].body;
    expect(formData.data).not.toContainEqual([
      "replyingTo",
      expect.any(Object),
    ]);

    expect(result).toEqual({ success: true, data: "Mock Data" });
  });
});
