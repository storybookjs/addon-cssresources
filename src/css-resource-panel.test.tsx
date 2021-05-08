import React from 'react';
import userEvent from '@testing-library/user-event';
import { render, screen } from '@testing-library/react';
import { STORY_RENDERED } from '@storybook/core-events';
import { ThemeProvider, themes, convert } from '@storybook/theming';
import { API } from '@storybook/api';
import { EVENTS, PARAM_KEY } from './constants';
import { CssResourcePanel } from './css-resource-panel';

const defaultParameters = [
  {
    id: 'fake-css-id-1',
    code: 'fake-css-code-1',
    picked: true,
  },
  {
    id: 'fake-css-id-2',
    code: 'fake-css-code-2',
    picked: false,
  },
];

const mockedApi = ({
  emit: jest.fn(),
  on: jest.fn(),
  off: jest.fn(),
  getCurrentParameter: jest.fn(() => defaultParameters),
} as unknown) as API;

function ThemedCSSResourcePanel({ api }: { api: API }) {
  return (
    <ThemeProvider theme={convert(themes.light)}>
      <CssResourcePanel active api={api} />
    </ThemeProvider>
  );
}

const renderWithData = (api: Partial<API> = {}) => {
  const apiAdd = jest.fn();
  render(
    <ThemedCSSResourcePanel
      api={{
        ...mockedApi,
        on: apiAdd,
        ...api,
      }}
    />
  );
  apiAdd.mock.calls[0][1]('fake-story-id');
  return {
    onStoryChange: apiAdd.mock.calls[0][1],
  };
};

describe('CSSResourcePanel', () => {
  it('should mount', () => {
    const { container } = render(<ThemedCSSResourcePanel api={mockedApi} />);
    expect(container).toBeInTheDocument();
  });

  it('should add STORY_RENDERED listener to the api', () => {
    const apiAdd = jest.fn();
    render(
      <CssResourcePanel
        active
        api={{
          ...mockedApi,
          on: apiAdd,
        }}
      />
    );
    expect(apiAdd).toHaveBeenCalledWith(STORY_RENDERED, expect.any(Function));
  });

  it('should remove STORY_RENDERED listener from the api', () => {
    const apiRemove = jest.fn();
    const { unmount } = render(
      <CssResourcePanel
        active
        api={{
          ...mockedApi,
          off: apiRemove,
        }}
      />
    );
    unmount();
    expect(apiRemove).toHaveBeenCalledWith(STORY_RENDERED, expect.any(Function));
  });

  it('should populate list with the default items', () => {
    const apiAdd = jest.fn();
    render(
      <ThemedCSSResourcePanel
        api={{
          ...mockedApi,
          on: apiAdd,
        }}
      />
    );
    apiAdd.mock.calls[0][1]('fake-story-id');
    expect(screen.getByText(/fake-css-id-1/)).toBeInTheDocument();
    expect(screen.getByText(/fake-css-id-2/)).toBeInTheDocument();
  });

  it('should pull default items from getCurrentParameter', () => {
    const getCurrentParameter = jest.fn();
    const apiAdd = jest.fn();
    render(
      <ThemedCSSResourcePanel
        api={{
          ...mockedApi,
          on: apiAdd,
          getCurrentParameter: getCurrentParameter as any,
        }}
      />
    );
    apiAdd.mock.calls[0][1]('fake-story-id');
    expect(getCurrentParameter).toHaveBeenCalledWith(PARAM_KEY);
  });

  // it('should maintain picked attribute for matching ids', () => {
  //   const getCurrentParameter = jest.fn(() => [
  //     {
  //       ...defaultParameters[0],
  //       picked: !defaultParameters[0].picked,
  //     },
  //   ]);
  //   const { onStoryChange } = renderWithData({
  //     getCurrentParameter: getCurrentParameter as any,
  //   });
  //   expect(
  //     screen.getByRole('checkbox', { name: `# ${defaultParameters[0].id}` })
  //   ).not.toBeChecked();
  //   getCurrentParameter.mockReturnValueOnce([
  //     {
  //       ...defaultParameters[0],
  //       picked: defaultParameters[0].picked,
  //     },
  //   ]);
  //   onStoryChange('fake-story-id');
  //   expect(
  //     screen.getByRole('checkbox', { name: `# ${defaultParameters[0].id}` })
  //   ).not.toBeChecked();
  // });

  // it('should update the list with new picked items', () => {
  //   renderWithData();
  //   expect(screen.getByRole('checkbox', { name: `# ${defaultParameters[0].id}` })).toBeChecked();
  //   userEvent.click(screen.getByRole('checkbox', { name: `# ${defaultParameters[0].id}` }));
  //   expect(
  //     screen.getByRole('checkbox', { name: `# ${defaultParameters[0].id}` })
  //   ).not.toBeChecked();
  // });

  // it('should call emit method with updated list', () => {
  //   const emit = jest.fn();
  //   renderWithData({ emit });
  //   userEvent.click(screen.getByRole('checkbox', { name: `# ${defaultParameters[0].id}` }));
  //   expect(emit).toHaveBeenLastCalledWith(EVENTS.SET, []);
  // });

  it('should not render anything when not active', () => {
    const { container } = render(<CssResourcePanel api={mockedApi} active={false} />);
    expect(container.firstChild).toBeFalsy();
  });

  // it('should render list items', () => {
  //   renderWithData();

  //   defaultParameters.forEach((param) => {
  //     expect(screen.getByText(new RegExp(param.id))).toBeInTheDocument();
  //     const checkbox = screen.getByRole('checkbox', { name: `# ${param.id}` });
  //     if (param.picked) {
  //       expect(checkbox).toBeChecked();
  //     } else {
  //       expect(checkbox).not.toBeChecked();
  //     }
  //   });
  // });

  // it('should render code for items with the `hideCode` flag', () => {
  //   const getCurrentParameter = jest.fn(() => [
  //     {
  //       id: 'local-fake-id-1',
  //       code: 'local-fake-code-1',
  //       picked: true,
  //       hideCode: false,
  //     },
  //   ]);

  //   renderWithData({
  //     getCurrentParameter: getCurrentParameter as any,
  //   });

  //   expect(screen.queryByText('local-fake-code-1')).toBeInTheDocument();
  // });

  it('should not render code for items /w the `hideCode` flag', () => {
    const getCurrentParameter = jest.fn(() => [
      {
        id: 'local-fake-id-1',
        code: 'local-fake-code-1',
        picked: true,
        hideCode: true,
      },
    ]);

    renderWithData({
      getCurrentParameter: getCurrentParameter as any,
    });

    expect(screen.queryByText('local-fake-code-1')).not.toBeInTheDocument();
  });
});
