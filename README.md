# Storybook Addon Cssresources

Switch between CSS resources at runtime, and define per-story CSS resources.

[Framework Support](https://storybook.js.org/docs/react/api/frameworks-feature-support)

![Storybook Addon Cssresources Demo](docs/demo.gif)

## Installation

Install the addon:

```sh
yarn add -D @storybook/addon-cssresources
```

```sh
npm i -D @storybook/addon-cssresources
```

```sh
pnpm i -D @storybook/addon-cssresources
```

## Configuration

Then add the addon to your Storybook config:

```ts
// .storybook/main.ts
import { defineMain } from '@storybook/<your-framework>/node';

const config = defineMain({
  addons: [
    '@storybook/addon-docs',
    '@storybook/addon-cssresources', // Add here
  ],
  framework: '@storybook/react-vite',
});

export default config;
```

## Usage

Define the CSS resources you want to use in your [`parameters`](https://storybook.js.org/docs/writing-stories/parameters). They can be added globally or per story.

You can choose which resources get loaded by default in the parameters, and then unload or load other resources in the addon panel UI.

If you use [CSF Next](https://storybook.js.org/docs/api/csf/csf-next), load the addon in `preview.ts` as well:

```ts
// .storybook/preview.ts
import { definePreview } from '@storybook/<your-framework>';
import addonDocs from '@storybook/addon-docs';
import addonCssResources from '@storybook/addon-cssresources';

export default definePreview({
  addons: [addonDocs(), addonCssResources()], // only if using CSF Next
  parameters: {
    cssresources: [
      {
        // Label shown in the addon panel UI
        id: `bootstrap v5.0.2`,
        // Code to use to load the resource
        code: `<link rel="stylesheet" type="text/css" href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" crossorigin="anonymous"></link>`,
        // Defines which resources will be initially loaded in the story
        picked: true,
        // Defaults to false, this enables you to hide the code snippet and only displays the style selector
        hideCode: false,
      },
      {
        id: `bootstrap v4.1.3`,
        code: `<link rel="stylesheet" type="text/css" href="https://cdn.jsdelivr.net/npm/bootstrap@4.1.3/dist/css/bootstrap.min.css" crossorigin="anonymous"></link>`,
        picked: false,
        hideCode: false,
      },
    ]
  },
});
```

## Credits

While this addon was part of the [Storybook monorepo](https://github.com/storybookjs/storybook), it received commits from the following authors:

> Aaron Reisman,
> Andrew Lisowski,
> Armand Abric,
> Brody McKee,
> Clément DUNGLER,
> Gaëtan Maisse,
> Grey Baker,
> Jean-Philippe Roy,
> Jimmy Somsanith,
> Jon Palmer,
> Lynn Chyi,
> Michael Shilman,
> Michaël De Boey,
> Neville Mehta,
> Norbert de Langen,
> Paul Rosania,
> Preston Goforth,
> Renovate Bot,
> Simen Bekkhus,
> Tom Coleman,
> Tomi Laurell,
> Varun Vachhar
