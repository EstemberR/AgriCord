import { Card, CardContent, Typography, Box, Avatar, Chip, Button } from '@mui/material';
import { PersonAdd, Edit, Delete, ChangeCircle, History as HistoryIcon, ArrowForward } from '@mui/icons-material';
import { Link } from '@inertiajs/react';

interface Activity {
  id: number;
  farmer_name: string;
  action_type: string;
  changed_by: string;
  details: string;
  created_at: string;
  relative_time: string;
}

interface RecentActivitiesProps {
  activities: Activity[];
}

export default function RecentActivities({ activities }: RecentActivitiesProps) {
  const getActionIcon = (actionType: string) => {
    switch (actionType) {
      case 'New Registration':
        return <PersonAdd sx={{ color: '#013220' }} />;
      case 'Updated':
        return <Edit sx={{ color: '#000080' }} />;
      case 'Deleted':
        return <Delete sx={{ color: '#ef4444' }} />;
      case 'Status Changed':
        return <ChangeCircle sx={{ color: '#f59e0b' }} />;
      default:
        return <HistoryIcon sx={{ color: '#6b7280' }} />;
    }
  };

  const getActionColor = (actionType: string) => {
    switch (actionType) {
      case 'New Registration':
        return 'success';
      case 'Updated':
        return 'info';
      case 'Deleted':
        return 'error';
      case 'Status Changed':
        return 'warning';
      default:
        return 'default';
    }
  };

  return (
    <Card sx={{ boxShadow: 2, height: '100%' }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 700, color: '#1e3a8a' }}>
            Recent Activities
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {activities.length === 0 ? (
            <Typography variant="body2" sx={{ color: '#64748b', textAlign: 'center', py: 4 }}>
              No recent activities
            </Typography>
          ) : (
            activities.map((activity) => (
              <Box
                key={activity.id}
                sx={{
                  display: 'flex',
                  gap: 2,
                  p: 2,
                  borderRadius: 2,
                  bgcolor: '#f8fafc',
                  '&:hover': { bgcolor: '#f1f5f9' },
                  transition: 'all 0.2s',
                }}
              >
                <Avatar sx={{ bgcolor: '#e0e7ff', width: 40, height: 40 }}>
                  {getActionIcon(activity.action_type)}
                </Avatar>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 0.5 }}>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: '#0f172a' }}>
                      {activity.farmer_name}
                    </Typography>
                    <Chip
                      label={activity.action_type}
                      size="small"
                      color={getActionColor(activity.action_type) as 'success' | 'info' | 'error' | 'warning' | 'default'}
                      sx={{ fontWeight: 600, fontSize: '0.7rem' }}
                    />
                  </Box>
                  <Typography variant="body2" sx={{ color: '#64748b', fontSize: '0.875rem', mb: 0.5 }}>
                    {activity.details}
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#94a3b8' }}>
                    {activity.relative_time} • by {activity.changed_by}
                  </Typography>
                </Box>
              </Box>
            ))
          )}
        </Box>
        
        <Box sx={{ mt: 3, textAlign: 'center' }}>
          <Button
            component={Link}
            href="/farmers/history"
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
            View More Activities
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
}
