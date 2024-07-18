import axios from "axios";
import fetchChatsList from "../../../api/chats/fetchChatsList";
import MockAdapter from "axios-mock-adapter";

describe("fetchChatsList", () => {
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

  it("should fetch chat data successfully", async () => {
    const id = "test-id";
    const mockData = { success: true, data: "Mock Data" };

    mock
      .onGet(`https://finder-rent-backend.vercel.app/api/v1/chats/${id}`)
      .reply(200, mockData);

    const result = await fetchChatsList(id);

    expect(result).toEqual(mockData);
  });

  it("should throw an error when the status is not 200", async () => {
    const id = "test-id";
    const mockData = { message: "Error occurred" };

    mock
      .onGet(`https://finder-rent-backend.vercel.app/api/v1/chats/${id}`)
      .reply(400, mockData);

    await expect(fetchChatsList(id)).rejects.toThrow("Error occurred");
  });
});
