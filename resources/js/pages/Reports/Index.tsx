import { useState } from 'react';
import FullLayout from '@/layouts/full/FullLayout';
import { Head } from '@inertiajs/react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Stack,
  ToggleButtonGroup,
  ToggleButton,
} from '@mui/material';
import {
  PictureAsPdf as PdfIcon,
  Inventory as InventoryIcon,
  Agriculture as FarmerIcon,
  Assessment as ResourceIcon,
  FactCheck as ComplianceIcon,
} from '@mui/icons-material';
import dayjs from 'dayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

interface ReportCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  lastGenerated: string;
  onExport: () => void;
}

const ReportCard = ({ icon, title, description, lastGenerated, onExport }: ReportCardProps) => (
  <Card sx={{ 
    bgcolor: '#1a223f', 
    height: '100%',
    transition: 'transform 0.2s',
    '&:hover': {
      transform: 'translateY(-4px)',
    }
  }}>
    <CardContent>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
        <Box sx={{ 
          p: 1.5, 
          borderRadius: 2, 
          bgcolor: 'rgba(255,255,255,0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          {icon}
        </Box>
        <Typography variant="h6" sx={{ color: 'white', fontWeight: 600 }}>
          {title}
        </Typography>
      </Box>
      
      <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', mb: 3 }}>
        {description}
      </Typography>
      
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)' }}>
          Last generated: {lastGenerated}
        </Typography>
        <Button
          variant="contained"
          startIcon={<PdfIcon />}
          onClick={onExport}
          sx={{
            bgcolor: '#185c37',
            '&:hover': {
              bgcolor: '#134c2d',
            }
          }}
        >
          Export PDF
        </Button>
      </Box>
    </CardContent>
  </Card>
);

export default function Reports() {
  const [dateRange, setDateRange] = useState<{
    from: dayjs.Dayjs | null;
    to: dayjs.Dayjs | null;
  }>({
    from: dayjs(),
    to: dayjs(),
  });
  
  const [quickFilter, setQuickFilter] = useState('today');

  const handleQuickFilterChange = (event: React.MouseEvent<HTMLElement>, newFilter: string) => {
    if (newFilter !== null) {
      setQuickFilter(newFilter);
      const today = dayjs();
      
      switch (newFilter) {
        case 'today':
          setDateRange({ from: today, to: today });
          break;
        case 'week':
          setDateRange({ from: today.subtract(7, 'day'), to: today });
          break;
        case 'month':
          setDateRange({ from: today.subtract(1, 'month'), to: today });
          break;
        case 'year':
          setDateRange({ from: today.subtract(1, 'year'), to: today });
          break;
        case 'all':
          setDateRange({ from: null, to: today });
          break;
      }
    }
  };

  const handleExport = (reportType: string) => {
    // Handle export based on report type
    console.log(`Exporting ${reportType} report...`);
  };

  return (
    <FullLayout>
      <Head title="Reports" />
      
      <Box sx={{ p: 3 }}>
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" sx={{ color: '#1a223f', fontWeight: 700, mb: 1 }}>
            Reports
          </Typography>
          <Typography variant="body1" sx={{ color: 'text.secondary' }}>
            Generate and download comprehensive reports for your agricultural data
          </Typography>
        </Box>

        {/* Date Range and Quick Filters */}
        <Card sx={{ mb: 4, p: 2 }}>
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems="center">
            <DatePicker
              label="Date From"
              value={dateRange.from}
              onChange={(newValue: dayjs.Dayjs | null) => setDateRange(prev => ({ ...prev, from: newValue }))}
              slotProps={{
                textField: {
                  size: "small",
                  sx: { width: 200 }
                }
              }}
            />
            <DatePicker
              label="Date To"
              value={dateRange.to}
              onChange={(newValue: dayjs.Dayjs | null) => setDateRange(prev => ({ ...prev, to: newValue }))}
              slotProps={{
                textField: {
                  size: "small",
                  sx: { width: 200 }
                }
              }}
            />
            <ToggleButtonGroup
              value={quickFilter}
              exclusive
              onChange={handleQuickFilterChange}
              aria-label="date range quick filter"
              size="small"
            >
              <ToggleButton value="today" aria-label="today">
                Today
              </ToggleButton>
              <ToggleButton value="week" aria-label="this week">
                This Week
              </ToggleButton>
              <ToggleButton value="month" aria-label="this month">
                This Month
              </ToggleButton>
              <ToggleButton value="year" aria-label="this year">
                This Year
              </ToggleButton>
              <ToggleButton value="all" aria-label="all time">
                All Time
              </ToggleButton>
            </ToggleButtonGroup>
          </Stack>
        </Card>

        {/* Report Cards Grid */}
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }, gap: 3 }}>
          <Box>
            <ReportCard
              icon={<InventoryIcon sx={{ fontSize: 32, color: '#f59e0b' }} />}
              title="Distribution Reports"
              description="Comprehensive overview of fertilizer and seed distributions across all barangays"
              lastGenerated="Today at 2:30 PM"
              onExport={() => handleExport('distribution')}
            />
          </Box>

          <Box>
            <ReportCard
              icon={<FarmerIcon sx={{ fontSize: 32, color: '#185c37' }} />}
              title="Farmer Statistics"
              description="Detailed analysis of farmer registrations, demographics, and farm data"
              lastGenerated="Yesterday at 5:15 PM"
              onExport={() => handleExport('farmers')}
            />
          </Box>

          <Box>
            <ReportCard
              icon={<ResourceIcon sx={{ fontSize: 32, color: '#1a223f' }} />}
              title="Resource Utilization"
              description="Track inventory usage, costs, and distribution efficiency metrics"
              lastGenerated="2 days ago"
              onExport={() => handleExport('resources')}
            />
          </Box>

          <Box>
            <ReportCard
              icon={<ComplianceIcon sx={{ fontSize: 32, color: '#2563eb' }} />}
              title="Compliance Report"
              description="Monitor data quality, completeness, and regulatory compliance"
              lastGenerated="3 days ago"
              onExport={() => handleExport('compliance')}
            />
          </Box>
        </Box>
      </Box>
    </FullLayout>
  );
}