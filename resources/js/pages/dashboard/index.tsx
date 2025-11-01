import { Head } from '@inertiajs/react';
import FullLayout from '@/layouts/full/FullLayout';
import {
  Box,
  Typography,
  Card,
  CardContent,
  LinearProgress,
} from '@mui/material';
import { 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell,
  BarChart,
  Bar,
} from 'recharts';
import PeopleIcon from '@mui/icons-material/People';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import { DashboardData } from './types';

interface DashboardProps {
  dashboardData: DashboardData;
}

export default function Dashboard({ dashboardData }: DashboardProps) {
  const {
    totalFarmers,
    activeFarmers,
    totalDistributions,
    pendingDistributions,
    topCrops,
    monthlyDistributions,
    barangayDistribution,
    recentActivities
  } = dashboardData;

  return (
    <FullLayout>
      <Head title="Dashboard" />
      <Box sx={{ p: 3, backgroundColor: '#ffffff', minHeight: '100vh' }}>
        {/* Top Stats Row */}
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3, mb: 4 }}>
            <Card sx={{ bgcolor: '#1e293b', color: 'white', height: '100%' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <PeopleIcon sx={{ fontSize: 40 }} />
                  <Box> 
                    <Typography variant="h6">Registered Farmers</Typography>
                    <Typography variant="h3">{totalFarmers}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {activeFarmers} Active
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          
            <Card sx={{ bgcolor: '#1e293b', color: 'white', height: '100%' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <LocalShippingIcon sx={{ fontSize: 40 }} />
                  <Box>
                    <Typography variant="h6">Total Distributions</Typography>
                    <Typography variant="h3">{totalDistributions}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {pendingDistributions} Pending
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
        </Box>

        {/* Main 2x2 Grid */}
        <Box sx={{ 
          display: 'grid', 
          gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, 
          gap: 3, 
          mb: 4 
        }}>
          {/* Monthly Distribution Card */}
          <Card sx={{ bgcolor: '#1e293b', height: '400px' }}>
            <CardContent sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <Typography variant="h6" sx={{ color: 'white', mb: 2 }}>
                Monthly Distribution Trends
              </Typography>
              <Box sx={{ flex: 1, minHeight: 0 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlyDistributions}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#2A374A" />
                    <XAxis dataKey="month" stroke="#9CA3AF" />
                    <YAxis stroke="#9CA3AF" />
                    <Tooltip contentStyle={{ backgroundColor: '#2A374A' }} />
                    <Bar dataKey="count" fill="#3B82F6" />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>

          {/* Top Crops Card */}
          <Card sx={{ bgcolor: '#1e293b', height: '400px' }}>
            <CardContent sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <Typography variant="h6" sx={{ color: 'white', mb: 2 }}>
                Top Crops Planted
              </Typography>
              <Box sx={{ flex: 1, minHeight: 0 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={topCrops}
                      dataKey="count"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={120}
                      fill="#3B82F6"
                      label={({ name, value }) => `${name}: ${value}`}
                    >
                      {topCrops.map((entry: { name: string; count: number }, index: number) => (
                        <Cell key={`cell-${index}`} fill={['#3B82F6', '#3B82F6', '#3B82F6', '#3B82F6'][index % 4]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: '#2A374A' }} />
                  </PieChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>

          {/* Farmers by Barangay Card */}
          <Card sx={{ bgcolor: '#1e293b', height: '400px' }}>
            <CardContent sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <Typography variant="h6" sx={{ color: 'white', mb: 2 }}>
                Farmers by Barangay
              </Typography>
              <Box sx={{ flex: 1, overflowY: 'auto' }}>
                {barangayDistribution.map((item: { barangay: string; farmers: number }, index: number) => (
                  <Box key={index} sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography sx={{ color: '#E5E7EB' }}>{item.barangay}</Typography>
                      <Typography sx={{ color: '#9CA3AF' }}>{item.farmers}</Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={(item.farmers / totalFarmers) * 100}
                      sx={{
                        height: 6,
                        borderRadius: 3,
                        bgcolor: '#2A374A',
                        '& .MuiLinearProgress-bar': {
                          bgcolor: '#3B82F6',
                          borderRadius: 3
                        }
                      }}
                    />
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>

          {/* Recent Activities Card */}
          <Card sx={{ bgcolor: '#1e293b', height: '400px' }}>
            <CardContent sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <Typography variant="h6" sx={{ color: 'white', mb: 2 }}>
                Recent System Activities
              </Typography>
              <Box sx={{ flex: 1, overflowY: 'auto' }}>
                {recentActivities.map((activity: { id: number; description: string; user: string; timestamp: string }) => (
                  <Box
                    key={activity.id}
                    sx={{
                      p: 2,
                      mb: 2,
                      borderRadius: 1,
                      bgcolor: '#2A374A',
                      '&:hover': { bgcolor: '#374151' }
                    }}
                  >
                    <Typography sx={{ color: '#E5E7EB', fontSize: '0.875rem', mb: 1 }}>
                      {activity.description}
                    </Typography>
                    <Typography sx={{ color: '#9CA3AF', fontSize: '0.75rem' }}>
                      By: {activity.user} • {activity.timestamp}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Box>
    </FullLayout>
  );
}
