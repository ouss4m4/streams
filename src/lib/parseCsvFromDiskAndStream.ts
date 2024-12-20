import { createReadStream } from "fs";
import { parse } from "fast-csv";

export function parseCsvFromDiskAndStream(path: string) {
  return createReadStream(path).pipe(parse({ headers: true }));
}
