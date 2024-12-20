# Image Uploader API Development

## Important 
Please read the task carefully, and take time to fully consider your solution before jumping into coding. You have 210 minutes, so use this time wisely. 
We expect a README file from you that includes any additional ideas or improvements you would consider if you had more time. Also, review the scoring criteria to understand how your task will be evaluated.


## Allowed Languages / Restrictions
You’re welcome to use Node.js with TypeScript for this task. 
Please note that we monitor the use of AI code-generation tools, so ChatGPT, Copilot, and other AI tools are not allowed.




## Problem Statement

You are tasked with developing a NodeJs application that provides an API endpoint for uploading images from URLs specified in a CSV file to local storage. This application should be capable of handling high loads efficiently and provide robust error handling.

## Functional Requirements

1. Implement an HTTP server with a single endpoint that accepts a CSV file upload.
2. Parse the uploaded CSV file, which follows this structure:
   ```
   sku,Image 1,Image 2,Image 3,Image 4,Image 5
   fabercastel-pad1,https://example.com/image1.jpg,https://example.com/image2.jpg,,,
   ```
3. Extract image URLs from the CSV.
4. Download images from the extracted URLs and save them to a specified local storage directory.
5. Handle errors such as invalid URLs, failed downloads, and I/O errors.
6. Implement efficient handling of high-volume requests and data processing.

## Technical Requirements

1. Use NodeJs programming language.
2. Implement proper error handling and logging.
3. Use appropriate NodeJs packages for HTTP server, CSV parsing, and file I/O.
4. Implement concurrent processing for improved performance.
5. Follow NodeJs best practices and idiomatic NodeJs programming.

## Input Format

The input will be a CSV file uploaded via an HTTP POST request. The CSV file will have the following format:
```
sku,Image 1,Image 2,Image 3,Image 4,Image 5
item1,https://cfn-catalog-prod.tradeling.com/up/65f2cf756aad860f7a264659/db6c3700092f7d71186c67213643e3fc.jpg,https://cfn-catalog-prod.tradeling.com/up/65f2cf756aad860f7a264659/fd61bd8156556772a7146c1c167c4fd4.jpg,,,
item2,https://example.com/image3.jpg,,,,
```

## Output Format

The API should respond with a JSON object indicating the success or failure of the operation. For example:
```json
{
  "success": true,
  "message": "Processed 10 images successfully",
  "errors": ["Failed to download image: https://example.com/broken-link.jpg"]
}
```

## Constraints

- The CSV file size will not exceed 10MB.
- The number of rows in the CSV file will not exceed 1000.
- Each image URL will not exceed 500 characters.
- The total number of unique image URLs will not exceed 5000.
- Time limit: 120 minutes

## Scoring

Your solution will be evaluated based on the following criteria:

1. Correctness: Does the program correctly parse the CSV, download images, and handle errors? (25%)
2. Code Quality: Is the code well-structured, readable, and maintainable? (10%)
3. Performance: How efficiently does the program handle concurrent downloads and high loads? (35%)
4. Error Handling: How comprehensively are potential errors handled? (10%)
5. Documentation: Is the code well-documented with clear setup instructions? (10%)
6. Unit Testing: Are there unit tests covering critical parts of the code? (10%)

## Unit Testing

Implement unit tests for critical components of your application. Focus on testing:
- CSV parsing logic
- URL validation
- Image downloading function
- Error handling scenarios

Aim for at least 70% code coverage in your unit tests.

## Time Management

You have 210 minutes to complete this task. 

Use your time wisely:
- Start with a basic working implementation before adding advanced features.
- If you need to make compromises due to time constraints, clearly document your decisions and provide solid reasoning for your choices.
- Prioritize core functionality and error handling over optimization in the initial stages.

## Extra Credit Tasks

If you complete the main requirements and have additional time, consider implementing these extra features:

1. Implement a caching mechanism to avoid re-downloading previously processed images.
2. Add support for resuming interrupted uploads.
3. Implement a rate limiter to prevent overloading the source servers.
4. Create a simple web interface for uploading CSV files and viewing processing status.
5. Add support for different image formats and implement basic image processing (e.g., resizing, format conversion) 
6. A file called images.csv contains the URLs of the images to be downloaded. Implement a feature to download images from the URLs in the images.csv file.

Note: Extra credit tasks are optional and should only be attempted if you have completed the core requirements satisfactorily.

## Sample Input

```
sku,Image 1,Image 2,Image 3,Image 4,Image 5
item1,https://cfn-catalog-prod.tradeling.com/up/65f2cf756aad860f7a264659/db6c3700092f7d71186c67213643e3fc.jpg,https://cfn-catalog-prod.tradeling.com/up/65f2cf756aad860f7a264659/fd61bd8156556772a7146c1c167c4fd4.jpg,,,
item2,https://example.com/image3.jpg,,,,
```

## Sample Output

```json
{
  "success": true,
  "message": "Processed 3 images successfully",
  "errors": []
}
```

## Notes

- You are allowed to use standard NodeJs packages and any third-party packages that are commonly available.
- Ensure your solution can handle concurrent requests efficiently.
- Proper error handling and logging are crucial for this task.
- You may assume that the local storage directory is writable by the application.
- If you make any assumptions or compromises due to time constraints, clearly document them in your code comments or in a separate README file.
- Focus on delivering a working solution first, then improve and optimize if time allows.
- Remember to include unit tests for critical components of your application.
