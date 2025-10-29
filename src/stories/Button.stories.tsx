import preview from '#.storybook/preview';
import { fn } from 'storybook/test';

import type { CssResource } from '../types.js';
import { Button } from './Button';

const CSS_RESOURCES: CssResource[] = [
  {
    id: `bootstrap v5.0.2`,
    code: `<link rel="stylesheet" type="text/css" href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" crossorigin="anonymous"></link>`,
    picked: true,
  },
  {
    id: `bootstrap v4.1.3`,
    code: `<link rel="stylesheet" type="text/css" href="https://cdn.jsdelivr.net/npm/bootstrap@4.1.3/dist/css/bootstrap.min.css" crossorigin="anonymous"></link>`,
    picked: false,
  },
  {
    id: `bootstrap v3.3.5`,
    code: `<link rel="stylesheet" type="text/css" href="https://cdn.jsdelivr.net/npm/bootstrap@3.3.5/dist/css/bootstrap.min.css" crossorigin="anonymous"></link>`,
    picked: false,
  },
];

const v5 = CSS_RESOURCES.map((res) => ({ ...res, picked: res.id === `bootstrap v5.0.2` }));
const v4 = CSS_RESOURCES.map((res) => ({ ...res, picked: res.id === `bootstrap v4.1.3` }));
const v3 = CSS_RESOURCES.map((res) => ({ ...res, picked: res.id === `bootstrap v3.3.5` }));

const meta = preview.meta({
  title: 'Addon/Button',
  component: Button,
  args: {
    onClick: fn(),
  },
  tags: ['autodocs'],
});

export default meta;

export const Primary = meta.story({
  args: {
    primary: true,
    label: 'Button',
  },
  parameters: { cssresources: v5 },
});
export const PrimaryV4 = Primary.extend({
  parameters: { cssresources: v4 },
});
export const PrimaryV3 = Primary.extend({
  parameters: { cssresources: v3 },
});

export const Secondary = meta.story({
  args: {
    label: 'Button',
  },
  parameters: { cssresources: v5 },
});
export const SecondaryV4 = Secondary.extend({
  parameters: { cssresources: v4 },
});
export const SecondaryV3 = Secondary.extend({
  parameters: { cssresources: v3 },
});

export const Large = meta.story({
  args: {
    size: 'lg',
    label: 'Button',
  },
  parameters: { cssresources: v5 },
});
export const LargeV4 = Large.extend({
  parameters: { cssresources: v4 },
});
export const LargeV3 = Large.extend({
  parameters: { cssresources: v3 },
});

export const Small = meta.story({
  args: {
    size: 'sm',
    label: 'Button',
  },
  parameters: { cssresources: v5 },
});
export const SmallV4 = Small.extend({
  parameters: { cssresources: v4 },
});
export const SmallV3 = Small.extend({
  parameters: { cssresources: v3 },
});
