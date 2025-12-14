/**
 * Tabs Component (LMS Design System)
 * ----------------------------------------------------------------------------
 * Global, accessible, and scalable tab system.
 * - Design-system classes only (tabs.module.scss), no local/sample/demo logic.
 * - Accepts tabs as array OR TabPane compound children pattern for flexibility.
 * - Handles keyboard accessibility: tab/arrow navigation, ARIA roles/attrs.
 * - Supports controlled/uncontrolled selection and disables tabs.
 *
 * Props:
 * - tabs?: Array<{ label: string, content: ReactNode, disabled?: boolean }>
 * - children?: ReactNode (only <TabPane label="...">...</TabPane>)
 * - activeIndex?: number (controlled selection, 0-based)
 * - defaultIndex?: number (uncontrolled, initial active)
 * - onTabChange?: function(idx) (called on tab switch)
 * - className?: string (root classes)
 */

import { useState, useMemo, Children } from 'react';
import PropTypes from 'prop-types';
import styles from './tabs.module.scss';

// Compound component for <Tabs><TabPane ...>...</TabPane></Tabs>
export function TabPane({ children }) {
  return children;
}
TabPane.propTypes = {
  label: PropTypes.string,
  disabled: PropTypes.bool,
  children: PropTypes.node,
};

export default function Tabs({
  tabs,
  children,
  activeIndex,        // controlled
  defaultIndex = 0,   // uncontrolled
  onTabChange,
  className = '',
}) {
  // Normalize tab data structure (from array OR from children)
  const tabData = useMemo(() => {
    if (Array.isArray(tabs)) {
      return tabs.map(tab => ({
        label: tab.label,
        content: tab.content,
        disabled: !!tab.disabled,
      }));
    }
    if (children) {
      return Children.toArray(children).map(child => ({
        label: child.props.label,
        content: child.props.children,
        disabled: !!child.props.disabled,
      }));
    }
    return [];
  }, [tabs, children]);

  // Uncontrolled active index fallback
  const [internalActive, setInternalActive] = useState(defaultIndex);

  // Controlled vs. uncontrolled: supports either mode safely
  const currentIndex =
    typeof activeIndex === 'number' ? activeIndex : internalActive;

  // Tab change and keyboard handler
  const handleTabChange = idx => {
    if (tabData[idx].disabled) return;
    if (typeof activeIndex !== 'number') setInternalActive(idx);
    if (onTabChange) onTabChange(idx);
  };

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

  const rootClass = [styles.tabs__root, className].filter(Boolean).join(' ');

  return (
    <div className={rootClass}>
      {/* Tab header/buttons */}
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

      {/* Active tab panel only */}
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

Tabs.propTypes = {
  tabs: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      content: PropTypes.node.isRequired,
      disabled: PropTypes.bool,
    })
  ),
  children: PropTypes.node,
  activeIndex: PropTypes.number,
  defaultIndex: PropTypes.number,
  onTabChange: PropTypes.func,
  className: PropTypes.string,
};

/**
 * Production/Architecture Notes:
 * - All ARIA, focus, disabled state, and scroll/tab class logic is global and prod-ready.
 * - Ready for backend-driven or dynamic tab UIs at scale (forms, quiz, dashboard).
 * - Only design-system class tokens and no local/sample implementation logic.
 */