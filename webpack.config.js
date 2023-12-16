import { join } from 'path';
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const output = {
  path: join(__dirname, 'dist'),
  publicPath: '/',
  filename: 'app.js',
};

export default {
  mode: 'production',
  entry: './index.js',
  output: output,
  target: 'node',
}
