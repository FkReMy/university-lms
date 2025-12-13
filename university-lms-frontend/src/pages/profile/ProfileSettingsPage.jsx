/**
 * ProfileSettingsPage Component
 * ----------------------------------------------------------
 * User profile settings: view/edit profile info, change password.
 *
 * Responsibilities:
 * - Show summary/profile info: name, email, role, avatar.
 * - Allow user to edit name or avatar (change password UX as a demo).
 * - Demo: handles form changes, mock save, loading and success states.
 *
 * Usage:
 *   <Route path="/profile" element={<ProfileSettingsPage />} />
 */

import React, { useEffect, useState, useRef } from "react";
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

  // Simulate profile load (API)
  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setProfile(DEMO_PROFILE);
      setName(DEMO_PROFILE.name);
      setAvatarUrl(DEMO_PROFILE.avatar);
      setLoading(false);
    }, 700);
  }, []);

  // Avatar preview on file pick
  function handleAvatarChange(e) {
    const file = e.target.files[0];
    setAvatarFile(file || null);
    if (file) {
      const url = URL.createObjectURL(file);
      setAvatarUrl(url);
    } else {
      setAvatarUrl(profile.avatar);
    }
  }

  function handleRemoveAvatar() {
    setAvatarFile(null);
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
                <label className={styles.profileSettingsPage__avatarLabel}>
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
                  <input
                    className={styles.profileSettingsPage__avatarInput}
                    type="file"
                    accept="image/*"
                    ref={avatarInputRef}
                    onChange={handleAvatarChange}
                  />
                </label>
                {avatarUrl && (
                  <button
                    type="button"
                    className={styles.profileSettingsPage__avatarRemoveBtn}
                    onClick={handleRemoveAvatar}
                    aria-label="Remove avatar"
                  >
                    &#215;
                  </button>
                )}
              </div>
              <div className={styles.profileSettingsPage__fieldRow}>
                <label>
                  Name
                  <input
                    className={styles.profileSettingsPage__input}
                    type="text"
                    value={name}
                    maxLength={50}
                    required
                    onChange={(e) => setName(e.target.value)}
                  />
                </label>
              </div>
              <div className={styles.profileSettingsPage__fieldRow}>
                <label>
                  Email
                  <input
                    className={styles.profileSettingsPage__input}
                    type="email"
                    value={profile.email || ""}
                    disabled
                  />
                </label>
              </div>
              <div className={styles.profileSettingsPage__fieldRow}>
                <label>
                  Role
                  <input
                    className={styles.profileSettingsPage__input}
                    type="text"
                    value={profile.role || ""}
                    disabled
                  />
                </label>
              </div>
              <div className={styles.profileSettingsPage__actions}>
                <button
                  type="submit"
                  className={styles.profileSettingsPage__saveBtn}
                  disabled={saving}
                >
                  {saving ? "Saving…" : "Save Profile"}
                </button>
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
                <button
                  type="button"
                  className={styles.profileSettingsPage__pwShowBtn}
                  aria-label="Change password"
                  onClick={() => setShowPw((c) => !c)}
                >
                  {showPw ? "Hide Password" : "Change Password"}
                </button>
                {showPw && (
                  <input
                    className={styles.profileSettingsPage__input}
                    type="password"
                    placeholder="New password"
                    value={password}
                    minLength={6}
                    required
                    onChange={(e) => setPassword(e.target.value)}
                  />
                )}
                {showPw && (
                  <button
                    type="submit"
                    className={styles.profileSettingsPage__saveBtn}
                    disabled={saving || !password}
                  >
                    {saving ? "Saving…" : "Save Password"}
                  </button>
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