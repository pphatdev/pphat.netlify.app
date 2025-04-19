import { Image } from '@lib/types/images';
import fs from 'fs';
import path from 'path';


const publicDir = path.join(process.cwd(), 'public');
const imageDir = path.join(publicDir, 'assets/brands');

export const brands: Image[] = fs.readdirSync(imageDir)
    .filter(file => /\.(jpg|jpeg|svg)$/i.test(file))
    .map(file => ({
        src: `/assets/brands/${file}`,
        alt: file.split('.')[0],
        width: 200,
        height: 200,
        caption: file.split('.')[0].replace(/-/g, ' ').replace(/\b\w/g, char => char.toUpperCase())
    }));