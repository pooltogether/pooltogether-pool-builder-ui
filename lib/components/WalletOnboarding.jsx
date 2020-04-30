import dynamic from 'next/dynamic'

const DynamicOnboardState = dynamic(() =>
  import('lib/components/OnboardState').then(mod => mod.OnboardState),
  { ssr: false }
)

export const WalletOnboarding = (props) => {
  return <>
    <DynamicOnboardState>
      <Layout>
        <IndexContent />
      </Layout>
    </DynamicOnboardState>
  </>
}
