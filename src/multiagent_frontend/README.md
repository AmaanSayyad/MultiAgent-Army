# MultiAgent Army - Internet Computer Platform

A platform for creating, deploying, and trading AI agents on the Internet Computer (ICP) blockchain.

## Features

- Connect with Internet Identity or Plug Wallet
- Create and deploy AI agents
- Token-based ownership and revenue distribution
- Agent trading and staking

## Getting Started

### Prerequisites

- Node.js (v16+)
- Internet Computer local replica (for development)
- Internet Identity local canister (for development)
- Plug Wallet browser extension (optional)

### Development Setup

1. Clone the repository
   ```
   git clone https://github.com/yourusername/multiagent-army.git
   cd multiagent-army
   ```

2. Install dependencies
   ```
   npm install
   ```

3. Start the local IC replica (in a separate terminal)
   ```
   dfx start --clean
   ```

4. Deploy Internet Identity locally (in a separate terminal)
   ```
   dfx deploy internet_identity
   ```

5. Start the development server
   ```
   npm run dev
   ```

### Wallet Integration

The platform supports two types of wallets:

1. **Internet Identity**: The native authentication system of the Internet Computer.
2. **Plug Wallet**: A browser extension wallet for the Internet Computer.

To use the wallet integration in your components:

```tsx
import { useWallet } from "@/hooks/use-wallet";

const MyComponent = () => {
  const {
    isConnected,
    principalId,
    accountId,
    walletType,
    connectInternetIdentity,
    connectPlug,
    disconnect,
    isPlugDetected
  } = useWallet();

  const handleConnectII = async () => {
    try {
      await connectInternetIdentity();
      console.log("Connected with Internet Identity:", principalId);
    } catch (error) {
      console.error("Failed to connect:", error);
    }
  };

  const handleConnectPlug = async () => {
    try {
      // You can specify canister IDs that your app needs to interact with
      const whitelist = [
        // Add your canister IDs here
      ];
      await connectPlug(whitelist);
      console.log("Connected with Plug Wallet:", principalId);
    } catch (error) {
      console.error("Failed to connect:", error);
    }
  };

  return (
    <div>
      {isConnected ? (
        <>
          <p>Connected with {walletType}</p>
          <p>Principal ID: {principalId}</p>
          <button onClick={disconnect}>Disconnect</button>
        </>
      ) : (
        <>
          <button onClick={handleConnectII}>Connect with Internet Identity</button>
          <button 
            onClick={handleConnectPlug}
            disabled={!isPlugDetected}
          >
            Connect with Plug Wallet
          </button>
        </>
      )}
    </div>
  );
};
```

## Environment Configuration

Create a `.env.development` file in the root directory with the following content:

```
# Network configuration
DFX_NETWORK="local"

# Identity configuration
II_LOCAL_CANISTER_ID="rdmx6-jaaaa-aaaaa-aaadq-cai"

# Host configuration
DFX_LOCAL_HOST="http://localhost:4943"

# Specify Internet Identity URL
II_URL_LOCAL="http://localhost:4943?canisterId=rdmx6-jaaaa-aaaaa-aaadq-cai"
II_URL_IC="https://identity.ic0.app"
```

## License

[MIT License](LICENSE)
