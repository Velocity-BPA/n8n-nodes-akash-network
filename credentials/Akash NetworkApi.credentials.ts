import {
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class AkashNetworkApi implements ICredentialType {
	name = 'akashNetworkApi';
	displayName = 'Akash Network API';
	description = 'Akash Network authentication credentials';
	documentationUrl = 'https://docs.akash.network/';
	properties: INodeProperties[] = [
		{
			displayName: 'API Base URL',
			name: 'baseUrl',
			type: 'string',
			default: 'https://api.akash.network/v1beta3',
			description: 'The base URL for the Akash Network API',
			required: true,
		},
		{
			displayName: 'Authentication Method',
			name: 'authMethod',
			type: 'options',
			options: [
				{
					name: 'Private Key (Wallet Operations)',
					value: 'privateKey',
				},
				{
					name: 'Certificate (Provider Operations)',
					value: 'certificate',
				},
				{
					name: 'API Key (RPC Endpoints)',
					value: 'apiKey',
				},
				{
					name: 'Public (Read Only)',
					value: 'public',
				},
			],
			default: 'public',
			description: 'Method of authentication to use',
		},
		{
			displayName: 'Private Key',
			name: 'privateKey',
			type: 'string',
			typeOptions: { password: true },
			default: '',
			description: 'Private key for wallet operations (Cosmos SDK format)',
			displayOptions: {
				show: {
					authMethod: ['privateKey'],
				},
			},
		},
		{
			displayName: 'Wallet Address',
			name: 'walletAddress',
			type: 'string',
			default: '',
			description: 'Akash wallet address (akash...)',
			displayOptions: {
				show: {
					authMethod: ['privateKey'],
				},
			},
		},
		{
			displayName: 'Certificate',
			name: 'certificate',
			type: 'string',
			typeOptions: { password: true },
			default: '',
			description: 'x509 certificate for provider operations',
			displayOptions: {
				show: {
					authMethod: ['certificate'],
				},
			},
		},
		{
			displayName: 'Certificate Key',
			name: 'certificateKey',
			type: 'string',
			typeOptions: { password: true },
			default: '',
			description: 'Private key for the x509 certificate',
			displayOptions: {
				show: {
					authMethod: ['certificate'],
				},
			},
		},
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			typeOptions: { password: true },
			default: '',
			description: 'API key for RPC endpoint access',
			displayOptions: {
				show: {
					authMethod: ['apiKey'],
				},
			},
		},
	];
}