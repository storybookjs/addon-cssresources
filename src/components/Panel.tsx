import React, { useEffect, useState, type ChangeEvent } from 'react';
import { Form, Placeholder, Spaced, SyntaxHighlighter } from 'storybook/internal/components';
import Events from 'storybook/internal/core-events';
import { type API } from 'storybook/manager-api';
import { AlertIcon } from '@storybook/icons';
import { styled } from 'storybook/theming';

import { EVENTS, PARAM_KEY } from '../constants';
import type { CssResource } from '../types';

const maxLimitToUseSyntaxHighlighter = 100000;

const PlainCode = styled.pre({
  textAlign: 'left',
  fontWeight: 'normal',
});

const Warning = styled.div(({ theme }) => ({
  display: 'flex',
  padding: '10px',
  justifyContent: 'center',
  alignItems: 'center',
  background: theme.background.warning,
  color: theme.color.warningText,
  fontSize: theme.typography.size.s2,
  '& svg': {
    marginRight: 10,
    width: 24,
    height: 24,
  },
}));

const Label = styled.label(({ theme }) => ({
  fontWeight: theme.typography.weight.bold,
  display: 'flex',
  alignItems: 'center',
  gap: 4,
}));

export const Panel = ({ active, api }: { active?: boolean; api: API }) => {
  const [currentList, setCurrentList] = useState<CssResource[]>([]);
  const listParameter = api.getCurrentParameter<CssResource[]>(PARAM_KEY) || [];

  useEffect(() => {
    const refreshPickedResources = () => {
      api.emit(EVENTS.SET, currentList);
    };

    api.on(Events.STORY_RENDERED, refreshPickedResources);
    return () => api.off(Events.STORY_RENDERED, refreshPickedResources);
  }, [api, currentList]);

  useEffect(() => {
    setCurrentList(listParameter);
  }, [listParameter]);

  useEffect(() => {
    api.emit(EVENTS.SET, currentList);
  }, [currentList]);

  const onChange = (event: ChangeEvent<HTMLInputElement>) => {
    const updatedList = currentList.map((i) => ({
      ...i,
      picked: i.id === event.target.id ? event.target.checked : i.picked,
    }));

    setCurrentList(updatedList);
  };

  if (!active) {
    return null;
  }

  return (
    <div>
      {currentList?.map(({ id, code, picked, hideCode = false }) => (
        <div key={id} style={{ padding: 10 }}>
          <Label htmlFor={id}>
            <Form.Checkbox checked={picked} onChange={onChange} id={id} /> <span>{id}</span>
          </Label>
          {code && !hideCode && code.length < maxLimitToUseSyntaxHighlighter && (
            <SyntaxHighlighter language="html" wrapLongLines>
              {code}
            </SyntaxHighlighter>
          )}
          {code && !hideCode && code.length >= maxLimitToUseSyntaxHighlighter && (
            <Placeholder>
              <Spaced row={1}>
                <PlainCode>{code.substring(0, maxLimitToUseSyntaxHighlighter)} ...</PlainCode>
                <Warning>
                  <AlertIcon />
                  Rest of the content cannot be displayed
                </Warning>
              </Spaced>
            </Placeholder>
          )}
        </div>
      ))}
    </div>
  );
};
