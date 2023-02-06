import { GenerationArtifact } from "../api";

/**
 * Convert artifact base64 data into a Buffer object
 * @param artifact
 */
export function getArtifactBuffer(artifact: GenerationArtifact) {
  return Buffer.from(artifact.base64, "base64");
}
