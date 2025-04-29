import { Image } from '@lib/types/images';
import fs from 'fs';
import path from 'path';

const publicDir = path.join(process.cwd(), 'public');
const imageDir = path.join(publicDir, 'assets/gallery/WEBP');

export const images: Image[] = (() => {
    try {
        if (!fs.existsSync(imageDir)) {
            return [];
        }
        return fs.readdirSync(imageDir)
            .filter(file => /\.(jpg|jpeg|png|gif|webp)$/i.test(file))
            .map(file => ({
                src: `/assets/gallery/WEBP/${file}`,
                alt: file.split('.')[0],
                width: 300,
                height: 200,
                link: `/gallery/${file.split('.')[0]}`,
                caption: file.split('.')[0].replace(/-/g, ' ').replace(/\b\w/g, char => char.toUpperCase())
            }));
    } catch {
        return [];
    }
})();