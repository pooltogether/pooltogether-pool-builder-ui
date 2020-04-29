// import App from 'next/app'
import React from 'react'

// import 'odometer/themes/odometer-theme-minimal.css'
// import 'react-toastify/dist/ReactToastify.css'

// import 'assets/styles/normalize-opentype.css'
import 'assets/styles/index.css'
import 'assets/styles/layout.css'
import 'assets/styles/pool.css'
import 'assets/styles/utils.css'
import 'assets/styles/animations.css'
import 'assets/styles/transitions.css'

function MyApp({ Component, pageProps }) {
  return <Component
    {...pageProps}
  />
}

export default MyApp