import dynamic from 'next/dynamic'

import { IndexContent } from 'lib/components/IndexContent'
import { Layout } from 'lib/components/Layout'

const DynamicOnboardState = dynamic(() =>
  import('lib/components/OnboardState').then(mod => mod.OnboardState),
  { ssr: false }
)

export default function IndexPage() {
  return <>
    <DynamicOnboardState>
      <Layout>
        <IndexContent />
      </Layout>
    </DynamicOnboardState>
  </>
}
