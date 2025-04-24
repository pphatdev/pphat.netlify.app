import { Image } from '@lib/types/images';
import fs from 'fs';
import path from 'path';


const publicDir = path.join(process.cwd(), 'public');

export const languages: Image[] = fs.readdirSync(path.join(publicDir, 'assets/brands/language'))
    .filter(file => /\.(jpg|jpeg|svg)$/i.test(file))
    .map(file => ({
        src: `/assets/brands/language/${file}`,
        alt: file.split('.')[0],
        width: 200,
        height: 200,
        caption: file.split('.')[0].replace(/-/g, ' ').replace(/\b\w/g, char => char.toUpperCase())
    }));

export const designed: Image[] = (() => {
    try {
        return fs.readdirSync(path.join(publicDir, 'assets/brands/design'))
            .filter(file => /\.(jpg|jpeg|svg)$/i.test(file))
            .map(file => ({
                src: `/assets/brands/design/${file}`,
                alt: file.split('.')[0],
                width: 200,
                height: 200,
                caption: file.split('.')[0].replace(/-/g, ' ').replace(/\b\w/g, char => char.toUpperCase())
            }));
    } catch (error) {
        console.error('Error reading directory:', error);
        return [];
    }
})()