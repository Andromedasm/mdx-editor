'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { MDXRemote, MDXRemoteSerializeResult } from 'next-mdx-remote';
import { serialize } from 'next-mdx-remote/serialize';
import { MDXProvider } from '@mdx-js/react';
import axios from 'axios';

const Home: React.FC = () => {
    const [mdxContent, setMdxContent] = useState<string>('# Hello MDX\n\nThis is an MDX example.');
    const [compiledMDX, setCompiledMDX] = useState<MDXRemoteSerializeResult | null>(null);
    const [filename, setFilename] = useState<string>('example.mdx');

    useEffect(() => {
        const compileMDX = async () => {
            const compiled = await serialize(mdxContent);
            setCompiledMDX(compiled);
        };
        compileMDX();
    }, [mdxContent]);

    const handleContentChange = async (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        const content = event.target.value;
        setMdxContent(content);
        const compiled = await serialize(content);
        setCompiledMDX(compiled);
    };

    const onDrop = useCallback((acceptedFiles: File[]) => {
        const file = acceptedFiles[0];
        const reader = new FileReader();

        reader.onload = async (event: any) => {
            const content = event.target.result;
            setMdxContent(content);
            setFilename(file.name); // 记录文件名以便保存时使用
            const compiled = await serialize(content);
            setCompiledMDX(compiled);
        };

        reader.readAsText(file);
    }, []);

    const { getRootProps, getInputProps } = useDropzone({ onDrop, accept: '.mdx' });

    const handleSave = async () => {
        try {
            await axios.post('/api/save-mdx', { content: mdxContent, filename });
            alert('File saved successfully');
        } catch (error) {
            alert('Error saving file');
            console.error(error);
        }
    };

    return (
        <div className="flex flex-col h-screen bg-gray-900 text-gray-100">
            <div {...getRootProps()} className="p-4 bg-gray-800 border-b border-gray-700 cursor-pointer">
                <input {...getInputProps()} />
                <p>Drag 'n' drop an MDX file here, or click to select one</p>
            </div>
            <div className="flex flex-grow">
        <textarea
            value={mdxContent}
            onChange={handleContentChange}
            className="w-1/2 h-full p-4 bg-gray-800 border-r border-gray-700 focus:outline-none"
        />
                <div className="w-1/2 h-full p-4 overflow-y-auto">
                    {compiledMDX && (
                        <MDXProvider>
                            <MDXRemote {...compiledMDX} />
                        </MDXProvider>
                    )}
                </div>
            </div>
            <button
                onClick={handleSave}
                className="p-2 m-4 bg-blue-600 rounded hover:bg-blue-700 focus:outline-none"
            >
                Save Changes
            </button>
        </div>
    );
};

export default Home;
