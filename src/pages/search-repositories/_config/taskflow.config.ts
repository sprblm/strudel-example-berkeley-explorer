import { TaskflowConfig } from './taskflow.types';

export const taskflow: TaskflowConfig = {
  data: {
    list: {
      source: '/api/datasets',
      staticParams: {
        limit: 10,
        offset: 0,
      },
      idField: 'id',
      queryMode: 'server',
    },
    detail: {
      source: '/api/dataset',
      staticParams: undefined,
      idField: 'id',
      queryMode: 'client',
    },
    repositories: [
      { id: 'urban-tree-inventory', name: 'Urban Tree Inventory Data', enabled: true },
      { id: 'air-quality', name: 'Air Quality Monitoring Data', enabled: true },
      { id: 'user', name: 'User-contributed datasets', enabled: true },
    ],
  },
  pages: {
    index: {
      description: 'Search across multiple urban environmental health data repositories',
      cardFields: {
        idField: 'id',
        titleField: 'title',
        contentField: 'summary',
        dateField: 'publication_date',
        categoryField: 'category'
      },
      filters: {
        fields: [
          {
            field: 'source',
            label: 'Data Source',
            type: 'select',
            operator: 'contains-one-of',
            filterComponent: 'CheckboxList',
            filterProps: {
              options: [
                { label: 'Urban Tree Inventory', value: 'urban-tree-inventory' },
                { label: 'Air Quality', value: 'air-quality' },
              ],
            },
          },
          // Add other filter fields with the 'type' property
        ]
      }
    }
  }
};
