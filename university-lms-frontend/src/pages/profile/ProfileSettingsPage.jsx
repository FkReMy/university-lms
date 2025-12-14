/**
 * ProfileSettingsPage Component
 * ----------------------------------------------------------
 * User profile settings: view/edit profile info, change password.
 *
 * Responsibilities:
 * - Show summary/profile info: name, email, role, avatar.
 * - Allow user to edit name or avatar (change password UX as a demo).
 * - Handles cleanup of avatar blob URLs to avoid memory leaks.
 * - Consistently uses Input and Button components from UI library.
 *
 * Usage:
 *   <Route path="/profile" element={<ProfileSettingsPage />} />
 */

import { useEffect, useState, useRef } from "react";

import Button from "../../components/ui/button";
import Input from "../../components/ui/input";

import styles from "./ProfileSettingsPage.module.scss";

// Demo: initial profile
const DEMO_PROFILE = {
  name: "Jane Student",
  email: "jane.student@university.edu",
  role: "Student",
  avatar: null,
};

export default function ProfileSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState({});
  const [name, setName] = useState("");
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [showPw, setShowPw] = useState(false);
  const [password, setPassword] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const avatarInputRef = useRef();
  const nameInputId = "profile-name";
  const emailInputId = "profile-email";
  const roleInputId = "profile-role";
  const avatarInputId = "profile-avatar";

  // To track previous blob for proper cleanup
  const previousBlobUrl = useRef(null);

  // Simulate profile load (API)
  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setProfile(DEMO_PROFILE);
      setName(DEMO_PROFILE.name);
      setAvatarUrl(DEMO_PROFILE.avatar);
      setLoading(false);
    }, 700);
    // Cleanup avatarUrl (just in case component is unmounted early)
    return () => {
      if (previousBlobUrl.current) {
        URL.revokeObjectURL(previousBlobUrl.current);
        previousBlobUrl.current = null;
      }
    };
  }, []);

  // Avatar preview on file pick, with blobURL cleanup
  function handleAvatarChange(e) {
    const file = e.target.files[0];
    setAvatarFile(file || null);

    // Clean up the previous created blob URL before making a new one
    if (previousBlobUrl.current) {
      URL.revokeObjectURL(previousBlobUrl.current);
      previousBlobUrl.current = null;
    }

    if (file) {
      const url = URL.createObjectURL(file);
      previousBlobUrl.current = url;
      setAvatarUrl(url);
    } else {
      setAvatarUrl(profile.avatar);
    }
  }

  // Clean up blob URL on avatar remove
  function handleRemoveAvatar() {
    setAvatarFile(null);
    if (previousBlobUrl.current) {
      URL.revokeObjectURL(previousBlobUrl.current);
      previousBlobUrl.current = null;
    }
    setAvatarUrl(null);
    if (avatarInputRef.current) avatarInputRef.current.value = "";
  }

  // Demo only: Save profile info
  function handleSaveProfile(e) {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => {
      setProfile((p) => ({
        ...p,
        name,
        avatar: avatarFile ? avatarUrl : p.avatar,
      }));
      setSaving(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 1200);
    }, 900);
  }

  // Demo only: Change password UX
  function handleSavePassword(e) {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      setPassword("");
      setSaved(true);
      setTimeout(() => setSaved(false), 1200);
    }, 900);
  }

  // Use initials if no avatar
  function getInitials(name) {
    if (!name) return "";
    const parts = name.trim().split(" ");
    if (parts.length === 1) return parts[0][0] || "";
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }

  return (
    <div className={styles.profileSettingsPage}>
      <h1 className={styles.profileSettingsPage__title}>Profile Settings</h1>
      <div className={styles.profileSettingsPage__mainBox}>
        {loading ? (
          <div className={styles.profileSettingsPage__loading}>
            Loading profile…
          </div>
        ) : (
          <>
            <form
              className={styles.profileSettingsPage__form}
              onSubmit={handleSaveProfile}
              autoComplete="off"
              encType="multipart/form-data"
            >
              <div className={styles.profileSettingsPage__avatarRow}>
                <label
                  className={styles.profileSettingsPage__avatarLabel}
                  htmlFor={avatarInputId}
                >
                  {avatarUrl ? (
                    <img
                      src={avatarUrl}
                      alt="Profile Avatar"
                      className={styles.profileSettingsPage__avatarImg}
                    />
                  ) : (
                    <span className={styles.profileSettingsPage__avatarInitials}>
                      {getInitials(name)}
                    </span>
                  )}
                  <Input
                    className={styles.profileSettingsPage__avatarInput}
                    type="file"
                    accept="image/*"
                    ref={avatarInputRef}
                    id={avatarInputId}
                    onChange={handleAvatarChange}
                    aria-label="Upload avatar"
                  />
                </label>
                {avatarUrl && (
                  <Button
                    type="button"
                    variant="outline"
                    className={styles.profileSettingsPage__avatarRemoveBtn}
                    onClick={handleRemoveAvatar}
                    aria-label="Remove avatar"
                  >
                    &#215;
                  </Button>
                )}
              </div>
              <div className={styles.profileSettingsPage__fieldRow}>
                <label htmlFor={nameInputId}>
                  Name
                  <Input
                    className={styles.profileSettingsPage__input}
                    type="text"
                    value={name}
                    id={nameInputId}
                    maxLength={50}
                    required
                    onChange={(e) => setName(e.target.value)}
                  />
                </label>
              </div>
              <div className={styles.profileSettingsPage__fieldRow}>
                <label htmlFor={emailInputId}>
                  Email
                  <Input
                    className={styles.profileSettingsPage__input}
                    type="email"
                    value={profile.email || ""}
                    id={emailInputId}
                    disabled
                  />
                </label>
              </div>
              <div className={styles.profileSettingsPage__fieldRow}>
                <label htmlFor={roleInputId}>
                  Role
                  <Input
                    className={styles.profileSettingsPage__input}
                    type="text"
                    value={profile.role || ""}
                    id={roleInputId}
                    disabled
                  />
                </label>
              </div>
              <div className={styles.profileSettingsPage__actions}>
                <Button
                  type="submit"
                  className={styles.profileSettingsPage__saveBtn}
                  disabled={saving}
                  variant="primary"
                >
                  {saving ? "Saving…" : "Save Profile"}
                </Button>
                {saved && (
                  <span className={styles.profileSettingsPage__savedMsg}>
                    Profile saved!
                  </span>
                )}
              </div>
            </form>
            <div className={styles.profileSettingsPage__divider} />
            <form
              className={styles.profileSettingsPage__form}
              onSubmit={handleSavePassword}
              autoComplete="off"
            >
              <div className={styles.profileSettingsPage__pwRow}>
                <Button
                  type="button"
                  variant="outline"
                  className={styles.profileSettingsPage__pwShowBtn}
                  aria-label="Change password"
                  onClick={() => setShowPw((c) => !c)}
                >
                  {showPw ? "Hide Password" : "Change Password"}
                </Button>
                {showPw && (
                  <Input
                    className={styles.profileSettingsPage__input}
                    type="password"
                    placeholder="New password"
                    value={password}
                    minLength={6}
                    required
                    onChange={e => setPassword(e.target.value)}
                  />
                )}
                {showPw && (
                  <Button
                    type="submit"
                    className={styles.profileSettingsPage__saveBtn}
                    disabled={saving || !password}
                    variant="primary"
                  >
                    {saving ? "Saving…" : "Save Password"}
                  </Button>
                )}
              </div>
              {showPw && saved && (
                <span className={styles.profileSettingsPage__savedMsg}>
                  Password updated!
                </span>
              )}
            </form>
          </>
        )}
      </div>
    </div>
  );
}

/**
 * Key improvements:
 * - Input and Button components from UI library used for all interactive elements for uniform look and accessibility.
 * - Blob URLs from file uploader are now properly revoked for memory/resource safety.
 * - No leaks: cleans up on file change and unmount.
 * - Still demo logic, but now fully aligned with UI/UX design system.
 */
