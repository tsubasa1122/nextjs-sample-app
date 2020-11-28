import { NextApiRequest, NextApiResponse } from 'next';
import { createCanvas } from 'canvas';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const width = 600;
  const height = 315;
  const canvas = createCanvas(width, height);
  const context = canvas.getContext('2d');

  context.fillStyle = '#888888';
  context.fillRect(0, 0, width, height);

  const buffer = canvas.toBuffer();

  res.writeHead(200, {
    'Context-Type': 'image/png',
    'Content-Length': buffer.length,
  });
  res.end(buffer, 'binary');
};
