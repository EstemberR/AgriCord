import PasswordController from '@/actions/App/Http/Controllers/Settings/PasswordController';
import InputError from '@/components/input-error';
import FullLayout from '@/layouts/full/FullLayout';
import { Transition } from '@headlessui/react';
import { Form, Head } from '@inertiajs/react';
import { useRef } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Box, Card, CardContent, Typography } from '@mui/material';

export default function Password() {
    const passwordInput = useRef<HTMLInputElement>(null);
    const currentPasswordInput = useRef<HTMLInputElement>(null);

    return (
        <FullLayout>
            <Head title="Password settings" />

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
                            Update password
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 3, color: '#64748b' }}>
                            Ensure your account is using a long, random password to stay secure
                        </Typography>

                        <Form
                            {...PasswordController.update.form()}
                            options={{
                                preserveScroll: true,
                            }}
                            resetOnError={[
                                'password',
                                'password_confirmation',
                                'current_password',
                            ]}
                            resetOnSuccess
                            onError={(errors) => {
                                if (errors.password) {
                                    passwordInput.current?.focus();
                                }

                                if (errors.current_password) {
                                    currentPasswordInput.current?.focus();
                                }
                            }}
                            className="space-y-6"
                        >
                            {({ errors, processing, recentlySuccessful }) => (
                                <>
                                    <div className="grid gap-2">
                                        <Label htmlFor="current_password">
                                            Current password
                                        </Label>

                                        <Input
                                            id="current_password"
                                            ref={currentPasswordInput}
                                            name="current_password"
                                            type="password"
                                            className="mt-1 block w-full"
                                            autoComplete="current-password"
                                            placeholder="Current password"
                                        />

                                        <InputError
                                            message={errors.current_password}
                                        />
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="password">
                                            New password
                                        </Label>

                                        <Input
                                            id="password"
                                            ref={passwordInput}
                                            name="password"
                                            type="password"
                                            className="mt-1 block w-full"
                                            autoComplete="new-password"
                                            placeholder="New password"
                                        />

                                        <InputError message={errors.password} />
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="password_confirmation">
                                            Confirm password
                                        </Label>

                                        <Input
                                            id="password_confirmation"
                                            name="password_confirmation"
                                            type="password"
                                            className="mt-1 block w-full"
                                            autoComplete="new-password"
                                            placeholder="Confirm password"
                                        />

                                        <InputError
                                            message={errors.password_confirmation}
                                        />
                                    </div>

                                    <div className="flex items-center gap-4">
                                        <Button
                                            disabled={processing}
                                            data-test="update-password-button"
                                        >
                                            Save password
                                        </Button>

                                        <Transition
                                            show={recentlySuccessful}
                                            enter="transition ease-in-out"
                                            enterFrom="opacity-0"
                                            leave="transition ease-in-out"
                                            leaveTo="opacity-0"
                                        >
                                            <p className="text-sm text-neutral-600">
                                                Saved
                                            </p>
                                        </Transition>
                                    </div>
                                </>
                            )}
                        </Form>
                    </CardContent>
                </Card>
            </Box>
        </FullLayout>
    );
}
