import Head from 'next/head'

import dynamic from 'next/dynamic'

const DynamicRipcord = dynamic(() => import('../components/Ripcord'), {
  ssr: false
})

export default function Home() {
  return (
    <div className="container">
      <Head>
        <title>Ripcord | PoolTogether</title>
        <meta name="viewport" content="width=device-width, initial-scale=1"></meta>
        <link rel="icon" href="/favicon.ico" />
        <link rel='stylesheet' href='https://cdn.jsdelivr.net/npm/bulma@0.8.2/css/bulma.css' />
      </Head>

      <DynamicRipcord />

      <style jsx global>{`
        html {
          background-color: #230548;
        }
        * {
          color: white;
        }
        .title {
          color: white;
        }
        .subtitle {
          color: gray;
        }
        
      `}</style>
    </div>
  )
}
