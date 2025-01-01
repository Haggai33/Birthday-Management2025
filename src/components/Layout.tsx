import React from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { Calendar, Users, LogIn, UserPlus, Settings, LogOut, Gift } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

function Layout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const isActive = (path: string) => location.pathname === path;

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between h-16">
            <div className="flex items-center space-x-8">
              <div className="flex items-center">
                <Calendar className="h-6 w-6 text-indigo-600" />
                <div className="ml-3">
                  <Link to="/" className="font-semibold text-xl text-gray-900 hover:text-indigo-600">
                    Birthday Management
                  </Link>
                  <div className="text-sm text-gray-600">
                    <span>Developed by: Chagai Yechiel - </span>
                    <a 
                      href="https://www.linkedin.com/in/chagai-yechiel/" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-indigo-600 hover:text-indigo-800"
                    >
                      LinkedIn
                    </a>
                  </div>
                </div>
              </div>

              {user && (
                <div className="flex space-x-4">
                  <Link
                    to="/"
                    className={`inline-flex items-center px-3 py-2 text-sm font-medium ${
                      isActive('/') 
                        ? 'text-indigo-600 border-b-2 border-indigo-600' 
                        : 'text-gray-500 hover:text-indigo-600'
                    }`}
                  >
                    <Calendar className="h-4 w-4 mr-2" />
                    Dashboard
                  </Link>
                  
                  <Link
                    to="/gelt"
                    className={`inline-flex items-center px-3 py-2 text-sm font-medium ${
                      isActive('/gelt')
                        ? 'text-indigo-600 border-b-2 border-indigo-600'
                        : 'text-gray-500 hover:text-indigo-600'
                    }`}
                  >
                    <Gift className="h-4 w-4 mr-2" />
                    Holiday Gelt
                  </Link>
                </div>
              )}
            </div>
            
            <div className="flex items-center space-x-4">
              {user ? (
                <>
                  <div className="text-sm text-gray-600">
                    Welcome, <span className="font-medium">{user.firstName} {user.lastName}</span>
                    <span className="ml-2 px-2 py-1 text-xs rounded-full bg-indigo-100 text-indigo-800">
                      {user.role}
                    </span>
                  </div>
                  
                  {user.role === 'admin' && (
                    <Link
                      to="/admin"
                      className={`inline-flex items-center px-3 py-2 text-sm font-medium ${
                        isActive('/admin')
                          ? 'text-indigo-600 border-b-2 border-indigo-600'
                          : 'text-gray-500 hover:text-indigo-600'
                      }`}
                    >
                      <Settings className="h-4 w-4 mr-2" />
                      Admin
                    </Link>
                  )}
                  
                  <button
                    onClick={handleLogout}
                    className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-500 hover:text-indigo-600"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className={`inline-flex items-center px-3 py-2 text-sm font-medium ${
                      isActive('/login')
                        ? 'text-indigo-600 border-b-2 border-indigo-600'
                        : 'text-gray-500 hover:text-indigo-600'
                    }`}
                  >
                    <LogIn className="h-4 w-4 mr-2" />
                    Login
                  </Link>
                  
                  <Link
                    to="/register"
                    className={`inline-flex items-center px-3 py-2 text-sm font-medium ${
                      isActive('/register')
                        ? 'text-indigo-600 border-b-2 border-indigo-600'
                        : 'text-gray-500 hover:text-indigo-600'
                    }`}
                  >
                    <UserPlus className="h-4 w-4 mr-2" />
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-6">
        <Outlet />
      </main>

      <footer className="bg-white mt-auto">
        <div className="max-w-7xl mx-auto py-4 px-4">
          <p className="text-center text-gray-500 text-sm">
            © {new Date().getFullYear()} Hebrew Birthday Management System
          </p>
        </div>
      </footer>
    </div>
  );
}

export default Layout;