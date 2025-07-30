import {
	INodeProperties,
	IDataObject,
	IExecuteSingleFunctions,
	IHttpRequestOptions,
} from 'n8n-workflow';
import { buildApiProperties, createOperationNotice, createScrapeOptionsProperty } from '../common';

const name = 'extract';
const displayName = 'Extract Data';
export const operationName = 'extract';

/**
 * Creates the URLs property
 * @returns The URLs property
 */
function createUrlsProperty(): INodeProperties {
	return {
		displayName: 'URLs',
		name: 'urls',
		type: 'fixedCollection',
		default: {},
		typeOptions: {
			multipleValues: true,
		},
		description: 'The URLs to extract data from. URLs should be in glob format.',
		placeholder: 'Add URL',
		options: [
			{
				displayName: 'Items',
				name: 'items',
				values: [
					{
						displayName: 'URL',
						name: 'url',
						type: 'string',
						default: '',
						placeholder: 'https://example.com/*',
						description: 'URL to extract data from (supports glob format)',
					},
				],
			},
		],
		routing: {
			request: {
				body: {
					urls: '={{$value.items ? $value.items.map(item => item.url) : []}}',
				},
			},
		},
		displayOptions: {
			show: {
				resource: ['Default'],
				operation: [operationName],
			},
		},
	};
}

/**
 * Creates the prompt property
 * @returns The prompt property
 */
function createPromptProperty(): INodeProperties {
	return {
		displayName: 'Prompt',
		name: 'prompt',
		type: 'string',
		default: '',
		description: 'Prompt to guide the extraction process',
		routing: {
			request: {
				body: {
					prompt: '={{ $value }}',
				},
			},
		},
		displayOptions: {
			hide: {
				useCustomBody: [true],
			},
			show: {
				resource: ['Default'],
				operation: [operationName],
			},
		},
	};
}

/**
 * Creates the schema property
 * @returns The schema property
 */
function createSchemaProperty(): INodeProperties {
	return {
		displayName: 'Schema',
		name: 'schema',
		type: 'json',
		default: '{\n  "property1": "string",\n  "property2": "number"\n}',
		description: 'Schema to define the structure of the extracted data',
		routing: {
			request: {
				body: {
					schema: '={{ JSON.parse($value) }}',
				},
			},
		},
		displayOptions: {
			hide: {
				useCustomBody: [true],
			},
			show: {
				resource: ['Default'],
				operation: [operationName],
			},
		},
	};
}

function createEnableWebSearchProperty(): INodeProperties {
	return {
		displayName: 'Enable Web Search',
		name: 'enableWebSearch',
		type: 'boolean',
		default: false,
		description: 'Whether to enable web search to find additional data',
		routing: {
			request: {
				body: {
					enableWebSearch: '={{ $value }}',
				},
			},
		},
		displayOptions: {
			hide: {
				useCustomBody: [true],
			},
			show: {
				resource: ['Default'],
				operation: [operationName],
			},
		},
	};
}

function createIgnoreSitemapProperty(): INodeProperties {
	return {
		displayName: 'Ignore Sitemap',
		name: 'ignoreSitemap',
		type: 'boolean',
		default: true,
		description: 'Whether to ignore the website sitemap when crawling',
		routing: {
			request: {
				body: {
					ignoreSitemap: '={{ $value }}',
				},
			},
		},
		displayOptions: {
			hide: {
				useCustomBody: [true],
			},
			show: {
				resource: ['Default'],
				operation: [operationName],
			},
		},
	};
}

function createIncludeSubdomainsProperty(): INodeProperties {
	return {
		displayName: 'Include Subdomains',
		name: 'includeSubdomains',
		type: 'boolean',
		default: false,
		description: 'Whether to include subdomains of the website',
		routing: {
			request: {
				body: {
					includeSubdomains: '={{ $value }}',
				},
			},
		},
		displayOptions: {
			hide: {
				useCustomBody: [true],
			},
			show: {
				resource: ['Default'],
				operation: [operationName],
			},
		},
	};
}

function createShowSourcesProperty(): INodeProperties {
	return {
		displayName: 'Show Sources',
		name: 'showSources',
		type: 'boolean',
		default: false,
		description: 'Whether to show the sources used to extract the data',
		routing: {
			request: {
				body: {
					showSources: '={{ $value }}',
				},
			},
		},
		displayOptions: {
			hide: {
				useCustomBody: [true],
			},
			show: {
				resource: ['Default'],
				operation: [operationName],
			},
		},
	};
}

/**
 * Create additional fields property for custom data
 */
function createAdditionalFieldsProperty(operation: string): INodeProperties {
	return {
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		description: 'Additional fields to send in the request body',
		options: [
			{
				displayName: 'Custom Properties (JSON)',
				name: 'customProperties',
				type: 'json',
				default: '{}',
				description: 'Custom JSON properties to add to the request body',
			},
		],
		routing: {
			request: {
				body: {
					additionalFields: '={{ $value }}',
				},
			},
			send: {
				preSend: [
					async function (
						this: IExecuteSingleFunctions,
						requestOptions: IHttpRequestOptions,
					): Promise<IHttpRequestOptions> {
						if (typeof requestOptions.body !== 'object' || !requestOptions.body) {
							return requestOptions;
						}

						const body = requestOptions.body as IDataObject;
						const additionalFields = body.additionalFields as IDataObject;

						if (additionalFields) {
							// Handle custom properties JSON
							if (additionalFields.customProperties) {
								try {
									const customProps = JSON.parse(additionalFields.customProperties as string);
									Object.assign(requestOptions.body as IDataObject, customProps);
								} catch (error) {
									// If JSON parsing fails, just skip
								}
							}

							// Remove the additionalFields wrapper
							delete body.additionalFields;
						}

						return requestOptions;
					},
				],
			},
		},
		displayOptions: {
			show: {
				operation: [operation],
				useCustomBody: [true],
			},
		},
	};
}

/**
 * Creates all properties for the extract operation
 * @returns Array of properties for the extract operation
 */
function createExtractProperties(): INodeProperties[] {
	return [
		createOperationNotice('Default', name, 'POST'),
		createUrlsProperty(),
		createPromptProperty(),
		createSchemaProperty(),
		createIgnoreSitemapProperty(),
		createIncludeSubdomainsProperty(),
		createEnableWebSearchProperty(),
		createShowSourcesProperty(),
		createScrapeOptionsProperty(operationName),
	];
}

// Build and export the properties and options
const { options, properties } = buildApiProperties(name, displayName, createExtractProperties());

// Add the additional fields property separately so it appears only when custom body is enabled
properties.push(createAdditionalFieldsProperty(name));

export { options, properties };
