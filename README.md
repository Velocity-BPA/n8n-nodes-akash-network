# n8n-nodes-akash-network

> **[Velocity BPA Licensing Notice]**
>
> This n8n node is licensed under the Business Source License 1.1 (BSL 1.1).
>
> Use of this node by for-profit organizations in production environments requires a commercial license from Velocity BPA.
>
> For licensing information, visit https://velobpa.com/licensing or contact licensing@velobpa.com.

This n8n community node provides comprehensive integration with Akash Network, the decentralized cloud computing marketplace. It includes 6 resources (Deployment, Provider, Lease, Bid, Account, Certificate) with full CRUD operations, enabling developers to automate container deployment management, provider discovery, lease negotiations, and account administration on the Akash decentralized cloud platform.

![n8n Community Node](https://img.shields.io/badge/n8n-Community%20Node-blue)
![License](https://img.shields.io/badge/license-BSL--1.1-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)
![Akash Network](https://img.shields.io/badge/Akash-Network-red)
![Blockchain](https://img.shields.io/badge/Blockchain-Decentralized-green)
![Cloud Computing](https://img.shields.io/badge/Cloud-Computing-orange)

## Features

- **Deployment Management** - Create, update, close, and monitor container deployments on Akash Network
- **Provider Discovery** - Search and filter available compute providers based on location, resources, and pricing
- **Lease Operations** - Manage lease agreements between tenants and providers for compute resources
- **Bid Processing** - Handle provider bids on deployments and automate bid selection workflows
- **Account Administration** - Manage Akash accounts, balances, and transaction history
- **Certificate Management** - Create and manage TLS certificates for secure deployment communications
- **Real-time Monitoring** - Track deployment status, resource utilization, and network events
- **Cost Optimization** - Compare provider pricing and automatically select cost-effective options

## Installation

### Community Nodes (Recommended)

1. Open n8n
2. Go to **Settings** → **Community Nodes**
3. Click **Install a community node**
4. Enter `n8n-nodes-akash-network`
5. Click **Install**

### Manual Installation

```bash
cd ~/.n8n
npm install n8n-nodes-akash-network
```

### Development Installation

```bash
git clone https://github.com/Velocity-BPA/n8n-nodes-akash-network.git
cd n8n-nodes-akash-network
npm install
npm run build
mkdir -p ~/.n8n/custom
ln -s $(pwd) ~/.n8n/custom/n8n-nodes-akash-network
n8n start
```

## Credentials Setup

| Field | Description | Required |
|-------|-------------|----------|
| API Key | Your Akash Network API key for authentication | Yes |
| Network | Akash network environment (mainnet/testnet) | Yes |
| Chain ID | Akash chain identifier (akashnet-2 for mainnet) | Yes |
| RPC Endpoint | Custom RPC endpoint URL (optional) | No |

## Resources & Operations

### 1. Deployment

| Operation | Description |
|-----------|-------------|
| Create | Deploy a new container application to Akash Network |
| Get | Retrieve deployment details and current status |
| List | Get all deployments for the authenticated account |
| Update | Modify deployment configuration or resources |
| Close | Terminate a running deployment and release resources |
| Get Logs | Fetch application logs from the deployment |

### 2. Provider

| Operation | Description |
|-----------|-------------|
| List | Get all available compute providers on the network |
| Get | Retrieve detailed information about a specific provider |
| Search | Find providers matching specific criteria (location, resources) |
| Get Status | Check provider availability and resource capacity |

### 3. Lease

| Operation | Description |
|-----------|-------------|
| List | Get all active leases for the account |
| Get | Retrieve details of a specific lease agreement |
| Create | Establish a new lease with a provider |
| Close | Terminate an existing lease agreement |
| Get Status | Check lease status and resource usage |

### 4. Bid

| Operation | Description |
|-----------|-------------|
| List | Get all bids received for a deployment |
| Get | Retrieve details of a specific bid |
| Accept | Accept a provider bid and create a lease |
| Reject | Decline a provider bid |

### 5. Account

| Operation | Description |
|-----------|-------------|
| Get | Retrieve account information and balance |
| Get Balance | Check current AKT token balance |
| Get Transactions | List transaction history for the account |
| Transfer | Send AKT tokens to another account |

### 6. Certificate

| Operation | Description |
|-----------|-------------|
| Create | Generate a new TLS certificate for deployments |
| List | Get all certificates associated with the account |
| Get | Retrieve a specific certificate |
| Revoke | Revoke an existing certificate |

## Usage Examples

```javascript
// Create a new deployment
{
  "sdl": "version: '2.0'\nservices:\n  web:\n    image: nginx\n    expose:\n      - port: 80\n        to:\n          - global: true",
  "deposit": "5000000uakt",
  "name": "my-web-app"
}
```

```javascript
// Search for providers in a specific region
{
  "filters": {
    "region": "us-west",
    "minCpu": "1000m",
    "minMemory": "1Gi",
    "minStorage": "10Gi"
  },
  "limit": 10
}
```

```javascript
// Accept a provider bid
{
  "deploymentId": "12345",
  "bidId": "67890",
  "provider": "akash1abcd...",
  "price": "100uakt"
}
```

```javascript
// Get deployment logs
{
  "deploymentId": "12345",
  "service": "web",
  "lines": 100,
  "follow": false
}
```

## Error Handling

| Error | Description | Solution |
|-------|-------------|----------|
| Invalid API Key | Authentication failed with provided credentials | Verify API key and network configuration |
| Insufficient Balance | Account doesn't have enough AKT tokens | Add funds to account or reduce resource requirements |
| Deployment Failed | Container deployment unsuccessful | Check SDL syntax and resource availability |
| Provider Unavailable | Selected provider is not accepting new leases | Choose different provider or retry later |
| Network Timeout | Connection to Akash network timed out | Check network connectivity and RPC endpoint |
| Invalid SDL | Deployment manifest contains syntax errors | Validate SDL format and required fields |

## Development

```bash
npm install
npm run build
npm test
npm run lint
npm run dev
```

## Author

**Velocity BPA**
- Website: [velobpa.com](https://velobpa.com)
- GitHub: [Velocity-BPA](https://github.com/Velocity-BPA)

## Licensing

This n8n community node is licensed under the **Business Source License 1.1**.

### Free Use
Permitted for personal, educational, research, and internal business use.

### Commercial Use
Use of this node within any SaaS, PaaS, hosted platform, managed service, or paid automation offering requires a commercial license.

For licensing inquiries: **licensing@velobpa.com**

See [LICENSE](LICENSE), [COMMERCIAL_LICENSE.md](COMMERCIAL_LICENSE.md), and [LICENSING_FAQ.md](LICENSING_FAQ.md) for details.

## Contributing

Contributions are welcome! Please ensure:

1. Code follows existing style conventions
2. All tests pass (`npm test`)
3. Linting passes (`npm run lint`)
4. Documentation is updated for new features
5. Commit messages are descriptive

## Support

- **Issues**: [GitHub Issues](https://github.com/Velocity-BPA/n8n-nodes-akash-network/issues)
- **Akash Documentation**: [Akash Network Docs](https://docs.akash.network)
- **Community Forum**: [Akash Network Discord](https://discord.akash.network)