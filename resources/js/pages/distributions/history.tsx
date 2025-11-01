import { useState } from 'react';
import { Head } from '@inertiajs/react';
import FullLayout from '@/layouts/full/FullLayout';
import {
  Box,
  Typography,
  Card,
  CardContent,
  TextField,
  MenuItem,
  InputAdornment,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TableSortLabel,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
  Grid,
} from '@mui/material';
import {
  Search as SearchIcon,
  Close as CloseIcon,
  Info as InfoIcon,
  LocalShipping as LocalShippingIcon,
  Science as ScienceIcon,
  History as HistoryIcon,
  CheckCircle as CheckCircleIcon,
  Schedule as ScheduleIcon,
  Warning as WarningIcon,
} from '@mui/icons-material';
import {
  tableHeaderStyle,
  tableContainerStyle,
  tableRowHoverStyle,
  tableCellStyle,
  tablePaginationStyle,
  defaultRowsPerPageOptions
} from '@/components/table/CustomTableStyle';

interface Distribution {
  id: number;
  distribution_id: string;
  date: string;
  farmer_name: string;
  item_type: 'seed' | 'fertilizer';
  item_name: string;
  quantity: string;
  unit: string;
  status: string;
  distributed_by: string;
  notes: string | null;
}

interface Statistics {
  totalDistributions: number;
  totalFertilizerDistributed: number;
  totalSeedsDistributed: number;
  thisMonthDistributions: number;
}

interface HistoryPageProps {
  distributions: Distribution[];
  statistics: Statistics;
}

type Order = 'asc' | 'desc';

export default function DistributionHistory({ distributions, statistics }: HistoryPageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterItemType, setFilterItemType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [orderBy, setOrderBy] = useState<keyof Distribution>('date');
  const [order, setOrder] = useState<Order>('desc');
  const [detailsDialog, setDetailsDialog] = useState<{
    open: boolean;
    distribution: Distribution | null;
  }>({
    open: false,
    distribution: null,
  });

  // Filter data
  const filteredDistributions = distributions.filter((dist) => {
    const matchesSearch =
      dist.farmer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dist.distribution_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dist.item_name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesItemType = filterItemType === 'all' || dist.item_type === filterItemType;
    const matchesStatus = filterStatus === 'all' || dist.status === filterStatus;
    
    return matchesSearch && matchesItemType && matchesStatus;
  });

  // Sort data
  const sortedDistributions = [...filteredDistributions].sort((a, b) => {
    const aValue = a[orderBy];
    const bValue = b[orderBy];
    if (aValue === null || bValue === null) return 0;
    if (aValue < bValue) return order === 'asc' ? -1 : 1;
    if (aValue > bValue) return order === 'asc' ? 1 : -1;
    return 0;
  });

  // Paginate data
  const paginatedDistributions = sortedDistributions.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const handleSort = (property: keyof Distribution) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleOpenDetails = (distribution: Distribution) => {
    setDetailsDialog({ open: true, distribution });
  };

  const handleCloseDetails = () => {
    setDetailsDialog({ open: false, distribution: null });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircleIcon fontSize="small" />;
      case 'pending': return <ScheduleIcon fontSize="small" />;
      case 'cancelled': return <WarningIcon fontSize="small" />;
      default: return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'success';
      case 'pending': return 'warning';
      case 'cancelled': return 'error';
      default: return 'default';
    }
  };

  return (
    <FullLayout>
      <Head title="Distribution History" />
      <Box sx={{ p: 3 }}>
        {/* Page Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" sx={{ fontWeight: 700, color: '#2C3E50' }}>
            Distribution History
          </Typography>
        </Box>

        {/* Summary Cards */}
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6} lg={3}>
            <Card sx={{ bgcolor: '#000080', color: 'white', height: '100%', borderRadius: 2 }}>
              <CardContent sx={{ p: 2.5 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <Box>
                    <Typography variant="body2" sx={{ opacity: 0.9, mb: 1, fontSize: '0.8rem' }}>
                      Total Distributions
                    </Typography>
                    <Typography variant="h4" sx={{ mb: 0.5, fontWeight: 700 }}>
                      {statistics.totalDistributions}
                    </Typography>
                  </Box>
                  <Box sx={{ bgcolor: 'rgba(255,255,255,0.2)', p: 1, borderRadius: 2 }}>
                    <HistoryIcon sx={{ fontSize: 20 }} />
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} lg={3}>
            <Card sx={{ bgcolor: '#013220', color: 'white', height: '100%', borderRadius: 2 }}>
              <CardContent sx={{ p: 2.5 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <Box>
                    <Typography variant="body2" sx={{ opacity: 0.9, mb: 1, fontSize: '0.8rem' }}>
                      Total Fertilizer
                    </Typography>
                    <Typography variant="h4" sx={{ mb: 0.5, fontWeight: 700 }}>
                      {statistics.totalFertilizerDistributed}
                    </Typography>
                    <Typography variant="caption" sx={{ opacity: 0.7 }}>Kilograms</Typography>
                  </Box>
                  <Box sx={{ bgcolor: 'rgba(255,255,255,0.2)', p: 1, borderRadius: 2 }}>
                    <ScienceIcon sx={{ fontSize: 20 }} />
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} lg={3}>
            <Card sx={{ bgcolor: '#ffa726', color: 'white', height: '100%', borderRadius: 2 }}>
              <CardContent sx={{ p: 2.5 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <Box>
                    <Typography variant="body2" sx={{ opacity: 0.9, mb: 1, fontSize: '0.8rem' }}>
                      Total Seeds
                    </Typography>
                    <Typography variant="h4" sx={{ mb: 0.5, fontWeight: 700 }}>
                      {statistics.totalSeedsDistributed}
                    </Typography>
                    <Typography variant="caption" sx={{ opacity: 0.7 }}>Kilograms</Typography>
                  </Box>
                  <Box sx={{ bgcolor: 'rgba(255,255,255,0.2)', p: 1, borderRadius: 2 }}>
                    <LocalShippingIcon sx={{ fontSize: 20 }} />
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} lg={3}>
            <Card sx={{ bgcolor: '#64748B', color: 'white', height: '100%', borderRadius: 2 }}>
              <CardContent sx={{ p: 2.5 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <Box>
                    <Typography variant="body2" sx={{ opacity: 0.9, mb: 1, fontSize: '0.8rem' }}>
                      This Month
                    </Typography>
                    <Typography variant="h4" sx={{ mb: 0.5, fontWeight: 700 }}>
                      {statistics.thisMonthDistributions}
                    </Typography>
                    <Typography variant="caption" sx={{ opacity: 0.7 }}>New Distributions</Typography>
                  </Box>
                  <Box sx={{ bgcolor: 'rgba(255,255,255,0.2)', p: 1, borderRadius: 2 }}>
                    <CheckCircleIcon sx={{ fontSize: 20 }} />
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Filters */}
        <Card sx={{ mb: 3, bgcolor: '#2C3E50', color: 'white', borderRadius: 2 }}>
          <CardContent sx={{ p: 2.5 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  fullWidth
                  size="small"
                  placeholder="Search by ID, farmer, or item..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon sx={{ color: '#667eea' }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      color: 'white',
                      '& fieldset': {
                        borderColor: 'rgba(255, 255, 255, 0.3)',
                      },
                      '&:hover fieldset': {
                        borderColor: 'rgba(255, 255, 255, 0.5)',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#667eea',
                      },
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  select
                  fullWidth
                  size="small"
                  label="Item Type"
                  value={filterItemType}
                  onChange={(e) => setFilterItemType(e.target.value)}
                  InputLabelProps={{
                    sx: { color: 'rgba(255, 255, 255, 0.7)' },
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      color: 'white',
                      '& fieldset': {
                        borderColor: 'rgba(255, 255, 255, 0.3)',
                      },
                      '&:hover fieldset': {
                        borderColor: 'rgba(255, 255, 255, 0.5)',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#667eea',
                      },
                    },
                  }}
                >
                  <MenuItem value="all">All Types</MenuItem>
                  <MenuItem value="fertilizer">Fertilizer</MenuItem>
                  <MenuItem value="seed">Seeds</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  select
                  fullWidth
                  size="small"
                  label="Status"
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  InputLabelProps={{
                    sx: { color: 'rgba(255, 255, 255, 0.7)' },
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      color: 'white',
                      '& fieldset': {
                        borderColor: 'rgba(255, 255, 255, 0.3)',
                      },
                      '&:hover fieldset': {
                        borderColor: 'rgba(255, 255, 255, 0.5)',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#667eea',
                      },
                    },
                  }}
                >
                  <MenuItem value="all">All Status</MenuItem>
                  <MenuItem value="completed">Completed</MenuItem>
                  <MenuItem value="pending">Pending</MenuItem>
                  <MenuItem value="cancelled">Cancelled</MenuItem>
                </TextField>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* History Table */}
        <Card sx={tableContainerStyle}>
          <TableContainer>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell sx={{...tableHeaderStyle, color: 'white'}}>
                    <TableSortLabel
                      active={orderBy === 'distribution_id'}
                      direction={orderBy === 'distribution_id' ? order : 'asc'}
                      onClick={() => handleSort('distribution_id')}
                      sx={{ color: 'white !important' }}
                    >
                      Distribution ID
                    </TableSortLabel>
                  </TableCell>
                  <TableCell sx={{...tableHeaderStyle, color: 'white'}}>
                    <TableSortLabel
                      active={orderBy === 'date'}
                      direction={orderBy === 'date' ? order : 'asc'}
                      onClick={() => handleSort('date')}
                      sx={{ color: 'white !important' }}
                    >
                      Date
                    </TableSortLabel>
                  </TableCell>
                  <TableCell sx={{...tableHeaderStyle, color: 'white'}}>
                    <TableSortLabel
                      active={orderBy === 'farmer_name'}
                      direction={orderBy === 'farmer_name' ? order : 'asc'}
                      onClick={() => handleSort('farmer_name')}
                      sx={{ color: 'white !important' }}
                    >
                      Farmer Name
                    </TableSortLabel>
                  </TableCell>
                  <TableCell sx={{...tableHeaderStyle, color: 'white'}}>Item Type</TableCell>
                  <TableCell sx={{...tableHeaderStyle, color: 'white'}}>Item Name</TableCell>
                  <TableCell sx={{...tableHeaderStyle, color: 'white'}}>Quantity</TableCell>
                  <TableCell sx={{...tableHeaderStyle, color: 'white'}}>Status</TableCell>
                  <TableCell sx={{...tableHeaderStyle, color: 'white'}}>Distributed By</TableCell>
                  <TableCell sx={{...tableHeaderStyle, color: 'white', textAlign: 'center'}}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedDistributions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} align="center" sx={{ py: 6 }}>
                      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
                        <HistoryIcon sx={{ fontSize: 48, color: 'white', opacity: 0.7, mb: 1 }} />
                        <Typography variant="h6" sx={{ color: 'white', opacity: 0.9 }}>
                          No distribution records found
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'white', opacity: 0.7 }}>
                          Try adjusting your filters to find what you're looking for
                        </Typography>
                      </Box>
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedDistributions.map((dist) => (
                    <TableRow key={dist.id} sx={tableRowHoverStyle}>
                      <TableCell sx={{...tableCellStyle, color: '#667eea', fontWeight: 600}}>
                        {dist.distribution_id}
                      </TableCell>
                      <TableCell sx={{...tableCellStyle, color: 'white'}}>{dist.date}</TableCell>
                      <TableCell sx={{...tableCellStyle, color: 'white', fontWeight: 500}}>
                        {dist.farmer_name}
                      </TableCell>
                      <TableCell sx={{...tableCellStyle, color: 'white'}}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          {dist.item_type === 'fertilizer' ? (
                            <ScienceIcon sx={{ fontSize: 18 }} />
                          ) : (
                            <LocalShippingIcon sx={{ fontSize: 18 }} />
                          )}
                          {dist.item_type.charAt(0).toUpperCase() + dist.item_type.slice(1)}
                        </Box>
                      </TableCell>
                      <TableCell sx={{...tableCellStyle, color: 'white'}}>{dist.item_name}</TableCell>
                      <TableCell sx={{...tableCellStyle, color: 'white'}}>
                        {dist.quantity} {dist.unit}
                      </TableCell>
                      <TableCell sx={tableCellStyle}>
                        <Chip
                          icon={getStatusIcon(dist.status)}
                          label={dist.status.charAt(0).toUpperCase() + dist.status.slice(1)}
                          color={getStatusColor(dist.status)}
                          size="small"
                          sx={{ fontSize: '0.75rem', fontWeight: 600 }}
                        />
                      </TableCell>
                      <TableCell sx={{...tableCellStyle, color: 'white'}}>{dist.distributed_by}</TableCell>
                      <TableCell sx={{...tableCellStyle, textAlign: 'center'}}>
                        <IconButton
                          size="small"
                          onClick={() => handleOpenDetails(dist)}
                          sx={{ color: '#000080' }}
                        >
                          <InfoIcon fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={defaultRowsPerPageOptions}
            component="div"
            count={filteredDistributions.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            sx={{
              ...tablePaginationStyle,
              color: 'white',
              '.MuiTablePagination-select': {
                color: 'white'
              },
              '.MuiTablePagination-selectLabel': {
                color: 'white'
              },
              '.MuiTablePagination-displayedRows': {
                color: 'white'
              },
              '.MuiTablePagination-selectIcon': {
                color: 'white'
              },
              '.MuiTablePagination-actions': {
                color: 'white',
                '& .MuiIconButton-root': {
                  color: 'white'
                }
              }
            }}
          />
        </Card>

        {/* Details Dialog */}
        <Dialog
          open={detailsDialog.open}
          onClose={handleCloseDetails}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle sx={{ pr: 6 }}>
            Distribution Details
            <IconButton
              onClick={handleCloseDetails}
              sx={{ position: 'absolute', right: 8, top: 8 }}
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent dividers>
            {detailsDialog.distribution && (
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="textSecondary">Distribution ID</Typography>
                  <Typography variant="body1" gutterBottom>{detailsDialog.distribution.distribution_id}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="textSecondary">Date</Typography>
                  <Typography variant="body1" gutterBottom>{detailsDialog.distribution.date}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="textSecondary">Beneficiary Farmer</Typography>
                  <Typography variant="body1" gutterBottom>{detailsDialog.distribution.farmer_name}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="textSecondary">Item Type</Typography>
                  <Typography variant="body1" gutterBottom>
                    {detailsDialog.distribution.item_type.charAt(0).toUpperCase() + 
                     detailsDialog.distribution.item_type.slice(1)}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="textSecondary">Item Name</Typography>
                  <Typography variant="body1" gutterBottom>{detailsDialog.distribution.item_name}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="textSecondary">Quantity</Typography>
                  <Typography variant="body1" gutterBottom>
                    {detailsDialog.distribution.quantity} {detailsDialog.distribution.unit}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="textSecondary">Status</Typography>
                  <Chip
                    icon={getStatusIcon(detailsDialog.distribution.status)}
                    label={detailsDialog.distribution.status.charAt(0).toUpperCase() + 
                           detailsDialog.distribution.status.slice(1)}
                    color={getStatusColor(detailsDialog.distribution.status)}
                    size="small"
                    sx={{ mt: 0.5 }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="textSecondary">Distributed By</Typography>
                  <Typography variant="body1" gutterBottom>{detailsDialog.distribution.distributed_by}</Typography>
                </Grid>
                {detailsDialog.distribution.notes && (
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" color="textSecondary">Notes</Typography>
                    <Typography variant="body1" gutterBottom>{detailsDialog.distribution.notes}</Typography>
                  </Grid>
                )}
              </Grid>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDetails}>Close</Button>
          </DialogActions>
        </Dialog>
      </Box>
    </FullLayout>
  );
}