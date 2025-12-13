/**
 * Avatar Component
 * ----------------------------------------------------------
 * A reusable avatar component for the LMS UI using CSS modules.
 *
 * Responsibilities:
 * - Display a user's avatar image, fallback to initials or icon if no image.
 * - Support different sizes ("sm", "md", "lg", "xl").
 * - Optional alt text for accessibility.
 * - Custom className and style support.
 *
 * Props:
 * - src: string (optional)        - Image URL for the avatar.
 * - alt: string (optional)        - Accessible text for the image.
 * - name: string (optional)       - User's name (for generating fallback initials).
 * - size: "sm" | "md" | "lg" | "xl" (default: "md") - Size of the avatar.
 * - className: string (optional)  - Extra classes for the wrapper.
 * - style: object (optional)      - Inline styles.
 * - ...rest:                      - Other props for <span>.
 *
 * Usage:
 *   <Avatar src={user.imgUrl} name={user.fullName} size="sm" />
 *   <Avatar name="Ada Lovelace" />
 *   <Avatar>?</Avatar>
 */

import styles from './avatar.module.scss';

// Given a name, generate initials (max 2)
function getInitials(name) {
  if (!name || typeof name !== "string") return "";
  const words = name.trim().split(/\s+/);
  if (words.length === 1) {
    return words[0][0]?.toUpperCase() || "";
  }
  return (
    words[0][0]?.toUpperCase() +
    words[words.length - 1][0]?.toUpperCase()
  );
}

// Acceptable size variants
const SIZES = {
  sm: styles.avatar__sm,
  md: styles.avatar__md,
  lg: styles.avatar__lg,
  xl: styles.avatar__xl,
};

export default function Avatar({
  src,
  alt = "",
  name,
  size = "md",
  className = "",
  style = {},
  children,
  ...rest
}) {
  const sizeClass = SIZES[size] || SIZES.md;
  const avatarClass = [styles.avatar, sizeClass, className].filter(Boolean).join(" ");

  // Fallback content (initials or children)
  const fallback = name
    ? getInitials(name)
    : children || (
        <span aria-hidden="true" className={styles.avatar__icon}>
          {/* Simple user icon SVG */}
          <svg width="60%" height="60%" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="8" r="5" fill="#e5e7eb" />
            <ellipse cx="12" cy="17.2" rx="7.7" ry="4.8" fill="#e5e7eb" />
          </svg>
        </span>
      );

  return (
    <span className={avatarClass} style={style} {...rest}>
      {src ? (
        <img
          src={src}
          alt={alt || name || "User avatar"}
          className={styles.avatar__img}
          onError={e => (e.target.style.display = "none")}
        />
      ) : (
        <span className={styles.avatar__fallback}>{fallback}</span>
      )}
    </span>
  );
}