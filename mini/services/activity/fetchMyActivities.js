import { config } from '../../config/index';

function mockFetchMyActivities(pageIndex = 1, pageSize = 10, filterType = 'all') {
  const { delay } = require('../_utils/delay');
  const myActivitiesModel = require('../../model/myActivities');

  return delay().then(() => 
    myActivitiesModel.getMyActivities(pageIndex, pageSize, filterType)
  );
}

export function fetchMyActivities(pageIndex = 1, pageSize = 10, filterType = 'all') {
  if (config.useMock) {
    return mockFetchMyActivities(pageIndex, pageSize, filterType);
  }

  return new Promise((resolve) => {
    resolve('real api');
  });
}
