import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ProtectedRoute from './components/ProtectedRoute'

// Public pages
import HomePage from './pages/HomePage'
import ProductsPage from './pages/ProductsPage'
import ProductDetailPage from './pages/ProductDetailPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import ForgotPasswordPage from './pages/ForgotPasswordPage'
import ResetPasswordPage from './pages/ResetPasswordPage'

// User pages
import ProfilePage from './pages/ProfilePage'
import PlaceOrderPage from './pages/PlaceOrderPage'
import MyOrdersPage from './pages/MyOrdersPage'

// Admin pages
import AdminDashboardPage from './pages/admin/AdminDashboardPage'
import AdminProductsPage from './pages/admin/AdminProductsPage'
import AdminUsersPage from './pages/admin/AdminUsersPage'
import AdminOrdersPage from './pages/admin/AdminOrdersPage'

function NotFound() {
    return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
            <div className="text-6xl">🚀</div>
            <h1 className="text-3xl font-extrabold">404 — Page Not Found</h1>
            <p className="text-text-sub">The page you're looking for doesn't exist.</p>
            <a href="/" className="btn btn-primary">Go Home</a>
        </div>
    )
}

export default function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <Navbar />
                <Routes>
                    {/* Public */}
                    <Route path="/" element={<HomePage />} />
                    <Route path="/products" element={<ProductsPage />} />
                    <Route path="/product/:id" element={<ProductDetailPage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                    <Route path="/password/reset/:token" element={<ResetPasswordPage />} />

                    {/* User protected */}
                    <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
                    <Route path="/place-order" element={<ProtectedRoute><PlaceOrderPage /></ProtectedRoute>} />
                    <Route path="/my-orders" element={<ProtectedRoute><MyOrdersPage /></ProtectedRoute>} />

                    {/* Admin protected */}
                    <Route path="/admin/dashboard" element={<ProtectedRoute adminOnly><AdminDashboardPage /></ProtectedRoute>} />
                    <Route path="/admin/products" element={<ProtectedRoute adminOnly><AdminProductsPage /></ProtectedRoute>} />
                    <Route path="/admin/users" element={<ProtectedRoute adminOnly><AdminUsersPage /></ProtectedRoute>} />
                    <Route path="/admin/orders" element={<ProtectedRoute adminOnly><AdminOrdersPage /></ProtectedRoute>} />

                    {/* 404 */}
                    <Route path="*" element={<NotFound />} />
                </Routes>
                <Footer />
            </AuthProvider>
        </BrowserRouter>
    )
}
