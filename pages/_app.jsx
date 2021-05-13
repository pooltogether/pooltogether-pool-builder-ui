import React, { useEffect } from 'react'
import dynamic from 'next/dynamic'
import * as Sentry from '@sentry/react'
import { Integrations } from '@sentry/tracing'
import { QueryClient, QueryClientProvider } from 'react-query'
import { ErrorBoundary, CustomErrorBoundary } from 'lib/components/CustomErrorBoundary'
import { Layout } from 'lib/components/Layout'

import 'react-toastify/dist/ReactToastify.css'
import '@reach/menu-button/styles.css'

import 'assets/styles/index.css'
import 'assets/styles/layout.css'
import 'assets/styles/inputs.css'
import 'assets/styles/loader.css'
import 'assets/styles/pool.css'
import 'assets/styles/pool-toast.css'
import 'assets/styles/utils.css'
import 'assets/styles/animations.css'
import 'assets/styles/transitions.css'
import 'assets/styles/typography.css'

import 'assets/styles/bnc-onboard--custom.css'
import 'assets/styles/reach--custom.css'

const DynamicWalletContextProvider = dynamic(
  () => import('lib/components/WalletContextProvider').then((mod) => mod.WalletContextProvider),
  { ssr: false }
)

if (process.env.NEXT_JS_SENTRY_DSN) {
  Sentry.init({
    dsn: process.env.NEXT_JS_SENTRY_DSN,
    release: process.env.NEXT_JS_RELEASE_VERSION,
    integrations: [new Integrations.BrowserTracing()]
  })
}

const queryClient = new QueryClient()

function MyApp({ Component, pageProps }) {
  // ChunkLoadErrors happen when someone has the app loaded, then we deploy a
  // new release, and the user's app points to previous chunks that no longer exist
  useEffect(() => {
    window.addEventListener('error', (e) => {
      console.log(e)
      if (/Loading chunk [\d]+ failed/.test(e.message)) {
        window.location.reload()
      }
    })
  }, [])

  return (
    <>
      <ErrorBoundary>
        <QueryClientProvider client={queryClient}>
          <DynamicWalletContextProvider>
            <Layout>
              <CustomErrorBoundary>
                <Component {...pageProps} />
              </CustomErrorBoundary>
            </Layout>
          </DynamicWalletContextProvider>
        </QueryClientProvider>
      </ErrorBoundary>
    </>
  )
}

export default MyApp
