import { INodeProperties } from 'n8n-workflow';
import { buildApiProperties, createOperationNotice } from '../common';

export const name = 'batchScrape';
export const displayName = 'Batch scrape multiple URLs';

function createUrlsProperty(): INodeProperties {
	return {
		displayName: 'URLs',
		name: 'urls',
		type: 'fixedCollection',
		default: {},
		description: 'List of URLs to scrape',
		options: [
			{
				displayName: 'URLs',
				name: 'list',
				values: [
					{
						displayName: 'URL',
						name: 'url',
						type: 'string',
						default: '',
					},
				],
				typeOptions: {
					multipleValues: true,
				},
			},
		],
		routing: {
			request: {
				body: {
					urls: '={{$value.list ? $value.list.map(i => i.url) : []}}',
				},
			},
		},
		displayOptions: {
			show: {
				resource: ['Default'],
				operation: [name],
			},
		},
	};
}

function createFormatsProperty(): INodeProperties {
	return {
		displayName: 'Formats',
		name: 'formats',
		type: 'multiOptions',
		options: [
			{ name: 'Markdown', value: 'markdown' },
			{ name: 'HTML', value: 'html' },
			{ name: 'Raw HTML', value: 'rawHtml' },
			{ name: 'Links', value: 'links' },
			{ name: 'Screenshot', value: 'screenshot' },
			{ name: 'Summary', value: 'summary' },
			{ name: 'JSON', value: 'json' },
		],
		default: ['markdown'],
		description: 'Output format(s) for the scraped data',
		routing: {
			request: {
				body: {
					formats: '={{ $value }}',
				},
			},
		},
		displayOptions: {
			show: {
				resource: ['Default'],
				operation: [name],
			},
			hide: {
				useCustomBody: [true],
			},
		},
	};
}

function createIgnoreInvalidUrlsProperty(): INodeProperties {
	return {
		displayName: 'Ignore Invalid URLs',
		name: 'ignoreInvalidURLs',
		type: 'boolean',
		default: true,
		description: 'Skip invalid URLs instead of failing the entire batch',
		routing: {
			request: {
				body: {
					ignoreInvalidURLs: '={{ $value }}',
				},
			},
		},
		displayOptions: {
			show: {
				resource: ['Default'],
				operation: [name],
			},
			hide: {
				useCustomBody: [true],
			},
		},
	};
}

function createBatchScrapeProperties(): INodeProperties[] {
	return [
		createOperationNotice('Default', name),
		createUrlsProperty(),
		createFormatsProperty(),
		createIgnoreInvalidUrlsProperty(),
	];
}

const { options, properties } = buildApiProperties(name, displayName, createBatchScrapeProperties());

// Override request path to hit /batch/scrape
options.routing = {
	request: {
		url: '=\/batch\/scrape',
	},
};

export { options, properties };


