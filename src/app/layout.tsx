import type {Metadata} from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'GeoScape 3D | Interactive Globe',
  description: 'Explore the world in high-definition 3D with immersive geographic insights.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="icon" href="/favicon.svg" />
        {/* Fonts are served locally from /public/fonts — see src/app/globals.css */}
      </head>
      <body className="font-body antialiased bg-[#232528] text-white">
        {children}
      </body>
    </html>
  );
}