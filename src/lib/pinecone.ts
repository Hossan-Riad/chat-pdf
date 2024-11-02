import { Pinecone } from "@pinecone-database/pinecone"; // Use Pinecone instead of PineconeClient
import { downloadFromS3 } from "./s3-server";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";// Adjusted import path
import { fileURLToPath } from "url";


let pinecone: any = null; // Using 'any' as a temporary type

export const getPineconeClient = async () => {
    if (!pinecone) {
        pinecone = new Pinecone(); // Initialize Pinecone directly
        await pinecone.init({
            environment: process.env.PINECONE_ENVIRONMENT!,
            apiKey: process.env.PINECONE_API_KEY!,
        });
    }
    return pinecone;
}

export async function loadS3IntoPinecone(fileKey: string) {
    console.log('Downloading S3 into file system');
    const file_name = await downloadFromS3(fileKey);
    if (!file_name) {
        throw new Error("Could not download from S3");
    }

    const loader = new PDFLoader(file_name);
    const pages = await loader.load(); // Ensure this is awaited
    return pages;
}