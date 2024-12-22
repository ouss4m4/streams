import fs, { createWriteStream, writeFileSync } from "fs";
import { join } from "path";
/**
 *
 * @param url
 * @param filePath
 * @deprecated Not In use in favor of pipeline
 */
const downloadImage = async (url: string, filePath: string) => {
  try {
    filePath = join(__dirname, "deez.png"); // Save the file as deez.png

    const response = await fetch(url);

    if (!response.ok || !response.body) {
      throw new Error("Failed to fetch the image");
    }

    const arrayBuffer = await response.arrayBuffer();

    const filebuffer = Buffer.from(arrayBuffer);

    writeFileSync(filePath, filebuffer);

    console.log("Image downloaded successfully:", filePath);
  } catch (error) {
    console.error("Error downloading the image:", error);
  }
};

downloadImage(
  "https://fastly.picsum.photos/id/1042/200/300.jpg?hmac=rLBArBa4ahYhaKOp1GOxw6W77_v5daNsouqdh_bkoUs",
  "300"
);
