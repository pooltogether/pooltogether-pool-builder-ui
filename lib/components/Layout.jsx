import React from 'react'
// import { Slide, ToastContainer } from 'react-toastify'

// import { OnboardWrapper } from 'lib/components/OnboardWrapper'
// import { ConnectWallet } from 'lib/components/ConnectWallet'
import { Footer } from 'lib/components/Footer'
import { Meta } from 'lib/components/Meta'
import { Nav } from 'lib/components/Nav'

// This page has no blocking data requirements
// it'll be rendered as static HTML at build time
export function Layout({ children }) {
  return <>
    <div
      className='pool-container flex flex-grow relative z-30 h-full page fadeIn animated'
    >
      <div
        className='flex flex-col'
        style={{
          minHeight: '100vh'
        }}
      >
        <div
          id='top'
          className='main-nav relative spinner-hidden z-20'
        >
          <Nav />
        </div>


        <div
          className='main-content relative flex flex-col flex-grow h-full z-10'
          style={{
            flex: 1
          }}
        >
          {children}
        </div>

        <div
          className='main-footer z-10'
        >
          <Footer />
        </div>

      </div>
    </div>
    {/* <Meta /> */}

    {/* <ToastContainer
      className='pool-toast'
      position='top-center'
      autoClose={6000}
      transition={Slide}
    />

    <OnboardWrapper>
      <div className='container mx-auto py-4'>
        <ConnectWallet />
      </div>

      {children}
    </OnboardWrapper> */}
  </>
}
