import { Head } from '@inertiajs/react';

import AppearanceTabs from '@/components/appearance-tabs';
import FullLayout from '@/layouts/full/FullLayout';
import { Box, Card, CardContent, Typography } from '@mui/material';

export default function Appearance() {
    return (
        <FullLayout>
            <Head title="Appearance settings" />

            <Box sx={{ maxWidth: 800, mx: 'auto', p: 3 }}>
                <Typography variant="h4" sx={{ mb: 1, fontWeight: 700, color: '#1e3a8a' }}>
                    Settings
                </Typography>
                <Typography variant="body2" sx={{ mb: 4, color: '#64748b' }}>
                    Manage your profile and account settings
                </Typography>

                <Card>
                    <CardContent>
                        <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
                            Appearance settings
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 3, color: '#64748b' }}>
                            Update your account's appearance settings
                        </Typography>
                        <AppearanceTabs />
                    </CardContent>
                </Card>
            </Box>
        </FullLayout>
    );
}
