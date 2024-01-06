import type { Metadata } from 'next';
import { Outfit } from 'next/font/google';
import 'bootstrap/dist/css/bootstrap.css';
import { ToastContainer } from 'react-toastify';
import Provider from '@/components/Provider';
import BootstrapClient from '@/components/BootstrapClient';
import 'react-toastify/dist/ReactToastify.css';
import './globals.css';
import Navbar from '@/components/Navbar/Navbar';

const outfit = Outfit({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Blog by Aldis',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='en' data-bs-theme='dark'>
      <body className={outfit.className}>
        <Provider>
          <Navbar />
          {children}
          <BootstrapClient />
          <ToastContainer />
        </Provider>
      </body>
    </html>
  );
}
