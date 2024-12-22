import { parentPort, workerData } from "worker_threads";
import { parseCsvFromDiskAndStream } from "../lib/parseCsvFromDiskAndStream";
import { fetchAndSaveImagesFromCsvRow } from "../lib/fetchAndSaveImagesFromCsvRow";
import { IDownloadReponse } from "../controllers/fileUploadWorker.controller";

async function processCsv(filePath: string) {
  const finalResult: IDownloadReponse = {
    success: 0,
    errors: [],
  };

  try {
    const csvStream = parseCsvFromDiskAndStream(filePath);
    const rowProcessingPromises = [];

    for await (const row of csvStream) {
      rowProcessingPromises.push(fetchAndSaveImagesFromCsvRow(row));
    }

    const rowsProcessingResult = await Promise.allSettled(
      rowProcessingPromises
    );

    rowsProcessingResult.forEach((resOrErr) => {
      if (resOrErr.status === "fulfilled") {
        finalResult.success += resOrErr.value.success;
        finalResult.errors = finalResult.errors.concat(resOrErr.value.errors);
      }
    });

    parentPort?.postMessage({ success: true, result: finalResult });
  } catch (error) {
    parentPort?.postMessage({
      success: false,
      error: (error as Error).message,
    });
  }
}

processCsv(workerData.filePath);
