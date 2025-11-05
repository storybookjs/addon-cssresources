import { useChannel, useParameter } from 'storybook/preview-api';
import { EVENTS, PARAM_KEY } from './constants';
import { definePreviewAddon, type DecoratorFunction } from 'storybook/internal/csf';
import type { CssResource } from './types';
import { useEffect, useState } from 'react';

const changeMediaAttribute = (element: HTMLElement, enabled: boolean) => {
  const current = element.getAttribute('media');

  if ((enabled && !current) || (!enabled && current === 'max-width: 1px')) {
    // don't do anything
  } else if (enabled && current === 'max-width: 1px') {
    // remove the attribute
    element.removeAttribute('media');
  } else if (enabled && current) {
    // remove the part of the attribute causing disabling
    const value = current.replace(' and max-width: 1px', '');
    element.setAttribute('media', value);
  } else {
    // modify the existing attribute so it disables
    const value = current ? `${current} and max-width: 1px` : 'max-width: 1px';
    element.setAttribute('media', value);
  }
};

const createElement = (id: string, code: string): HTMLDivElement => {
  const element: HTMLDivElement = document.createElement('div');
  element.setAttribute('id', `storybook-addon-resource_${id}`);
  element.innerHTML = code;
  return element;
};

const getElement = (id: string, code: string) => {
  const found = document.querySelector(`[id="storybook-addon-resource_${id}"]`);
  return { element: found || createElement(id, code), created: !found };
};

const updateElement = (id: string, code: string, value: boolean) => {
  const { element, created } = getElement(id, code);

  element.querySelectorAll('link').forEach((child) => changeMediaAttribute(child, value));
  element.querySelectorAll('style').forEach((child) => changeMediaAttribute(child, value));

  if (created) {
    document.body.appendChild(element);
  }
};

const list: CssResource[] = [];

const setResources = (resources: CssResource[]) => {
  const added = resources.filter((i) => !list.find((r) => r.code === i.code));
  const removed = list.filter((i) => !resources.find((r) => r.code === i.code));

  added.forEach((r) => list.push(r));

  resources.forEach((r) => {
    const { id, code } = r;
    updateElement(id, code, true);
  });
  removed.forEach((r) => {
    const { id, code } = r;
    updateElement(id, code, false);
  });
};

const DocsDecorator: DecoratorFunction = (StoryFn) => {
  const listParameter = useParameter<CssResource[]>(PARAM_KEY, []);
  setResources(listParameter || []);
  return StoryFn();
};

const PreviewDecorator: DecoratorFunction = (StoryFn) => {
  const [currentList, setCurrentList] = useState<CssResource[]>([]);
  const [pickedResources, setPickedResources] = useState<CssResource[] | null>(null);

  useChannel({
    [EVENTS.SET]: (pr) => {
      setPickedResources(pr);
    },
  });

  useEffect(() => {
    const filtered = (pickedResources || []).filter(({ picked }: CssResource) => picked);
    setCurrentList(filtered);
  }, [pickedResources]);

  setResources(currentList);
  return StoryFn();
};

export const withCssResources: DecoratorFunction = (StoryFn, context) => {
  if (context.viewMode !== 'story') {
    return DocsDecorator(StoryFn, context);
  }

  return PreviewDecorator(StoryFn, context);
};

export default definePreviewAddon({
  decorators: [withCssResources],
});
