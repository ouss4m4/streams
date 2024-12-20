import { downloadImage } from "../src/lib/downloadImage";

const runTest = async () => {
  const result = await downloadImage("https://google.com", "./image.png");
  return result;
};

(async () => {
  try {
    let res = await runTest();
    if (res instanceof Error) {
      console.log(res.message);
    } else {
      console.log(res);
    }
  } catch (error) {
    console.error("Error occurred:", error);
  }
})();
