/**
 * Copyright (c) 2026 Velocity BPA
 * 
 * Licensed under the Business Source License 1.1 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 *     https://github.com/VelocityBPA/n8n-nodes-akashnetwork/blob/main/LICENSE
 * 
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {
  IExecuteFunctions,
  INodeExecutionData,
  INodeType,
  INodeTypeDescription,
  NodeOperationError,
  NodeApiError,
} from 'n8n-workflow';

export class AkashNetwork implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'Akash Network',
    name: 'akashnetwork',
    icon: 'file:akashnetwork.svg',
    group: ['transform'],
    version: 1,
    subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
    description: 'Interact with the Akash Network API',
    defaults: {
      name: 'Akash Network',
    },
    inputs: ['main'],
    outputs: ['main'],
    credentials: [
      {
        name: 'akashnetworkApi',
        required: true,
      },
    ],
    properties: [
      {
        displayName: 'Resource',
        name: 'resource',
        type: 'options',
        noDataExpression: true,
        options: [
          {
            name: 'Deployment',
            value: 'deployment',
          },
          {
            name: 'Provider',
            value: 'provider',
          },
          {
            name: 'Lease',
            value: 'lease',
          },
          {
            name: 'Bid',
            value: 'bid',
          },
          {
            name: 'Account',
            value: 'account',
          },
          {
            name: 'Certificate',
            value: 'certificate',
          }
        ],
        default: 'deployment',
      },
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: { show: { resource: ['deployment'] } },
  options: [
    { name: 'Create Deployment', value: 'createDeployment', description: 'Create a new deployment on the Akash Network', action: 'Create deployment' },
    { name: 'Get Deployment', value: 'getDeployment', description: 'Get deployment details by owner and sequence', action: 'Get deployment' },
    { name: 'Get All Deployments', value: 'getAllDeployments', description: 'List all deployments with optional filters', action: 'Get all deployments' },
    { name: 'Update Deployment', value: 'updateDeployment', description: 'Update deployment configuration', action: 'Update deployment' },
    { name: 'Close Deployment', value: 'closeDeployment', description: 'Close an active deployment', action: 'Close deployment' }
  ],
  default: 'createDeployment',
},
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: { show: { resource: ['provider'] } },
  options: [
    { name: 'Get All Providers', value: 'getAllProviders', description: 'List all available providers', action: 'Get all providers' },
    { name: 'Get Provider', value: 'getProvider', description: 'Get specific provider details', action: 'Get provider' },
    { name: 'Get Provider Attributes', value: 'getProviderAttributes', description: 'Get provider attributes and capabilities', action: 'Get provider attributes' },
    { name: 'Create Provider', value: 'createProvider', description: 'Register as a provider', action: 'Create provider' }
  ],
  default: 'getAllProviders',
},
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: { show: { resource: ['lease'] } },
  options: [
    { name: 'Get All Leases', value: 'getAllLeases', description: 'List all leases', action: 'Get all leases' },
    { name: 'Get Lease', value: 'getLease', description: 'Get specific lease details', action: 'Get a lease' },
    { name: 'Create Lease', value: 'createLease', description: 'Create lease from winning bid', action: 'Create a lease' },
    { name: 'Close Lease', value: 'closeLease', description: 'Close an active lease', action: 'Close a lease' }
  ],
  default: 'getAllLeases',
},
{
	displayName: 'Operation',
	name: 'operation',
	type: 'options',
	noDataExpression: true,
	displayOptions: { show: { resource: ['bid'] } },
	options: [
		{ name: 'Get All Bids', value: 'getAllBids', description: 'List all bids in marketplace', action: 'Get all bids' },
		{ name: 'Get Bid', value: 'getBid', description: 'Get specific bid details', action: 'Get a bid' },
		{ name: 'Create Bid', value: 'createBid', description: 'Submit a bid for an order', action: 'Create a bid' },
		{ name: 'Close Bid', value: 'closeBid', description: 'Close/withdraw a bid', action: 'Close a bid' },
	],
	default: 'getAllBids',
},
{
	displayName: 'Operation',
	name: 'operation',
	type: 'options',
	noDataExpression: true,
	displayOptions: {
		show: {
			resource: ['account'],
		},
	},
	options: [
		{
			name: 'Get Account',
			value: 'getAccount',
			description: 'Get account information',
			action: 'Get account information',
		},
		{
			name: 'Get Balance',
			value: 'getBalance',
			description: 'Get account balance',
			action: 'Get account balance',
		},
		{
			name: 'Get Balance by Denom',
			value: 'getBalanceByDenom',
			description: 'Get balance for specific denomination',
			action: 'Get balance for specific denomination',
		},
		{
			name: 'Send Transaction',
			value: 'sendTransaction',
			description: 'Send a transaction',
			action: 'Send a transaction',
		},
		{
			name: 'Get Transaction',
			value: 'getTransaction',
			description: 'Get transaction by hash',
			action: 'Get transaction by hash',
		},
	],
	default: 'getAccount',
},
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: { show: { resource: ['certificate'] } },
  options: [
    { name: 'Get Certificates', value: 'getCertificates', description: 'Get certificates for an owner', action: 'Get certificates for an owner' },
    { name: 'Create Certificate', value: 'createCertificate', description: 'Create a new certificate', action: 'Create a new certificate' },
    { name: 'Revoke Certificate', value: 'revokeCertificate', description: 'Revoke a certificate', action: 'Revoke a certificate' }
  ],
  default: 'getCertificates',
},
{
  displayName: 'Owner',
  name: 'owner',
  type: 'string',
  required: true,
  displayOptions: { 
    show: { 
      resource: ['deployment'], 
      operation: ['createDeployment', 'getDeployment', 'updateDeployment', 'closeDeployment'] 
    } 
  },
  default: '',
  description: 'The owner address of the deployment',
},
{
  displayName: 'Deployment Sequence (DSEQ)',
  name: 'dseq',
  type: 'string',
  required: true,
  displayOptions: { 
    show: { 
      resource: ['deployment'], 
      operation: ['getDeployment', 'updateDeployment', 'closeDeployment'] 
    } 
  },
  default: '',
  description: 'The deployment sequence number',
},
{
  displayName: 'Requirements',
  name: 'requirements',
  type: 'json',
  required: true,
  displayOptions: { 
    show: { 
      resource: ['deployment'], 
      operation: ['createDeployment', 'updateDeployment'] 
    } 
  },
  default: '{}',
  description: 'Deployment requirements specification in JSON format',
},
{
  displayName: 'Version',
  name: 'version',
  type: 'string',
  required: true,
  displayOptions: { 
    show: { 
      resource: ['deployment'], 
      operation: ['createDeployment', 'updateDeployment'] 
    } 
  },
  default: '',
  description: 'Deployment version hash',
},
{
  displayName: 'Deposit',
  name: 'deposit',
  type: 'string',
  required: true,
  displayOptions: { 
    show: { 
      resource: ['deployment'], 
      operation: ['createDeployment'] 
    } 
  },
  default: '5000000uakt',
  description: 'Deposit amount in uakt',
},
{
  displayName: 'Filters',
  name: 'filters',
  type: 'json',
  displayOptions: { 
    show: { 
      resource: ['deployment'], 
      operation: ['getAllDeployments'] 
    } 
  },
  default: '{}',
  description: 'Optional filters for deployment listing',
},
{
  displayName: 'Pagination',
  name: 'pagination',
  type: 'json',
  displayOptions: { 
    show: { 
      resource: ['deployment'], 
      operation: ['getAllDeployments'] 
    } 
  },
  default: '{"limit": 100, "offset": 0}',
  description: 'Pagination options for deployment listing',
},
{
  displayName: 'Gas Fee',
  name: 'gasFee',
  type: 'string',
  displayOptions: { 
    show: { 
      resource: ['deployment'], 
      operation: ['createDeployment', 'updateDeployment', 'closeDeployment'] 
    } 
  },
  default: 'auto',
  description: 'Gas fee for the transaction',
},
{
  displayName: 'Filters',
  name: 'filters',
  type: 'json',
  default: '{}',
  description: 'Filter criteria for providers',
  displayOptions: { show: { resource: ['provider'], operation: ['getAllProviders'] } },
},
{
  displayName: 'Page Size',
  name: 'pageSize',
  type: 'number',
  default: 20,
  description: 'Number of providers per page',
  displayOptions: { show: { resource: ['provider'], operation: ['getAllProviders'] } },
},
{
  displayName: 'Page Offset',
  name: 'pageOffset',
  type: 'string',
  default: '',
  description: 'Pagination offset key',
  displayOptions: { show: { resource: ['provider'], operation: ['getAllProviders'] } },
},
{
  displayName: 'Owner Address',
  name: 'owner',
  type: 'string',
  required: true,
  default: '',
  description: 'Provider owner address',
  displayOptions: { show: { resource: ['provider'], operation: ['getProvider', 'getProviderAttributes'] } },
},
{
  displayName: 'Owner Address',
  name: 'owner',
  type: 'string',
  required: true,
  default: '',
  description: 'Provider owner address',
  displayOptions: { show: { resource: ['provider'], operation: ['createProvider'] } },
},
{
  displayName: 'Host URI',
  name: 'hostUri',
  type: 'string',
  required: true,
  default: '',
  description: 'Provider host URI endpoint',
  displayOptions: { show: { resource: ['provider'], operation: ['createProvider'] } },
},
{
  displayName: 'Attributes',
  name: 'attributes',
  type: 'json',
  default: '[]',
  description: 'Provider attributes and capabilities as JSON array',
  displayOptions: { show: { resource: ['provider'], operation: ['createProvider'] } },
},
{
  displayName: 'Provider Info',
  name: 'info',
  type: 'json',
  default: '{}',
  description: 'Additional provider information',
  displayOptions: { show: { resource: ['provider'], operation: ['createProvider'] } },
},
{
  displayName: 'Filters',
  name: 'filters',
  type: 'json',
  default: '{}',
  description: 'Filter criteria for lease listing',
  displayOptions: {
    show: {
      resource: ['lease'],
      operation: ['getAllLeases']
    }
  }
},
{
  displayName: 'Page Size',
  name: 'pageSize',
  type: 'number',
  default: 100,
  description: 'Number of results per page',
  displayOptions: {
    show: {
      resource: ['lease'],
      operation: ['getAllLeases']
    }
  }
},
{
  displayName: 'Page Token',
  name: 'pageToken',
  type: 'string',
  default: '',
  description: 'Token for pagination',
  displayOptions: {
    show: {
      resource: ['lease'],
      operation: ['getAllLeases']
    }
  }
},
{
  displayName: 'Owner',
  name: 'owner',
  type: 'string',
  required: true,
  default: '',
  description: 'Owner address of the deployment',
  displayOptions: {
    show: {
      resource: ['lease'],
      operation: ['getLease', 'createLease', 'closeLease']
    }
  }
},
{
  displayName: 'DSEQ',
  name: 'dseq',
  type: 'string',
  required: true,
  default: '',
  description: 'Deployment sequence number',
  displayOptions: {
    show: {
      resource: ['lease'],
      operation: ['getLease', 'createLease', 'closeLease']
    }
  }
},
{
  displayName: 'GSEQ',
  name: 'gseq',
  type: 'string',
  required: true,
  default: '',
  description: 'Group sequence number',
  displayOptions: {
    show: {
      resource: ['lease'],
      operation: ['getLease', 'createLease', 'closeLease']
    }
  }
},
{
  displayName: 'OSEQ',
  name: 'oseq',
  type: 'string',
  required: true,
  default: '',
  description: 'Order sequence number',
  displayOptions: {
    show: {
      resource: ['lease'],
      operation: ['getLease', 'createLease', 'closeLease']
    }
  }
},
{
  displayName: 'Provider',
  name: 'provider',
  type: 'string',
  required: true,
  default: '',
  description: 'Provider address',
  displayOptions: {
    show: {
      resource: ['lease'],
      operation: ['getLease', 'createLease', 'closeLease']
    }
  }
},
{
  displayName: 'Gas Fee',
  name: 'gasFee',
  type: 'string',
  default: '5000uakt',
  description: 'Gas fee for the transaction',
  displayOptions: {
    show: {
      resource: ['lease'],
      operation: ['createLease', 'closeLease']
    }
  }
},
{
  displayName: 'Private Key',
  name: 'privateKey',
  type: 'string',
  typeOptions: { password: true },
  required: true,
  default: '',
  description: 'Private key for transaction signing',
  displayOptions: {
    show: {
      resource: ['lease'],
      operation: ['createLease', 'closeLease']
    }
  }
},
{
	displayName: 'Filters',
	name: 'filters',
	type: 'json',
	displayOptions: { show: { resource: ['bid'], operation: ['getAllBids'] } },
	default: '{}',
	description: 'Filter criteria for bid search',
},
{
	displayName: 'Pagination',
	name: 'pagination',
	type: 'json',
	displayOptions: { show: { resource: ['bid'], operation: ['getAllBids'] } },
	default: '{"limit": 100, "offset": 0}',
	description: 'Pagination options for bid listing',
},
{
	displayName: 'Owner',
	name: 'owner',
	type: 'string',
	required: true,
	displayOptions: { show: { resource: ['bid'], operation: ['getBid', 'closeBid'] } },
	default: '',
	description: 'The owner address of the deployment',
},
{
	displayName: 'Deployment Sequence (DSEQ)',
	name: 'dseq',
	type: 'string',
	required: true,
	displayOptions: { show: { resource: ['bid'], operation: ['getBid', 'closeBid'] } },
	default: '',
	description: 'Deployment sequence number',
},
{
	displayName: 'Group Sequence (GSEQ)',
	name: 'gseq',
	type: 'string',
	required: true,
	displayOptions: { show: { resource: ['bid'], operation: ['getBid', 'closeBid'] } },
	default: '',
	description: 'Group sequence number',
},
{
	displayName: 'Order Sequence (OSEQ)',
	name: 'oseq',
	type: 'string',
	required: true,
	displayOptions: { show: { resource: ['bid'], operation: ['getBid', 'closeBid'] } },
	default: '',
	description: 'Order sequence number',
},
{
	displayName: 'Provider',
	name: 'provider',
	type: 'string',
	required: true,
	displayOptions: { show: { resource: ['bid'], operation: ['getBid', 'createBid', 'closeBid'] } },
	default: '',
	description: 'Provider address',
},
{
	displayName: 'Order',
	name: 'order',
	type: 'json',
	required: true,
	displayOptions: { show: { resource: ['bid'], operation: ['createBid'] } },
	default: '{}',
	description: 'Order details for the bid',
},
{
	displayName: 'Price',
	name: 'price',
	type: 'json',
	required: true,
	displayOptions: { show: { resource: ['bid'], operation: ['createBid'] } },
	default: '{"denom": "uakt", "amount": "1000"}',
	description: 'Bid price in AKT tokens',
},
{
	displayName: 'Gas Fee',
	name: 'gasFee',
	type: 'json',
	displayOptions: { show: { resource: ['bid'], operation: ['createBid', 'closeBid'] } },
	default: '{"denom": "uakt", "amount": "5000"}',
	description: 'Gas fee for the transaction',
},
{
	displayName: 'Address',
	name: 'address',
	type: 'string',
	required: true,
	displayOptions: {
		show: {
			resource: ['account'],
			operation: ['getAccount', 'getBalance', 'getBalanceByDenom'],
		},
	},
	default: '',
	description: 'The account address',
},
{
	displayName: 'Denomination',
	name: 'denom',
	type: 'string',
	displayOptions: {
		show: {
			resource: ['account'],
			operation: ['getBalance', 'getBalanceByDenom'],
		},
	},
	default: 'uakt',
	description: 'The denomination to query (e.g., uakt for AKT tokens)',
},
{
	displayName: 'Transaction Bytes',
	name: 'txBytes',
	type: 'string',
	required: true,
	displayOptions: {
		show: {
			resource: ['account'],
			operation: ['sendTransaction'],
		},
	},
	default: '',
	description: 'Base64 encoded transaction bytes (protobuf encoded)',
},
{
	displayName: 'Broadcast Mode',
	name: 'mode',
	type: 'options',
	displayOptions: {
		show: {
			resource: ['account'],
			operation: ['sendTransaction'],
		},
	},
	options: [
		{
			name: 'Sync',
			value: 'BROADCAST_MODE_SYNC',
		},
		{
			name: 'Async',
			value: 'BROADCAST_MODE_ASYNC',
		},
		{
			name: 'Block',
			value: 'BROADCAST_MODE_BLOCK',
		},
	],
	default: 'BROADCAST_MODE_SYNC',
	description: 'Transaction broadcast mode',
},
{
	displayName: 'Transaction Hash',
	name: 'hash',
	type: 'string',
	required: true,
	displayOptions: {
		show: {
			resource: ['account'],
			operation: ['getTransaction'],
		},
	},
	default: '',
	description: 'The transaction hash to query',
},
{
  displayName: 'Owner',
  name: 'owner',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['certificate'], operation: ['getCertificates', 'createCertificate', 'revokeCertificate'] } },
  default: '',
  description: 'The owner address for the certificate',
},
{
  displayName: 'State',
  name: 'state',
  type: 'options',
  displayOptions: { show: { resource: ['certificate'], operation: ['getCertificates'] } },
  options: [
    { name: 'All', value: '' },
    { name: 'Valid', value: 'valid' },
    { name: 'Revoked', value: 'revoked' }
  ],
  default: '',
  description: 'Certificate state filter',
},
{
  displayName: 'Pagination Key',
  name: 'paginationKey',
  type: 'string',
  displayOptions: { show: { resource: ['certificate'], operation: ['getCertificates'] } },
  default: '',
  description: 'Pagination key for fetching next page',
},
{
  displayName: 'Limit',
  name: 'limit',
  type: 'number',
  displayOptions: { show: { resource: ['certificate'], operation: ['getCertificates'] } },
  default: 100,
  description: 'Number of certificates to return',
},
{
  displayName: 'Certificate',
  name: 'cert',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['certificate'], operation: ['createCertificate'] } },
  typeOptions: { rows: 10 },
  default: '',
  description: 'PEM-encoded certificate',
},
{
  displayName: 'Public Key',
  name: 'pubkey',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['certificate'], operation: ['createCertificate'] } },
  typeOptions: { rows: 5 },
  default: '',
  description: 'PEM-encoded public key',
},
{
  displayName: 'Serial Number',
  name: 'serial',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['certificate'], operation: ['revokeCertificate'] } },
  default: '',
  description: 'Certificate serial number to revoke',
},
{
  displayName: 'Gas Fee',
  name: 'gasFee',
  type: 'number',
  displayOptions: { show: { resource: ['certificate'], operation: ['createCertificate', 'revokeCertificate'] } },
  default: 5000,
  description: 'Gas fee in uakt for the transaction',
},
{
  displayName: 'Memo',
  name: 'memo',
  type: 'string',
  displayOptions: { show: { resource: ['certificate'], operation: ['createCertificate', 'revokeCertificate'] } },
  default: '',
  description: 'Optional memo for the transaction',
},
    ],
  };

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const items = this.getInputData();
    const resource = this.getNodeParameter('resource', 0) as string;

    switch (resource) {
      case 'deployment':
        return [await executeDeploymentOperations.call(this, items)];
      case 'provider':
        return [await executeProviderOperations.call(this, items)];
      case 'lease':
        return [await executeLeaseOperations.call(this, items)];
      case 'bid':
        return [await executeBidOperations.call(this, items)];
      case 'account':
        return [await executeAccountOperations.call(this, items)];
      case 'certificate':
        return [await executeCertificateOperations.call(this, items)];
      default:
        throw new NodeOperationError(this.getNode(), `The resource "${resource}" is not supported`);
    }
  }
}

// ============================================================
// Resource Handler Functions
// ============================================================

async function executeDeploymentOperations(
  this: IExecuteFunctions,
  items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
  const returnData: INodeExecutionData[] = [];
  const operation = this.getNodeParameter('operation', 0) as string;
  const credentials = await this.getCredentials('akashnetworkApi') as any;

  for (let i = 0; i < items.length; i++) {
    try {
      let result: any;

      switch (operation) {
        case 'createDeployment': {
          const owner = this.getNodeParameter('owner', i) as string;
          const requirements = this.getNodeParameter('requirements', i) as object;
          const version = this.getNodeParameter('version', i) as string;
          const deposit = this.getNodeParameter('deposit', i) as string;
          const gasFee = this.getNodeParameter('gasFee', i) as string;

          const body = {
            owner,
            requirements,
            version,
            deposit,
            gas_fee: gasFee
          };

          const options: any = {
            method: 'POST',
            url: `${credentials.baseUrl}/akash/deployment/v1beta3/deployments`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
              'X-Cosmos-SDK-Version': credentials.cosmosVersion || 'v0.47.0'
            },
            body,
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getDeployment': {
          const owner = this.getNodeParameter('owner', i) as string;
          const dseq = this.getNodeParameter('dseq', i) as string;

          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/akash/deployment/v1beta3/deployments/${owner}/${dseq}`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json'
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getAllDeployments': {
          const filters = this.getNodeParameter('filters', i) as object;
          const pagination = this.getNodeParameter('pagination', i) as object;

          const queryParams = new URLSearchParams();
          
          if (filters && Object.keys(filters).length > 0) {
            queryParams.append('filters', JSON.stringify(filters));
          }
          
          if (pagination) {
            const paginationObj = pagination as any;
            if (paginationObj.limit) {
              queryParams.append('pagination.limit', paginationObj.limit.toString());
            }
            if (paginationObj.offset) {
              queryParams.append('pagination.offset', paginationObj.offset.toString());
            }
          }

          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/akash/deployment/v1beta3/deployments${queryParams.toString() ? '?' + queryParams.toString() : ''}`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json'
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'updateDeployment': {
          const owner = this.getNodeParameter('owner', i) as string;
          const dseq = this.getNodeParameter('dseq', i) as string;
          const version = this.getNodeParameter('version', i) as string;
          const requirements = this.getNodeParameter('requirements', i) as object;
          const gasFee = this.getNodeParameter('gasFee', i) as string;

          const body = {
            version,
            requirements,
            gas_fee: gasFee
          };

          const options: any = {
            method: 'POST',
            url: `${credentials.baseUrl}/akash/deployment/v1beta3/deployments/${owner}/${dseq}/update`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
              'X-Cosmos-SDK-Version': credentials.cosmosVersion || 'v0.47.0'
            },
            body,
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'closeDeployment': {
          const owner = this.getNodeParameter('owner', i) as string;
          const dseq = this.getNodeParameter('dseq', i) as string;
          const gasFee = this.getNodeParameter('gasFee', i) as string;

          const body = {
            gas_fee: gasFee
          };

          const options: any = {
            method: 'POST',
            url: `${credentials.baseUrl}/akash/deployment/v1beta3/deployments/${owner}/${dseq}/close`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
              'X-Cosmos-SDK-Version': credentials.cosmosVersion || 'v0.47.0'
            },
            body,
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        default:
          throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
      }

      returnData.push({ json: result, pairedItem: { item: i } });

    } catch (error: any) {
      if (this.continueOnFail()) {
        returnData.push({ 
          json: { error: error.message }, 
          pairedItem: { item: i } 
        });
      } else {
        throw error;
      }
    }
  }

  return returnData;
}

async function executeProviderOperations(
  this: IExecuteFunctions,
  items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
  const returnData: INodeExecutionData[] = [];
  const operation = this.getNodeParameter('operation', 0) as string;
  const credentials = await this.getCredentials('akashnetworkApi') as any;

  for (let i = 0; i < items.length; i++) {
    try {
      let result: any;

      switch (operation) {
        case 'getAllProviders': {
          const filters = this.getNodeParameter('filters', i, '{}') as string;
          const pageSize = this.getNodeParameter('pageSize', i, 20) as number;
          const pageOffset = this.getNodeParameter('pageOffset', i, '') as string;

          let url = `${credentials.baseUrl}/akash/provider/v1beta3/providers`;
          const queryParams: string[] = [];

          if (pageSize) {
            queryParams.push(`pagination.limit=${pageSize}`);
          }
          if (pageOffset) {
            queryParams.push(`pagination.offset=${pageOffset}`);
          }

          if (queryParams.length > 0) {
            url += `?${queryParams.join('&')}`;
          }

          const options: any = {
            method: 'GET',
            url,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getProvider': {
          const owner = this.getNodeParameter('owner', i) as string;

          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/akash/provider/v1beta3/providers/${encodeURIComponent(owner)}`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getProviderAttributes': {
          const owner = this.getNodeParameter('owner', i) as string;

          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/akash/provider/v1beta3/providers/${encodeURIComponent(owner)}/attributes`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'createProvider': {
          const owner = this.getNodeParameter('owner', i) as string;
          const hostUri = this.getNodeParameter('hostUri', i) as string;
          const attributes = this.getNodeParameter('attributes', i, '[]') as string;
          const info = this.getNodeParameter('info', i, '{}') as string;

          let parsedAttributes: any;
          let parsedInfo: any;

          try {
            parsedAttributes = JSON.parse(attributes);
          } catch (error: any) {
            throw new Error(`Invalid attributes JSON: ${error.message}`);
          }

          try {
            parsedInfo = JSON.parse(info);
          } catch (error: any) {
            throw new Error(`Invalid info JSON: ${error.message}`);
          }

          const body = {
            owner,
            host_uri: hostUri,
            attributes: parsedAttributes,
            info: parsedInfo,
          };

          const options: any = {
            method: 'POST',
            url: `${credentials.baseUrl}/akash/provider/v1beta3/providers`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            body,
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        default:
          throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
      }

      returnData.push({
        json: result,
        pairedItem: { item: i },
      });

    } catch (error: any) {
      if (this.continueOnFail()) {
        returnData.push({
          json: { error: error.message },
          pairedItem: { item: i },
        });
      } else {
        throw error;
      }
    }
  }

  return returnData;
}

async function executeLeaseOperations(
  this: IExecuteFunctions,
  items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
  const returnData: INodeExecutionData[] = [];
  const operation = this.getNodeParameter('operation', 0) as string;
  const credentials = await this.getCredentials('akashnetworkApi') as any;

  for (let i = 0; i < items.length; i++) {
    try {
      let result: any;

      switch (operation) {
        case 'getAllLeases': {
          const filters = this.getNodeParameter('filters', i, {}) as any;
          const pageSize = this.getNodeParameter('pageSize', i, 100) as number;
          const pageToken = this.getNodeParameter('pageToken', i, '') as string;

          const queryParams = new URLSearchParams();
          if (pageSize) queryParams.append('pagination.limit', pageSize.toString());
          if (pageToken) queryParams.append('pagination.key', pageToken);
          
          Object.keys(filters).forEach((key: string) => {
            queryParams.append(key, filters[key]);
          });

          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/akash/market/v1beta3/leases?${queryParams.toString()}`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json'
            },
            json: true
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getLease': {
          const owner = this.getNodeParameter('owner', i) as string;
          const dseq = this.getNodeParameter('dseq', i) as string;
          const gseq = this.getNodeParameter('gseq', i) as string;
          const oseq = this.getNodeParameter('oseq', i) as string;
          const provider = this.getNodeParameter('provider', i) as string;

          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/akash/market/v1beta3/leases/${owner}/${dseq}/${gseq}/${oseq}/${provider}`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json'
            },
            json: true
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'createLease': {
          const owner = this.getNodeParameter('owner', i) as string;
          const dseq = this.getNodeParameter('dseq', i) as string;
          const gseq = this.getNodeParameter('gseq', i) as string;
          const oseq = this.getNodeParameter('oseq', i) as string;
          const provider = this.getNodeParameter('provider', i) as string;
          const gasFee = this.getNodeParameter('gasFee', i) as string;
          const privateKey = this.getNodeParameter('privateKey', i) as string;

          const transactionBody = {
            messages: [{
              '@type': '/akash.market.v1beta3.MsgCreateLease',
              bid_id: {
                owner,
                dseq,
                gseq,
                oseq,
                provider
              }
            }],
            memo: 'Create lease transaction',
            timeout_height: '0',
            extension_options: [],
            non_critical_extension_options: []
          };

          const options: any = {
            method: 'POST',
            url: `${credentials.baseUrl}/akash/market/v1beta3/leases/${owner}/${dseq}/${gseq}/${oseq}/${provider}/create`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json'
            },
            body: {
              tx: transactionBody,
              gas_fee: gasFee,
              private_key: privateKey
            },
            json: true
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'closeLease': {
          const owner = this.getNodeParameter('owner', i) as string;
          const dseq = this.getNodeParameter('dseq', i) as string;
          const gseq = this.getNodeParameter('gseq', i) as string;
          const oseq = this.getNodeParameter('oseq', i) as string;
          const provider = this.getNodeParameter('provider', i) as string;
          const gasFee = this.getNodeParameter('gasFee', i) as string;
          const privateKey = this.getNodeParameter('privateKey', i) as string;

          const transactionBody = {
            messages: [{
              '@type': '/akash.market.v1beta3.MsgCloseLease',
              lease_id: {
                owner,
                dseq,
                gseq,
                oseq,
                provider
              }
            }],
            memo: 'Close lease transaction',
            timeout_height: '0',
            extension_options: [],
            non_critical_extension_options: []
          };

          const options: any = {
            method: 'POST',
            url: `${credentials.baseUrl}/akash/market/v1beta3/leases/${owner}/${dseq}/${gseq}/${oseq}/${provider}/close`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json'
            },
            body: {
              tx: transactionBody,
              gas_fee: gasFee,
              private_key: privateKey
            },
            json: true
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        default:
          throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
      }

      returnData.push({ json: result, pairedItem: { item: i } });

    } catch (error: any) {
      if (this.continueOnFail()) {
        returnData.push({ json: { error: error.message }, pairedItem: { item: i } });
      } else {
        throw error;
      }
    }
  }

  return returnData;
}

async function executeBidOperations(
	this: IExecuteFunctions,
	items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
	const returnData: INodeExecutionData[] = [];
	const operation = this.getNodeParameter('operation', 0) as string;
	const credentials = await this.getCredentials('akashnetworkApi') as any;

	for (let i = 0; i < items.length; i++) {
		try {
			let result: any;

			switch (operation) {
				case 'getAllBids': {
					const filters = this.getNodeParameter('filters', i, {}) as any;
					const pagination = this.getNodeParameter('pagination', i, { limit: 100, offset: 0 }) as any;
					
					const queryParams = new URLSearchParams();
					if (filters && Object.keys(filters).length > 0) {
						Object.entries(filters).forEach(([key, value]) => {
							queryParams.append(key, String(value));
						});
					}
					if (pagination.limit) queryParams.append('pagination.limit', String(pagination.limit));
					if (pagination.offset) queryParams.append('pagination.offset', String(pagination.offset));

					const options: any = {
						method: 'GET',
						url: `${credentials.baseUrl}/akash/market/v1beta3/bids?${queryParams.toString()}`,
						headers: {
							'Authorization': `Bearer ${credentials.apiKey}`,
							'Content-Type': 'application/json',
						},
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'getBid': {
					const owner = this.getNodeParameter('owner', i) as string;
					const dseq = this.getNodeParameter('dseq', i) as string;
					const gseq = this.getNodeParameter('gseq', i) as string;
					const oseq = this.getNodeParameter('oseq', i) as string;
					const provider = this.getNodeParameter('provider', i) as string;

					const options: any = {
						method: 'GET',
						url: `${credentials.baseUrl}/akash/market/v1beta3/bids/${owner}/${dseq}/${gseq}/${oseq}/${provider}`,
						headers: {
							'Authorization': `Bearer ${credentials.apiKey}`,
							'Content-Type': 'application/json',
						},
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'createBid': {
					const order = this.getNodeParameter('order', i) as any;
					const provider = this.getNodeParameter('provider', i) as string;
					const price = this.getNodeParameter('price', i) as any;
					const gasFee = this.getNodeParameter('gasFee', i, { denom: 'uakt', amount: '5000' }) as any;

					const txMessage = {
						'@type': '/akash.market.v1beta3.MsgCreateBid',
						order: order,
						provider: provider,
						price: price,
					};

					const txBody = {
						messages: [txMessage],
						memo: '',
						timeout_height: '0',
						extension_options: [],
						non_critical_extension_options: [],
					};

					const authInfo = {
						signer_infos: [],
						fee: {
							amount: [gasFee],
							gas_limit: '200000',
							payer: '',
							granter: '',
						},
					};

					const options: any = {
						method: 'POST',
						url: `${credentials.baseUrl}/akash/market/v1beta3/bids`,
						headers: {
							'Authorization': `Bearer ${credentials.apiKey}`,
							'Content-Type': 'application/json',
						},
						body: {
							tx_bytes: Buffer.from(JSON.stringify({ body: txBody, auth_info: authInfo })).toString('base64'),
							mode: 'BROADCAST_MODE_BLOCK',
						},
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'closeBid': {
					const owner = this.getNodeParameter('owner', i) as string;
					const dseq = this.getNodeParameter('dseq', i) as string;
					const gseq = this.getNodeParameter('gseq', i) as string;
					const oseq = this.getNodeParameter('oseq', i) as string;
					const provider = this.getNodeParameter('provider', i) as string;
					const gasFee = this.getNodeParameter('gasFee', i, { denom: 'uakt', amount: '5000' }) as any;

					const txMessage = {
						'@type': '/akash.market.v1beta3.MsgCloseBid',
						bid_id: {
							owner: owner,
							dseq: dseq,
							gseq: parseInt(gseq),
							oseq: parseInt(oseq),
							provider: provider,
						},
					};

					const txBody = {
						messages: [txMessage],
						memo: '',
						timeout_height: '0',
						extension_options: [],
						non_critical_extension_options: [],
					};

					const authInfo = {
						signer_infos: [],
						fee: {
							amount: [gasFee],
							gas_limit: '200000',
							payer: '',
							granter: '',
						},
					};

					const options: any = {
						method: 'POST',
						url: `${credentials.baseUrl}/akash/market/v1beta3/bids/${owner}/${dseq}/${gseq}/${oseq}/${provider}/close`,
						headers: {
							'Authorization': `Bearer ${credentials.apiKey}`,
							'Content-Type': 'application/json',
						},
						body: {
							tx_bytes: Buffer.from(JSON.stringify({ body: txBody, auth_info: authInfo })).toString('base64'),
							mode: 'BROADCAST_MODE_BLOCK',
						},
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				default:
					throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
			}

			returnData.push({
				json: result,
				pairedItem: { item: i },
			});

		} catch (error: any) {
			if (this.continueOnFail()) {
				returnData.push({
					json: { error: error.message },
					pairedItem: { item: i },
				});
			} else {
				throw error;
			}
		}
	}

	return returnData;
}

async function executeAccountOperations(
	this: IExecuteFunctions,
	items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
	const returnData: INodeExecutionData[] = [];
	const operation = this.getNodeParameter('operation', 0) as string;
	const credentials = await this.getCredentials('akashnetworkApi') as any;

	for (let i = 0; i < items.length; i++) {
		try {
			let result: any;

			switch (operation) {
				case 'getAccount': {
					const address = this.getNodeParameter('address', i) as string;
					const options: any = {
						method: 'GET',
						url: `${credentials.baseUrl}/cosmos/auth/v1beta1/accounts/${address}`,
						headers: {
							'Authorization': `Bearer ${credentials.apiKey}`,
							'Content-Type': 'application/json',
						},
						json: true,
					};
					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'getBalance': {
					const address = this.getNodeParameter('address', i) as string;
					const denom = this.getNodeParameter('denom', i) as string;
					let url = `${credentials.baseUrl}/cosmos/bank/v1beta1/balances/${address}`;
					if (denom) {
						url += `?pagination.limit=1000&denom=${denom}`;
					}
					const options: any = {
						method: 'GET',
						url,
						headers: {
							'Authorization': `Bearer ${credentials.apiKey}`,
							'Content-Type': 'application/json',
						},
						json: true,
					};
					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'getBalanceByDenom': {
					const address = this.getNodeParameter('address', i) as string;
					const denom = this.getNodeParameter('denom', i) as string;
					const options: any = {
						method: 'GET',
						url: `${credentials.baseUrl}/cosmos/bank/v1beta1/balances/${address}/by_denom?denom=${denom}`,
						headers: {
							'Authorization': `Bearer ${credentials.apiKey}`,
							'Content-Type': 'application/json',
						},
						json: true,
					};
					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'sendTransaction': {
					const txBytes = this.getNodeParameter('txBytes', i) as string;
					const mode = this.getNodeParameter('mode', i) as string;
					const options: any = {
						method: 'POST',
						url: `${credentials.baseUrl}/cosmos/tx/v1beta1/txs`,
						headers: {
							'Authorization': `Bearer ${credentials.apiKey}`,
							'Content-Type': 'application/json',
						},
						body: {
							tx_bytes: txBytes,
							mode: mode,
						},
						json: true,
					};
					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'getTransaction': {
					const hash = this.getNodeParameter('hash', i) as string;
					const options: any = {
						method: 'GET',
						url: `${credentials.baseUrl}/cosmos/tx/v1beta1/txs/${hash}`,
						headers: {
							'Authorization': `Bearer ${credentials.apiKey}`,
							'Content-Type': 'application/json',
						},
						json: true,
					};
					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				default:
					throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
			}

			returnData.push({
				json: result,
				pairedItem: { item: i },
			});

		} catch (error: any) {
			if (this.continueOnFail()) {
				returnData.push({
					json: { error: error.message },
					pairedItem: { item: i },
				});
			} else {
				throw error;
			}
		}
	}

	return returnData;
}

async function executeCertificateOperations(
  this: IExecuteFunctions,
  items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
  const returnData: INodeExecutionData[] = [];
  const operation = this.getNodeParameter('operation', 0) as string;
  const credentials = await this.getCredentials('akashnetworkApi') as any;

  for (let i = 0; i < items.length; i++) {
    try {
      let result: any;

      switch (operation) {
        case 'getCertificates': {
          const owner = this.getNodeParameter('owner', i) as string;
          const state = this.getNodeParameter('state', i) as string;
          const paginationKey = this.getNodeParameter('paginationKey', i) as string;
          const limit = this.getNodeParameter('limit', i) as number;

          let url = `${credentials.baseUrl}/akash/cert/v1beta3/certificates/${owner}`;
          const queryParams: string[] = [];

          if (state) queryParams.push(`pagination.state=${state}`);
          if (paginationKey) queryParams.push(`pagination.key=${encodeURIComponent(paginationKey)}`);
          if (limit) queryParams.push(`pagination.limit=${limit}`);

          if (queryParams.length > 0) {
            url += `?${queryParams.join('&')}`;
          }

          const options: any = {
            method: 'GET',
            url,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'createCertificate': {
          const owner = this.getNodeParameter('owner', i) as string;
          const cert = this.getNodeParameter('cert', i) as string;
          const pubkey = this.getNodeParameter('pubkey', i) as string;
          const gasFee = this.getNodeParameter('gasFee', i) as number;
          const memo = this.getNodeParameter('memo', i) as string;

          const txBody = {
            messages: [{
              '@type': '/akash.cert.v1beta3.MsgCreateCertificate',
              owner,
              cert: Buffer.from(cert).toString('base64'),
              pubkey: Buffer.from(pubkey).toString('base64'),
            }],
            memo,
          };

          const authInfo = {
            signer_infos: [],
            fee: {
              amount: [{ denom: 'uakt', amount: gasFee.toString() }],
              gas_limit: '200000',
            },
          };

          const options: any = {
            method: 'POST',
            url: `${credentials.baseUrl}/akash/cert/v1beta3/certificates`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            body: {
              tx_body: txBody,
              auth_info: authInfo,
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'revokeCertificate': {
          const owner = this.getNodeParameter('owner', i) as string;
          const serial = this.getNodeParameter('serial', i) as string;
          const gasFee = this.getNodeParameter('gasFee', i) as number;
          const memo = this.getNodeParameter('memo', i) as string;

          const txBody = {
            messages: [{
              '@type': '/akash.cert.v1beta3.MsgRevokeCertificate',
              id: {
                owner,
                serial,
              },
            }],
            memo,
          };

          const authInfo = {
            signer_infos: [],
            fee: {
              amount: [{ denom: 'uakt', amount: gasFee.toString() }],
              gas_limit: '200000',
            },
          };

          const options: any = {
            method: 'POST',
            url: `${credentials.baseUrl}/akash/cert/v1beta3/certificates/${owner}/${serial}/revoke`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            body: {
              tx_body: txBody,
              auth_info: authInfo,
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        default:
          throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
      }

      returnData.push({
        json: result,
        pairedItem: { item: i },
      });
    } catch (error: any) {
      if (this.continueOnFail()) {
        returnData.push({
          json: { error: error.message },
          pairedItem: { item: i },
        });
      } else {
        throw error;
      }
    }
  }

  return returnData;
}
