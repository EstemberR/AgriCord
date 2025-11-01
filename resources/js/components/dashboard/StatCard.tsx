import { Card, CardContent, Typography, Box } from '@mui/material';
import { TrendingUp, TrendingDown } from '@mui/icons-material';

interface StatCardProps {
  title: string;
  value: number;
  change?: number;
  color: string;
  icon: React.ReactNode;
}

export default function StatCard({ title, value, change, color, icon }: StatCardProps) {
  const isPositive = change && change >= 0;

  return (
    <Card sx={{ background: `linear-gradient(135deg, ${color} 0%, ${color}dd 100%)`, color: 'white', boxShadow: 3 }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box>
            <Typography variant="h3" sx={{ fontWeight: 'bold', color: 'white', mb: 1 }}>
              {value.toLocaleString()}
            </Typography>
            <Typography variant="body2" sx={{ color: 'white', fontWeight: 500 }}>
              {title}
            </Typography>
          </Box>
          <Box sx={{ 
            bgcolor: 'rgba(255,255,255,0.2)', 
            borderRadius: 2, 
            p: 1.5,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            {icon}
          </Box>
        </Box>
        {change !== undefined && change !== 0 && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            {isPositive ? (
              <TrendingUp sx={{ fontSize: 16, color: 'white' }} />
            ) : (
              <TrendingDown sx={{ fontSize: 16, color: 'white' }} />
            )}
            <Typography variant="caption" sx={{ color: 'white', fontWeight: 600 }}>
              {isPositive ? '+' : ''}{change}% vs last month
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
}
