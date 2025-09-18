import { INodeProperties } from 'n8n-workflow';
import { buildApiProperties, createOperationNotice } from '../common';

export const name = 'cancelCrawl';
export const displayName = 'Cancel a crawl job';

function createCrawlIdProperty(): INodeProperties {
	return {
		displayName: 'Crawl ID',
		name: 'crawlId',
		type: 'string',
		required: true,
		default: '',
		description: 'ID of the crawl job to cancel',
		routing: {
			request: {
				url: '=/crawl/{{$value}}',
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

function createProperties(): INodeProperties[] {
	return [
		createOperationNotice('Default', name, 'DELETE'),
		createCrawlIdProperty(),
	];
}

const { options, properties } = buildApiProperties(name, displayName, createProperties());

options.routing = {
	request: {
		method: 'DELETE',
	},
};

export { options, properties };


