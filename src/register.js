'use client';

import {useEffect} from 'react';

export default function RegisterSW() {
    useEffect(() => {
        if (!('serviceWorker' in navigator)) return;

        // This app does not use offline caching. Remove the old worker/cache so
        // an old deployment cannot serve chunks from a different build.
        void Promise.all([
            navigator.serviceWorker.getRegistrations().then((registrations) =>
                Promise.all(registrations.map((registration) => registration.unregister())),
            ),
            'caches' in window
                ? caches.keys().then((cacheNames) =>
                    Promise.all(cacheNames.map((cacheName) => caches.delete(cacheName))),
                )
                : Promise.resolve(),
        ]).catch((error) => {
            console.error('Failed to remove stale service worker data:', error);
        });
    }, []);

    return null;
}
