import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en" className="dark">
      <Head />
      <body suppressHydrationWarning className="bg-gradient-to-b from-gray-900 to-gray-800 text-white min-h-screen">
        <Main />
        <NextScript />
      </body>
    </Html>
  )
} 