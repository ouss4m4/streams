import fs from "fs";
import https from "https";
import { join } from "path";

/**
 *
 * @param url
 * @param filePath
 * @deprecated Not In use in favor of Fetch()
 */

const downloadImage = async (url: string, filePath: string) => {
  filePath = join(__dirname, "deez.png");
  const file = fs.createWriteStream(filePath);

  return new Promise((resolve, reject) => {
    https
      .get(url, (response) => {
        if (response.statusCode !== 200) {
          reject(new Error(`Failed to get '${url}' (${response.statusCode})`));
          return;
        }
        response.pipe(file);
        file.on("finish", () => {
          file.close(resolve);
        });
      })
      .on("error", (err) => {
        fs.unlink(filePath, () => reject(err)); // Delete file if any error occurs
      });
  });
};

downloadImage(
  "https://fastly.picsum.photos/id/1042/200/300.jpg?hmac=rLBArBa4ahYhaKOp1GOxw6W77_v5daNsouqdh_bkoUs",
  "300"
);
