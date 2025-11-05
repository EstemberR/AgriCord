import FullLayout from '@/layouts/full/FullLayout';
import { Head } from '@inertiajs/react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
} from '@mui/material';
import { 
  PictureAsPdf as PdfIcon,
  LocalShipping as ShippingIcon,
  Science as ScienceIcon,
  Grass as GrassIcon,
} from '@mui/icons-material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface Distribution {
  id: number;
  distribution_date: string;
  farmer: {
    full_name: string;
    address_barangay: string;
  };
  item_type: string;
  quantity: number;
}

interface Props {
  distributionData: {
    month: string;
    fertilizer: number;
    seeds: number;
  }[];
  recentDistributions: Distribution[];
  summary: {
    total: number;
    fertilizerTotal: number;
    seedsTotal: number;
  };
}

export default function DistributionReport({ distributionData, recentDistributions, summary }: Props) {

  return (
    <FullLayout>
      <Head title="Distribution Report" />
      
      <Box sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography variant="h4" sx={{ color: '#1a223f', fontWeight: 700 }}>
            Distribution Report
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
                <ShippingIcon sx={{ fontSize: 28, color: '#000080' }} />
              </Box>
              <Typography variant="subtitle2" sx={{ opacity: 0.9, mb: 0.5, fontWeight: 600 }}>
                Total Distributions
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.25 }}>
                {summary.total.toLocaleString()}
              </Typography>
              <Typography variant="caption" sx={{ opacity: 0.7 }}>
                Total records
              </Typography>
            </CardContent>
          </Card>
          
          <Card sx={{ bgcolor: '#185c37', color: 'white', maxHeight: 130, borderRadius: 2, boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)' }}>
            <CardContent sx={{ p: 2.5, position: 'relative' }}>
              <Box sx={{ position: 'absolute', top: 12, right: 12, bgcolor: 'rgba(255,255,255,0.1)', borderRadius: 2, p: 1 }}>
                <ScienceIcon sx={{ fontSize: 28, color: '#006400' }} />
              </Box>
              <Typography variant="subtitle2" sx={{ opacity: 0.9, mb: 0.5, fontWeight: 600 }}>
                Fertilizer (kg)
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.25 }}>
                {summary.fertilizerTotal.toLocaleString()}
              </Typography>
              <Typography variant="caption" sx={{ opacity: 0.7 }}>
                Total distributed
              </Typography>
            </CardContent>
          </Card>
          
          <Card sx={{ bgcolor: '#f59e0b', color: 'white', maxHeight: 130, borderRadius: 2, boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)' }}>
            <CardContent sx={{ p: 2.5, position: 'relative' }}>
              <Box sx={{ position: 'absolute', top: 12, right: 12, bgcolor: 'rgba(255,255,255,0.1)', borderRadius: 2, p: 1 }}>
                <GrassIcon sx={{ fontSize: 28, color: '#FFA500' }} />
              </Box>
              <Typography variant="subtitle2" sx={{ opacity: 0.9, mb: 0.5, fontWeight: 600 }}>
                Seeds (kg)
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.25 }}>
                {summary.seedsTotal.toLocaleString()}
              </Typography>
              <Typography variant="caption" sx={{ opacity: 0.7 }}>
                Total distributed
              </Typography>
            </CardContent>
          </Card>
        </Box>

        {/* Distribution Chart */}
        <Box sx={{ mb: 3 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Distribution Trends</Typography>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={distributionData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="fertilizer" name="Fertilizer (kg)" fill="#185c37" />
                  <Bar dataKey="seeds" name="Seeds (kg)" fill="#f59e0b" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Box>

        {/* Recent Distributions Table */}
        <Box sx={{ mb: 3 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Recent Distributions</Typography>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Date</TableCell>
                      <TableCell>Farmer</TableCell>
                      <TableCell>Barangay</TableCell>
                      <TableCell>Type</TableCell>
                      <TableCell align="right">Amount (kg)</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {recentDistributions.map((row) => (
                      <TableRow key={row.id}>
                        <TableCell>{new Date(row.distribution_date).toLocaleDateString()}</TableCell>
                        <TableCell>{row.farmer.full_name}</TableCell>
                        <TableCell>{row.farmer.address_barangay}</TableCell>
                        <TableCell>{row.item_type.charAt(0).toUpperCase() + row.item_type.slice(1)}</TableCell>
                        <TableCell align="right">{row.quantity.toLocaleString()}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Box>
      </Box>
    </FullLayout>
  );
}