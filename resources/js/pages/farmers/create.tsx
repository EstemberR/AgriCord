import { Form, Head, useForm, router } from '@inertiajs/react';
import FullLayout from '@/layouts/full/FullLayout';
import { Box, Typography, TextField, MenuItem, Button, Card, CardContent, CardHeader, Dialog, DialogTitle, DialogContent, DialogActions, Stack } from '@mui/material';
import { useState } from 'react';

export default function CreateFarmer() {
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
    land_ownership_type: 'owner',
    farming_experience_months: 0,
    farming_experience_years: 0,

    // Additional Information
    emergency_contact_person: '',
    emergency_contact_number: '',
  });

  type OtherDialogState = { open: boolean; field: keyof typeof data | ''; label: string; value: string };
  const [otherDialog, setOtherDialog] = useState<OtherDialogState>({ open: false, field: '', label: '', value: '' });

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
      onSuccess: () => reset('passport_photo'),
    });
  };

  return (
    <FullLayout>
      <Head title="Add New Farmer" />
      <Box sx={{ 
        p: 3, 
        background: 'linear-gradient(135deg, #1e3a8a 0%, #1e40af 50%, #1e3a8a 100%)',
        minHeight: '100vh'
      }}>
        <Box sx={{ 
          maxWidth: '1200px', 
          mx: 'auto',
          background: 'rgba(255, 255, 255, 0.98)',
          borderRadius: 3,
          boxShadow: '0 20px 40px rgba(30, 58, 138, 0.2)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(30, 58, 138, 0.3)',
          p: 3
        }}>
          <Typography variant="h4" sx={{ 
            textAlign: 'center', 
            mb: 3, 
            background: 'linear-gradient(45deg, #1e3a8a, #f59e0b)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontWeight: 'bold'
          }}>
            🌾 Add New Farmer
          </Typography>
          <Form onSubmit={handleSubmit}>
            <Stack spacing={2}>
              {/* Personal Information */}
              <Card sx={{ 
                background: 'linear-gradient(145deg, #1e293b 0%, #334155 100%)',
                border: '1px solid rgba(30, 58, 138, 0.5)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
                borderRadius: 2,
                overflow: 'hidden'
              }}>
                <CardHeader 
                  title="👤 Personal Information" 
                  sx={{ 
                    background: 'linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%)',
                    color: 'white',
                    '& .MuiCardHeader-title': {
                      fontSize: '1.2rem',
                      fontWeight: '600'
                    }
                  }} 
                />
                <CardContent sx={{ p: 3 }}>
                <Stack spacing={1.5}>
                  <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
                    <TextField 
                      sx={{ 
                        flex: '1 1 300px', 
                        minWidth: '200px',
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                          backgroundColor: 'rgba(30, 41, 59, 0.8)',
                          color: '#e2e8f0',
                          '&:hover': {
                            backgroundColor: 'rgba(30, 41, 59, 0.9)',
                            boxShadow: '0 4px 12px rgba(30, 58, 138, 0.3)'
                          },
                          '&.Mui-focused': {
                            backgroundColor: 'rgba(30, 41, 59, 1)',
                            boxShadow: '0 0 0 3px rgba(30, 58, 138, 0.4)'
                          }
                        },
                        '& .MuiInputLabel-root': {
                          color: '#94a3b8'
                        },
                        '& .MuiInputLabel-root.Mui-focused': {
                          color: '#60a5fa'
                        }
                      }} 
                      label="Full Name" 
                      value={data.full_name} 
                      onChange={(e) => setData('full_name', e.target.value)} 
                      error={!!errors.full_name} 
                      helperText={errors.full_name} 
                    />
                    <TextField 
                      sx={{ 
                        flex: '1 1 200px', 
                        minWidth: '150px',
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                          backgroundColor: 'rgba(255, 255, 255, 0.8)',
                          '&:hover': {
                            backgroundColor: 'rgba(255, 255, 255, 0.9)',
                            boxShadow: '0 4px 12px rgba(102, 126, 234, 0.15)'
                          },
                          '&.Mui-focused': {
                            backgroundColor: 'white',
                            boxShadow: '0 0 0 3px rgba(102, 126, 234, 0.1)'
                          }
                        }
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
                      sx={{ flex: '1 1 150px', minWidth: '120px' }}
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
                      InputLabelProps={{ shrink: true }}
                    >
                      {['Male','Female','Other'].map((g) => (<MenuItem key={g} value={g}>{g}</MenuItem>))}
                    </TextField>
                    <TextField
                      select
                      sx={{ flex: '1 1 150px', minWidth: '120px' }}
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
                      InputLabelProps={{ shrink: true }}
                    >
                      {['Single','Married','Widowed','Separated','Other'].map((s) => (<MenuItem key={s} value={s}>{s}</MenuItem>))}
                    </TextField>
                    <TextField sx={{ flex: '1 1 200px', minWidth: '150px' }} label="Contact" value={data.contact_number} onChange={(e) => setData('contact_number', e.target.value)} error={!!errors.contact_number} helperText={errors.contact_number} />
                  </Box>
                  <TextField sx={{ maxWidth: '400px' }} label="Email (optional)" value={data.email} onChange={(e) => setData('email', e.target.value)} error={!!errors.email} helperText={errors.email} />
                  <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
                    <TextField sx={{ flex: '1 1 150px', minWidth: '120px' }} label="Purok" value={data.address_purok} onChange={(e) => setData('address_purok', e.target.value)} error={!!errors.address_purok} helperText={errors.address_purok} />
                    <TextField sx={{ flex: '1 1 200px', minWidth: '150px' }} label="Barangay" value={data.address_barangay} onChange={(e) => setData('address_barangay', e.target.value)} error={!!errors.address_barangay} helperText={errors.address_barangay} />
                    <TextField sx={{ flex: '1 1 200px', minWidth: '150px' }} label="Municipality" value={data.address_municipality} onChange={(e) => setData('address_municipality', e.target.value)} error={!!errors.address_municipality} helperText={errors.address_municipality} />
                    <TextField sx={{ flex: '1 1 200px', minWidth: '150px' }} label="Province" value={data.address_province} onChange={(e) => setData('address_province', e.target.value)} error={!!errors.address_province} helperText={errors.address_province} />
                  </Box>
                  <TextField sx={{ maxWidth: '300px' }} label="Nationality" value={data.nationality} onChange={(e) => setData('nationality', e.target.value)} error={!!errors.nationality} helperText={errors.nationality} />
                </Stack>
              </CardContent>
            </Card>

              {/* Identification */}
              <Card sx={{ 
                background: 'linear-gradient(145deg, #2a1f1a 0%, #3d2a1f 100%)',
                border: '1px solid rgba(245, 158, 11, 0.5)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
                borderRadius: 2,
                overflow: 'hidden'
              }}>
                <CardHeader 
                  title="🆔 Identification" 
                  sx={{ 
                    background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                    color: 'white',
                    '& .MuiCardHeader-title': {
                      fontSize: '1.2rem',
                      fontWeight: '600'
                    }
                  }} 
                />
                <CardContent sx={{ p: 3 }}>
                <Stack spacing={1.5}>
                  <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
                    <TextField sx={{ flex: '1 1 250px', minWidth: '200px' }} label="Voter's ID" value={data.voters_id_number} onChange={(e) => setData('voters_id_number', e.target.value)} error={!!errors.voters_id_number} helperText={errors.voters_id_number} />
                    <TextField sx={{ flex: '1 1 250px', minWidth: '200px' }} label="Voter's Cert" value={data.voters_certification_number} onChange={(e) => setData('voters_certification_number', e.target.value)} error={!!errors.voters_certification_number} helperText={errors.voters_certification_number} />
                  </Box>
                  <Button 
                    component="label" 
                    variant="contained" 
                    sx={{ 
                      alignSelf: 'flex-start',
                      background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                      borderRadius: 2,
                      px: 3,
                      py: 1.5,
                      fontWeight: '600',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #d97706 0%, #b45309 100%)',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 8px 25px rgba(245, 158, 11, 0.4)'
                      },
                      transition: 'all 0.3s ease'
                    }}
                  >
                    📷 Upload Photo
                    <input hidden accept="image/*" type="file" onChange={(e) => setData('passport_photo', e.target.files?.[0] ?? null)} />
                  </Button>
                  {errors.passport_photo && (
                    <Typography variant="caption" color="error">{errors.passport_photo}</Typography>
                  )}
                </Stack>
              </CardContent>
            </Card>

              {/* Farm Information */}
              <Card sx={{ 
                background: 'linear-gradient(145deg, #1e293b 0%, #334155 100%)',
                border: '1px solid rgba(30, 58, 138, 0.5)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
                borderRadius: 2,
                overflow: 'hidden'
              }}>
                <CardHeader 
                  title="🚜 Farm Information" 
                  sx={{ 
                    background: 'linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%)',
                    color: 'white',
                    '& .MuiCardHeader-title': {
                      fontSize: '1.2rem',
                      fontWeight: '600'
                    }
                  }} 
                />
                <CardContent sx={{ p: 3 }}>
                <Stack spacing={1.5}>
                  <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
                    <TextField sx={{ flex: '1 1 300px', minWidth: '200px' }} label="Farm Name" placeholder="Rice, Corn, etc." value={data.farm_name} onChange={(e) => setData('farm_name', e.target.value)} error={!!errors.farm_name} helperText={errors.farm_name} />
                    <TextField sx={{ flex: '1 1 400px', minWidth: '250px' }} label="Farm Location" value={data.farm_location} onChange={(e) => setData('farm_location', e.target.value)} error={!!errors.farm_location} helperText={errors.farm_location} />
                  </Box>
                  <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
                    <TextField select sx={{ flex: '1 1 150px', minWidth: '120px' }} label="Ownership" value={data.land_ownership_type} onChange={(e) => setData('land_ownership_type', e.target.value)} error={!!errors.land_ownership_type} helperText={errors.land_ownership_type}>
                      {['owner','tenant'].map((t) => (<MenuItem key={t} value={t}>{t}</MenuItem>))}
                    </TextField>
                    <TextField sx={{ flex: '1 1 120px', minWidth: '100px' }} type="number" label="Months" value={data.farming_experience_months} onChange={(e) => setData('farming_experience_months', Number(e.target.value))} error={!!errors.farming_experience_months} helperText={errors.farming_experience_months} />
                    <TextField sx={{ flex: '1 1 120px', minWidth: '100px' }} type="number" label="Years" value={data.farming_experience_years} onChange={(e) => setData('farming_experience_years', Number(e.target.value))} error={!!errors.farming_experience_years} helperText={errors.farming_experience_years} />
                  </Box>
                </Stack>
              </CardContent>
            </Card>

              {/* Additional Information */}
              <Card sx={{ 
                background: 'linear-gradient(145deg, #2a1f1a 0%, #3d2a1f 100%)',
                border: '1px solid rgba(239, 68, 68, 0.5)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
                borderRadius: 2,
                overflow: 'hidden'
              }}>
                <CardHeader 
                  title="🚨 Emergency Contact" 
                  sx={{ 
                    background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                    color: 'white',
                    '& .MuiCardHeader-title': {
                      fontSize: '1.2rem',
                      fontWeight: '600'
                    }
                  }} 
                />
                <CardContent sx={{ p: 3 }}>
                <Stack spacing={1.5}>
                  <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
                    <TextField sx={{ flex: '1 1 300px', minWidth: '200px' }} label="Contact Person" value={data.emergency_contact_person} onChange={(e) => setData('emergency_contact_person', e.target.value)} error={!!errors.emergency_contact_person} helperText={errors.emergency_contact_person} />
                    <TextField sx={{ flex: '1 1 200px', minWidth: '150px' }} label="Contact Number" value={data.emergency_contact_number} onChange={(e) => setData('emergency_contact_number', e.target.value)} error={!!errors.emergency_contact_number} helperText={errors.emergency_contact_number} />
                  </Box>
                </Stack>
              </CardContent>
            </Card>

              {/* Submit */}
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'center', 
                gap: 2, 
                mt: 3,
                p: 3,
                background: 'linear-gradient(145deg, #1e293b 0%, #334155 100%)',
                borderRadius: 2,
                border: '1px solid rgba(30, 58, 138, 0.5)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
              }}>
                <Button 
                  variant="outlined" 
                  onClick={() => router.get('/dashboard')}
                  disabled={processing}
                  sx={{
                    px: 4,
                    py: 1.5,
                    borderRadius: 2,
                    borderColor: '#94a3b8',
                    color: '#94a3b8',
                    fontWeight: '600',
                    '&:hover': {
                      borderColor: '#e2e8f0',
                      backgroundColor: 'rgba(148, 163, 184, 0.1)',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 4px 12px rgba(148, 163, 184, 0.3)'
                    },
                    transition: 'all 0.3s ease'
                  }}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  variant="contained" 
                  disabled={processing}
                  sx={{
                    px: 4,
                    py: 1.5,
                    borderRadius: 2,
                    background: 'linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%)',
                    fontWeight: '600',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #1e40af 0%, #2563eb 100%)',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 8px 25px rgba(30, 58, 138, 0.4)'
                    },
                    '&:disabled': {
                      background: 'linear-gradient(135deg, #9ca3af 0%, #6b7280 100%)',
                      transform: 'none',
                      boxShadow: 'none'
                    },
                    transition: 'all 0.3s ease'
                  }}
                >
                  🌾 Save Farmer
                </Button>
              </Box>
            </Stack>
          </Form>
        </Box>
      </Box>
        <Dialog 
          open={otherDialog.open} 
          onClose={() => setOtherDialog({ open: false, field: '', label: '', value: '' })} 
          fullWidth 
          maxWidth="xs"
          PaperProps={{
            sx: {
              borderRadius: 3,
              background: 'linear-gradient(145deg, #1e293b 0%, #334155 100%)',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.4)',
              border: '1px solid rgba(30, 58, 138, 0.5)'
            }
          }}
        >
          <DialogTitle sx={{ 
            background: 'linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%)',
            color: 'white',
            textAlign: 'center',
            fontWeight: '600'
          }}>
            ✏️ Specify {otherDialog.label}
          </DialogTitle>
          <DialogContent sx={{ p: 3 }}>
            <Box sx={{ mt: 1 }}>
              <TextField
                autoFocus
                fullWidth
                label={otherDialog.label}
                value={otherDialog.value}
                onChange={(e) => setOtherDialog((prev) => ({ ...prev, value: e.target.value }))}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    backgroundColor: 'rgba(30, 41, 59, 0.8)',
                    color: '#e2e8f0',
                    '&:hover': {
                      backgroundColor: 'rgba(30, 41, 59, 0.9)',
                      boxShadow: '0 4px 12px rgba(30, 58, 138, 0.3)'
                    },
                    '&.Mui-focused': {
                      backgroundColor: 'rgba(30, 41, 59, 1)',
                      boxShadow: '0 0 0 3px rgba(30, 58, 138, 0.4)'
                    }
                  },
                  '& .MuiInputLabel-root': {
                    color: '#94a3b8'
                  },
                  '& .MuiInputLabel-root.Mui-focused': {
                    color: '#60a5fa'
                  }
                }}
              />
            </Box>
          </DialogContent>
          <DialogActions sx={{ p: 3, gap: 1 }}>
            <Button 
              onClick={() => setOtherDialog({ open: false, field: '', label: '', value: '' })}
              sx={{
                borderRadius: 2,
                px: 3,
                fontWeight: '600'
              }}
            >
              Cancel
            </Button>
            <Button 
              variant="contained" 
              onClick={handleOtherSave} 
              disabled={!otherDialog.value.trim()}
              sx={{
                borderRadius: 2,
                px: 3,
                background: 'linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%)',
                fontWeight: '600',
                '&:hover': {
                  background: 'linear-gradient(135deg, #1e40af 0%, #2563eb 100%)',
                  transform: 'translateY(-1px)',
                  boxShadow: '0 4px 12px rgba(30, 58, 138, 0.3)'
                },
                '&:disabled': {
                  background: 'linear-gradient(135deg, #9ca3af 0%, #6b7280 100%)',
                  transform: 'none',
                  boxShadow: 'none'
                },
                transition: 'all 0.3s ease'
              }}
            >
              Save
            </Button>
          </DialogActions>
        </Dialog>
    </FullLayout>
  );
}


