import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import getMessages from "../../../api/chats/getMessages";

describe("getMessages", () => {
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

  it("should fetch messages data successfully", async () => {
    const chatId = "test-chat-id";
    const mockData = { success: true, data: "Mock Data" };

    mock
      .onGet(`https://finder-rent-backend.vercel.app/api/v1/messages/${chatId}`)
      .reply(200, mockData);

    const result = await getMessages(chatId);

    expect(result).toEqual(mockData);
  });

  it("should throw an error when the status is not 200", async () => {
    const chatId = "test-chat-id";
    const mockData = { message: "Error occurred" };

    mock
      .onGet(`https://finder-rent-backend.vercel.app/api/v1/messages/${chatId}`)
      .reply(400, mockData);

    await expect(getMessages(chatId)).rejects.toThrow("Error occurred");
  });
});
