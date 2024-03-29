# Storybook Addon Cssresources

Storybook Addon Cssresources to switch between css resources at runtime for your story [Storybook](https://storybook.js.org).

[Framework Support](https://storybook.js.org/docs/react/api/frameworks-feature-support)

![Storybook Addon Cssresources Demo](docs/demo.gif)

## Installation

```sh
yarn add -D @storybook/addon-cssresources
```

## Configuration

Then create a file called `main.js` in your storybook config.

Add following content to it:

```js
module.exports = {
  addons: ["@storybook/addon-cssresources"],
};
```

## Usage

You need add the all the css resources at compile time using the `withCssResources` decorator. They can be added globally or per story. You can then choose which ones to load from the cssresources addon UI:

```js
import { withCssResources } from "@storybook/addon-cssresources";

export default {
  title: "CssResources",
  parameters: {
    cssresources: [
      {
        id: `bluetheme`,
        code: `<style>body { background-color: lightblue; }</style>`,
        picked: false,
        hideCode: false, // Defaults to false, this enables you to hide the code snippet and only displays the style selector
      },
    ],
  },
  decorators: [withCssResources],
};

export const defaultView = () => <div />;
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
