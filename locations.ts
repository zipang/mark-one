import { resolve } from 'node:path';

// Resolve the input and output dir relatively to the project's root
export const projectRoot = import.meta.dirname;
export const inputDir = resolve(projectRoot, "input");
export const outputDir = resolve(projectRoot, "output");
export const contentDir = resolve(projectRoot, "content");
