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
                { label: 'Baseline Inventory', value: 'baseline' },
                { label: 'User Contributions', value: 'user-contributed' },
              ],
            },
          },
          {
            field: 'species',
            label: 'Tree Species',
            type: 'select',
            operator: 'contains-one-of',
            filterComponent: 'Autocomplete',
            filterProps: {
              options: [
                { label: 'Oak', value: 'oak' },
                { label: 'Pine', value: 'pine' },
                // Add more species options as needed
              ],
            },
          },
          {
            field: 'dbh',
            label: 'DBH (cm)',
            type: 'range',
            operator: 'between',
            filterProps: {
              min: 0,
              max: 100,
              step: 1,
            },
          },
          {
            field: 'healthCondition',
            label: 'Health Condition',
            type: 'select',
            operator: 'contains-one-of',
            filterComponent: 'CheckboxList',
            filterProps: {
              options: [
                { label: 'Good', value: 'good' },
                { label: 'Fair', value: 'fair' },
                { label: 'Poor', value: 'poor' },
              ],
            },
          },
          {
            field: 'observationDate',
            label: 'Observation Date',
            type: 'date-range',
            operator: 'between',
            filterProps: {
              // Date range picker props
            },
          },
        ]
      }
    }
  }
};
