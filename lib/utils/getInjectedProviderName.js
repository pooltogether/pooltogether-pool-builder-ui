export function getInjectedProviderName() {
  const provider = window.ethereum || (window.web3 && window.web3.currentProvider)

  if (!provider) return

  if (provider.isWalletIO) {
    return 'wallet.io'
  }

  if (provider.isDcentWallet) {
    return "D'CENT"
  }

  if (provider.isTokenPocket) {
    return 'TokenPocket'
  }

  if (provider.isOwnbit) {
    return 'Ownbit'
  }

  if (provider.wallet === 'MEETONE') {
    return 'MEETONE'
  }

  if (provider.isTorus) {
    return 'Torus'
  }

  if (provider.isImToken) {
    return 'imToken'
  }

  if (provider.isDapper) {
    return 'Dapper'
  }

  if (provider.isWalletConnect) {
    return 'WalletConnect'
  }

  if (provider.isTrust) {
    return 'Trust'
  }

  if (provider.isCoinbaseWallet) {
    return 'Coinbase'
  }

  if (provider.isToshi) {
    return 'Toshi'
  }

  if (provider.isCipher) {
    return 'Cipher'
  }

  if (provider.isOpera) {
    return 'Opera'
  }

  if (provider.isStatus) {
    return 'Status'
  }

  if (provider.isMetaMask) {
    return 'MetaMask'
  }

  if (provider.isMYKEY) {
    return 'MYKEY'
  }

  if (provider.isHbWallet) {
    return 'huobiwallet'
  }

  if (provider.isHyperPay) {
    return 'HyperPay'
  }

  if (provider.isAToken) {
    return 'AToken'
  }

  if (provider.isLiquality) {
    return 'Liquality'
  }

  if (provider.isAlphaWallet) {
    return 'AlphaWallet'
  }

  if (provider.host && provider.host.indexOf('localhost') !== -1) {
    return 'localhost'
  }

  return 'web3Wallet'
}
