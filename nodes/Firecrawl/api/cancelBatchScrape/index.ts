import { INodeProperties } from 'n8n-workflow';
import { buildApiProperties, createOperationNotice } from '../common';

export const name = 'cancelBatchScrape';
export const displayName = 'Cancel batch scrape job';

function createBatchIdProperty(): INodeProperties {
	return {
		displayName: 'Batch ID',
		name: 'batchId',
		type: 'string',
		required: true,
		default: '',
		description: 'ID of the batch scrape job to cancel',
		routing: {
			request: {
				url: '=/batch/scrape/{{$value}}',
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
		createBatchIdProperty(),
	];
}

const { options, properties } = buildApiProperties(name, displayName, createProperties());

options.routing = {
	request: {
		method: 'DELETE',
	},
};

export { options, properties };


