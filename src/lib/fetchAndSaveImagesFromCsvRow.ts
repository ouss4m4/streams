import { createWriteStream } from "fs";
import { pipeline } from "stream/promises";
import { join } from "path";
import { downloadImage } from "./downloadImage";
import { IDownloadReponse } from "../controllers/fileUploadWorker.controller";

export const fetchAndSaveImagesFromCsvRow = async (
  row: Record<string, string>
) => {
  const downloadPromises = [];
  const downloadResult: IDownloadReponse = {
    success: 0,
    errors: [],
  };
  // {image1: url, image2: url}
  for (const item in row) {
    if (item == "sku") {
      continue;
    }
    // todo: validate url first

    // mkdir for each row using sku
    downloadPromises.push(
      downloadImage(
        row[item],
        join(__dirname, "../..", "downloads", `${row["sku"]}-${item}.png`)
      )
    );
  }

  let rowResult = await Promise.allSettled(downloadPromises);

  rowResult.forEach((resOrError) => {
    if (resOrError.status == "fulfilled") {
      if (resOrError.value instanceof Error) {
        downloadResult.errors.push(resOrError.value.message);
      } else {
        downloadResult.success += 1;
      }
    }
  });

  return downloadResult;
};
