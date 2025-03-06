import { Canvas, createCanvas, loadImage } from "canvas";

export default function generatePNG(width: number, height: number): string {
	const canvas: Canvas = createCanvas(width, height);
	const context = canvas.getContext("2d");

	const imageData = context.createImageData(width, height);
	const data = imageData.data;

	//add some random bias
	for (let x = 0; x < width; x++) {
		for (let y = 0; y < height; y++) {
			const index = (x + y * width) * 4;
			data[index] = Math.random() * 255; // R
			data[index + 1] = Math.random() * 255; // G
			data[index + 2] = Math.random() * 255; // B
			data[index + 3] = 255; // A
		}
	}

	context.putImageData(imageData, 0, 0);

	return canvas.toDataURL("image/png");
}

export async function randomizePixel(x: number, y: number, radius: number, dataUrl: string) {
	const img = await loadImage(dataUrl);
	const [width, height] = [img.width, img.height];

	const canvas = createCanvas(width, height);
	const context = canvas.getContext("2d");

	context.drawImage(img, 0, 0);

	const imageData = context.getImageData(0, 0, width, height);
	const data = imageData.data;

	for (let dx = -radius; dx <= radius; dx++) {
		for (let dy = -radius; dy <= radius; dy++) {
			if (x + dx >= width || x - dx < 0 || y + dy >= height || y - dy < 0) {
				//out of bounds
				continue;
			}

			//check if the pixel is within the circle
			if (dx * dx + dy * dy <= radius * radius) {
				//set the pixel to a random color
				const index = (x + dx + (y + dy) * img.width) * 4;
				// data[index] = Math.random() * 255; // R
				// data[index + 1] = Math.random() * 255; // G
				// data[index + 2] = Math.random() * 255; // B
				// data[index + 3] = 255; // A				
				data[index + 3] = 0; // A
			}
		}
	}

	context.putImageData(imageData, 0, 0);

	return canvas.toDataURL("image/png");
}