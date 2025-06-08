import type { MakeBuildResult } from "./types";

export const makeBuildResult = (
  content: string,
  filePath: string,
  fileName: string,
): MakeBuildResult =>
  Object.freeze({
    content,
    filePath,
    fileName,
  })