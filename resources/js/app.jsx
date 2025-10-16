import './i18n';
import 'core-js/stable';
import 'regenerator-runtime/runtime';


import '../css/app.css';
import './bootstrap';

import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';
import { EventBusProvider } from './EventBus';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Toast from './Components/Toast';

const appName = import.meta.env.VITE_APP_NAME || 'Taskwin Workstation';
const queryClient = new QueryClient();

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) =>
        resolvePageComponent(
            `./Pages/${name}.jsx`,
            import.meta.glob('./Pages/**/*.jsx'),
        ),
    setup({ el, App, props }) {
        const root = createRoot(el);

        root.render(
            <EventBusProvider>
                <QueryClientProvider client={queryClient}>
                    <App {...props} />
                    <Toast />
                </QueryClientProvider>
            </EventBusProvider>
        );
    },
    progress: {
        color: '#4B5563',
    },
});
