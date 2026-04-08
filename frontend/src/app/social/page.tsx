'use client';

import {
  Box,
  Container,
  Card,
  CardContent,
  CardActions,
  Button,
  Grid,
  Chip,
  Switch,
  List,
  ListItem,
  ListItemText,
  Typography,
} from '@mui/material';
import {
  Share as ShareIcon,
  CheckCircle as CheckIcon,
  Cancel as CancelIcon,
} from '@mui/icons-material';
import { useState } from 'react';
import NavBar from '../../components/NavBar';

const platforms = [
  { id: 'tiktok', name: 'TikTok', description: 'Auto-post short transformation videos', connected: true, username: '@cardetl_pro', color: '#00f2ea' },
  { id: 'instagram', name: 'Instagram', description: 'Share reels to your feed or story', connected: false, username: null, color: '#e4405f' },
  { id: 'youtube', name: 'YouTube', description: 'Upload shorts with auto-tags', connected: false, username: null, color: '#ff0000' },
];

export default function SocialPage() {
  const [platformStates, setPlatformStates] = useState(platforms.reduce((acc, p) => ({ ...acc, [p.id]: p.connected }), {}));

  const togglePlatform = (id: string) => {
    setPlatformStates((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <NavBar />

      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h4" sx={{ mb: 3, fontWeight: 700 }}>
          Social Accounts
        </Typography>

        <Grid container spacing={3} sx={{ mb: 4 }}>
          {platforms.map((platform) => (
            <Grid item xs={12} md={6} key={platform.id}>
              <Card sx={{ bgcolor: 'background.paper' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Box sx={{ width: 48, height: 48, borderRadius: 2, bgcolor: platform.color, display: 'flex', alignItems: 'center', justifyContent: 'center', mr: 2 }}>
                      <ShareIcon sx={{ color: 'white' }} />
                    </Box>
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>{platform.name}</Typography>
                      <Typography variant="body2" color="text.secondary">{platform.description}</Typography>
                    </Box>
                    {platformStates[platform.id] ? (
                      <Chip icon={<CheckIcon />} label="Connected" color="success" size="small" />
                    ) : (
                      <Chip icon={<CancelIcon />} label="Not Connected" size="small" variant="outlined" />
                    )}
                  </Box>
                  {platformStates[platform.id] && platform.username && (
                    <Typography variant="body2">Connected as: <strong>{platform.username}</strong></Typography>
                  )}
                </CardContent>
                <CardActions>
                  {platformStates[platform.id] ? (
                    <Button size="small" color="error" onClick={() => togglePlatform(platform.id)}>Disconnect</Button>
                  ) : (
                    <Button size="small" variant="contained" sx={{ bgcolor: platform.color, '&:hover': { bgcolor: platform.color } }} onClick={() => togglePlatform(platform.id)}>
                      Connect {platform.name}
                    </Button>
                  )}
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Card sx={{ bgcolor: 'background.paper' }}>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>Auto-Post Settings</Typography>
            <List>
              {[
                { label: 'Auto-post to TikTok when video is ready', enabled: true },
                { label: 'Auto-post to Instagram Reels', enabled: false },
                { label: 'Add branded hashtag #CarDetl', enabled: true },
                { label: 'Tag local car detailing businesses', enabled: false },
              ].map((setting, index) => (
                <ListItem key={index} secondaryAction={<Switch checked={setting.enabled} onChange={() => {}} />}>
                  <ListItemText primary={setting.label} />
                </ListItem>
              ))}
            </List>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}
