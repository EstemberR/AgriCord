import { useState, useMemo } from 'react';
import FullLayout from '@/layouts/full/FullLayout';
import { usePage } from '@inertiajs/react';
import {
  tableHeaderStyle,
  tableContainerStyle,
  tableRowHoverStyle,
  tableCellStyle,
  tablePaginationStyle,
  defaultRowsPerPageOptions
} from '@/components/table/CustomTableStyle';
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
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  IconButton,
  Chip,
  Grid,
  TablePagination,
  InputAdornment,
  Tooltip,
  Modal,
  Button,
} from '@mui/material';
import {
  Search as SearchIcon,
  Visibility as VisibilityIcon,
  Science as ScienceIcon,
  Agriculture as AgricultureIcon,
  CheckCircle as CheckCircleIcon,
  Download as DownloadIcon,
  Schedule as ScheduleIcon,
  Warning as WarningIcon,
  History as HistoryIcon,
  LocalShipping as LocalShippingIcon,
} from '@mui/icons-material';
import StatisticsCard from '@/components/cards/StatisticsCard';

interface Distribution {
  id: number;
  distribution_id: string;
  date: string;
  time: string;
  datetime: string;
  item_type: string;
  item_name: string;
  crop_type: string | null;
  variety: string | null;
  farmer_name: string;
  farmer_id: number;
  barangay: string;
  quantity: string;
  unit: string;
  status: string;
  distributed_by: string;
  notes: string | null;
}

interface Admin {
  id: number;
  name: string;
}

interface Props {
  statistics: {
    totalDistributions: number;
    totalFertilizerDistributed: string;
    totalSeedsDistributed: string;
    thisMonthDistributions: number;
  };
  distributions: Distribution[];
  itemNames: string[];
  barangays: string[];
  admins: Admin[];
}

function DistributionHistory() {
  const { statistics, distributions, itemNames, barangays, admins } = usePage<Props>().props;
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterItemType, setFilterItemType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterBarangay, setFilterBarangay] = useState('all');
  const [filterItemName, setFilterItemName] = useState('all');
  const [filterDistributedBy, setFilterDistributedBy] = useState('all');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(50);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedDistribution, setSelectedDistribution] = useState<Distribution | null>(null);

  // Filter distributions
  const filteredDistributions = useMemo(() => {
    return distributions.filter((dist) => {
      const matchesSearch =
        dist.farmer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        dist.distribution_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        dist.item_name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesItemType = filterItemType === 'all' || dist.item_type === filterItemType;
      const matchesStatus = filterStatus === 'all' || dist.status === filterStatus;
      const matchesBarangay = filterBarangay === 'all' || dist.barangay === filterBarangay;
      const matchesItemName = filterItemName === 'all' || dist.item_name === filterItemName;
      const matchesDistributedBy = filterDistributedBy === 'all' || dist.distributed_by === filterDistributedBy;
      return matchesSearch && matchesItemType && matchesStatus && matchesBarangay && matchesItemName && matchesDistributedBy;
    });
  }, [distributions, searchTerm, filterItemType, filterStatus, filterBarangay, filterItemName, filterDistributedBy]);

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleViewDetails = (distribution: Distribution) => {
    setSelectedDistribution(distribution);
    setViewModalOpen(true);
  };

  const handleCloseViewModal = () => {
    setViewModalOpen(false);
    setSelectedDistribution(null);
  };

  const handleDownloadReceipt = (distribution: Distribution) => {
    // Send request to download the receipt
    window.location.href = `/download-receipt/${distribution.id}`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'success';
      case 'pending': return 'warning';
      case 'cancelled': return 'error';
      default: return 'default';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircleIcon fontSize="small" />;
      case 'pending': return <ScheduleIcon fontSize="small" />;
      case 'cancelled': return <WarningIcon fontSize="small" />;
      default: return null;
    }
  };

  const getItemTypeIcon = (type: string) => {
    return type === 'fertilizer' ? '🧪' : '🌱';
  };

  return (
    <FullLayout>
      <Box sx={{ p: 3 }}>

        {/* Summary Cards */}
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }, gap: 2, mb: 3 }}>
          <Card sx={{ bgcolor: '#1e293b', color: 'white', maxHeight: 130, borderRadius: 2, boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)' }}>
            <CardContent sx={{ p: 2.5, position: 'relative' }}>
              <Box sx={{ position: 'absolute', top: 12, right: 12, bgcolor: 'rgba(255,255,255,0.1)', borderRadius: 2, p: 1 }}>
                <HistoryIcon sx={{ fontSize: 28, color: '#000080' }} />
              </Box>
              <Typography variant="subtitle2" sx={{ opacity: 0.9, mb: 0.5, fontWeight: 600 }}>
                All Time
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.25 }}>
                {statistics.totalDistributions}
              </Typography>
              <Typography variant="caption" sx={{ opacity: 0.7 }}>
                Total Distributions
              </Typography>
            </CardContent>
          </Card>

          <Card sx={{ bgcolor: '#1e293b', color: 'white', maxHeight: 130, borderRadius: 2, boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)' }}>
            <CardContent sx={{ p: 2.5, position: 'relative' }}>
              <Box sx={{ position: 'absolute', top: 12, right: 12, bgcolor: 'rgba(255,255,255,0.1)', borderRadius: 2, p: 1 }}>
                <ScienceIcon sx={{ fontSize: 28, color: '#006400' }} />
              </Box>
              <Typography variant="subtitle2" sx={{ opacity: 0.9, mb: 0.5, fontWeight: 600 }}>
                Fertilizer
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.25 }}>
                {statistics.totalFertilizerDistributed}
              </Typography>
              <Typography variant="caption" sx={{ opacity: 0.7 }}>
                Kilograms Total
              </Typography>
            </CardContent>
          </Card>

          <Card sx={{ bgcolor: '#1e293b', color: 'white', maxHeight: 130, borderRadius: 2, boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)' }}>
            <CardContent sx={{ p: 2.5, position: 'relative' }}>
              <Box sx={{ position: 'absolute', top: 12, right: 12, bgcolor: 'rgba(255,255,255,0.1)', borderRadius: 2, p: 1 }}>
                <AgricultureIcon sx={{ fontSize: 28, color: '#FFA500' }} />
              </Box>
              <Typography variant="subtitle2" sx={{ opacity: 0.9, mb: 0.5, fontWeight: 600 }}>
                Seeds
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.25 }}>
                {statistics.totalSeedsDistributed}
              </Typography>
              <Typography variant="caption" sx={{ opacity: 0.7 }}>
                Kilograms Total
              </Typography>
            </CardContent>
          </Card>

          <Card sx={{ bgcolor: '#1e293b', color: 'white', maxHeight: 130, borderRadius: 2, boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)' }}>
            <CardContent sx={{ p: 2.5, position: 'relative' }}>
              <Box sx={{ position: 'absolute', top: 12, right: 12, bgcolor: 'rgba(255,255,255,0.1)', borderRadius: 2, p: 1 }}>
                <CheckCircleIcon sx={{ fontSize: 28, color: '#808080' }} />
              </Box>
              <Typography variant="subtitle2" sx={{ opacity: 0.9, mb: 0.5, fontWeight: 600 }}>
                This Month
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.25 }}>
                {statistics.thisMonthDistributions}
              </Typography>
              <Typography variant="caption" sx={{ opacity: 0.7 }}>
                Distributions
              </Typography>
            </CardContent>
          </Card>
        </Box>

        {/* Filters */}
        <Card sx={{ 
          mb: 3,
          bgcolor: '#2C3E50',
          color: 'white',
          borderRadius: 2,
          boxShadow: '0 2px 8px rgba(30, 41, 59, 0.15)'
        }}>
          <CardContent sx={{ p: 2.5 }}>
            <Grid container spacing={6}>
              <Grid item xs={12} md={2}>
                <TextField
                  fullWidth
                  size="small"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12} md={2}>
                <FormControl fullWidth size="small">
                  <InputLabel>Type</InputLabel>
                  <Select
                    value={filterItemType}
                    label="Type"
                    onChange={(e) => setFilterItemType(e.target.value)}
                  >
                    <MenuItem value="all">All Types</MenuItem>
                    <MenuItem value="fertilizer">Fertilizer</MenuItem>
                    <MenuItem value="seed">Seed</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={2}>
                <FormControl fullWidth size="small">
                  <InputLabel>Item</InputLabel>
                  <Select
                    value={filterItemName}
                    label="Item"
                    onChange={(e) => setFilterItemName(e.target.value)}
                  >
                    <MenuItem value="all">All Items</MenuItem>
                    {itemNames.map((name) => (
                      <MenuItem key={name} value={name}>
                        {name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={2}>
                <FormControl fullWidth size="small">
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={filterStatus}
                    label="Status"
                    onChange={(e) => setFilterStatus(e.target.value)}
                  >
                    <MenuItem value="all">All Status</MenuItem>
                    <MenuItem value="completed">Completed</MenuItem>
                    <MenuItem value="pending">Pending</MenuItem>
                    <MenuItem value="cancelled">Cancelled</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={2}>
                <FormControl fullWidth size="small">
                  <InputLabel>Barangay</InputLabel>
                  <Select
                    value={filterBarangay}
                    label="Barangay"
                    onChange={(e) => setFilterBarangay(e.target.value)}
                  >
                    <MenuItem value="all">All Barangays</MenuItem>
                    {barangays.map((barangay) => (
                      <MenuItem key={barangay} value={barangay}>
                        {barangay}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={2}>
                <FormControl fullWidth size="small">
                  <InputLabel>Distributed By</InputLabel>
                  <Select
                    value={filterDistributedBy}
                    label="Distributed By"
                    onChange={(e) => setFilterDistributedBy(e.target.value)}
                  >
                    <MenuItem value="all">All Users</MenuItem>
                    {admins.map((admin) => (
                      <MenuItem key={admin.id} value={admin.name}>
                        {admin.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Distribution Table */}
        <Card sx={tableContainerStyle}>
          <TableContainer>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ ...tableHeaderStyle, color: 'white' }}>Date & Time</TableCell>
                  <TableCell sx={{ ...tableHeaderStyle, color: 'white' }}>Type</TableCell>
                  <TableCell sx={{ ...tableHeaderStyle, color: 'white' }}>Item Name</TableCell>
                  <TableCell sx={{ ...tableHeaderStyle, color: 'white' }}>Farmer</TableCell>
                  <TableCell sx={{ ...tableHeaderStyle, color: 'white' }}>Barangay</TableCell>
                  <TableCell sx={{ ...tableHeaderStyle, color: 'white' }}>Quantity</TableCell>
                  <TableCell sx={{ ...tableHeaderStyle, color: 'white' }}>Status</TableCell>
                  <TableCell sx={{ ...tableHeaderStyle, color: 'white' }}>Distributed By</TableCell>
                  <TableCell sx={{ ...tableHeaderStyle, color: 'white', textAlign: 'center' }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredDistributions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} align="center" sx={{ py: 4 }}>
                      <Typography color="text.secondary">
                        No distribution records found
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredDistributions
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((dist) => (
                      <TableRow key={dist.id} sx={tableRowHoverStyle}>
                        <TableCell sx={{ ...tableCellStyle, color: 'white' }}>
                          <Typography variant="body2" sx={{ color: 'white' }}>{dist.date}</Typography>
                          <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)' }}>{dist.time}</Typography>
                        </TableCell>
                        <TableCell sx={{ ...tableCellStyle, color: 'white' }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <span>{getItemTypeIcon(dist.item_type)}</span>
                            <Typography variant="body2" sx={{ color: 'white' }}>
                              {dist.item_type.charAt(0).toUpperCase() + dist.item_type.slice(1)}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell sx={{ ...tableCellStyle, color: 'white' }}>
                          <Typography variant="body2" sx={{ color: 'white' }}>{dist.item_name}</Typography>
                          {dist.crop_type && (
                            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                              {dist.crop_type} {dist.variety ? `(${dist.variety})` : ''}
                            </Typography>
                          )}
                        </TableCell>
                        <TableCell sx={{ ...tableCellStyle, color: 'white' }}>{dist.farmer_name}</TableCell>
                        <TableCell sx={{ ...tableCellStyle, color: 'white' }}>{dist.barangay}</TableCell>
                        <TableCell sx={{ ...tableCellStyle, color: 'white' }}>
                          {dist.quantity} {dist.unit}
                        </TableCell>
                        <TableCell sx={tableCellStyle}>
                          <Chip
                            icon={getStatusIcon(dist.status)}
                            label={dist.status.charAt(0).toUpperCase() + dist.status.slice(1)}
                            color={getStatusColor(dist.status)}
                            size="small"
                            sx={{ height: 20, fontSize: '0.7rem' }}
                          />
                        </TableCell>
                        <TableCell sx={{...tableCellStyle, color: 'white'}}>{dist.distributed_by}</TableCell>
                        <TableCell sx={{ ...tableCellStyle, textAlign: 'center' }}>
                          <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'center' }}>
                            <Tooltip title="View Details">
                              <IconButton 
                                size="small" 
                                onClick={() => handleViewDetails(dist)}
                                sx={{ color: '#ffffff' }}
                              >
                                <VisibilityIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Download Receipt">
                              <IconButton 
                                size="small" 
                                onClick={() => handleDownloadReceipt(dist)}
                                sx={{ color: '#ffffff' }}
                              >
                                <DownloadIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </Box>
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

        {/* View Details Modal */}
        <Modal open={viewModalOpen} onClose={handleCloseViewModal}>
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: { xs: '90%', sm: 600 },
              bgcolor: 'background.paper',
              borderRadius: 2,
              boxShadow: 24,
              p: 4,
            }}
          >
            {selectedDistribution && (
              <>
                <Typography variant="h6" sx={{ mb: 3, fontWeight: 600, color: '#1e293b' }}>
                  Distribution Details
                </Typography>
                
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Box sx={{ mb: 2, p: 2, bgcolor: '#f8fafc', borderRadius: 1 }}>
                      <Typography variant="subtitle2" sx={{ color: '#64748b', mb: 1 }}>
                        Distribution ID
                      </Typography>
                      <Typography variant="body1" sx={{ color: '#1e293b', fontWeight: 600 }}>
                        {selectedDistribution.distribution_id}
                      </Typography>
                    </Box>
                  </Grid>

                  <Grid item xs={6}>
                    <Box sx={{ mb: 2, p: 2, bgcolor: '#f8fafc', borderRadius: 1 }}>
                      <Typography variant="subtitle2" sx={{ color: '#64748b', mb: 1 }}>
                        Date
                      </Typography>
                      <Typography variant="body1" sx={{ color: '#1e293b' }}>
                        {selectedDistribution.date}
                      </Typography>
                    </Box>
                  </Grid>

                  <Grid item xs={6}>
                    <Box sx={{ mb: 2, p: 2, bgcolor: '#f8fafc', borderRadius: 1 }}>
                      <Typography variant="subtitle2" sx={{ color: '#64748b', mb: 1 }}>
                        Time
                      </Typography>
                      <Typography variant="body1" sx={{ color: '#1e293b' }}>
                        {selectedDistribution.time}
                      </Typography>
                    </Box>
                  </Grid>

                  <Grid item xs={6}>
                    <Box sx={{ mb: 2, p: 2, bgcolor: '#f8fafc', borderRadius: 1 }}>
                      <Typography variant="subtitle2" sx={{ color: '#64748b', mb: 1 }}>
                        Farmer Name
                      </Typography>
                      <Typography variant="body1" sx={{ color: '#1e293b' }}>
                        {selectedDistribution.farmer_name}
                      </Typography>
                    </Box>
                  </Grid>

                  <Grid item xs={6}>
                    <Box sx={{ mb: 2, p: 2, bgcolor: '#f8fafc', borderRadius: 1 }}>
                      <Typography variant="subtitle2" sx={{ color: '#64748b', mb: 1 }}>
                        Barangay
                      </Typography>
                      <Typography variant="body1" sx={{ color: '#1e293b' }}>
                        {selectedDistribution.barangay}
                      </Typography>
                    </Box>
                  </Grid>

                  <Grid item xs={6}>
                    <Box sx={{ mb: 2, p: 2, bgcolor: '#f8fafc', borderRadius: 1 }}>
                      <Typography variant="subtitle2" sx={{ color: '#64748b', mb: 1 }}>
                        Item Type
                      </Typography>
                      <Typography variant="body1" sx={{ color: '#1e293b' }}>
                        {selectedDistribution.item_type.charAt(0).toUpperCase() + selectedDistribution.item_type.slice(1)}
                      </Typography>
                    </Box>
                  </Grid>

                  <Grid item xs={6}>
                    <Box sx={{ mb: 2, p: 2, bgcolor: '#f8fafc', borderRadius: 1 }}>
                      <Typography variant="subtitle2" sx={{ color: '#64748b', mb: 1 }}>
                        Item Name
                      </Typography>
                      <Typography variant="body1" sx={{ color: '#1e293b' }}>
                        {selectedDistribution.item_name}
                      </Typography>
                    </Box>
                  </Grid>

                  {selectedDistribution.crop_type && (
                    <Grid item xs={6}>
                      <Box sx={{ mb: 2, p: 2, bgcolor: '#f8fafc', borderRadius: 1 }}>
                        <Typography variant="subtitle2" sx={{ color: '#64748b', mb: 1 }}>
                          Crop Type
                        </Typography>
                        <Typography variant="body1" sx={{ color: '#1e293b' }}>
                          {selectedDistribution.crop_type}
                        </Typography>
                      </Box>
                    </Grid>
                  )}

                  {selectedDistribution.variety && (
                    <Grid item xs={6}>
                      <Box sx={{ mb: 2, p: 2, bgcolor: '#f8fafc', borderRadius: 1 }}>
                        <Typography variant="subtitle2" sx={{ color: '#64748b', mb: 1 }}>
                          Variety
                        </Typography>
                        <Typography variant="body1" sx={{ color: '#1e293b' }}>
                          {selectedDistribution.variety}
                        </Typography>
                      </Box>
                    </Grid>
                  )}

                  <Grid item xs={6}>
                    <Box sx={{ mb: 2, p: 2, bgcolor: '#f8fafc', borderRadius: 1 }}>
                      <Typography variant="subtitle2" sx={{ color: '#64748b', mb: 1 }}>
                        Quantity
                      </Typography>
                      <Typography variant="body1" sx={{ color: '#1e293b' }}>
                        {selectedDistribution.quantity} {selectedDistribution.unit}
                      </Typography>
                    </Box>
                  </Grid>

                  <Grid item xs={6}>
                    <Box sx={{ mb: 2, p: 2, bgcolor: '#f8fafc', borderRadius: 1 }}>
                      <Typography variant="subtitle2" sx={{ color: '#64748b', mb: 1 }}>
                        Status
                      </Typography>
                      <Chip
                        label={selectedDistribution.status.charAt(0).toUpperCase() + selectedDistribution.status.slice(1)}
                        color={getStatusColor(selectedDistribution.status)}
                        size="small"
                        icon={getStatusIcon(selectedDistribution.status)}
                        sx={{ height: 24 }}
                      />
                    </Box>
                  </Grid>

                  <Grid item xs={12}>
                    <Box sx={{ mb: 2, p: 2, bgcolor: '#f8fafc', borderRadius: 1 }}>
                      <Typography variant="subtitle2" sx={{ color: '#64748b', mb: 1 }}>
                        Distributed By
                      </Typography>
                      <Typography variant="body1" sx={{ color: '#1e293b' }}>
                        {selectedDistribution.distributed_by}
                      </Typography>
                    </Box>
                  </Grid>

                  {selectedDistribution.notes && (
                    <Grid item xs={12}>
                      <Box sx={{ mb: 2, p: 2, bgcolor: '#f8fafc', borderRadius: 1 }}>
                        <Typography variant="subtitle2" sx={{ color: '#64748b', mb: 1 }}>
                          Notes
                        </Typography>
                        <Typography variant="body1" sx={{ color: '#1e293b' }}>
                          {selectedDistribution.notes}
                        </Typography>
                      </Box>
                    </Grid>
                  )}
                </Grid>

                <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                  <Button
                    variant="outlined"
                    onClick={handleCloseViewModal}
                    sx={{ color: '#64748b', borderColor: '#64748b' }}
                  >
                    Close
                  </Button>
                  <Button
                    variant="contained"
                    startIcon={<DownloadIcon />}
                    onClick={() => handleDownloadReceipt(selectedDistribution)}
                    sx={{ 
                      bgcolor: '#1e293b',
                      '&:hover': { bgcolor: '#334155' }
                    }}
                  >
                    Download Receipt
                  </Button>
                </Box>
              </>
            )}
          </Box>
        </Modal>
      </Box>
    </FullLayout>
  );
}

export default DistributionHistory;
