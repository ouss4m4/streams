import { createWriteStream } from "fs";
import { join } from "path";
import { Readable } from "stream";
import { pipeline } from "stream";
import { promisify } from "util";

/**
 *
 * @param url
 * @param filePath
 * @deprecated Not In use in favor of stream/promises instead of promisify
 */
const downloadImage = async (url: string, filePath: string) => {
  try {
    filePath = join(__dirname, "deez.png"); // Save the file as deez.png
    const fileStream = createWriteStream(filePath);

    const response = await fetch(url);

    if (!response.ok || !response.body) {
      throw new Error("Failed to fetch the image");
    }

    let nodestream = Readable.fromWeb(response.body as any);
    let promLine = promisify(pipeline);

    await promLine(nodestream, fileStream);

    console.log("Downloaded");
  } catch (error) {
    console.error("Error downloading the image:", error);
  }
};

downloadImage(
  "https://fastly.picsum.photos/id/1042/200/300.jpg?hmac=rLBArBa4ahYhaKOp1GOxw6W77_v5daNsouqdh_bkoUs",
  "300"
);
