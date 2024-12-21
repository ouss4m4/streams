// import { pipeline } from "stream/promises";
import { createWriteStream } from "fs";
import { pipeline } from "stream/promises";
import { downloadImage } from "../src/lib/downloadImage";
import { Readable, Stream } from "stream";

global.fetch = jest.fn();

jest.mock("fs", () => ({
  createWriteStream: jest.fn(),
}));

jest.mock("stream/promises", () => ({
  pipeline: jest.fn(),
}));

jest.mock("stream/promises", () => ({
  pipeline: jest.fn(),
}));

describe("It should download and save image from a url", () => {
  beforeEach(() => {
    // Clear mock calls and instances before each test
    jest.clearAllMocks();
  });
  it("should download an image from url", async () => {
    // mock fetch
    const mockUrl = "https://image.example";
    const mockFetchResponse = {
      ok: true,
      status: 200,
      body: Readable.from(["Image fake thing"]),
    };

    (global.fetch as jest.Mock).mockReturnValue(mockFetchResponse);

    // mock writer
    const mockFilePath = "/path/to/download/image.png";
    const mockWriteStream = Stream.Writable;
    (createWriteStream as jest.Mock).mockReturnValue(mockWriteStream);

    // pipeline ? mock that it gets called with fetch body and writer ?
    (pipeline as jest.Mock).mockReturnValue(true);
    const result = await downloadImage(mockUrl, mockFilePath);

    expect(fetch).toHaveBeenCalledWith(mockUrl);
    expect(createWriteStream).toHaveBeenCalledWith(mockFilePath);
    expect(pipeline).toHaveBeenLastCalledWith(
      mockFetchResponse.body,
      mockWriteStream
    );
    expect(result).toBe(true);
  });

  it("should return an error message on fail", async () => {
    // Mock the fetch response to simulate a failure
    const mockUrl = "https://image.example";
    const mockFetchResponse = { ok: false, status: 404, body: null };

    (global.fetch as jest.Mock).mockResolvedValue(mockFetchResponse);

    const mockFilePath = "/path/to/download/image.png";
    (createWriteStream as jest.Mock).mockReturnValue({});

    (pipeline as jest.Mock).mockResolvedValue(undefined);

    // Call the function
    const result = await downloadImage(mockUrl, mockFilePath);

    // Assertions
    expect(fetch).toHaveBeenCalledWith(mockUrl);
    expect(fetch).toHaveReturnedWith(Promise.resolve(mockFetchResponse));

    // Ensure `createWriteStream` and `pipeline` are not called
    expect(createWriteStream).not.toHaveBeenCalled();
    expect(pipeline).not.toHaveBeenCalled();

    // Ensure the result is an Error
    expect(result).toBeInstanceOf(Error);
    expect((result as Error).message).toContain(`failed to fetch, status: 404`);
  });
});
