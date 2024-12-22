/**
 * Write the content of a ReadableStream to a file
 * @param {string} outputPath - The path to write the file to (parent dirs are created if needed)
 * @param {string} inputStream - The stream to write
 * @returns {Promise<number>} - A promise that resolves when the file is written with the size of the file in bytes
 */
export const writeToFile = (outputPath: string, inputStream: ReadableStream): Promise<number> => {
    const response = new Response(inputStream);

    console.log("Writing response stream to", outputPath);
    return Bun.write(outputPath, response);
};

/**
 * Use this Response to send a file from a readable stream or a Blob
 * @param filename 
 * @param fileData 
 * @returns 
 */
export const sendPdfFile = (filename: string, fileData: ArrayBuffer | Blob | ReadableStream | string) => new Response(fileData, {
    headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${filename}"`,
    },
});
    