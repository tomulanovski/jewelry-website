import { s3 } from '../config/aws.js';

const uploadToS3 = async (fileData, filename) => {
    const params = {
        Bucket: 'moms-jewelry',
        Key: filename,
        Body: fileData,
        ContentType: 'image/jpeg'
        // Removed ACL setting
    };

    try {
        const result = await s3.upload(params).promise();
        return result.Location;
    } catch (error) {
        console.error('S3 upload error:', error);
        throw error;
    }
};

export { uploadToS3 };