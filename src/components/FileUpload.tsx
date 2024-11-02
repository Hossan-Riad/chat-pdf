"use client";
import React from 'react';
import axios from 'axios';
import { uploadToS3 } from '@/lib/s3';
import { useDropzone } from 'react-dropzone';
import { Inbox, Loader2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';

const FileUpload = () => {
    const router = useRouter();
    const [uploading, setUploading] = React.useState(false);

    // Define the type for your mutation data
    type MutationData = {
        file_key: string;
        file_name: string;
    };

    // Use the correct typing for useMutation
    const mutation = useMutation<any, Error, MutationData>({
        mutationFn: async ({ file_key, file_name }: MutationData) => {
            const response = await axios.post("/api/create-chat", {
                file_key,
                file_name,
            });
            return response.data;
        },
    });

    // Destructure mutate and isLoading from mutation
    const { mutate, isLoading } = mutation;

    const { getRootProps, getInputProps } = useDropzone({
        accept: { "application/pdf": [".pdf"] },
        maxFiles: 1,
        onDrop: async (acceptedFiles) => {
            const file = acceptedFiles[0];
            if (file.size > 10 * 1024 * 1024) {
                // bigger than 10 MB
                toast.error("File too large");
                return;
            }

            try {
                setUploading(true); // Set uploading state to true
                const data = await uploadToS3(file);
                console.log("meow", data);
                if (!data?.file_key || !data?.file_name) {
                    toast.error("Something went wrong!");
                    return;
                }
                mutate(data, {
                    onSuccess: (data) => {
                        console.log(data);
                    },
                    /* onSuccess: ({ chat_id }) => {
                        toast.success("Chat created!");
                        router.push(`/chat/${chat_id}`);
                    }, */
                    onError: (err) => {
                        toast.error("Error creating chat");
                        console.error(err);
                    },
                });
            } catch (error) {
                console.log(error);
            } finally {
                setUploading(false); // Reset uploading state
            }
        },
    });

    return (
        <div className='p-2 bg-white rounded-xl'>
            <div
                {...getRootProps({
                    className:"border-dashed border-2 rounded-xl cursor-pointer bg-gray-50 py-8 flex justify-center items-center flex-col",
                })}
            >
                <input {...getInputProps()} />
                {uploading || isLoading ? (
                    <>
                        {/* loading state */}
                        <Loader2 className="h-10 w-10 text-blue-500 animate-spin" />
                        <p className="mt-2 text-sm text-slate-400">
                            Spilling Tea to GPT...
                        </p>
                    </>
                    ) : (
                    <>
                        <Inbox className="w-10 h-10 text-blue-500" />
                        <p className="mt-2 text-sm text-slate-400">Drop PDF Here</p>
                    </>
                )}
                    
            </div>
        </div>
    );
}

export default FileUpload;