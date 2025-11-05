import React from 'react';
import { addons, types } from 'storybook/manager-api';

import { ADDON_ID, PANEL_ID, PARAM_KEY } from './constants';
import { Panel } from './components/Panel';

addons.register(ADDON_ID, (api) => {
  addons.add(PANEL_ID, {
    type: types.PANEL,
    title: 'CSS resources',
    render: ({ active }) => <Panel key={PANEL_ID} active={active} api={api} />,
    paramKey: PARAM_KEY,
  });
});
