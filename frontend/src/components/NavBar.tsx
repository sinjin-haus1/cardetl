'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  AppBar,
  Box,
  Toolbar,
  Typography,
  Button,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  CloudUpload as UploadIcon,
  VideoLibrary as VideoIcon,
  Share as ShareIcon,
} from '@mui/icons-material';

const navItems = [
  { label: 'Dashboard', href: '/dashboard', icon: <DashboardIcon /> },
  { label: 'Upload', href: '/upload', icon: <UploadIcon /> },
  { label: 'Videos', href: '/videos', icon: <VideoIcon /> },
  { label: 'Social', href: '/social', icon: <ShareIcon /> },
];

export default function NavBar() {
  const pathname = usePathname();

  return (
    <AppBar position="static" sx={{ bgcolor: 'background.paper', boxShadow: 'none', borderBottom: '1px solid #334155' }}>
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 700 }}>
          🚗 CarDetl.io
        </Typography>
        {navItems.map((item) => (
          <Button
            key={item.href}
            color="inherit"
            startIcon={item.icon}
            component={Link}
            href={item.href}
            sx={{
              bgcolor: pathname === item.href ? 'primary.main' : 'transparent',
              '&:hover': { bgcolor: pathname === item.href ? 'primary.dark' : 'rgba(255,255,255,0.08)' },
            }}
          >
            {item.label}
          </Button>
        ))}
      </Toolbar>
    </AppBar>
  );
}
