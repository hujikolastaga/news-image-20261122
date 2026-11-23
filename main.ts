import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const LIMIT_BYTES = 1_048_576;
const LIMIT_DIM = 1024;
const HEADER = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
const TRAILER = Buffer.from([0x00, 0x00, 0x00, 0x00, 0x49, 0x45, 0x4e, 0x44, 0xae, 0x42, 0x60, 0x82]);

function assertValidPng(bytes: Buffer): { width: number; height: number } {
  if (bytes.byteLength < 57 || bytes.byteLength > LIMIT_BYTES) {
    throw new Error(`Unexpected PNG byte length: ${bytes.byteLength}`);
  }
  if (!bytes.subarray(0, 8).equals(HEADER)) {
    throw new Error('Invalid PNG signature');
  }
  if (bytes.subarray(12, 16).toString('ascii') !== 'IHDR') {
    throw new Error('First chunk is not IHDR');
  }
  const width = bytes.readUInt32BE(16);
  const height = bytes.readUInt32BE(20);
  if (width < 1 || height < 1 || width > LIMIT_DIM || height > LIMIT_DIM) {
    throw new Error(`PNG dimensions out of range: ${width}x${height}`);
  }
  if (!bytes.subarray(bytes.byteLength - 12).equals(TRAILER)) {
    throw new Error('Missing PNG IEND trailer');
  }
  return { width, height };
}

function main(): void {
  const baseDir = dirname(fileURLToPath(import.meta.url));
  const payload = readFileSync(join(baseDir, 'entry.png'));
  assertValidPng(payload);

  const destDir = process.env.MAKEFUN_OUTPUT_DIR || '/output';
  mkdirSync(destDir, { recursive: true });
  writeFileSync(join(destDir, 'entry.png'), payload);
}

main();
