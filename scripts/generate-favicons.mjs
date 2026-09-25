import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import sharp from 'sharp';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const publicDir = join(root, 'public');
const svg = readFileSync(join(publicDir, 'favicon.svg'));

const sizes = [
	{ name: 'favicon-16x16.png', size: 16 },
	{ name: 'favicon-32x32.png', size: 32 },
	{ name: 'apple-touch-icon.png', size: 180 },
];

for (const { name, size } of sizes) {
	await sharp(svg).resize(size, size).png().toFile(join(publicDir, name));
}

const png16 = await sharp(svg).resize(16, 16).png().toBuffer();
const png32 = await sharp(svg).resize(32, 32).png().toBuffer();
writeFileSync(join(publicDir, 'favicon.ico'), encodeIco([png16, png32]));

console.log('Generated favicon.ico, favicon-16x16.png, favicon-32x32.png, apple-touch-icon.png');

function encodeIco(images) {
	const count = images.length;
	const headerSize = 6;
	const dirEntrySize = 16;
	const offset = headerSize + dirEntrySize * count;

	let dataOffset = offset;
	const entries = images.map((buf, index) => {
		const size = index === 0 ? 16 : 32;
		const entry = { size, buf, dataOffset };
		dataOffset += buf.length;
		return entry;
	});

	const totalSize = dataOffset;
	const out = Buffer.alloc(totalSize);

	out.writeUInt16LE(0, 0);
	out.writeUInt16LE(1, 2);
	out.writeUInt16LE(count, 4);

	entries.forEach((entry, i) => {
		const base = headerSize + i * dirEntrySize;
		out.writeUInt8(entry.size === 256 ? 0 : entry.size, base);
		out.writeUInt8(entry.size === 256 ? 0 : entry.size, base + 1);
		out.writeUInt8(0, base + 2);
		out.writeUInt8(0, base + 3);
		out.writeUInt16LE(1, base + 4);
		out.writeUInt16LE(32, base + 6);
		out.writeUInt32LE(entry.buf.length, base + 8);
		out.writeUInt32LE(entry.dataOffset, base + 12);
	});

	entries.forEach((entry) => {
		entry.buf.copy(out, entry.dataOffset);
	});

	return out;
}
