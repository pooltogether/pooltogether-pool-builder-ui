import React from 'react'
import { Slide, ToastContainer } from 'react-toastify'

import { Footer } from 'lib/components/Footer'
import { Meta } from 'lib/components/Meta'
import { Nav } from 'lib/components/Nav'
import { NotificationBanners } from 'lib/components/NotificationBanners'

export const Layout = (props) => {
  const { children } = props

  return (
    <>
      <Meta />

      <NotificationBanners />

      <div
        className='flex flex-col'
        style={{
          minHeight: '100vh'
        }}
      >
        <div className='pool-container flex flex-grow relative z-30 h-full page fadeIn animated'>
          <div className='flex flex-col flex-grow'>
            <div id='top' className='main-nav relative z-20 pt-2 sm:px-0 lg:px-12'>
              <Nav />
            </div>

            <div
              className='relative flex flex-col flex-grow h-full z-10 px-4 sm:px-0 lg:px-12 text-white pb-48'
              style={{
                flex: 1
              }}
            >
              {React.cloneElement(children, {
                ...props
              })}
            </div>

            <div className='main-footer z-10'>
              <Footer />
            </div>
          </div>
        </div>
      </div>

      <ToastContainer
        className='pool-toast'
        position='top-center'
        autoClose={6000}
        transition={Slide}
      />
    </>
  )
}
