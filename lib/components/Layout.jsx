import React from 'react'
// import { Slide, ToastContainer } from 'react-toastify'

// import { OnboardWrapper } from 'lib/components/OnboardWrapper'
// import { ConnectWallet } from 'lib/components/ConnectWallet'
import { Footer } from 'lib/components/Footer'
import { Meta } from 'lib/components/Meta'
import { Nav } from 'lib/components/Nav'

export const Layout = (props) => {
  const {
    children
  } = props
  
  return <>
    <div
      className='pool-container flex flex-grow relative z-30 h-full page fadeIn animated'
    >
      <div
        className='flex flex-col w-full'
        style={{
          minHeight: '100vh'
        }}
      >
        <div
          id='top'
          className='main-nav relative spinner-hidden z-20 pt-2'
        >
          <Nav
            {...props}
          />
        </div>


        <div
          className='relative flex flex-col flex-grow h-full z-10 px-3 sm:px-8 lg:px-12 text-white'
          style={{
            flex: 1
          }}
        >
          {React.cloneElement(children, {
            ...props,
            fuck: 'yeah',
          })}
        </div>

        <div
          className='main-footer z-10'
        >
          <Footer />
        </div>

      </div>
      {/* <Meta />

          <ToastContainer
          className='pool-toast'
          position='top-center'
          autoClose={6000}
          transition={Slide}
        /> */}

    </div>
  </>
}
