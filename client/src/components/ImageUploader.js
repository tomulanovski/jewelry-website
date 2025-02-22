import React, { useState } from 'react';
import {
    Box,
    TextField,
    IconButton,
    CircularProgress,
} from '@mui/material';
import { Delete as DeleteIcon, Upload as UploadIcon } from '@mui/icons-material';
import api from '../services/api'

const ImageUploader = ({ value = '', index, onChange, onRemove }) => {
    const [uploading, setUploading] = useState(false);
    const [preview, setPreview] = useState(value);
    
    const handleFileSelect = async (event) => {
        const file = event.target.files[0];
        if (!file) return;
    
        try {
            setUploading(true);
    
            // Log the file details
            console.log('File selected:', {
                name: file.name,
                type: file.type,
                size: file.size
            });
    
            const formData = new FormData();
            formData.append('image', file);
            formData.append('imageIndex', index + 1);
    
            // Log what we're sending
            console.log('Sending formData with:', {
                hasFile: formData.has('image'),
                imageIndex: formData.get('imageIndex')
            });
    
            const response = await api.post('/images/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
    
            onChange(index, response.data.imageUrl);
            setPreview(response.data.imageUrl);
        } catch (error) {
            console.error('Upload error:', error);
            alert('Failed to upload image. Please try again.');
        } finally {
            setUploading(false);
        }
    };

    return (
        <Box sx={{ display: 'flex', gap: 1, mt: 1, alignItems: 'center' }}>
            <input
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                id={`image-upload-${index}`}
                onChange={handleFileSelect}
            />
            
            <TextField
                fullWidth
                label={`Image ${index + 1}`}
                value={value}
                onChange={(e) => onChange(index, e.target.value)}
                required={index === 0}
                InputProps={{
                    endAdornment: (
                        <Box sx={{ display: 'flex', gap: 1 }}>
                            <label htmlFor={`image-upload-${index}`}>
                                <IconButton 
                                    component="span" 
                                    disabled={uploading}
                                    color="primary"
                                >
                                    {uploading ? <CircularProgress size={24} /> : <UploadIcon />}
                                </IconButton>
                            </label>
                            {preview && (
                                <img 
                                    src={preview} 
                                    alt={`Preview ${index + 1}`}
                                    style={{ 
                                        height: 40, 
                                        width: 40, 
                                        objectFit: 'cover',
                                        borderRadius: 4
                                    }}
                                />
                            )}
                        </Box>
                    )
                }}
            />
            
            {index > 0 && (
                <IconButton 
                    color="error" 
                    onClick={() => onRemove(index)}
                >
                    <DeleteIcon />
                </IconButton>
            )}
        </Box>
    );
};

export default ImageUploader;