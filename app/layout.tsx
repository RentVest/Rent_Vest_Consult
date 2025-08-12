import type { Metadata } from 'next';

import './styles/normalize.css';
import './styles/global.scss';

export const metadata: Metadata = {
  title: 'RentVest - Property & Tenant Preferences Form',
  description:
    "Complete our quick form to help us understand your property and rental needs. Whether you're a tenant or landlord, RentVest makes property transactions simple and secure.",
  keywords: 'property rental, tenant screening, landlord services, rent to own, property management, rental form',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='en'>
      <body>
        <div>{children}</div>
      </body>
    </html>
  );
}
