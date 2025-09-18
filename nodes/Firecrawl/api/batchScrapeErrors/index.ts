import { INodeProperties } from 'n8n-workflow';
import { buildApiProperties, createOperationNotice } from '../common';

export const name = 'batchScrapeErrors';
export const displayName = 'Get batch scrape errors';

function createBatchIdProperty(): INodeProperties {
	return {
		displayName: 'Batch ID',
		name: 'batchId',
		type: 'string',
		required: true,
		default: '',
		description: 'ID of the batch scrape job',
		routing: {
			request: {
				url: '=/batch/scrape/{{$value}}/errors',
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
		createOperationNotice('Default', name, 'GET'),
		createBatchIdProperty(),
	];
}

const { options, properties } = buildApiProperties(name, displayName, createProperties());

options.routing = {
	request: {
		method: 'GET',
	},
};

export { options, properties };


