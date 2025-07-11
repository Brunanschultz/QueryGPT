import type { Metadata } from 'next'
import localFont from 'next/font/local'
import { Toaster } from 'react-hot-toast'

import Providers from './providers'

const vivoType = localFont({
  src: [
    {
      path: '../../public/assets/fonts/VivoTypeLight.woff2',
      weight: '300',
      style: 'normal'
    },
    {
      path: '../../public/assets/fonts/VivoTypeRegular.woff2',
      weight: '400',
      style: 'normal'
    },
    {
      path: '../../public/assets/fonts/VivoTypeBold.woff2',
      weight: '700',
      style: 'normal'
    }
  ],
  variable: '--font-vivo-type'
})

export const metadata: Metadata = {
  title: {
    default: 'Book GPT',
    template: 'Book GPT - %s'
  }
}

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt_BR" className={vivoType.variable}>
      <body className="overflow-hidden">
        <Providers>{children}</Providers>

        <Toaster
          toastOptions={{
            duration: 10000,
            className:
              'border border-[var(--border-color)] !px-4 !py-3 text-base !text-[var(--text-color-secondary)] !shadow-[var(--box-shadow-level-2)]',
            success: {
              iconTheme: {
                primary: '#99CC33',
                secondary: 'white'
              }
            },
            error: {
              iconTheme: {
                primary: '#E43E75',
                secondary: 'white'
              }
            }
          }}
        />
      </body>
    </html>
  )
}
