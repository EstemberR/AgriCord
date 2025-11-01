import '../css/app.css';

import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';
import { initializeTheme } from './hooks/use-appearance';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { StyledEngineProvider } from '@mui/material/styles';
import theme from './theme/Theme';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

createInertiaApp({
    title: (title) => (title ? `${title} - ${appName}` : appName),
    resolve: (name) =>
        resolvePageComponent(
            `./pages/${name}.tsx`,
            import.meta.glob('./pages/**/*.tsx'),
        ),
        
    setup({ el, App, props }) {
        const root = createRoot(el);

        root.render(
            <StyledEngineProvider injectFirst>
                <ThemeProvider theme={theme}>
                    <CssBaseline />
                    <div style={{ 
                        backgroundColor: theme.palette.background.default,
                        minHeight: '100vh',
                        color: theme.palette.text.primary
                    }}>
                        <App {...props} />
                    </div>
                </ThemeProvider>
            </StyledEngineProvider>
        );
    },
    progress: {
        color: theme.palette.primary.main,
    },
});

// This will set light / dark mode on load...
initializeTheme();
