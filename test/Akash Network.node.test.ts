/**
 * Copyright (c) 2026 Velocity BPA
 * Licensed under the Business Source License 1.1
 */

import { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { AkashNetwork } from '../nodes/Akash Network/Akash Network.node';

// Mock n8n-workflow
jest.mock('n8n-workflow', () => ({
  ...jest.requireActual('n8n-workflow'),
  NodeApiError: class NodeApiError extends Error {
    constructor(node: any, error: any) { super(error.message || 'API Error'); }
  },
  NodeOperationError: class NodeOperationError extends Error {
    constructor(node: any, message: string) { super(message); }
  },
}));

describe('AkashNetwork Node', () => {
  let node: AkashNetwork;

  beforeAll(() => {
    node = new AkashNetwork();
  });

  describe('Node Definition', () => {
    it('should have correct basic properties', () => {
      expect(node.description.displayName).toBe('Akash Network');
      expect(node.description.name).toBe('akashnetwork');
      expect(node.description.version).toBe(1);
      expect(node.description.inputs).toContain('main');
      expect(node.description.outputs).toContain('main');
    });

    it('should define 6 resources', () => {
      const resourceProp = node.description.properties.find(
        (p: any) => p.name === 'resource'
      );
      expect(resourceProp).toBeDefined();
      expect(resourceProp!.type).toBe('options');
      expect(resourceProp!.options).toHaveLength(6);
    });

    it('should have operation dropdowns for each resource', () => {
      const operations = node.description.properties.filter(
        (p: any) => p.name === 'operation'
      );
      expect(operations.length).toBe(6);
    });

    it('should require credentials', () => {
      expect(node.description.credentials).toBeDefined();
      expect(node.description.credentials!.length).toBeGreaterThan(0);
      expect(node.description.credentials![0].required).toBe(true);
    });

    it('should have parameters with proper displayOptions', () => {
      const params = node.description.properties.filter(
        (p: any) => p.displayOptions?.show?.resource
      );
      for (const param of params) {
        expect(param.displayOptions.show.resource).toBeDefined();
        expect(Array.isArray(param.displayOptions.show.resource)).toBe(true);
      }
    });
  });

  // Resource-specific tests
describe('Deployment Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({ 
        apiKey: 'test-key', 
        baseUrl: 'https://api.akash.network/v1beta3',
        cosmosVersion: 'v0.47.0' 
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: { 
        httpRequest: jest.fn().mockResolvedValue({ deployment_id: 'test-deployment' })
      },
    };
  });

  test('should create deployment successfully', async () => {
    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
      switch (param) {
        case 'operation': return 'createDeployment';
        case 'owner': return 'akash1234567890';
        case 'requirements': return { cpu: '1000m', memory: '1Gi' };
        case 'version': return 'abc123';
        case 'deposit': return '5000000uakt';
        case 'gasFee': return 'auto';
        default: return '';
      }
    });

    const result = await executeDeploymentOperations.call(mockExecuteFunctions, [{ json: {} }]);
    
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'POST',
      url: 'https://api.akash.network/v1beta3/akash/deployment/v1beta3/deployments',
      headers: {
        'Authorization': 'Bearer test-key',
        'Content-Type': 'application/json',
        'X-Cosmos-SDK-Version': 'v0.47.0'
      },
      body: {
        owner: 'akash1234567890',
        requirements: { cpu: '1000m', memory: '1Gi' },
        version: 'abc123',
        deposit: '5000000uakt',
        gas_fee: 'auto'
      },
      json: true,
    });
    expect(result).toEqual([{ json: { deployment_id: 'test-deployment' }, pairedItem: { item: 0 } }]);
  });

  test('should get deployment successfully', async () => {
    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
      switch (param) {
        case 'operation': return 'getDeployment';
        case 'owner': return 'akash1234567890';
        case 'dseq': return '12345';
        default: return '';
      }
    });

    const result = await executeDeploymentOperations.call(mockExecuteFunctions, [{ json: {} }]);
    
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'GET',
      url: 'https://api.akash.network/v1beta3/akash/deployment/v1beta3/deployments/akash1234567890/12345',
      headers: {
        'Authorization': 'Bearer test-key',
        'Content-Type': 'application/json'
      },
      json: true,
    });
    expect(result).toEqual([{ json: { deployment_id: 'test-deployment' }, pairedItem: { item: 0 } }]);
  });

  test('should handle errors gracefully', async () => {
    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
      if (param === 'operation') return 'createDeployment';
      return '';
    });
    mockExecuteFunctions.continueOnFail.mockReturnValue(true);
    mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));

    const result = await executeDeploymentOperations.call(mockExecuteFunctions, [{ json: {} }]);
    
    expect(result).toEqual([{ json: { error: 'API Error' }, pairedItem: { item: 0 } }]);
  });
});

describe('Provider Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({
        apiKey: 'test-key',
        baseUrl: 'https://api.akash.network/v1beta3'
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: {
        httpRequest: jest.fn(),
        requestWithAuthentication: jest.fn(),
      },
    };
  });

  test('getAllProviders should fetch all providers successfully', async () => {
    const mockResponse = {
      providers: [
        { owner: 'akash1test', host_uri: 'https://provider1.com' },
        { owner: 'akash2test', host_uri: 'https://provider2.com' },
      ],
      pagination: { next_key: null, total: 2 }
    };

    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('getAllProviders')
      .mockReturnValueOnce('{}')
      .mockReturnValueOnce(20)
      .mockReturnValueOnce('');

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const items = [{ json: {} }];
    const result = await executeProviderOperations.call(mockExecuteFunctions, items);

    expect(result).toHaveLength(1);
    expect(result[0].json).toEqual(mockResponse);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'GET',
      url: 'https://api.akash.network/v1beta3/akash/provider/v1beta3/providers?pagination.limit=20',
      headers: {
        'Authorization': 'Bearer test-key',
        'Content-Type': 'application/json',
      },
      json: true,
    });
  });

  test('getProvider should fetch specific provider successfully', async () => {
    const mockResponse = {
      provider: {
        owner: 'akash1testowner',
        host_uri: 'https://provider.example.com',
        attributes: [{ key: 'region', value: 'us-west' }]
      }
    };

    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('getProvider')
      .mockReturnValueOnce('akash1testowner');

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const items = [{ json: {} }];
    const result = await executeProviderOperations.call(mockExecuteFunctions, items);

    expect(result).toHaveLength(1);
    expect(result[0].json).toEqual(mockResponse);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'GET',
      url: 'https://api.akash.network/v1beta3/akash/provider/v1beta3/providers/akash1testowner',
      headers: {
        'Authorization': 'Bearer test-key',
        'Content-Type': 'application/json',
      },
      json: true,
    });
  });

  test('getProviderAttributes should fetch provider attributes successfully', async () => {
    const mockResponse = {
      attributes: [
        { key: 'region', value: 'us-west' },
        { key: 'tier', value: 'premium' }
      ]
    };

    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('getProviderAttributes')
      .mockReturnValueOnce('akash1testowner');

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const items = [{ json: {} }];
    const result = await executeProviderOperations.call(mockExecuteFunctions, items);

    expect(result).toHaveLength(1);
    expect(result[0].json).toEqual(mockResponse);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'GET',
      url: 'https://api.akash.network/v1beta3/akash/provider/v1beta3/providers/akash1testowner/attributes',
      headers: {
        'Authorization': 'Bearer test-key',
        'Content-Type': 'application/json',
      },
      json: true,
    });
  });

  test('createProvider should register provider successfully', async () => {
    const mockResponse = {
      provider: {
        owner: 'akash1newowner',
        host_uri: 'https://newprovider.com',
        attributes: [{ key: 'region', value: 'us-east' }]
      }
    };

    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('createProvider')
      .mockReturnValueOnce('akash1newowner')
      .mockReturnValueOnce('https://newprovider.com')
      .mockReturnValueOnce('[{"key": "region", "value": "us-east"}]')
      .mockReturnValueOnce('{"description": "New provider"}');

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const items = [{ json: {} }];
    const result = await executeProviderOperations.call(mockExecuteFunctions, items);

    expect(result).toHaveLength(1);
    expect(result[0].json).toEqual(mockResponse);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'POST',
      url: 'https://api.akash.network/v1beta3/akash/provider/v1beta3/providers',
      headers: {
        'Authorization': 'Bearer test-key',
        'Content-Type': 'application/json',
      },
      body: {
        owner: 'akash1newowner',
        host_uri: 'https://newprovider.com',
        attributes: [{ key: 'region', value: 'us-east' }],
        info: { description: 'New provider' }
      },
      json: true,
    });
  });

  test('should handle API errors gracefully', async () => {
    const error = new Error('Provider not found');
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('getProvider')
      .mockReturnValueOnce('nonexistent');

    mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(error);
    mockExecuteFunctions.continueOnFail.mockReturnValue(true);

    const items = [{ json: {} }];
    const result = await executeProviderOperations.call(mockExecuteFunctions, items);

    expect(result).toHaveLength(1);
    expect(result[0].json.error).toBe('Provider not found');
  });

  test('should throw error for unknown operation', async () => {
    mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('unknownOperation');

    const items = [{ json: {} }];

    await expect(executeProviderOperations.call(mockExecuteFunctions, items))
      .rejects
      .toThrow('Unknown operation: unknownOperation');
  });
});

describe('Lease Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({ 
        apiKey: 'test-key', 
        baseUrl: 'https://api.akash.network/v1beta3' 
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: { 
        httpRequest: jest.fn(),
        requestWithAuthentication: jest.fn() 
      },
    };
  });

  describe('getAllLeases operation', () => {
    it('should get all leases successfully', async () => {
      const mockResponse = { leases: [{ id: 'lease1' }], pagination: {} };
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getAllLeases')
        .mockReturnValueOnce({})
        .mockReturnValueOnce(100)
        .mockReturnValueOnce('');
      
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeLeaseOperations.call(
        mockExecuteFunctions,
        [{ json: {} }]
      );

      expect(result[0].json).toEqual(mockResponse);
    });

    it('should handle getAllLeases error', async () => {
      mockExecuteFunctions.getNodeParameter.mockReturnValue('getAllLeases');
      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));
      mockExecuteFunctions.continueOnFail.mockReturnValue(true);

      const result = await executeLeaseOperations.call(
        mockExecuteFunctions,
        [{ json: {} }]
      );

      expect(result[0].json.error).toBe('API Error');
    });
  });

  describe('getLease operation', () => {
    it('should get specific lease successfully', async () => {
      const mockResponse = { lease: { id: 'lease1' } };
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getLease')
        .mockReturnValueOnce('akash1owner')
        .mockReturnValueOnce('123')
        .mockReturnValueOnce('1')
        .mockReturnValueOnce('1')
        .mockReturnValueOnce('akash1provider');
      
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeLeaseOperations.call(
        mockExecuteFunctions,
        [{ json: {} }]
      );

      expect(result[0].json).toEqual(mockResponse);
    });
  });

  describe('createLease operation', () => {
    it('should create lease successfully', async () => {
      const mockResponse = { txhash: 'ABC123', code: 0 };
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('createLease')
        .mockReturnValueOnce('akash1owner')
        .mockReturnValueOnce('123')
        .mockReturnValueOnce('1')
        .mockReturnValueOnce('1')
        .mockReturnValueOnce('akash1provider')
        .mockReturnValueOnce('5000uakt')
        .mockReturnValueOnce('private-key');
      
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeLeaseOperations.call(
        mockExecuteFunctions,
        [{ json: {} }]
      );

      expect(result[0].json).toEqual(mockResponse);
    });
  });

  describe('closeLease operation', () => {
    it('should close lease successfully', async () => {
      const mockResponse = { txhash: 'DEF456', code: 0 };
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('closeLease')
        .mockReturnValueOnce('akash1owner')
        .mockReturnValueOnce('123')
        .mockReturnValueOnce('1')
        .mockReturnValueOnce('1')
        .mockReturnValueOnce('akash1provider')
        .mockReturnValueOnce('5000uakt')
        .mockReturnValueOnce('private-key');
      
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeLeaseOperations.call(
        mockExecuteFunctions,
        [{ json: {} }]
      );

      expect(result[0].json).toEqual(mockResponse);
    });
  });
});

describe('Bid Resource', () => {
	let mockExecuteFunctions: any;

	beforeEach(() => {
		mockExecuteFunctions = {
			getNodeParameter: jest.fn(),
			getCredentials: jest.fn().mockResolvedValue({
				apiKey: 'test-key',
				baseUrl: 'https://api.akash.network/v1beta3'
			}),
			getInputData: jest.fn().mockReturnValue([{ json: {} }]),
			getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
			continueOnFail: jest.fn().mockReturnValue(false),
			helpers: {
				httpRequest: jest.fn(),
				requestWithAuthentication: jest.fn()
			},
		};
	});

	describe('getAllBids', () => {
		it('should get all bids successfully', async () => {
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('getAllBids')
				.mockReturnValueOnce({})
				.mockReturnValueOnce({ limit: 50, offset: 0 });

			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
				bids: [{ id: 'bid1' }, { id: 'bid2' }],
				pagination: { total: 2 }
			});

			const result = await executeBidOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(result).toHaveLength(1);
			expect(result[0].json).toHaveProperty('bids');
			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith(
				expect.objectContaining({
					method: 'GET',
					url: expect.stringContaining('/akash/market/v1beta3/bids')
				})
			);
		});

		it('should handle getAllBids error', async () => {
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('getAllBids')
				.mockReturnValueOnce({})
				.mockReturnValueOnce({});

			mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));
			mockExecuteFunctions.continueOnFail.mockReturnValue(true);

			const result = await executeBidOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(result).toHaveLength(1);
			expect(result[0].json.error).toBe('API Error');
		});
	});

	describe('getBid', () => {
		it('should get specific bid successfully', async () => {
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('getBid')
				.mockReturnValueOnce('owner123')
				.mockReturnValueOnce('1')
				.mockReturnValueOnce('1')
				.mockReturnValueOnce('1')
				.mockReturnValueOnce('provider123');

			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
				bid: { id: 'bid1', owner: 'owner123' }
			});

			const result = await executeBidOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(result).toHaveLength(1);
			expect(result[0].json).toHaveProperty('bid');
			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith(
				expect.objectContaining({
					method: 'GET',
					url: expect.stringContaining('/akash/market/v1beta3/bids/owner123/1/1/1/provider123')
				})
			);
		});
	});

	describe('createBid', () => {
		it('should create bid successfully', async () => {
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('createBid')
				.mockReturnValueOnce({ owner: 'owner123', dseq: '1' })
				.mockReturnValueOnce('provider123')
				.mockReturnValueOnce({ denom: 'uakt', amount: '1000' })
				.mockReturnValueOnce({ denom: 'uakt', amount: '5000' });

			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
				txhash: 'hash123',
				code: 0
			});

			const result = await executeBidOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(result).toHaveLength(1);
			expect(result[0].json).toHaveProperty('txhash');
			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith(
				expect.objectContaining({
					method: 'POST',
					url: expect.stringContaining('/akash/market/v1beta3/bids')
				})
			);
		});
	});

	describe('closeBid', () => {
		it('should close bid successfully', async () => {
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('closeBid')
				.mockReturnValueOnce('owner123')
				.mockReturnValueOnce('1')
				.mockReturnValueOnce('1')
				.mockReturnValueOnce('1')
				.mockReturnValueOnce('provider123')
				.mockReturnValueOnce({ denom: 'uakt', amount: '5000' });

			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
				txhash: 'hash123',
				code: 0
			});

			const result = await executeBidOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(result).toHaveLength(1);
			expect(result[0].json).toHaveProperty('txhash');
			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith(
				expect.objectContaining({
					method: 'POST',
					url: expect.stringContaining('/close')
				})
			);
		});
	});
});

describe('Account Resource', () => {
	let mockExecuteFunctions: any;

	beforeEach(() => {
		mockExecuteFunctions = {
			getNodeParameter: jest.fn(),
			getCredentials: jest.fn().mockResolvedValue({
				apiKey: 'test-key',
				baseUrl: 'https://api.akash.network/v1beta3',
			}),
			getInputData: jest.fn().mockReturnValue([{ json: {} }]),
			getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
			continueOnFail: jest.fn().mockReturnValue(false),
			helpers: {
				httpRequest: jest.fn(),
			},
		};
	});

	describe('getAccount operation', () => {
		it('should get account information successfully', async () => {
			const mockResponse = {
				account: {
					address: 'akash1address',
					account_number: '123',
					sequence: '456',
				},
			};

			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('getAccount')
				.mockReturnValueOnce('akash1address');
			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

			const result = await executeAccountOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
				method: 'GET',
				url: 'https://api.akash.network/v1beta3/cosmos/auth/v1beta1/accounts/akash1address',
				headers: {
					'Authorization': 'Bearer test-key',
					'Content-Type': 'application/json',
				},
				json: true,
			});
		});

		it('should handle getAccount errors', async () => {
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('getAccount')
				.mockReturnValueOnce('akash1address');
			mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));
			mockExecuteFunctions.continueOnFail.mockReturnValue(true);

			const result = await executeAccountOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(result).toEqual([{ json: { error: 'API Error' }, pairedItem: { item: 0 } }]);
		});
	});

	describe('getBalance operation', () => {
		it('should get account balance successfully', async () => {
			const mockResponse = {
				balances: [
					{ denom: 'uakt', amount: '1000000' },
				],
			};

			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('getBalance')
				.mockReturnValueOnce('akash1address')
				.mockReturnValueOnce('uakt');
			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

			const result = await executeAccountOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
		});
	});

	describe('sendTransaction operation', () => {
		it('should send transaction successfully', async () => {
			const mockResponse = {
				tx_response: {
					txhash: 'ABC123',
					code: 0,
				},
			};

			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('sendTransaction')
				.mockReturnValueOnce('base64encodedtx')
				.mockReturnValueOnce('BROADCAST_MODE_SYNC');
			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

			const result = await executeAccountOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
				method: 'POST',
				url: 'https://api.akash.network/v1beta3/cosmos/tx/v1beta1/txs',
				headers: {
					'Authorization': 'Bearer test-key',
					'Content-Type': 'application/json',
				},
				body: {
					tx_bytes: 'base64encodedtx',
					mode: 'BROADCAST_MODE_SYNC',
				},
				json: true,
			});
		});
	});

	describe('getTransaction operation', () => {
		it('should get transaction by hash successfully', async () => {
			const mockResponse = {
				tx: { memo: 'test transaction' },
				tx_response: { txhash: 'ABC123' },
			};

			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('getTransaction')
				.mockReturnValueOnce('ABC123');
			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

			const result = await executeAccountOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
		});
	});
});

describe('Certificate Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({
        apiKey: 'test-key',
        baseUrl: 'https://api.akash.network/v1beta3'
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: {
        httpRequest: jest.fn(),
        requestWithAuthentication: jest.fn()
      },
    };
  });

  describe('getCertificates operation', () => {
    it('should get certificates successfully', async () => {
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getCertificates')
        .mockReturnValueOnce('akash1owner123')
        .mockReturnValueOnce('valid')
        .mockReturnValueOnce('')
        .mockReturnValueOnce(100);

      const mockResponse = {
        certificates: [
          { owner: 'akash1owner123', serial: '123', state: 'valid' }
        ],
        pagination: { next_key: null, total: '1' }
      };

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeCertificateOperations.call(
        mockExecuteFunctions,
        [{ json: {} }]
      );

      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual(mockResponse);
    });

    it('should handle get certificates error', async () => {
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getCertificates')
        .mockReturnValueOnce('akash1owner123')
        .mockReturnValueOnce('')
        .mockReturnValueOnce('')
        .mockReturnValueOnce(100);

      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));
      mockExecuteFunctions.continueOnFail.mockReturnValue(true);

      const result = await executeCertificateOperations.call(
        mockExecuteFunctions,
        [{ json: {} }]
      );

      expect(result).toHaveLength(1);
      expect(result[0].json.error).toBe('API Error');
    });
  });

  describe('createCertificate operation', () => {
    it('should create certificate successfully', async () => {
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('createCertificate')
        .mockReturnValueOnce('akash1owner123')
        .mockReturnValueOnce('-----BEGIN CERTIFICATE-----\ntest\n-----END CERTIFICATE-----')
        .mockReturnValueOnce('-----BEGIN PUBLIC KEY-----\ntest\n-----END PUBLIC KEY-----')
        .mockReturnValueOnce(5000)
        .mockReturnValueOnce('test memo');

      const mockResponse = {
        tx_response: {
          txhash: 'ABC123',
          code: 0,
          raw_log: 'success'
        }
      };

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeCertificateOperations.call(
        mockExecuteFunctions,
        [{ json: {} }]
      );

      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual(mockResponse);
    });

    it('should handle create certificate error', async () => {
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('createCertificate')
        .mockReturnValueOnce('akash1owner123')
        .mockReturnValueOnce('invalid-cert')
        .mockReturnValueOnce('invalid-key')
        .mockReturnValueOnce(5000)
        .mockReturnValueOnce('');

      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('Invalid certificate'));
      mockExecuteFunctions.continueOnFail.mockReturnValue(true);

      const result = await executeCertificateOperations.call(
        mockExecuteFunctions,
        [{ json: {} }]
      );

      expect(result).toHaveLength(1);
      expect(result[0].json.error).toBe('Invalid certificate');
    });
  });

  describe('revokeCertificate operation', () => {
    it('should revoke certificate successfully', async () => {
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('revokeCertificate')
        .mockReturnValueOnce('akash1owner123')
        .mockReturnValueOnce('123456789')
        .mockReturnValueOnce(5000)
        .mockReturnValueOnce('revoke cert');

      const mockResponse = {
        tx_response: {
          txhash: 'DEF456',
          code: 0,
          raw_log: 'certificate revoked'
        }
      };

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeCertificateOperations.call(
        mockExecuteFunctions,
        [{ json: {} }]
      );

      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual(mockResponse);
    });

    it('should handle revoke certificate error', async () => {
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('revokeCertificate')
        .mockReturnValueOnce('akash1owner123')
        .mockReturnValueOnce('invalid-serial')
        .mockReturnValueOnce(5000)
        .mockReturnValueOnce('');

      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('Certificate not found'));
      mockExecuteFunctions.continueOnFail.mockReturnValue(true);

      const result = await executeCertificateOperations.call(
        mockExecuteFunctions,
        [{ json: {} }]
      );

      expect(result).toHaveLength(1);
      expect(result[0].json.error).toBe('Certificate not found');
    });
  });
});
});
