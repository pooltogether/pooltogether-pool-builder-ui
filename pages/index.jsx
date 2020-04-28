import dynamic from 'next/dynamic'

const DynamicIndexContent = dynamic(() => import('lib/components/IndexContent'), {
  ssr: false
})

export default function IndexPage() {
  return <DynamicIndexContent />
}
