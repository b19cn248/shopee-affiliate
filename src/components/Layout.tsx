import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { TicketIcon, PlusIcon } from '@heroicons/react/24/outline';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link to="/" className="flex items-center space-x-3">
                <TicketIcon className="h-8 w-8 text-primary-600" />
                <span className="text-xl font-bold text-gray-900">Voucher Admin</span>
              </Link>
            </div>
            
            <nav className="flex space-x-4">
              <Link
                to="/vouchers"
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  location.pathname === '/vouchers'
                    ? 'bg-primary-100 text-primary-700'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                Danh sách Voucher
              </Link>
              <Link
                to="/vouchers/new"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                <PlusIcon className="h-4 w-4 mr-2" />
                Tạo Voucher
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <p className="text-center text-sm text-gray-500">
            © 2024 Shopee Affiliate System. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;