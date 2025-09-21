import { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Paper,
  Typography,
  Alert,
  CircularProgress,
  Card,
  CardContent,
  Avatar,
  Fade,
  IconButton,
  Chip,
  useTheme
} from '@mui/material';
import { 
  CloudUpload as CloudUploadIcon,
  ReportProblem as ReportIcon,
  PhotoCamera as PhotoCameraIcon,
  Delete as DeleteIcon,
  Description as DescriptionIcon,
  Title as TitleIcon
} from '@mui/icons-material';
import * as api from '../api';

export default function ReportIssue({ onIssueSubmitted }) {
  const theme = useTheme();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
  });
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedImage(file);
      setError('');
      
      // Create preview URL
      const reader = new FileReader();
      reader.onload = (e) => setImagePreview(e.target.result);
      reader.readAsDataURL(file);
    } else {
      setError('Please select a valid image file (JPG, PNG, GIF)');
      setSelectedImage(null);
      setImagePreview(null);
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      formDataToSend.append('description', formData.description);
      if (selectedImage) {
        formDataToSend.append('image', selectedImage);
      }

      await api.createIssue(formDataToSend);
      
      setSuccess(true);
      setFormData({ title: '', description: '' });
      setSelectedImage(null);
      setImagePreview(null);
      if (onIssueSubmitted) {
        onIssueSubmitted();
      }
      
      // Hide success message after 3 seconds
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to submit issue');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Fade in timeout={600}>
      <Card 
        sx={{ 
          background: 'linear-gradient(145deg, #FFFFFF 0%, #F8F9FA 100%)',
          border: '1px solid rgba(255, 255, 255, 0.18)',
          borderRadius: 3,
          overflow: 'hidden'
        }}
      >
        {/* Header */}
        <Box
          sx={{
            background: 'linear-gradient(135deg, #1565C0 0%, #1976D2 100%)',
            color: 'white',
            p: 3
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Avatar
              sx={{
                bgcolor: 'rgba(255, 255, 255, 0.2)',
                backdropFilter: 'blur(10px)',
                mr: 2,
                width: 48,
                height: 48
              }}
            >
              <ReportIcon />
            </Avatar>
            <Box>
              <Typography variant="h5" fontWeight={600}>
                Report New Issue
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                Help us improve your community by reporting issues
              </Typography>
            </Box>
          </Box>
        </Box>

        <CardContent sx={{ p: 4 }}>
          {error && (
            <Alert 
              severity="error" 
              sx={{ 
                mb: 3,
                borderRadius: 2,
                border: '1px solid rgba(239, 83, 80, 0.3)'
              }}
            >
              {error}
            </Alert>
          )}

          {success && (
            <Alert 
              severity="success" 
              sx={{ 
                mb: 3,
                borderRadius: 2,
                border: '1px solid rgba(102, 187, 106, 0.3)'
              }}
            >
              Issue reported successfully! Our team will review it shortly.
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            {/* Title Field */}
            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <TitleIcon sx={{ mr: 1, color: 'text.secondary', fontSize: 20 }} />
                <Typography variant="subtitle2" fontWeight={600}>
                  Issue Title
                </Typography>
              </Box>
              <TextField
                fullWidth
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                placeholder="Brief, descriptive title for the issue"
                variant="outlined"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2
                  }
                }}
              />
            </Box>

            {/* Description Field */}
            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <DescriptionIcon sx={{ mr: 1, color: 'text.secondary', fontSize: 20 }} />
                <Typography variant="subtitle2" fontWeight={600}>
                  Detailed Description
                </Typography>
              </Box>
              <TextField
                fullWidth
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                multiline
                rows={4}
                placeholder="Provide a detailed description of the issue, including location and any relevant details"
                variant="outlined"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2
                  }
                }}
              />
            </Box>

            {/* Image Upload Section */}
            <Box sx={{ mb: 4 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <PhotoCameraIcon sx={{ mr: 1, color: 'text.secondary', fontSize: 20 }} />
                <Typography variant="subtitle2" fontWeight={600}>
                  Photo Evidence (Optional)
                </Typography>
              </Box>

              {!imagePreview ? (
                <Box>
                  <input
                    accept="image/*"
                    style={{ display: 'none' }}
                    id="image-upload"
                    type="file"
                    onChange={handleImageChange}
                  />
                  <label htmlFor="image-upload">
                    <Card
                      component="span"
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        height: 120,
                        cursor: 'pointer',
                        border: '2px dashed',
                        borderColor: 'primary.main',
                        bgcolor: 'rgba(21, 101, 192, 0.05)',
                        borderRadius: 2,
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          borderColor: 'primary.dark',
                          bgcolor: 'rgba(21, 101, 192, 0.1)',
                          transform: 'translateY(-2px)'
                        }
                      }}
                    >
                      <CloudUploadIcon 
                        sx={{ 
                          fontSize: 40, 
                          color: 'primary.main',
                          mb: 1 
                        }} 
                      />
                      <Typography variant="body2" color="primary.main" fontWeight={500}>
                        Click to upload photo
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Supports JPG, PNG, GIF
                      </Typography>
                    </Card>
                  </label>
                </Box>
              ) : (
                <Card 
                  sx={{ 
                    position: 'relative',
                    borderRadius: 2,
                    overflow: 'hidden'
                  }}
                >
                  <Box
                    component="img"
                    src={imagePreview}
                    alt="Preview"
                    sx={{
                      width: '100%',
                      height: 200,
                      objectFit: 'cover'
                    }}
                  />
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 8,
                      right: 8,
                      display: 'flex',
                      gap: 1
                    }}
                  >
                    <Chip
                      label={selectedImage?.name}
                      size="small"
                      sx={{
                        bgcolor: 'rgba(0, 0, 0, 0.7)',
                        color: 'white',
                        maxWidth: 200
                      }}
                    />
                    <IconButton
                      onClick={removeImage}
                      size="small"
                      sx={{
                        bgcolor: 'rgba(239, 83, 80, 0.9)',
                        color: 'white',
                        '&:hover': {
                          bgcolor: 'error.dark'
                        }
                      }}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Box>
                </Card>
              )}
            </Box>

            {/* Submit Button */}
            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                type="submit"
                variant="contained"
                size="large"
                disabled={loading || !formData.title.trim() || !formData.description.trim()}
                sx={{
                  px: 4,
                  py: 1.5,
                  borderRadius: 2,
                  fontWeight: 600,
                  background: 'linear-gradient(135deg, #1565C0 0%, #1976D2 100%)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #0D47A1 0%, #1565C0 100%)',
                  },
                  '&:disabled': {
                    background: 'rgba(0, 0, 0, 0.12)'
                  }
                }}
              >
                {loading ? (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CircularProgress size={20} color="inherit" />
                    Submitting...
                  </Box>
                ) : (
                  'Submit Issue Report'
                )}
              </Button>
            </Box>
          </form>
        </CardContent>
      </Card>
    </Fade>
  );
}