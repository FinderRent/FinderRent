import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import newChat from "../../../api/chats/newChat";

describe("newChat", () => {
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

  it("should create a new chat successfully", async () => {
    const mockData = { success: true, data: "Mock Data" };
    const senderId = "sender-id";
    const receiverId = "receiver-id";

    mock
      .onPost(`https://finder-rent-backend.vercel.app/api/v1/chats`)
      .reply(200, mockData);

    const result = await newChat({ senderId, receiverId });

    expect(result).toEqual(mockData);
  });

  it("should throw an error when the status is not 200", async () => {
    const mockData = { message: "Error occurred" };
    const senderId = "sender-id";
    const receiverId = "receiver-id";

    mock
      .onPost(`https://finder-rent-backend.vercel.app/api/v1/chats`)
      .reply(400, mockData);

    await expect(newChat({ senderId, receiverId })).rejects.toThrow(
      "Error occurred"
    );
  });
});
