import React, { useState } from 'react';
import {
    Box,
    TextField,
    IconButton,
    CircularProgress,
} from '@mui/material';
import { Delete as DeleteIcon, Upload as UploadIcon } from '@mui/icons-material';

const ImageUploader = ({ value = '', index, onChange, onRemove, pendingUploads, setPendingUploads }) => {
    const [uploading, setUploading] = useState(false);
    const [preview, setPreview] = useState(value);
    const [localPreview, setLocalPreview] = useState(null);
    
    const handleFileSelect = (event) => {
        const file = event.target.files[0];
        if (!file) return;
        
        // Create a local preview
        const localUrl = URL.createObjectURL(file);
        setLocalPreview(localUrl);
        
        // Store the file in pending uploads
        setPendingUploads(prev => ({
            ...prev,
            [index]: file
        }));
        
        // Set text field to "pending upload"
        onChange(index, 'pending_upload');
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
                value={value === 'pending_upload' ? 'Image will be uploaded on save' : value}
                onChange={(e) => onChange(index, e.target.value)}
                required={index === 0}
                disabled={value === 'pending_upload'}
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
                            {(localPreview || preview) && (
                                <img
                                    src={localPreview || preview}
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