import React from 'react';

export default {
  title: 'Addon/FontAwesome',
  parameters: {
    cssresources: [
      {
        id: `fontawesome`,
        code: `<link rel="stylesheet" type="text/css" href="https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css"></link>`,
        picked: true,
        hideCode: true,
      },
    ],
    options: {
      selectedPanel: 'storybook/cssresources/panel',
    },
  },
};

export const CameraIcon = {
  render: () => <i className="fa fa-camera-retro"> Camera Icon</i>,
};

export const SaveIcon = {
  render: () => <i className="fa fa-save"> Save Icon</i>,
};
