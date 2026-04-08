'use client';

import {
  Box,
  Container,
  Card,
  CardContent,
  Grid,
  Typography,
  Chip,
} from '@mui/material';
import {
  VideoLibrary as VideoIcon,
} from '@mui/icons-material';
import NavBar from '../../components/NavBar';

const stats = [
  { label: 'Total Videos', value: '12', color: '#6366f1' },
  { label: 'This Week', value: '3', color: '#22c55e' },
  { label: 'Pending', value: '2', color: '#f59e0b' },
];

const recentVideos = [
  { title: 'Tesla Model S - Showroom Style', status: 'Ready', platform: 'TikTok', created: '2 hours ago' },
  { title: 'Ford F-150 - Midnight Detail', status: 'Processing', platform: 'Instagram', created: '5 hours ago' },
  { title: 'Honda Civic - Budget Friendly', status: 'Ready', platform: 'YouTube', created: '1 day ago' },
];

export default function DashboardPage() {
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <NavBar />

      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h4" sx={{ mb: 3, fontWeight: 700 }}>
          Dashboard
        </Typography>

        <Grid container spacing={3} sx={{ mb: 4 }}>
          {stats.map((stat) => (
            <Grid item xs={12} sm={4} key={stat.label}>
              <Card sx={{ bgcolor: 'background.paper' }}>
                <CardContent>
                  <Typography variant="overline" color="text.secondary">
                    {stat.label}
                  </Typography>
                  <Typography variant="h3" sx={{ fontWeight: 700, color: stat.color }}>
                    {stat.value}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
          Recent Videos
        </Typography>

        <Grid container spacing={3}>
          {recentVideos.map((video) => (
            <Grid item xs={12} sm={6} md={4} key={video.title}>
              <Card sx={{ bgcolor: 'background.paper' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Chip
                      label={video.status}
                      size="small"
                      sx={{
                        bgcolor: video.status === 'Ready' ? '#22c55e' : '#f59e0b',
                        color: 'white',
                      }}
                    />
                    <Chip label={video.platform} size="small" variant="outlined" />
                  </Box>
                  <Typography variant="h6" sx={{ mb: 1 }}>
                    {video.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {video.created}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}
