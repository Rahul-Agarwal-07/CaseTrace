import './globals.css'

export const metadata = {
  title: 'Digital Evidence Management System',
  description: 'Secure Evidence Storage and Management System',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}

