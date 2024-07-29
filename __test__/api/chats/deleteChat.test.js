import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import deleteChat from "../../../api/chats/deleteChat";

describe("deleteChat", () => {
  let mock;

  beforeEach(() => {
    mock = new MockAdapter(axios);
  });

  afterEach(() => {
    mock.restore();
  });

  it("should delete chat successfully", async () => {
    const chatId = "test-chat-id";

    mock
      .onDelete(`https://finder-rent-backend.vercel.app/api/v1/chats/${chatId}`)
      .reply(204);

    const response = await deleteChat(chatId);

    expect(response).toEqual(undefined);
  });

  it("should throw an error when the status is not 204", async () => {
    const chatId = "test-chat-id";

    const mockData = {
      message: "Error occurred",
    };

    mock
      .onDelete(`https://finder-rent-backend.vercel.app/api/v1/chats/${chatId}`)
      .reply(400, mockData);

    await expect(deleteChat(chatId)).rejects.toThrow("Error occurred");
  });
});
