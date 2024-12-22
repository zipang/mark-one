/**
 * Unit tests for file-utils.ts
 */
import { describe, expect, it } from "bun:test";
import { writeToFile } from "./file-utils";

const markdownContent = `# Hello World
Catching u soon!`;

describe("writeToFile", () => {
    it("should write stream the content to the file", async () => {
        const outputPath = "./test.md";
        const expectedSize = markdownContent.length;

        // Create a ReadableStream with the markdown content
        const inputStream = (new Blob([markdownContent])).stream();

        const size = await writeToFile(outputPath, inputStream);

        expect(size).toBe(expectedSize);
    });

})
