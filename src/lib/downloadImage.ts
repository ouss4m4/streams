import { pipeline } from "stream/promises";
import { createWriteStream } from "fs";

export const downloadImage = async (
  url: string,
  filePath: string
): Promise<boolean | Error> => {
  try {
    const response = await fetch(url);

    if (!response.ok || !response.body) {
      throw new Error(`failed to fetch, status: ${response.status}`);
    }
    const writer = createWriteStream(filePath);

    await pipeline(response.body as unknown as NodeJS.ReadableStream, writer);
    return true;
  } catch (error: any) {
    let message = "Error while downloading image";
    if (error instanceof Error) {
      message = error.message;
    }
    return new Error(`${message} | ${url} `);
  }
};
