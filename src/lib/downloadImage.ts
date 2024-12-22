import { createWriteStream } from "fs";
import { mkdir } from "fs/promises";
import { dirname } from "path";
import { pipeline } from "stream/promises";

export const downloadImage = async (
  url: string,
  filePath: string
): Promise<boolean | Error> => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000); // 10 seconds timeout on image download

  try {
    await mkdir(dirname(filePath), { recursive: true });

    const response = await fetch(url, { signal: controller.signal });

    if (!response.ok || !response.body) {
      throw new Error(`Failed to fetch, status: ${response.status}`);
    }

    const writer = createWriteStream(filePath);
    await pipeline(response.body as unknown as NodeJS.ReadableStream, writer);

    return true;
  } catch (error: any) {
    let message = "Error while downloading image";
    if (error.name === "AbortError") {
      message = `Request timed out while downloading image`;
    } else if (error instanceof Error) {
      message = error.message;
    }
    return new Error(`${message} | ${url}`);
  } finally {
    clearTimeout(timeout);
  }
};
