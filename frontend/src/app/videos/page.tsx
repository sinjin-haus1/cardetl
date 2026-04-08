'use client';

import {
  Box,
  Container,
  Card,
  CardContent,
  CardMedia,
  Button,
  Grid,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  Typography,
} from '@mui/material';
import {
  PlayArrow as PlayIcon,
  Download as DownloadIcon,
  Share as ShareIcon,
  MoreVert as MoreIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { useState } from 'react';
import NavBar from '../../components/NavBar';

const videos = [
  {
    id: 1,
    title: 'Tesla Model S - Showroom Style',
    status: 'Ready',
    platform: 'TikTok',
    thumbnail: 'https://picsum.photos/seed/tesla/400/300',
    views: '12.5K',
  },
  {
    id: 2,
    title: 'Ford F-150 - Midnight Detail',
    status: 'Processing',
    platform: 'Instagram',
    thumbnail: 'https://picsum.photos/seed/ford/400/300',
    views: '-',
  },
  {
    id: 3,
    title: 'Honda Civic - Budget Friendly',
    status: 'Ready',
    platform: 'YouTube',
    thumbnail: 'https://picsum.photos/seed/honda/400/300',
    views: '8.2K',
  },
  {
    id: 4,
    title: 'BMW X5 - Clean Crew Edition',
    status: 'Ready',
    platform: 'TikTok',
    thumbnail: 'https://picsum.photos/seed/bmw/400/300',
    views: '22.1K',
  },
];

export default function VideosPage() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <NavBar />

      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h4" sx={{ mb: 3, fontWeight: 700 }}>
          My Videos
        </Typography>

        <Grid container spacing={3}>
          {videos.map((video) => (
            <Grid item xs={12} sm={6} md={4} key={video.id}>
              <Card sx={{ bgcolor: 'background.paper' }}>
                <Box sx={{ position: 'relative' }}>
                  <CardMedia
                    component="img"
                    height="180"
                    image={video.thumbnail}
                    alt={video.title}
                  />
                  <Box sx={{ position: 'absolute', top: 8, right: 8 }}>
                    <Chip
                      label={video.status}
                      size="small"
                      sx={{
                        bgcolor: video.status === 'Ready' ? '#22c55e' : '#f59e0b',
                        color: 'white',
                      }}
                    />
                  </Box>
                  {video.status === 'Ready' && (
                    <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
                      <IconButton sx={{ bgcolor: 'rgba(0,0,0,0.7)', '&:hover': { bgcolor: 'rgba(0,0,0,0.9)' } }}>
                        <PlayIcon sx={{ color: 'white' }} />
                      </IconButton>
                    </Box>
                  )}
                </Box>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Box>
                      <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 0.5 }}>
                        {video.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {video.platform} • {video.views} views
                      </Typography>
                    </Box>
                    <IconButton size="small" onClick={handleMenuOpen}>
                      <MoreIcon />
                    </IconButton>
                  </Box>
                  {video.status === 'Ready' && (
                    <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                      <Button size="small" variant="outlined" startIcon={<DownloadIcon />}>
                        Download
                      </Button>
                      <Button size="small" variant="contained" startIcon={<ShareIcon />}>
                        Share
                      </Button>
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
          <MenuItem onClick={handleMenuClose}><ShareIcon sx={{ mr: 1 }} /> Share</MenuItem>
          <MenuItem onClick={handleMenuClose}><DownloadIcon sx={{ mr: 1 }} /> Download</MenuItem>
          <MenuItem onClick={handleMenuClose} sx={{ color: 'error.main' }}><DeleteIcon sx={{ mr: 1 }} /> Delete</MenuItem>
        </Menu>
      </Container>
    </Box>
  );
}
