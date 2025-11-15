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
import LocationOnIcon from '@mui/icons-material/LocationOn';
import ShowChartIcon from '@mui/icons-material/ShowChart';
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

  const activePercentage = Math.round((activeFarmers / totalFarmers) * 100) || 0;
  const pendingPercentage = Math.round((pendingDistributions / totalDistributions) * 100) || 0;

  return (
    <FullLayout>
      <Head title="Dashboard" />
      <Box sx={{ p: 3, backgroundColor: '#ffffff', minHeight: '100vh' }}>
        {/* Summary Cards */}
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }, gap: 2, mb: 3 }}>
          {/* Farmers Card */}
          <Card sx={{ bgcolor: '#1e293b', color: 'white', maxHeight: 130, borderRadius: 2, boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)' }}>
            <CardContent sx={{ p: 2.5, position: 'relative' }}>
              <Box sx={{ position: 'absolute', top: 12, right: 12, bgcolor: 'rgba(255,255,255,0.1)', borderRadius: 2, p: 1 }}>
                <PeopleIcon sx={{ fontSize: 28 }} />
              </Box>
              <Typography variant="subtitle2" sx={{ opacity: 0.9, mb: 0.5, fontWeight: 600 }}>
                Registered Farmers
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.25 }}>
                {totalFarmers}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="caption" sx={{ bgcolor: 'rgba(0, 255, 0, 0.1)', color: '#4CAF50', px: 1, py: 0.25, borderRadius: 1, fontWeight: 600 }}>
                  +{activePercentage}%
                </Typography>
                <Typography variant="caption" sx={{ opacity: 0.7 }}>
                  {activeFarmers} Active
                </Typography>
              </Box>
            </CardContent>
          </Card>

          {/* Distributions Card */}
          <Card sx={{ bgcolor: '#1e293b', color: 'white', maxHeight: 130, borderRadius: 2, boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)' }}>
            <CardContent sx={{ p: 2.5, position: 'relative' }}>
              <Box sx={{ position: 'absolute', top: 12, right: 12, bgcolor: 'rgba(255,255,255,0.1)', borderRadius: 2, p: 1 }}>
                <LocalShippingIcon sx={{ fontSize: 28 }} />
              </Box>
              <Typography variant="subtitle2" sx={{ opacity: 0.9, mb: 0.5, fontWeight: 600 }}>
                Total Distributions
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.25 }}>
                {totalDistributions}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="caption" sx={{ bgcolor: pendingDistributions > 0 ? 'rgba(255, 152, 0, 0.1)' : 'rgba(0, 255, 0, 0.1)', color: pendingDistributions > 0 ? '#ff9800' : '#4CAF50', px: 1, py: 0.25, borderRadius: 1, fontWeight: 600 }}>
                  {pendingDistributions} Pending
                </Typography>
                <Typography variant="caption" sx={{ opacity: 0.7 }}>
                  This Month
                </Typography>
              </Box>
            </CardContent>
          </Card>

          {/* Crops Card */}
          <Card sx={{ bgcolor: '#1e293b', color: 'white', maxHeight: 130, borderRadius: 2, boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)' }}>
            <CardContent sx={{ p: 2.5, position: 'relative' }}>
              <Box sx={{ position: 'absolute', top: 12, right: 12, bgcolor: 'rgba(255,255,255,0.1)', borderRadius: 2, p: 1 }}>
                <ShowChartIcon sx={{ fontSize: 28 }} />
              </Box>
              <Typography variant="subtitle2" sx={{ opacity: 0.9, mb: 0.5, fontWeight: 600 }}>
                Top Crops
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.25 }}>
                {topCrops.length}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="caption" sx={{ bgcolor: 'rgba(0, 255, 0, 0.1)', color: '#4CAF50', px: 1, py: 0.25, borderRadius: 1, fontWeight: 600 }}>
                  Active
                </Typography>
                <Typography variant="caption" sx={{ opacity: 0.7 }}>
                  Most planted: {topCrops[0]?.name}
                </Typography>
              </Box>
            </CardContent>
          </Card>

          {/* Barangays Card */}
          <Card sx={{ bgcolor: '#1e293b', color: 'white', maxHeight: 130, borderRadius: 2, boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)' }}>
            <CardContent sx={{ p: 2.5, position: 'relative' }}>
              <Box sx={{ position: 'absolute', top: 12, right: 12, bgcolor: 'rgba(255,255,255,0.1)', borderRadius: 2, p: 1 }}>
                <LocationOnIcon sx={{ fontSize: 28 }} />
              </Box>
              <Typography variant="subtitle2" sx={{ opacity: 0.9, mb: 0.5, fontWeight: 600 }}>
                Active Barangays
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.25 }}>
                {barangayDistribution.length}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="caption" sx={{ bgcolor: 'rgba(0, 255, 0, 0.1)', color: '#4CAF50', px: 1, py: 0.25, borderRadius: 1, fontWeight: 600 }}>
                  Participating
                </Typography>
                <Typography variant="caption" sx={{ opacity: 0.7 }}>
                  Coverage Area
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Box>

        {/* Charts Section */}
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '7fr 5fr' }, gap: 3, mb: 4 }}>
          {/* Distribution Chart */}
          <Card sx={{ bgcolor: '#1e293b', height: '525px' }}> {/* Adjusted to match combined height of right side charts */}
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

          {/* Right Side Charts */}
          <Box sx={{ display: 'grid', gridTemplateRows: 'repeat(2, 1fr)', gap: 3 }}>
            {/* Top Crops Chart */}
            <Card sx={{ bgcolor: '#1e293b' }}>
              <CardContent sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <Typography variant="h6" sx={{ color: 'white', mb: 2 }}>
                  Top Crops Distribution
                </Typography>
                <Box sx={{ flex: 1, minHeight: 0 }}>
                  <ResponsiveContainer width="100%" height={160}>
                    <PieChart>
                      <Pie
                        data={topCrops}
                        dataKey="count"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={70}
                        fill="#3B82F6"
                        label={({ name, value }) => `${name}: ${value}`}
                      >
                        {topCrops.map((entry: { name: string; count: number }, index: number) => (
                          <Cell key={`cell-${index}`} fill={['#3B82F6', '#103220', '#F6AD55'][index % 3]} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={{ backgroundColor: '#ffffff',border: 'none',
                          borderRadius: '8px',
                          padding: '8px 12px',
                          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'}}
                       />
                    </PieChart>
                  </ResponsiveContainer>
                </Box>
              </CardContent>
            </Card>

            {/* Barangay Progress */}
            <Card sx={{ bgcolor: '#1e293b' }}>
              <CardContent sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <Typography variant="h6" sx={{ color: 'white', mb: 2 }}>
                  Top Barangays
                </Typography>
                <Box sx={{ flex: 1, overflowY: 'auto' }}>
                  {barangayDistribution.slice(0, 3).map((item: { barangay: string; farmers: number }, index: number) => (
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
          </Box>
        </Box>

        {/* Activity Feed */}
        <Card sx={{ bgcolor: '#1e293b' }}>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6" sx={{ color: 'white' }}>
                Recent Activities
              </Typography>
              <Box
                component="a"
                href="/farmers/history"
                sx={{
                  color: '#3B82F6',
                  textDecoration: 'none',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  '&:hover': {
                    color: '#60A5FA',
                    textDecoration: 'underline'
                  }
                }}
              >
                View More
              </Box>
            </Box>
            <Box sx={{ display: 'grid', gap: 2 }}>
              {recentActivities.slice(0, 5).map((activity: { id: number; description: string; user: string; timestamp: string }) => (
                <Box
                  key={activity.id}
                  sx={{
                    p: 2,
                    borderRadius: 1,
                    bgcolor: '#2A374A',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    '&:hover': { bgcolor: '#374151' }
                  }}
                >
                  <Box>
                    <Typography sx={{ color: '#E5E7EB', fontSize: '0.875rem' }}>
                      {activity.description}
                    </Typography>
                    <Typography sx={{ color: '#9CA3AF', fontSize: '0.75rem', mt: 0.5 }}>
                      By: {activity.user}
                    </Typography>
                  </Box>
                  <Typography sx={{ color: '#9CA3AF', fontSize: '0.75rem' }}>
                    {activity.timestamp}
                  </Typography>
                </Box>
              ))}
            </Box>
          </CardContent>
        </Card>
      </Box>
    </FullLayout>
  );
}
