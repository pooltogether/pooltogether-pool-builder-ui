import dynamic from 'next/dynamic'

const DynamicIndexContent = dynamic(() =>
  import('lib/components/IndexContent').then(mod => mod.IndexContent),
  { ssr: false }
)

export default function IndexPage() {
  return <DynamicIndexContent />
}
