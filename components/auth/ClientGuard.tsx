'use client';

import { useAuth } from '@/context/AuthContext';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';

// Routes qui nécessitent une authentification
const PROTECTED_ROUTES = [
    '/accueil',
    '/historique',
    '/parametres',
    '/profil1',
    '/statistiques',
    '/verification',
    '/versionpro',
    '/settings'
];

export default function ClientGuard({ children }: { children: React.ReactNode }) {
    const { user, entreprise, loading } = useAuth();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        if (!loading) {
            // Nettoyer le pathname du locale (ex: /fr/accueil -> /accueil)
            const pathWithoutLocale = pathname.replace(/^\/[a-z]{2}(\/|$)/, '/');
            const normalizedPath = pathWithoutLocale === '/' ? '/' : pathWithoutLocale.replace(/\/$/, '');

            const isProtectedRoute = PROTECTED_ROUTES.some(route =>
                normalizedPath === route || normalizedPath.startsWith(route + '/')
            );

            if (isProtectedRoute && !user && !entreprise) {
                // Rediriger vers la page de connexion si non authentifié
                // On garde le locale si présent
                const localeMatch = pathname.match(/^\/([a-z]{2})(\/|$)/);
                const locale = localeMatch ? localeMatch[1] : 'fr';
                router.push(`/${locale}/connexion1`);
            }
        }
    }, [user, entreprise, loading, pathname, router]);

    // Optionnel : Afficher un loader pendant la vérification si on est sur une route protégée
    const pathWithoutLocale = pathname.replace(/^\/[a-z]{2}(\/|$)/, '/');
    const normalizedPath = pathWithoutLocale === '/' ? '/' : pathWithoutLocale.replace(/\/$/, '');
    const isProtectedRoute = PROTECTED_ROUTES.some(route =>
        normalizedPath === route || normalizedPath.startsWith(route + '/')
    );

    if (loading && isProtectedRoute) {
        return null; // Ou un composant de chargement
    }

    return <>{children}</>;
}
