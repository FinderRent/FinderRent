import axios from "axios";
import MockAdapter from "axios-mock-adapter";

import fetchChats from "../../../api/chats/fetchChats";

describe("fetchChats", () => {
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
    const ouid = "test-ouid";
    const mockData = { success: true, data: "Mock Data" };

    mock
      .onGet(`https://finder-rent-backend.vercel.app/api/v1/users/${ouid}`)
      .reply(200, mockData);

    const result = await fetchChats(ouid);

    expect(result).toEqual(mockData);
  });

  it("should throw an error when the status is not 200", async () => {
    const ouid = "test-ouid";
    const mockData = { message: "Error occurred" };

    mock
      .onGet(`https://finder-rent-backend.vercel.app/api/v1/users/${ouid}`)
      .reply(400, mockData);

    await expect(fetchChats(ouid)).rejects.toThrow("Error occurred");
  });
});
