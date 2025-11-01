import { Card, CardContent, Typography, Box, Avatar, Chip, Button } from '@mui/material';
import { Phone, LocationOn, ArrowForward } from '@mui/icons-material';
import { Link } from '@inertiajs/react';

interface Farmer {
  id: number;
  farmer_id: string;
  full_name: string;
  contact_number: string;
  address_barangay: string;
  farm_name: string;
  status: string;
  created_at: string;
  relative_time: string;
}

interface RecentFarmersProps {
  farmers: Farmer[];
}

export default function RecentFarmers({ farmers }: RecentFarmersProps) {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Card sx={{ boxShadow: 2, height: '100%' }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 700, color: '#1e3a8a' }}>
            Recently Registered
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {farmers.length === 0 ? (
            <Typography variant="body2" sx={{ color: '#64748b', textAlign: 'center', py: 4 }}>
              No farmers registered yet
            </Typography>
          ) : (
            farmers.map((farmer) => (
              <Box
                key={farmer.id}
                sx={{
                  display: 'flex',
                  gap: 2,
                  p: 2,
                  borderRadius: 2,
                  bgcolor: '#f8fafc',
                  '&:hover': { bgcolor: '#f1f5f9' },
                  transition: 'all 0.2s',
                  cursor: 'pointer',
                }}
              >
                <Avatar
                  sx={{
                    bgcolor: '#1e3a8a',
                    width: 48,
                    height: 48,
                    fontWeight: 700,
                    fontSize: '1rem',
                  }}
                >
                  {getInitials(farmer.full_name)}
                </Avatar>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 0.5 }}>
                    <Box>
                      <Typography variant="body1" sx={{ fontWeight: 700, color: '#0f172a', mb: 0.5 }}>
                        {farmer.full_name}
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600 }}>
                        {farmer.farmer_id}
                      </Typography>
                    </Box>
                    <Chip
                      label={farmer.status}
                      size="small"
                      color={farmer.status === 'Active' ? 'success' : 'default'}
                      sx={{ fontWeight: 600, fontSize: '0.7rem' }}
                    />
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                    <Phone sx={{ fontSize: 14, color: '#64748b' }} />
                    <Typography variant="caption" sx={{ color: '#64748b' }}>
                      {farmer.contact_number}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                    <LocationOn sx={{ fontSize: 14, color: '#64748b' }} />
                    <Typography variant="caption" sx={{ color: '#64748b' }}>
                      {farmer.address_barangay} • {farmer.farm_name}
                    </Typography>
                  </Box>
                  <Typography variant="caption" sx={{ color: '#94a3b8' }}>
                    Registered {farmer.relative_time}
                  </Typography>
                </Box>
              </Box>
            ))
          )}
        </Box>
        
        <Box sx={{ mt: 3, textAlign: 'center' }}>
          <Button
            component={Link}
            href="/farmers"
            variant="outlined"
            endIcon={<ArrowForward />}
            fullWidth
            sx={{ 
              color: '#1e3a8a',
              borderColor: '#1e3a8a',
              fontWeight: 600,
              '&:hover': {
                borderColor: '#1e3a8a',
                bgcolor: '#1e3a8a',
                color: '#ffffff'
              }
            }}
          >
            View All Farmers
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
}
