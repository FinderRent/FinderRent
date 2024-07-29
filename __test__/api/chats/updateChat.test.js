import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import updateChat from "../../../api/chats/updateChat";

describe("updateChat", () => {
  let mock;

  beforeAll(() => {
    mock = new MockAdapter(axios);
  });

  afterEach(() => {
    mock.reset();
  });

  afterAll(() => {
    mock.restore();
  });

  it("should update a chat successfully", async () => {
    const mockData = { success: true, data: "Chat updated" };
    const chatId = "chat-id";
    const messageText = "New message";

    mock
      .onPatch(
        `https://finder-rent-backend.vercel.app/api/v1/chats/update/${chatId}`
      )
      .reply(200, mockData);

    const result = await updateChat({ chatId, messageText });

    expect(result).toEqual(mockData);
  });

  it("should handle default message when messageText is empty", async () => {
    const mockData = { success: true, data: "Chat updated" };
    const chatId = "chat-id";

    mock
      .onPatch(
        `https://finder-rent-backend.vercel.app/api/v1/chats/update/${chatId}`
      )
      .reply(200, mockData);

    const result = await updateChat({ chatId });

    expect(result).toEqual(mockData);
  });

  it("should throw an error when the status is not 200", async () => {
    const mockData = { message: "Error occurred" };
    const chatId = "chat-id";
    const messageText = "New message";

    mock
      .onPatch(
        `https://finder-rent-backend.vercel.app/api/v1/chats/update/${chatId}`
      )
      .reply(400, mockData);

    await expect(updateChat({ chatId, messageText })).rejects.toThrow(
      "Error occurred"
    );
  });
});
