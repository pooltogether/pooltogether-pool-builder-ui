import React from 'react'
import dynamic from 'next/dynamic'

import { Layout } from 'lib/components/Layout'

import '@reach/menu-button/styles.css'
import 'react-toastify/dist/ReactToastify.css'

import 'assets/styles/reach--custom.css'
import 'assets/styles/index.css'
import 'assets/styles/layout.css'
import 'assets/styles/loader.css'
import 'assets/styles/pool.css'
import 'assets/styles/pool-toast.css'
import 'assets/styles/utils.css'
import 'assets/styles/animations.css'
import 'assets/styles/transitions.css'

const DynamicWalletContextProvider = dynamic(() =>
  import('lib/components/WalletContextProvider').then(mod => mod.WalletContextProvider),
  { ssr: false }
)

function MyApp({ Component, pageProps }) {
  return <>
    <DynamicWalletContextProvider>
      <Layout>
        <Component
          {...pageProps}
        />
      </Layout>
    </DynamicWalletContextProvider>
  </>
}

export default MyApp