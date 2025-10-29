import React from 'react';
import '@testing-library/jest-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { ThemeProvider, themes, convert } from 'storybook/theming';
import Events from 'storybook/internal/core-events';
import type { API } from 'storybook/manager-api';

import { EVENTS } from '../constants';
import { Panel } from './Panel';

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

function createMockApi(overrides: Partial<API> = {}): API {
  return {
    emit: vi.fn(),
    on: vi.fn(),
    off: vi.fn(),
    getCurrentParameter: vi.fn(() => defaultParameters) as API['getCurrentParameter'],
    ...overrides,
  } as unknown as API;
}

function ThemedCSSResourcePanel({ active = true, api }: { active?: boolean; api: API }) {
  return (
    <ThemeProvider theme={convert(themes.light)}>
      <Panel active={active} api={api} />
    </ThemeProvider>
  );
}

describe('Panel', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render when active', () => {
      const api = createMockApi();
      const { container } = render(<ThemedCSSResourcePanel api={api} />);
      expect(container.firstChild).toBeTruthy();
    });

    it('should not render when inactive', () => {
      const api = createMockApi();
      const { container } = render(<ThemedCSSResourcePanel api={api} active={false} />);
      expect(container.firstChild).toBeFalsy();
    });
  });

  describe('Parameter Handling', () => {
    it('should use the parameter from useParameter hook', () => {
      const api = createMockApi();
      render(<ThemedCSSResourcePanel api={api} />);

      expect(screen.getByText(/fake-css-id-2/)).toBeInTheDocument();
      expect(screen.getByText(/fake-css-id-1/)).toBeInTheDocument();
    });

    it('should render list items with correct checked states', () => {
      const api = createMockApi();
      render(<ThemedCSSResourcePanel api={api} />);

      const checkbox1 = screen.getByRole('checkbox', { name: /fake-css-id-1/ });
      const checkbox2 = screen.getByRole('checkbox', { name: /fake-css-id-2/ });

      expect(checkbox1).toBeChecked();
      expect(checkbox2).not.toBeChecked();
    });
  });

  describe('Event Listeners', () => {
    it('should register STORY_RENDERED listener on mount', () => {
      const on = vi.fn();
      const api = createMockApi({ on });

      render(<ThemedCSSResourcePanel api={api} />);

      expect(on).toHaveBeenCalledWith(Events.STORY_RENDERED, expect.any(Function));
    });

    it('should remove STORY_RENDERED listener on unmount', () => {
      const off = vi.fn();
      const api = createMockApi({ off });

      const { unmount } = render(<ThemedCSSResourcePanel api={api} />);
      unmount();

      expect(off).toHaveBeenCalledWith(Events.STORY_RENDERED, expect.any(Function));
    });

    it('should emit SET event with current list on mount', async () => {
      const emit = vi.fn();
      const api = createMockApi({ emit });

      render(<ThemedCSSResourcePanel api={api} />);

      await waitFor(() => {
        expect(emit).toHaveBeenCalledWith(EVENTS.SET, defaultParameters);
      });
    });
  });

  describe('Checkbox Interaction', () => {
    it('should update picked state when checkbox is clicked', async () => {
      const emit = vi.fn();
      const api = createMockApi({ emit });
      const user = userEvent.setup();

      render(<ThemedCSSResourcePanel api={api} />);

      const checkbox1 = screen.getByRole('checkbox', { name: /fake-css-id-1/ });
      expect(checkbox1).toBeChecked();

      await user.click(checkbox1);

      expect(checkbox1).not.toBeChecked();
    });

    it('should emit SET event with updated list after checkbox click', async () => {
      const emit = vi.fn();
      const api = createMockApi({ emit });
      const user = userEvent.setup();

      render(<ThemedCSSResourcePanel api={api} />);

      emit.mockClear();
      const checkbox1 = screen.getByRole('checkbox', { name: /fake-css-id-1/ });
      await user.click(checkbox1);

      await waitFor(() => {
        expect(emit).toHaveBeenCalledWith(EVENTS.SET, [
          {
            id: 'fake-css-id-1',
            code: 'fake-css-code-1',
            picked: false,
          },
          {
            id: 'fake-css-id-2',
            code: 'fake-css-code-2',
            picked: false,
          },
        ]);
      });
    });

    it('should only update the clicked checkbox', async () => {
      const api = createMockApi();
      const user = userEvent.setup();

      render(<ThemedCSSResourcePanel api={api} />);

      const checkbox1 = screen.getByRole('checkbox', { name: /fake-css-id-1/ });
      const checkbox2 = screen.getByRole('checkbox', { name: /fake-css-id-2/ });

      expect(checkbox1).toBeChecked();
      expect(checkbox2).not.toBeChecked();

      await user.click(checkbox2);

      expect(checkbox1).toBeChecked();
      expect(checkbox2).toBeChecked();
    });
  });

  describe('Code Display', () => {
    it('should render code when hideCode is false', async () => {
      const api = createMockApi();
      render(<ThemedCSSResourcePanel api={api} />);

      expect(await screen.findByText(/fake-css-code-2/)).toBeInTheDocument();
      expect(await screen.findByText(/fake-css-code-1/)).toBeInTheDocument();
    });

    it('should not render code when hideCode is true', () => {
      const hiddenCodeParams = [
        {
          id: 'hidden-id',
          code: 'hidden-code',
          picked: true,
          hideCode: true,
        },
      ];

      const api = createMockApi({
        getCurrentParameter: vi.fn(() => hiddenCodeParams) as API['getCurrentParameter'],
      });

      render(<ThemedCSSResourcePanel api={api} />);

      expect(screen.getByText(/hidden-id/)).toBeInTheDocument();
      expect(screen.queryByText('hidden-code')).not.toBeInTheDocument();
    });

    it('should render code with SyntaxHighlighter when code length is below threshold', async () => {
      const shortCode = 'a'.repeat(1000);
      const shortCodeParams = [
        {
          id: 'short-code-id',
          code: shortCode,
          picked: true,
        },
      ];

      const api = createMockApi({
        getCurrentParameter: vi.fn(() => shortCodeParams) as API['getCurrentParameter'],
      });

      render(<ThemedCSSResourcePanel api={api} />);

      expect(await screen.findByText(shortCode)).toBeInTheDocument();
    });

    it('should render code with warning when code length exceeds threshold', () => {
      const longCode = 'a'.repeat(150000);
      const longCodeParams = [
        {
          id: 'long-code-id',
          code: longCode,
          picked: true,
        },
      ];

      const api = createMockApi({
        getCurrentParameter: vi.fn(() => longCodeParams) as API['getCurrentParameter'],
      });

      render(<ThemedCSSResourcePanel api={api} />);

      expect(screen.getByText(/Rest of the content cannot be displayed/)).toBeInTheDocument();
      // Should display truncated code (first 100000 chars)
      const truncated = longCode.substring(0, 100000);
      expect(screen.getByText(new RegExp(truncated.substring(0, 50)))).toBeInTheDocument();
    });

    it('should not render code section when code is empty', () => {
      const noCodeParams = [
        {
          id: 'no-code-id',
          code: '',
          picked: true,
        },
      ];

      const api = createMockApi({
        getCurrentParameter: vi.fn(() => noCodeParams) as API['getCurrentParameter'],
      });

      render(<ThemedCSSResourcePanel api={api} />);

      expect(screen.getByText(/no-code-id/)).toBeInTheDocument();
      // Should not render SyntaxHighlighter or PlainCode
      expect(screen.queryByText('Rest of the content')).not.toBeInTheDocument();
    });
  });

  describe('Multiple Items', () => {
    it('should render multiple CSS resources', () => {
      const multipleParams = [
        { id: 'item-1', code: 'code-1', picked: true },
        { id: 'item-2', code: 'code-2', picked: false },
        { id: 'item-3', code: 'code-3', picked: true },
      ];

      const api = createMockApi({
        getCurrentParameter: vi.fn(() => multipleParams) as API['getCurrentParameter'],
      });

      render(<ThemedCSSResourcePanel api={api} />);

      expect(screen.getByText(/item-1/)).toBeInTheDocument();
      expect(screen.getByText(/item-2/)).toBeInTheDocument();
      expect(screen.getByText(/item-3/)).toBeInTheDocument();
    });
  });
});
