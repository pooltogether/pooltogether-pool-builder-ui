import { useEffect, useState } from 'react'
import { useOnboard } from '@pooltogether/hooks'

const truncateEnsName = (ensName) => ensName?.substr(0, 30) || ''

export const useEnsName = (address) => {
  const { provider } = useOnboard()

  const [ensName, setEnsName] = useState('')

  useEffect(() => {
    const lookup = async () => {
      if (address && provider) {
        try {
          const _ensName = await provider.lookupAddress(address)
          setEnsName(_ensName || '')
        } catch (e) {
          console.warn(e)
        }
      }
    }

    lookup()
  }, [address, provider])

  return { shortenedEnsName: truncateEnsName(ensName), ensName }
}
