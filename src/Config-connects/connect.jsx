import "@/css/connector.css"
import { useAccount, useConnect, useDisconnect } from 'wagmi'
import { useRef, useState, useEffect } from 'react'
const walletIcons = {
  metaMask: "https://cdn.iconscout.com/icon/free/png-256/metamask-2728406-2261817.png",
  // Add other wallet icons as needed
  coinbaseWallet: "https://cdn.cdnlogo.com/logos/c/69/coinbase.svg",
  walletConnect: "https://avatars.githubusercontent.com/u/37784886",
}

export function CustomWalletConnector() {
  const { address, isConnected } = useAccount()
  const { connectors, connect } = useConnect()
  const { disconnect } = useDisconnect()
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef(null);
  const handleConnect = (connector) => {
    connect({ connector })
    setDropdownOpen(false)
  }
  useEffect(() => {
  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setDropdownOpen(false);
    }
  };

  document.addEventListener("mousedown", handleClickOutside);
  return () => {
    document.removeEventListener("mousedown", handleClickOutside);
  };
}, []);

  const formatAddress = (addr) => {
    if (!addr) return ''
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`
  }

  const getConnectorIcon = (connectorId) => {
    const id = connectorId.toLowerCase()
    
    if (id.includes('metamask')) return walletIcons.metaMask
    if (id.includes('coinbase')) return walletIcons.coinbaseWallet
    if (id.includes('walletconnect')) return walletIcons.walletConnect
    
  }
  
  return (
    <div className="wallet-connector">
      <button 
        className={`wallet-button ${isConnected ? 'wallet-button-connected' : 'wallet-button-disconnected'}`}
        onClick={() => isConnected ? setDropdownOpen(!dropdownOpen) : setDropdownOpen(true)}
      >
        {isConnected ? formatAddress(address) : 'Connect Wallet'}
      </button>
      
      {dropdownOpen && (
        <div className="wallet-dropdown" ref= {dropdownRef}>
          {isConnected ? (
            <div className="connected-info">
              <div className="address-display">
                Connected: {formatAddress(address)}
              </div>
              <button 
                className="disconnect-button"
                onClick={() => {
                  disconnect()
                  setDropdownOpen(false)
                }}
              >
                Disconnect
              </button>
            </div>
          ) : (
            <>
              {connectors.map((connector) => (
                <div
                  key={connector.id}
                  className="wallet-option"
                  onClick={() => handleConnect(connector)}
                >
                  <img
                    src={getConnectorIcon(connector.id) || connector.icon}
                    alt={connector.name || connector.id}
                    width={20}
                    height={20}
                    style={{ marginRight: 8 }}
                  />
                  {connector.name || connector.id}
                </div>
              ))}
            </>
          )}
        </div>
      )}
    </div>
  )
}