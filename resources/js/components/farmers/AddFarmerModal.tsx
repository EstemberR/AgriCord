import { useForm } from '@inertiajs/react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Box,
  Stack,
  Card,
  CardHeader,
  CardContent,
  Typography,
  IconButton,
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { useState } from 'react';

interface AddFarmerModalProps {
  open: boolean;
  onClose: () => void;
}

export default function AddFarmerModal({ open, onClose }: AddFarmerModalProps) {
  const { data, setData, post, processing, errors, reset } = useForm({
    // Personal Information
    full_name: '',
    date_of_birth: '',
    gender: '',
    civil_status: '',
    contact_number: '',
    email: '',
    address_purok: '',
    address_barangay: '',
    address_municipality: '',
    address_province: '',
    nationality: '',

    // Identification
    voters_id_number: '',
    voters_certification_number: '',
    passport_photo: null as File | null,

    // Farm Information
    farm_name: '',
    farm_location: '',
    farm_size: 0,
    land_ownership_type: 'owner',
    farming_experience_months: 0,
    farming_experience_years: 0,

    // Additional Information
    emergency_contact_person: '',
    emergency_contact_number: '',
  });

  // Predefined crop types
  const cropTypes = [
    'Rice (Palay)',
    'Corn',
    'Coconut',
    'Sugarcane',
    'Banana',
    'Cassava',
  ];

  // Common TextField styling with elegant dark theme
  const textFieldStyle = {
    '& .MuiInputLabel-root': {
      color: 'rgba(255,255,255,0.7)',
      fontWeight: 500,
    },
    '& .MuiInputBase-input': {
      color: 'white',
      fontWeight: 400,
    },
    '& .MuiOutlinedInput-root': {
      backgroundColor: 'rgba(255,255,255,0.05)',
      transition: 'all 0.2s ease',
      '& fieldset': {
        borderColor: 'rgba(255,255,255,0.1)',
        borderWidth: '1px',
      },
      '&:hover': {
        backgroundColor: 'rgba(255,255,255,0.08)',
      },
      '&:hover fieldset': {
        borderColor: 'rgba(255,255,255,0.2)',
      },
      '&.Mui-focused': {
        backgroundColor: 'rgba(255,255,255,0.1)',
        '& fieldset': {
          borderColor: 'rgba(255,255,255,0.3)',
          borderWidth: '1px',
        },
      },
    },
    '& .MuiInputBase-input::placeholder': {
      color: 'rgba(255,255,255,0.5)',
      opacity: 1,
    },
  };

  type OtherDialogState = { open: boolean; field: keyof typeof data | ''; label: string; value: string };
  const [otherDialog, setOtherDialog] = useState<OtherDialogState>({
    open: false,
    field: '',
    label: '',
    value: '',
  });

  const openOtherDialog = (field: keyof typeof data, label: string) => {
    setOtherDialog({ open: true, field, label, value: '' });
  };

  const handleOtherSave = () => {
    if (otherDialog.field && otherDialog.value.trim()) {
      setData(otherDialog.field, otherDialog.value.trim());
    }
    setOtherDialog({ open: false, field: '', label: '', value: '' });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post('/farmers', {
      forceFormData: true,
      onSuccess: () => {
        reset();
        onClose();
      },
    });
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
            maxHeight: '90vh',
            background: '#1e293b',
          },
        }}
      >
        <DialogTitle
          sx={{
            background: 'transparent',
            color: 'white',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            py: 3,
            px: 3,
            borderBottom: '1px solid rgba(255,255,255,0.1)',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box sx={{ 
              bgcolor: 'rgba(255,255,255,0.1)',
              borderRadius: 1.5,
              p: 1,
              display: 'flex',
              alignItems: 'center',
            }}>
              <Typography sx={{ fontSize: '1.5rem' }}>🌾</Typography>
            </Box>
            <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '1.25rem' }}>
              Add New Farmer
            </Typography>
          </Box>
          <IconButton 
            onClick={handleClose} 
            sx={{ 
              color: 'white',
              '&:hover': { 
                bgcolor: 'rgba(255,255,255,0.1)',
                transform: 'rotate(90deg)',
                transition: 'all 0.2s ease-in-out',
              },
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <form onSubmit={handleSubmit}>
          <DialogContent sx={{ p: 3, background: '#1e293b' }}>
            <Stack spacing={2.5}>
              {/* Personal Information */}
              <Card
                sx={{
                  background: 'rgba(255,255,255,0.05)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: 2,
                  border: '1px solid rgba(255,255,255,0.1)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    background: 'rgba(255,255,255,0.08)',
                  },
                }}
              >
                <CardHeader
                  title={
                    <Typography sx={{ 
                      fontSize: '1rem',
                      fontWeight: 700,
                      color: 'white',
                      ml: 1
                    }}>
                      Personal Information
                    </Typography>
                  }
                  sx={{
                    py: 2,
                  }}
                />
                <CardContent sx={{ p: 2 }}>
                  <Stack spacing={1.5}>
                    <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
                      <TextField
                        sx={{ 
                          flex: '1 1 300px', 
                          minWidth: '200px',
                          ...textFieldStyle,
                        }}
                        label="Full Name"
                        value={data.full_name}
                        onChange={(e) => setData('full_name', e.target.value)}
                        error={!!errors.full_name}
                        helperText={errors.full_name}
                        required
                      />
                      <TextField
                        sx={{ 
                          flex: '1 1 200px', 
                          minWidth: '150px',
                          ...textFieldStyle,
                        }}
                        type="date"
                        label="Birth Date"
                        InputLabelProps={{ shrink: true }}
                        value={data.date_of_birth}
                        onChange={(e) => setData('date_of_birth', e.target.value)}
                        error={!!errors.date_of_birth}
                        helperText={errors.date_of_birth}
                      />
                    </Box>
                    <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
                      <TextField
                        select
                        sx={{ 
                          flex: '1 1 150px', 
                          minWidth: '120px',
                          ...textFieldStyle,
                        }}
                        label="Gender"
                        value={data.gender}
                        onChange={(e) => {
                          const value = e.target.value;
                          if (value === 'Other') {
                            openOtherDialog('gender', 'Gender');
                          } else {
                            setData('gender', value);
                          }
                        }}
                        error={!!errors.gender}
                        helperText={errors.gender}
                      >
                        {['Male', 'Female', 'Other'].map((g) => (
                          <MenuItem key={g} value={g}>
                            {g}
                          </MenuItem>
                        ))}
                      </TextField>
                      <TextField
                        select
                        sx={{ 
                          flex: '1 1 150px', 
                          minWidth: '120px',
                          ...textFieldStyle,
                        }}
                        label="Civil Status"
                        value={data.civil_status}
                        onChange={(e) => {
                          const value = e.target.value;
                          if (value === 'Other') {
                            openOtherDialog('civil_status', 'Civil Status');
                          } else {
                            setData('civil_status', value);
                          }
                        }}
                        error={!!errors.civil_status}
                        helperText={errors.civil_status}
                      >
                        {['Single', 'Married', 'Widowed', 'Separated', 'Other'].map((s) => (
                          <MenuItem key={s} value={s}>
                            {s}
                          </MenuItem>
                        ))}
                      </TextField>
                      <TextField
                        sx={{ 
                          flex: '1 1 200px', 
                          minWidth: '150px',
                          ...textFieldStyle,
                        }}
                        label="Contact"
                        value={data.contact_number}
                        onChange={(e) => setData('contact_number', e.target.value)}
                        error={!!errors.contact_number}
                        helperText={errors.contact_number}
                        required
                      />
                    </Box>
                    <TextField
                      label="Email (optional)"
                      value={data.email}
                      onChange={(e) => setData('email', e.target.value)}
                      error={!!errors.email}
                      helperText={errors.email}
                      sx={{
                        ...textFieldStyle,
                      }}
                    />
                    <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
                      <TextField
                        sx={{ 
                          flex: '1 1 150px', 
                          minWidth: '120px',
                          ...textFieldStyle,
                        }}
                        label="Purok"
                        value={data.address_purok}
                        onChange={(e) => setData('address_purok', e.target.value)}
                        error={!!errors.address_purok}
                        helperText={errors.address_purok}
                      />
                      <TextField
                        sx={{ 
                          flex: '1 1 200px', 
                          minWidth: '150px',
                          ...textFieldStyle,
                        }}
                        label="Barangay"
                        value={data.address_barangay}
                        onChange={(e) => setData('address_barangay', e.target.value)}
                        error={!!errors.address_barangay}
                        helperText={errors.address_barangay}
                        required
                      />
                      <TextField
                        sx={{ 
                          flex: '1 1 200px', 
                          minWidth: '150px',
                          ...textFieldStyle,
                        }}
                        label="Municipality"
                        value={data.address_municipality}
                        onChange={(e) => setData('address_municipality', e.target.value)}
                        error={!!errors.address_municipality}
                        helperText={errors.address_municipality}
                        required
                      />
                      <TextField
                        sx={{ 
                          flex: '1 1 200px', 
                          minWidth: '150px',
                          ...textFieldStyle,
                        }}
                        label="Province"
                        value={data.address_province}
                        onChange={(e) => setData('address_province', e.target.value)}
                        error={!!errors.address_province}
                        helperText={errors.address_province}
                      />
                    </Box>
                    <TextField
                      label="Nationality"
                      value={data.nationality}
                      onChange={(e) => setData('nationality', e.target.value)}
                      error={!!errors.nationality}
                      helperText={errors.nationality}
                      sx={{
                        ...textFieldStyle,
                      }}
                    />
                  </Stack>
                </CardContent>
              </Card>

              {/* Identification */}
              <Card
                sx={{
                  background: 'rgba(255,255,255,0.05)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: 2,
                  border: '1px solid rgba(255,255,255,0.1)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    background: 'rgba(255,255,255,0.08)',
                  },
                }}
              >
                <CardHeader
                  title={
                    <Typography sx={{ 
                      fontSize: '1rem',
                      fontWeight: 700,
                      color: 'white',
                      ml: 1
                    }}>
                      Identification
                    </Typography>
                  }
                  sx={{
                    py: 2,
                  }}
                />
                <CardContent sx={{ p: 2 }}>
                  <Stack spacing={1.5}>
                    <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
                      <TextField
                        sx={{ 
                          flex: '1 1 250px', 
                          minWidth: '200px',
                          ...textFieldStyle,
                        }}
                        label="Voter's ID"
                        value={data.voters_id_number}
                        onChange={(e) => setData('voters_id_number', e.target.value)}
                        error={!!errors.voters_id_number}
                        helperText={errors.voters_id_number}
                      />
                      <TextField
                        sx={{ 
                          flex: '1 1 250px', 
                          minWidth: '200px',
                          ...textFieldStyle,
                        }}
                        label="Voter's Cert"
                        value={data.voters_certification_number}
                        onChange={(e) => setData('voters_certification_number', e.target.value)}
                        error={!!errors.voters_certification_number}
                        helperText={errors.voters_certification_number}
                      />
                    </Box>
                    <Button
                      component="label"
                      variant="contained"
                      sx={{
                        alignSelf: 'flex-start',
                        bgcolor: 'rgba(255,255,255,0.1)',
                        color: 'white',
                        display: 'flex',
                        gap: 1,
                        px: 2,
                        py: 1,
                        '&:hover': {
                          bgcolor: 'rgba(255,255,255,0.2)',
                        },
                        transition: 'all 0.2s ease',
                      }}
                    >
                      <Box sx={{ 
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1
                      }}>
                        <Typography sx={{ fontSize: '1.2rem' }}>📷</Typography>
                        <span>Upload Photo</span>
                      </Box>
                      <input
                        hidden
                        accept="image/*"
                        type="file"
                        onChange={(e) => setData('passport_photo', e.target.files?.[0] ?? null)}
                      />
                    </Button>
                    {errors.passport_photo && (
                      <Typography variant="caption" color="error">
                        {errors.passport_photo}
                      </Typography>
                    )}
                  </Stack>
                </CardContent>
              </Card>

              {/* Farm Information */}
              <Card
                sx={{
                  background: 'rgba(255,255,255,0.05)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: 2,
                  border: '1px solid rgba(255,255,255,0.1)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    background: 'rgba(255,255,255,0.08)',
                  },
                }}
              >
                <CardHeader
                  title={
                    <Typography sx={{ 
                      fontSize: '1rem',
                      fontWeight: 700,
                      color: 'white',
                      ml: 1
                    }}>
                      Farm Information
                    </Typography>
                  }
                  sx={{
                    py: 2,
                  }}
                />
                <CardContent sx={{ p: 2 }}>
                  <Stack spacing={1.5}>
                    <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
                      <TextField
                        select
                        sx={{ 
                          flex: '1 1 300px', 
                          minWidth: '200px',
                          ...textFieldStyle,
                        }}
                        label="Crop Type"
                        value={data.farm_name}
                        onChange={(e) => setData('farm_name', e.target.value)}
                        error={!!errors.farm_name}
                        helperText={errors.farm_name}
                        required
                      >
                        {cropTypes.map((crop) => (
                          <MenuItem key={crop} value={crop}>
                            {crop}
                          </MenuItem>
                        ))}
                      </TextField>
                      <TextField
                        sx={{ 
                          flex: '1 1 200px', 
                          minWidth: '150px',
                          ...textFieldStyle,
                        }}
                        label="Farm Location"
                        value={data.farm_location}
                        onChange={(e) => setData('farm_location', e.target.value)}
                        error={!!errors.farm_location}
                        helperText={errors.farm_location}
                        required
                      />
                      <TextField
                        sx={{ 
                          flex: '1 1 150px', 
                          minWidth: '120px',
                          ...textFieldStyle,
                        }}
                        type="number"
                        label="Farm Size (hectares)"
                        value={data.farm_size}
                        onChange={(e) => setData('farm_size', Number(e.target.value))}
                        error={!!errors.farm_size}
                        helperText={errors.farm_size}
                        inputProps={{ step: '0.01', min: '0' }}
                      />
                    </Box>
                    <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
                      <TextField
                        select
                        sx={{ 
                          flex: '1 1 150px', 
                          minWidth: '120px',
                          ...textFieldStyle,
                        }}
                        label="Ownership"
                        value={data.land_ownership_type}
                        onChange={(e) => setData('land_ownership_type', e.target.value)}
                        error={!!errors.land_ownership_type}
                        helperText={errors.land_ownership_type}
                      >
                        {['owner', 'tenant'].map((t) => (
                          <MenuItem key={t} value={t}>
                            {t}
                          </MenuItem>
                        ))}
                      </TextField>
                      <TextField
                        sx={{ 
                          flex: '1 1 120px', 
                          minWidth: '100px',
                          ...textFieldStyle,
                        }}
                        type="number"
                        label="Experience (Months)"
                        value={data.farming_experience_months}
                        onChange={(e) => setData('farming_experience_months', Number(e.target.value))}
                        error={!!errors.farming_experience_months}
                        helperText={errors.farming_experience_months}
                      />
                      <TextField
                        sx={{ 
                          flex: '1 1 120px', 
                          minWidth: '100px',
                          ...textFieldStyle,
                        }}
                        type="number"
                        label="Experience (Years)"
                        value={data.farming_experience_years}
                        onChange={(e) => setData('farming_experience_years', Number(e.target.value))}
                        error={!!errors.farming_experience_years}
                        helperText={errors.farming_experience_years}
                      />
                    </Box>
                  </Stack>
                </CardContent>
              </Card>

              {/* Emergency Contact */}
              <Card
                sx={{
                  background: 'rgba(255,255,255,0.05)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: 2,
                  border: '1px solid rgba(255,255,255,0.1)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    background: 'rgba(255,255,255,0.08)',
                  },
                }}
              >
                <CardHeader
                  title={
                    <Typography sx={{ 
                      fontSize: '1rem',
                      fontWeight: 700,
                      color: 'white',
                      ml: 1
                    }}>
                      Emergency Contact
                    </Typography>
                  }
                  sx={{
                    py: 2,
                  }}
                />
                <CardContent sx={{ p: 2 }}>
                  <Stack spacing={1.5}>
                    <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
                      <TextField
                        sx={{ 
                          flex: '1 1 300px', 
                          minWidth: '200px',
                          ...textFieldStyle,
                        }}
                        label="Contact Person"
                        value={data.emergency_contact_person}
                        onChange={(e) => setData('emergency_contact_person', e.target.value)}
                        error={!!errors.emergency_contact_person}
                        helperText={errors.emergency_contact_person}
                      />
                      <TextField
                        sx={{ 
                          flex: '1 1 200px', 
                          minWidth: '150px',
                          ...textFieldStyle,
                        }}
                        label="Contact Number"
                        value={data.emergency_contact_number}
                        onChange={(e) => setData('emergency_contact_number', e.target.value)}
                        error={!!errors.emergency_contact_number}
                        helperText={errors.emergency_contact_number}
                      />
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            </Stack>
          </DialogContent>

          <DialogActions 
            sx={{ 
              p: 3, 
              gap: 2,
              background: '#1e293b',
              borderTop: '1px solid rgba(255,255,255,0.1)'
            }}
          >
            <Button 
              onClick={handleClose} 
              disabled={processing}
              sx={{ 
                color: 'rgba(255,255,255,0.7)', 
                fontWeight: 600,
                px: 3,
                '&:hover': {
                  backgroundColor: 'rgba(255,255,255,0.05)',
                },
              }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={processing}
              sx={{
                bgcolor: 'rgba(255,255,255,0.1)',
                color: 'white',
                fontWeight: 600,
                px: 4,
                '&:hover': {
                  bgcolor: 'rgba(255,255,255,0.2)',
                },
                '&:active': {
                  bgcolor: 'rgba(255,255,255,0.3)',
                },
                transition: 'all 0.2s ease',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography sx={{ fontSize: '1.2rem' }}>🌾</Typography>
                <span>Save Farmer</span>
              </Box>
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Other Dialog */}
      <Dialog
        open={otherDialog.open}
        onClose={() => setOtherDialog({ open: false, field: '', label: '', value: '' })}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle sx={{ color: '#0f172a', fontWeight: 700 }}>
          ✏️ Specify {otherDialog.label}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <TextField
              autoFocus
              fullWidth
              label={otherDialog.label}
              value={otherDialog.value}
              onChange={(e) => setOtherDialog((prev) => ({ ...prev, value: e.target.value }))}
              sx={{
                ...textFieldStyle,
              }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setOtherDialog({ open: false, field: '', label: '', value: '' })}
            sx={{ color: '#64748b', fontWeight: 600 }}
          >
            Cancel
          </Button>
          <Button 
            variant="contained" 
            onClick={handleOtherSave} 
            disabled={!otherDialog.value.trim()}
            sx={{ fontWeight: 600 }}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

