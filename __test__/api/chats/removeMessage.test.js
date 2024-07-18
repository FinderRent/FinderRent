import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import removeMessage from "../../../api/chats/removeMessage";

describe("removeMessage", () => {
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

  it("should remove a message successfully", async () => {
    const mockData = { success: true, data: "Message removed" };
    const messageId = "message-id";

    mock
      .onDelete(
        `https://finder-rent-backend.vercel.app/api/v1/messages/${messageId}`
      )
      .reply(204, mockData);

    const result = await removeMessage(messageId);

    expect(result).toEqual(mockData);
  });

  it("should throw an error when the status is not 200", async () => {
    const mockData = { message: "Error occurred" };
    const messageId = "message-id";

    mock
      .onDelete(
        `https://finder-rent-backend.vercel.app/api/v1/messages/${messageId}`
      )
      .reply(400, mockData);

    await expect(removeMessage(messageId)).rejects.toThrow("Error occurred");
  });
});
