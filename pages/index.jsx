import { IndexContent } from 'lib/components/IndexContent'
import { Layout } from 'lib/components/Layout'
import { WalletOnboarding } from 'lib/components/WalletOnboarding'

export default function IndexPage() {
  return <>
    <WalletOnboarding>
        <IndexContent />
    </WalletOnboarding>
  </>
}
