import FullLayout from '@/layouts/full/FullLayout';
import { Head } from '@inertiajs/react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import { 
  PictureAsPdf as PdfIcon,
  People as PeopleIcon,
  PersonAdd as PersonAddIcon,
  Agriculture as AgricultureIcon,
} from '@mui/icons-material';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

interface FarmerUpdate {
  id: number;
  name: string;
  barangay: string;
  status: string;
  farmSize: number;
  lastUpdate: string;
}

interface StatusData {
  name: string;
  value: number;
  color: string;
}

interface Props {
  statusData: StatusData[];
  farmSizeData: {
    name: string;
    value: number;
    color: string;
  }[];
  recentUpdates: FarmerUpdate[];
  summary: {
    total: number;
    active: number;
    avgFarmSize: number;
  };
}

export default function FarmerReport({ statusData, farmSizeData, recentUpdates, summary }: Props) {
  return (
    <FullLayout>
      <Head title="Farmer Statistics" />
      
      <Box sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography variant="h4" sx={{ color: '#1a223f', fontWeight: 700 }}>
            Farmer Statistics
          </Typography>
          <Button
            variant="contained"
            startIcon={<PdfIcon />}
            sx={{
              bgcolor: '#185c37',
              '&:hover': { bgcolor: '#134c2d' }
            }}
          >
            Export PDF
          </Button>
        </Box>

        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: 3, mb: 3 }}>
          {/* Summary Cards */}
          <Card sx={{ bgcolor: '#1a223f', color: 'white', maxHeight: 130, borderRadius: 2, boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)' }}>
            <CardContent sx={{ p: 2.5, position: 'relative' }}>
              <Box sx={{ position: 'absolute', top: 12, right: 12, bgcolor: 'rgba(255,255,255,0.1)', borderRadius: 2, p: 1 }}>
                <PeopleIcon sx={{ fontSize: 28, color: '#000080' }} />
              </Box>
              <Typography variant="subtitle2" sx={{ opacity: 0.9, mb: 0.5, fontWeight: 600 }}>
                Total Farmers
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.25 }}>
                {Number(summary.total || 0).toLocaleString()}
              </Typography>
              <Typography variant="caption" sx={{ opacity: 0.7 }}>
                Registered farmers
              </Typography>
            </CardContent>
          </Card>
          
          <Card sx={{ bgcolor: '#185c37', color: 'white', maxHeight: 130, borderRadius: 2, boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)' }}>
            <CardContent sx={{ p: 2.5, position: 'relative' }}>
              <Box sx={{ position: 'absolute', top: 12, right: 12, bgcolor: 'rgba(255,255,255,0.1)', borderRadius: 2, p: 1 }}>
                <PersonAddIcon sx={{ fontSize: 28, color: '#006400' }} />
              </Box>
              <Typography variant="subtitle2" sx={{ opacity: 0.9, mb: 0.5, fontWeight: 600 }}>
                Active Farmers
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.25 }}>
                {Number(summary.active || 0).toLocaleString()}
              </Typography>
              <Typography variant="caption" sx={{ opacity: 0.7 }}>
                {Math.round((Number(summary.active || 0) / Math.max(Number(summary.total || 1), 1)) * 100)}% of total
              </Typography>
            </CardContent>
          </Card>
          
          <Card sx={{ bgcolor: '#f59e0b', color: 'white', maxHeight: 130, borderRadius: 2, boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)' }}>
            <CardContent sx={{ p: 2.5, position: 'relative' }}>
              <Box sx={{ position: 'absolute', top: 12, right: 12, bgcolor: 'rgba(255,255,255,0.1)', borderRadius: 2, p: 1 }}>
                <AgricultureIcon sx={{ fontSize: 28, color: '#FFA500' }} />
              </Box>
              <Typography variant="subtitle2" sx={{ opacity: 0.9, mb: 0.5, fontWeight: 600 }}>
                Average Farm Size
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.25 }}>
                {Number(summary.avgFarmSize || 0).toFixed(1)}
              </Typography>
              <Typography variant="caption" sx={{ opacity: 0.7 }}>
                Hectares per farmer
              </Typography>
            </CardContent>
          </Card>
        </Box>

        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }, gap: 3, mb: 3 }}>
          {/* Charts */}
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Farmer Status Distribution</Typography>
              <Box sx={{ height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={statusData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                    >
                      {statusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Farm Size Distribution</Typography>
              <Box sx={{ height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={farmSizeData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                    >
                      {farmSizeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Box>

        {/* Farmers Table */}
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>Recent Updates</Typography>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Barangay</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell align="right">Farm Size (ha)</TableCell>
                    <TableCell>Last Update</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {recentUpdates.map((row) => (
                    <TableRow key={row.id}>
                      <TableCell>{row.name}</TableCell>
                      <TableCell>{row.barangay}</TableCell>
                      <TableCell sx={{ 
                        color: row.status === 'active' ? '#185c37' : 
                               row.status === 'inactive' ? '#dc2626' : '#f59e0b'
                      }}>
                        {row.status.charAt(0).toUpperCase() + row.status.slice(1)}
                      </TableCell>
                      <TableCell align="right">{Number(row.farmSize || 0).toFixed(1)}</TableCell>
                      <TableCell>{row.lastUpdate}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      </Box>
    </FullLayout>
  );
}