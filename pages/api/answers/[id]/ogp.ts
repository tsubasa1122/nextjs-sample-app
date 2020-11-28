import * as path from 'path';
import { NextApiRequest, NextApiResponse } from 'next';
import { createCanvas, registerFont } from 'canvas';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  registerFont(path.resolve('./fonts/ipagp.ttf'), {
    family: 'ipagp',
  });
  const width = 600;
  const height = 315;
  const canvas = createCanvas(width, height);
  const context = canvas.getContext('2d');

  context.fillStyle = '#fafafa';
  context.fillRect(0, 0, width, height);

  context.font = '20px ipagp';
  context.fillStyle = '#424242';
  context.textAlign = 'center';
  context.textBaseline = 'middle';
  context.fillText('testテスト', 100, 50);

  const buffer = canvas.toBuffer();

  res.writeHead(200, {
    'Context-Type': 'image/png',
    'Content-Length': buffer.length,
  });
  res.end(buffer, 'binary');
};
