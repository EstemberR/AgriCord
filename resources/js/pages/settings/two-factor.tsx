import TwoFactorRecoveryCodes from '@/components/two-factor-recovery-codes';
import TwoFactorSetupModal from '@/components/two-factor-setup-modal';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useTwoFactorAuth } from '@/hooks/use-two-factor-auth';
import FullLayout from '@/layouts/full/FullLayout';
import { disable, enable } from '@/routes/two-factor';
import { Form, Head } from '@inertiajs/react';
import { ShieldBan, ShieldCheck } from 'lucide-react';
import { useState } from 'react';
import { Box, Card, CardContent, Typography } from '@mui/material';

interface TwoFactorProps {
    requiresConfirmation?: boolean;
    twoFactorEnabled?: boolean;
}

export default function TwoFactor({
    requiresConfirmation = false,
    twoFactorEnabled = false,
}: TwoFactorProps) {
    const {
        qrCodeSvg,
        hasSetupData,
        manualSetupKey,
        clearSetupData,
        fetchSetupData,
        recoveryCodesList,
        fetchRecoveryCodes,
        errors,
    } = useTwoFactorAuth();
    const [showSetupModal, setShowSetupModal] = useState<boolean>(false);

    return (
        <FullLayout>
            <Head title="Two-Factor Authentication" />
            
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
                            Two-Factor Authentication
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 3, color: '#64748b' }}>
                            Manage your two-factor authentication settings
                        </Typography>

                        {twoFactorEnabled ? (
                            <div className="flex flex-col items-start justify-start space-y-4">
                                <Badge variant="default">Enabled</Badge>
                                <p className="text-muted-foreground">
                                    With two-factor authentication enabled, you will
                                    be prompted for a secure, random pin during
                                    login, which you can retrieve from the
                                    TOTP-supported application on your phone.
                                </p>

                                <TwoFactorRecoveryCodes
                                    recoveryCodesList={recoveryCodesList}
                                    fetchRecoveryCodes={fetchRecoveryCodes}
                                    errors={errors}
                                />

                                <div className="relative inline">
                                    <Form {...disable.form()}>
                                        {({ processing }) => (
                                            <Button
                                                variant="destructive"
                                                type="submit"
                                                disabled={processing}
                                            >
                                                <ShieldBan /> Disable 2FA
                                            </Button>
                                        )}
                                    </Form>
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-col items-start justify-start space-y-4">
                                <Badge variant="destructive">Disabled</Badge>
                                <p className="text-muted-foreground">
                                    When you enable two-factor authentication, you
                                    will be prompted for a secure pin during login.
                                    This pin can be retrieved from a TOTP-supported
                                    application on your phone.
                                </p>

                                <div>
                                    {hasSetupData ? (
                                        <Button
                                            onClick={() => setShowSetupModal(true)}
                                        >
                                            <ShieldCheck />
                                            Continue Setup
                                        </Button>
                                    ) : (
                                        <Form
                                            {...enable.form()}
                                            onSuccess={() =>
                                                setShowSetupModal(true)
                                            }
                                        >
                                            {({ processing }) => (
                                                <Button
                                                    type="submit"
                                                    disabled={processing}
                                                >
                                                    <ShieldCheck />
                                                    Enable 2FA
                                                </Button>
                                            )}
                                        </Form>
                                    )}
                                </div>
                            </div>
                        )}

                        <TwoFactorSetupModal
                            isOpen={showSetupModal}
                            onClose={() => setShowSetupModal(false)}
                            requiresConfirmation={requiresConfirmation}
                            twoFactorEnabled={twoFactorEnabled}
                            qrCodeSvg={qrCodeSvg}
                            manualSetupKey={manualSetupKey}
                            clearSetupData={clearSetupData}
                            fetchSetupData={fetchSetupData}
                            errors={errors}
                        />
                    </CardContent>
                </Card>
            </Box>
        </FullLayout>
    );
}
