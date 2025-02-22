import { uploadToS3 } from './utils/s3.js';
import * as dotenv from 'dotenv';

dotenv.config();

async function testUpload() {
    try {
        console.log('Testing AWS credentials...');
        
        // Create a test buffer - passing it directly now
        const testBuffer = Buffer.from('test image content');
        
        // Test upload - passing buffer directly
        const url = await uploadToS3(testBuffer, 'test-image.jpg');

        console.log('Success! Image uploaded to:', url);
    } catch (error) {
        console.error('Test failed:', error);
        console.error('Make sure your AWS credentials are set correctly in .env file');
    }
}

testUpload();