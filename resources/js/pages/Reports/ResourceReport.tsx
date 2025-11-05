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
  Storage as StorageIcon,
  TrendingUp as TrendingUpIcon,
  LoopRounded as LoopIcon,
  Schedule as ScheduleIcon,
} from '@mui/icons-material';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface InventoryTrend {
  month: string;
  received: number;
  distributed: number;
}

interface UtilizationData {
  id: number;
  resource: string;
  initial: number;
  received: number;
  distributed: number;
  remaining: number;
}

interface Props {
  inventoryData: InventoryTrend[];
  utilizationData: UtilizationData[];
  summary: {
    totalValue: number;
    utilizationRate: number;
    turnoverRate: number;
    stockCoverage: number;
  };
}

export default function ResourceReport({ inventoryData, utilizationData, summary }: Props) {
  return (
    <FullLayout>
      <Head title="Resource Utilization" />
      
      <Box sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography variant="h4" sx={{ color: '#1a223f', fontWeight: 700 }}>
            Resource Utilization
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

        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(4, 1fr)' }, gap: 3, mb: 3 }}>
          {/* Summary Cards */}
          <Card sx={{ bgcolor: '#1a223f', color: 'white', maxHeight: 130, borderRadius: 2, boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)' }}>
            <CardContent sx={{ p: 2.5, position: 'relative' }}>
              <Box sx={{ position: 'absolute', top: 12, right: 12, bgcolor: 'rgba(255,255,255,0.1)', borderRadius: 2, p: 1 }}>
                <StorageIcon sx={{ fontSize: 28, color: '#000080' }} />
              </Box>
              <Typography variant="subtitle2" sx={{ opacity: 0.9, mb: 0.5, fontWeight: 600 }}>
                Total Stock Value
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.25 }}>
                ₱{(summary.totalValue / 1000000).toFixed(1)}M
              </Typography>
              <Typography variant="caption" sx={{ opacity: 0.7 }}>
                Current inventory
              </Typography>
            </CardContent>
          </Card>
          
          <Card sx={{ bgcolor: '#185c37', color: 'white', maxHeight: 130, borderRadius: 2, boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)' }}>
            <CardContent sx={{ p: 2.5, position: 'relative' }}>
              <Box sx={{ position: 'absolute', top: 12, right: 12, bgcolor: 'rgba(255,255,255,0.1)', borderRadius: 2, p: 1 }}>
                <TrendingUpIcon sx={{ fontSize: 28, color: '#006400' }} />
              </Box>
              <Typography variant="subtitle2" sx={{ opacity: 0.9, mb: 0.5, fontWeight: 600 }}>
                Utilization Rate
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.25 }}>
                {summary.utilizationRate}%
              </Typography>
              <Typography variant="caption" sx={{ opacity: 0.7 }}>
                Past 30 days
              </Typography>
            </CardContent>
          </Card>
          
          <Card sx={{ bgcolor: '#f59e0b', color: 'white', maxHeight: 130, borderRadius: 2, boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)' }}>
            <CardContent sx={{ p: 2.5, position: 'relative' }}>
              <Box sx={{ position: 'absolute', top: 12, right: 12, bgcolor: 'rgba(255,255,255,0.1)', borderRadius: 2, p: 1 }}>
                <LoopIcon sx={{ fontSize: 28, color: '#FFA500' }} />
              </Box>
              <Typography variant="subtitle2" sx={{ opacity: 0.9, mb: 0.5, fontWeight: 600 }}>
                Stock Turnover
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.25 }}>
                {summary.turnoverRate.toFixed(1)}x
              </Typography>
              <Typography variant="caption" sx={{ opacity: 0.7 }}>
                Monthly average
              </Typography>
            </CardContent>
          </Card>

          <Card sx={{ bgcolor: '#2563eb', color: 'white', maxHeight: 130, borderRadius: 2, boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)' }}>
            <CardContent sx={{ p: 2.5, position: 'relative' }}>
              <Box sx={{ position: 'absolute', top: 12, right: 12, bgcolor: 'rgba(255,255,255,0.1)', borderRadius: 2, p: 1 }}>
                <ScheduleIcon sx={{ fontSize: 28, color: '#808080' }} />
              </Box>
              <Typography variant="subtitle2" sx={{ opacity: 0.9, mb: 0.5, fontWeight: 600 }}>
                Stock Coverage
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.25 }}>
                {summary.stockCoverage.toFixed(1)}
              </Typography>
              <Typography variant="caption" sx={{ opacity: 0.7 }}>
                Months remaining
              </Typography>
            </CardContent>
          </Card>
        </Box>

        {/* Stock Level Trends */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>Stock Level Trends</Typography>
            <Box sx={{ height: 400 }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={inventoryData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="received"
                    name="Stock Received"
                    stackId="1"
                    stroke="#185c37"
                    fill="#185c37"
                    fillOpacity={0.6}
                  />
                  <Area
                    type="monotone"
                    dataKey="distributed"
                    name="Stock Distributed"
                    stackId="2"
                    stroke="#f59e0b"
                    fill="#f59e0b"
                    fillOpacity={0.6}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </Box>
          </CardContent>
        </Card>

        {/* Resource Utilization Table */}
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>Resource Utilization Summary</Typography>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Resource</TableCell>
                    <TableCell align="right">Initial Stock</TableCell>
                    <TableCell align="right">Received</TableCell>
                    <TableCell align="right">Distributed</TableCell>
                    <TableCell align="right">Remaining</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {utilizationData.map((row) => (
                    <TableRow key={row.id}>
                      <TableCell>{row.resource}</TableCell>
                      <TableCell align="right">{row.initial}</TableCell>
                      <TableCell align="right">{row.received}</TableCell>
                      <TableCell align="right">{row.distributed}</TableCell>
                      <TableCell align="right">{row.remaining}</TableCell>
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