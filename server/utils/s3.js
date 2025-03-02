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

const deleteFromS3 = async (imageUrl) => {
    try {
        // Extract the key from the image URL
        // Example URL: https://moms-jewelry.s3.amazonaws.com/product_123_1678901234567.jpg
        const urlParts = imageUrl.split('/');
        const key = urlParts[urlParts.length - 1];
        
        const params = {
            Bucket: 'moms-jewelry',
            Key: key
        };
        
        console.log('Deleting from S3:', params);
        
        await s3.deleteObject(params).promise();
        return true;
    } catch (error) {
        console.error('S3 delete error:', error);
        throw error;
    }
};

export { uploadToS3, deleteFromS3 };