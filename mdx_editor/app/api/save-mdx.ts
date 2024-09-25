import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const { content, filename } = req.body;

        if (!content || !filename) {
            return res.status(400).json({ message: 'Content and filename are required' });
        }

        // 将文件保存到项目目录内的 `public/mdx` 目录
        const filePath = path.resolve(process.cwd(), 'public', 'mdx', filename);

        fs.writeFile(filePath, content, (err) => {
            if (err) {
                return res.status(500).json({ message: 'Error saving file', error: err.message });
            }

            res.status(200).json({ message: 'File saved successfully' });
        });
    } else {
        res.status(405).json({ message: 'Method not allowed' });
    }
}
