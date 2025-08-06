import "./globals.css";

import TopLoader from 'nextjs-toploader';
import 'remixicon/fonts/remixicon.css';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`scroll-smooth`}
    >
      <body className="bg-background text-foreground antialiased font-urbanist">
        <TopLoader />
        {children}
      </body>
    </html>
  );
};
