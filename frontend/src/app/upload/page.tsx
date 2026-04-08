'use client';

import {
  Box,
  Container,
  Card,
  CardContent,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  LinearProgress,
  Typography,
} from '@mui/material';
import {
  CloudUpload as UploadIcon,
  Image as ImageIcon,
} from '@mui/icons-material';
import { useState } from 'react';
import NavBar from '../../components/NavBar';

const presets = [
  { id: 'SHOWROOM', name: 'Showroom Shine', description: 'Premium dealership finish' },
  { id: 'CLEANCREW', name: 'Clean Crew', description: 'Professional detailing crew style' },
  { id: 'MIDNIGHT', name: 'Midnight Glam', description: 'Dark moody aesthetic' },
  { id: 'FAMILY', name: 'Family Safe', description: 'Clean family-friendly content' },
  { id: 'BUDGET', name: 'Budget Beast', description: 'Affordable detail transformations' },
];

export default function UploadPage() {
  const [selectedPreset, setSelectedPreset] = useState('SHOWROOM');
  const [beforeImage, setBeforeImage] = useState<File | null>(null);
  const [afterImage, setAfterImage] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleUpload = async () => {
    if (!beforeImage || !afterImage) return;
    setUploading(true);
    setTimeout(() => setUploading(false), 2000);
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <NavBar />

      <Container maxWidth="md" sx={{ py: 4 }}>
        <Typography variant="h4" sx={{ mb: 3, fontWeight: 700 }}>
          Create Transformation Video
        </Typography>

        <Card sx={{ bgcolor: 'background.paper', mb: 3 }}>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 2 }}>
              1. Select Style Preset
            </Typography>
            <FormControl fullWidth sx={{ mb: 3 }}>
              <InputLabel>Preset</InputLabel>
              <Select
                value={selectedPreset}
                label="Preset"
                onChange={(e) => setSelectedPreset(e.target.value)}
              >
                {presets.map((preset) => (
                  <MenuItem key={preset.id} value={preset.id}>
                    {preset.name} - {preset.description}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              {presets.map((preset) => (
                <Card
                  key={preset.id}
                  sx={{
                    p: 2,
                    cursor: 'pointer',
                    border: selectedPreset === preset.id ? '2px solid #6366f1' : '2px solid transparent',
                    bgcolor: 'background.default',
                  }}
                  onClick={() => setSelectedPreset(preset.id)}
                >
                  <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                    {preset.name}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {preset.description}
                  </Typography>
                </Card>
              ))}
            </Box>
          </CardContent>
        </Card>

        <Card sx={{ bgcolor: 'background.paper', mb: 3 }}>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 2 }}>
              2. Upload Before & After Photos
            </Typography>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Box
                sx={{
                  flex: 1,
                  border: '2px dashed #475569',
                  borderRadius: 2,
                  p: 3,
                  textAlign: 'center',
                  cursor: 'pointer',
                  '&:hover': { borderColor: '#6366f1' },
                }}
              >
                <input
                  type="file"
                  accept="image/*"
                  style={{ display: 'none' }}
                  onChange={(e) => setBeforeImage(e.target.files?.[0] || null)}
                />
                <ImageIcon sx={{ fontSize: 48, color: '#6366f1', mb: 1 }} />
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                  Before Photo
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {beforeImage ? beforeImage.name : 'Click or drag to upload'}
                </Typography>
              </Box>

              <Box
                sx={{
                  flex: 1,
                  border: '2px dashed #475569',
                  borderRadius: 2,
                  p: 3,
                  textAlign: 'center',
                  cursor: 'pointer',
                  '&:hover': { borderColor: '#6366f1' },
                }}
              >
                <input
                  type="file"
                  accept="image/*"
                  style={{ display: 'none' }}
                  onChange={(e) => setAfterImage(e.target.files?.[0] || null)}
                />
                <ImageIcon sx={{ fontSize: 48, color: '#22c55e', mb: 1 }} />
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                  After Photo
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {afterImage ? afterImage.name : 'Click or drag to upload'}
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>

        <Card sx={{ bgcolor: 'background.paper', mb: 3 }}>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 2 }}>
              3. Viral Hook Style
            </Typography>
            <TextField
              fullWidth
              label="Custom Hook (optional)"
              placeholder="e.g., Watch this $50 detail transform this car completely..."
              multiline
              rows={2}
            />
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Or let AI generate a viral hook based on your transformation
            </Typography>
          </CardContent>
        </Card>

        {uploading && <LinearProgress sx={{ mb: 2 }} />}

        <Button
          variant="contained"
          size="large"
          fullWidth
          startIcon={<UploadIcon />}
          disabled={!beforeImage || !afterImage || uploading}
          onClick={handleUpload}
          sx={{ py: 1.5 }}
        >
          Generate Video
        </Button>
      </Container>
    </Box>
  );
}
