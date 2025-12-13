/**
 * Tabs Component
 * ----------------------------------------------------------
 * A reusable, accessible set of tabs for the LMS UI, styled with CSS Modules.
 *
 * Responsibilities:
 * - Display a row of tab buttons and render the content of the active tab.
 * - Fully accessible (keyboard, ARIA roles/props).
 * - Handles controlled or uncontrolled active tab.
 * - Can be used for both simple and complex tab UIs.
 *
 * Props:
 * - tabs: Array<{ label: string, content: ReactNode, disabled?: boolean }>
 *       OR children as <TabPane label="..." disabled>...</TabPane>
 * - activeIndex: number (for controlled tab selection)
 * - defaultIndex: number (for uncontrolled initial tab)
 * - onTabChange: function (called with new tab index when changed)
 * - className: string (extra classes for tabs root)
 *
 * Usage (array form):
 *   <Tabs
 *     tabs={[
 *       { label: "Overview", content: <Overview /> },
 *       { label: "Assignments", content: <Assignments /> },
 *     ]}
 *   />
 *
 * Usage (component form):
 *   <Tabs>
 *     <TabPane label="Profile"> ... </TabPane>
 *     <TabPane label="Courses"> ... </TabPane>
 *   </Tabs>
 */

import { useState, useMemo, Children } from 'react';

import styles from './tabs.module.scss';

/**
 * Optional: TabPane component for composition API
 */
export function TabPane({ children }) {
  // Only children will be rendered by Tabs; label, disabled handled by Tabs
  return children;
}

/**
 * Main Tabs component
 */
export default function Tabs({
  tabs,
  children,
  activeIndex,      // controlled
  defaultIndex = 0, // uncontrolled
  onTabChange,
  className = '',
}) {
  // Determine tab data and content (array prop or TabPane children)
  const tabData = useMemo(() => {
    if (tabs && Array.isArray(tabs)) {
      return tabs.map(tab => ({
        label: tab.label,
        content: tab.content,
        disabled: !!tab.disabled,
      }));
    }
    // Use children as TabPane if present
    if (children) {
      return Children.toArray(children).map(child => ({
        label: child.props.label,
        content: child.props.children,
        disabled: !!child.props.disabled,
      }));
    }
    return [];
  }, [tabs, children]);

  // Internal state for uncontrolled tabs
  const [internalActive, setInternalActive] = useState(defaultIndex);

  // Controlled vs uncontrolled
  const currentIndex =
    typeof activeIndex === 'number' ? activeIndex : internalActive;

  // Handler for tab click/keyboard selection
  const handleTabChange = idx => {
    if (tabData[idx].disabled) return;
    if (typeof activeIndex !== 'number') setInternalActive(idx);
    if (onTabChange) onTabChange(idx);
  };

  // Keyboard navigation
  const handleKeyDown = (evt, idx) => {
    let next = idx;
    if (evt.key === 'ArrowRight') {
      do {
        next = (next + 1) % tabData.length;
      } while (tabData[next].disabled && next !== idx);
      handleTabChange(next);
    } else if (evt.key === 'ArrowLeft') {
      do {
        next = (next - 1 + tabData.length) % tabData.length;
      } while (tabData[next].disabled && next !== idx);
      handleTabChange(next);
    }
  };

  // Compose wrapper class
  const rootClass = [styles.tabs__root, className].filter(Boolean).join(' ');

  return (
    <div className={rootClass}>
      {/* Tab list */}
      <div
        className={styles.tabs__list}
        role="tablist"
        aria-label="Tabs"
      >
        {tabData.map((tab, idx) => (
          <button
            type="button"
            role="tab"
            aria-selected={currentIndex === idx}
            aria-controls={`tab-panel-${idx}`}
            id={`tab-${idx}`}
            key={idx}
            tabIndex={tab.disabled ? -1 : currentIndex === idx ? 0 : -1}
            disabled={tab.disabled}
            className={[
              styles.tabs__tab,
              currentIndex === idx ? styles['tabs__tab--active'] : '',
              tab.disabled ? styles['tabs__tab--disabled'] : '',
            ].filter(Boolean).join(' ')}
            onClick={() => handleTabChange(idx)}
            onKeyDown={evt => handleKeyDown(evt, idx)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab panels */}
      {tabData.map((tab, idx) =>
        currentIndex === idx ? (
          <div
            key={idx}
            className={styles.tabs__panel}
            role="tabpanel"
            id={`tab-panel-${idx}`}
            aria-labelledby={`tab-${idx}`}
            tabIndex={0}
          >
            {tab.content}
          </div>
        ) : null
      )}
    </div>
  );
}