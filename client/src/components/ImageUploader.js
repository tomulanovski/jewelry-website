import React, { useState, useRef } from 'react';
import {
    Box,
    TextField,
    IconButton,
    CircularProgress,
    Typography,
    Tooltip,
} from '@mui/material';
import { Delete as DeleteIcon, Upload as UploadIcon, PlayCircleOutline as VideoIcon } from '@mui/icons-material';

// ─── Single-slot uploader (existing behaviour, unchanged API) ─────────────────
// Props:
//   value, index, onChange, onRemove, pendingUploads, setPendingUploads
// ─────────────────────────────────────────────────────────────────────────────
const ImageUploader = ({ value = '', index, onChange, onRemove, pendingUploads, setPendingUploads }) => {
    const [uploading] = useState(false);
    const [localPreview, setLocalPreview] = useState(null);
    const [isVideo, setIsVideo] = useState(false);

    const handleFileSelect = (event) => {
        const file = event.target.files[0];
        if (!file) return;

        // Revoke any previous blob URL to prevent memory leaks
        if (localPreview && localPreview.startsWith('blob:')) {
            URL.revokeObjectURL(localPreview);
        }

        const localUrl = URL.createObjectURL(file);
        setLocalPreview(localUrl);
        setIsVideo(file.type.startsWith('video/'));

        setPendingUploads(prev => ({ ...prev, [index]: file }));
        onChange(index, 'pending_upload');

        // Reset file input so the same file can be re-selected if needed
        event.target.value = '';
    };

    const preview = localPreview || (value && value !== 'pending_upload' ? value : null);
    const previewIsVideo = isVideo || (preview && /\.(mp4|mov|webm|avi|mkv)(\?|$)/i.test(preview));

    return (
        <Box sx={{ display: 'flex', gap: 1, mt: 1, alignItems: 'center' }}>
            <input
                type="file"
                accept="image/*,video/*"
                style={{ display: 'none' }}
                id={`image-upload-${index}`}
                onChange={handleFileSelect}
            />

            <TextField
                fullWidth
                label={`Image/Video ${index + 1}`}
                value={value === 'pending_upload' ? 'File will be uploaded on save' : value}
                onChange={(e) => onChange(index, e.target.value)}
                required={index === 0}
                disabled={value === 'pending_upload'}
                InputProps={{
                    endAdornment: (
                        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                            <label htmlFor={`image-upload-${index}`}>
                                <Tooltip title="Choose image or video">
                                    <IconButton
                                        component="span"
                                        disabled={uploading}
                                        color="primary"
                                    >
                                        {uploading ? <CircularProgress size={24} /> : <UploadIcon />}
                                    </IconButton>
                                </Tooltip>
                            </label>
                            {preview && (
                                previewIsVideo ? (
                                    <Box
                                        sx={{
                                            height: 40,
                                            width: 40,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            bgcolor: 'grey.200',
                                            borderRadius: 1,
                                        }}
                                    >
                                        <VideoIcon fontSize="small" color="action" />
                                    </Box>
                                ) : (
                                    <img
                                        src={preview}
                                        alt={`Preview ${index + 1}`}
                                        style={{ height: 40, width: 40, objectFit: 'cover', borderRadius: 4 }}
                                    />
                                )
                            )}
                        </Box>
                    )
                }}
            />

            {index > 0 && (
                <IconButton color="error" onClick={() => onRemove(index)}>
                    <DeleteIcon />
                </IconButton>
            )}
        </Box>
    );
};

// ─── Multi-file drop-zone uploader ────────────────────────────────────────────
// Props:
//   onFilesSelected(files: File[])  — called when the user picks files
//   disabled
// ─────────────────────────────────────────────────────────────────────────────
export const MultiFileUploader = ({ onFilesSelected, disabled = false }) => {
    const inputRef = useRef(null);
    const [previews, setPreviews] = useState([]); // [{ url, name, isVideo, file }]

    const handleChange = (event) => {
        const files = Array.from(event.target.files);
        if (!files.length) return;

        // Revoke previous previews
        previews.forEach(p => { if (p.url.startsWith('blob:')) URL.revokeObjectURL(p.url); });

        const newPreviews = files.map(file => ({
            url: URL.createObjectURL(file),
            name: file.name,
            isVideo: file.type.startsWith('video/'),
            file,
        }));
        setPreviews(newPreviews);
        onFilesSelected(files);

        // Reset so the same selection can be re-opened
        event.target.value = '';
    };

    const removePreview = (idx) => {
        const updated = previews.filter((_, i) => i !== idx);
        if (previews[idx]?.url.startsWith('blob:')) URL.revokeObjectURL(previews[idx].url);
        setPreviews(updated);
        onFilesSelected(updated.map(p => p.file));
    };

    return (
        <Box>
            <input
                ref={inputRef}
                type="file"
                accept="image/*,video/*"
                multiple
                style={{ display: 'none' }}
                id="multi-file-upload"
                onChange={handleChange}
                disabled={disabled}
            />
            <label htmlFor="multi-file-upload">
                <Box
                    sx={{
                        border: '2px dashed',
                        borderColor: 'primary.main',
                        borderRadius: 2,
                        p: 2,
                        textAlign: 'center',
                        cursor: disabled ? 'not-allowed' : 'pointer',
                        opacity: disabled ? 0.5 : 1,
                        '&:hover': { bgcolor: disabled ? undefined : 'action.hover' },
                        mt: 1,
                    }}
                >
                    <UploadIcon sx={{ fontSize: 32, color: 'primary.main' }} />
                    <Typography variant="body2" color="text.secondary">
                        Click to select images or videos (up to 10)
                    </Typography>
                </Box>
            </label>

            {previews.length > 0 && (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
                    {previews.map((p, i) => (
                        <Box
                            key={i}
                            sx={{
                                position: 'relative',
                                width: 80,
                                height: 80,
                                borderRadius: 1,
                                overflow: 'hidden',
                                border: '1px solid',
                                borderColor: 'divider',
                            }}
                        >
                            {p.isVideo ? (
                                <Box
                                    sx={{
                                        width: '100%',
                                        height: '100%',
                                        bgcolor: 'grey.200',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}
                                >
                                    <VideoIcon color="action" />
                                    <Typography
                                        variant="caption"
                                        sx={{ fontSize: 9, maxWidth: 72, textAlign: 'center', wordBreak: 'break-all' }}
                                    >
                                        {p.name}
                                    </Typography>
                                </Box>
                            ) : (
                                <img
                                    src={p.url}
                                    alt={`preview-${i}`}
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                />
                            )}
                            <IconButton
                                size="small"
                                onClick={() => removePreview(i)}
                                sx={{
                                    position: 'absolute',
                                    top: 0,
                                    right: 0,
                                    bgcolor: 'rgba(0,0,0,0.5)',
                                    color: 'white',
                                    p: 0.25,
                                    '&:hover': { bgcolor: 'rgba(200,0,0,0.8)' },
                                }}
                            >
                                <DeleteIcon sx={{ fontSize: 14 }} />
                            </IconButton>
                        </Box>
                    ))}
                </Box>
            )}
        </Box>
    );
};

export default ImageUploader;
