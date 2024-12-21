import { createReadStream } from "fs";
import { parse } from "fast-csv";
import { parseCsvFromDiskAndStream } from "../src/lib/parseCsvFromDiskAndStream";

// Mock fs and fast-csv
jest.mock("fs", () => ({
  createReadStream: jest.fn(),
}));

jest.mock("fast-csv", () => ({
  parse: jest.fn(),
}));

describe("parse csv from storage to stream", () => {
  it("should parse the CSV file correctly", () => {
    const mockFilePath = "mocked/path/to/file.csv";

    const mockReadStream = {
      pipe: jest.fn(),
    };
    (createReadStream as jest.Mock).mockReturnValue(mockReadStream);

    const mockParseResult = {
      sku: "uni1",
      "image 1": "url 1",
      "image 2": "url 2",
      "image 3": "url 3",
    };
    (parse as jest.Mock).mockReturnValue(mockParseResult);
    const result = parseCsvFromDiskAndStream(mockFilePath);

    expect(createReadStream).toHaveBeenCalledWith(mockFilePath);
    expect(parse).toHaveBeenCalledWith({ headers: true });

    expect(mockReadStream.pipe).toHaveBeenCalledWith(mockParseResult);
  });
});
