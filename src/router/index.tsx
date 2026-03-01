/**
 * Application router.
 * Uses React Router v6 with lazy-loaded pages for better performance.
 */

import { Navigate, Route, Routes } from 'react-router-dom'
import { AppLayout } from '@/components/layout/AppLayout'
import { useAuth } from '@/context/AuthContext'
import { LoginPage } from '@/pages/LoginPage'
import { ProductDetailPage } from '@/pages/ProductDetailPage'
import { ProductsPage } from '@/pages/ProductsPage'
import { SearchConfigsPage } from '@/pages/SearchConfigsPage'
import { SourceWebsitesPage } from '@/pages/SourceWebsitesPage'

/** Wraps protected routes — redirects to /login if not authenticated. */
function RequireAuth({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth()
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />
}

export function AppRouter() {
  const { isAuthenticated } = useAuth()

  return (
    <Routes>
      {/* Public routes */}
      <Route
        path="/login"
        element={
          isAuthenticated ? <Navigate to="/products" replace /> : <LoginPage />
        }
      />

      {/* Protected routes — all inside AppLayout (Header + Sidebar + Footer) */}
      <Route
        element={
          <RequireAuth>
            <AppLayout />
          </RequireAuth>
        }
      >
        <Route index element={<Navigate to="/products" replace />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/products/:id" element={<ProductDetailPage />} />
        <Route path="/search-configs" element={<SearchConfigsPage />} />
        <Route path="/source-websites" element={<SourceWebsitesPage />} />
      </Route>

      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/products" replace />} />
    </Routes>
  )
}
