import { Box, Card, CardContent, Typography } from '@mui/material';
import { ReactNode } from 'react';

interface StatisticsCardProps {
  icon: ReactNode;
  title: string;
  value: string | number;
  subtitle: string;
  badge?: {
    text: string;
    color: string;
    bgColor: string;
  };
}

export default function StatisticsCard({ icon, title, value, subtitle, badge }: StatisticsCardProps) {
  return (
    <Card sx={{ bgcolor: '#1e293b', color: 'white', maxHeight: 130, borderRadius: 2, boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)' }}>
      <CardContent sx={{ p: 2.5, position: 'relative' }}>
        <Box sx={{ position: 'absolute', top: 12, right: 12, bgcolor: 'rgba(255,255,255,0.1)', borderRadius: 2, p: 1 }}>
          {icon}
        </Box>
        <Typography variant="subtitle2" sx={{ opacity: 0.9, mb: 0.5, fontWeight: 600 }}>
          {title}
        </Typography>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.25 }}>
          {value}
        </Typography>
        {badge ? (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography 
              variant="caption" 
              sx={{ 
                bgcolor: badge.bgColor, 
                color: badge.color, 
                px: 1, 
                py: 0.25, 
                borderRadius: 1, 
                fontWeight: 600 
              }}
            >
              {badge.text}
            </Typography>
            <Typography variant="caption" sx={{ opacity: 0.7 }}>
              {subtitle}
            </Typography>
          </Box>
        ) : (
          <Typography variant="caption" sx={{ opacity: 0.7 }}>
            {subtitle}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
}