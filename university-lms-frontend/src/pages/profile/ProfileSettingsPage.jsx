/**
 * ProfileSettingsPage Component (Production)
 * ----------------------------------------------------------------------------
 * User profile settings: view/edit profile info, change password.
 * - Shows name, email, role, current avatar (or initials).
 * - Allows editing name, avatar, and password.
 * - Uses global Input/Button components and handles avatar URL cleanup.
 * - All data is loaded and saved via backend API (no sample/demo logic).
 *
 * Usage:
 *   <Route path="/profile" element={<ProfileSettingsPage />} />
 */

import { useEffect, useRef, useState } from "react";

import styles from "./ProfileSettingsPage.module.scss";

import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import profileApi from "@/services/api/profileApi"; // Should provide .get(), .update(), .changePassword()

export default function ProfileSettingsPage() {
  // State for profile, form fields, and loading/saving
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState({});
  const [name, setName] = useState("");
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [showPw, setShowPw] = useState(false);
  const [password, setPassword] = useState("");
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [savedProfile, setSavedProfile] = useState(false);
  const [savedPassword, setSavedPassword] = useState(false);

  const avatarInputRef = useRef();
  const previousBlobUrl = useRef(null);

  // Input IDs for accessibility
  const nameInputId = "profile-name";
  const emailInputId = "profile-email";
  const roleInputId = "profile-role";
  const avatarInputId = "profile-avatar";

  // Load real profile data on mount
  useEffect(() => {
    let isMounted = true;
    async function loadProfile() {
      setLoading(true);
      try {
        const result = await profileApi.get();
        if (isMounted && result) {
          setProfile(result);
          setName(result.name || "");
          setAvatarUrl(result.avatar || null);
        }
      } catch (err) {
        if (isMounted) {
          setProfile({});
          setName("");
          setAvatarUrl(null);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    loadProfile();
    return () => {
      // Cleanup avatar blob on unmount
      if (previousBlobUrl.current) {
        URL.revokeObjectURL(previousBlobUrl.current);
        previousBlobUrl.current = null;
      }
    };
  }, []);

  // Handle avatar upload/change and blob cleanup
  function handleAvatarChange(e) {
    const file = e.target.files[0];
    setAvatarFile(file || null);

    // Cleanup old blob
    if (previousBlobUrl.current) {
      URL.revokeObjectURL(previousBlobUrl.current);
      previousBlobUrl.current = null;
    }
    if (file) {
      const url = URL.createObjectURL(file);
      previousBlobUrl.current = url;
      setAvatarUrl(url);
    } else if (profile.avatar) {
      setAvatarUrl(profile.avatar);
    } else {
      setAvatarUrl(null);
    }
  }

  // Remove avatar handler
  function handleRemoveAvatar() {
    setAvatarFile(null);
    if (previousBlobUrl.current) {
      URL.revokeObjectURL(previousBlobUrl.current);
      previousBlobUrl.current = null;
    }
    setAvatarUrl(null);
    if (avatarInputRef.current) avatarInputRef.current.value = "";
  }

  // Save profile information
  async function handleSaveProfile(e) {
    e.preventDefault();
    setSavingProfile(true);
    try {
      // FormData for avatar upload if needed
      let avatarToSave = avatarFile;
      let newAvatarUrl = avatarUrl;
      if (avatarFile) {
        const formData = new FormData();
        formData.append('avatar', avatarFile);
        const { url } = await profileApi.uploadAvatar(formData);
        newAvatarUrl = url;
        avatarToSave = null;
      }
      await profileApi.update({
        name,
        avatar: newAvatarUrl,
      });
      setProfile((prev) => ({
        ...prev,
        name,
        avatar: newAvatarUrl,
      }));
      setAvatarFile(null);
      setSavedProfile(true);
      setTimeout(() => setSavedProfile(false), 1200);
    } catch (err) {
      // Optional: show error message
    } finally {
      setSavingProfile(false);
    }
  }

  // Handle password save/change
  async function handleSavePassword(e) {
    e.preventDefault();
    setSavingPassword(true);
    try {
      await profileApi.changePassword({ password });
      setPassword("");
      setSavedPassword(true);
      setTimeout(() => setSavedPassword(false), 1200);
    } catch (err) {
      // Optionally: show error
    } finally {
      setSavingPassword(false);
    }
  }

  // Render initials if no avatar present
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
          <div className={styles.profileSettingsPage__loading}>Loading profile…</div>
        ) : (
          <>
            {/* Profile form */}
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
                  disabled={savingProfile}
                  variant="primary"
                >
                  {savingProfile ? "Saving…" : "Save Profile"}
                </Button>
                {savedProfile && (
                  <span className={styles.profileSettingsPage__savedMsg}>
                    Profile saved!
                  </span>
                )}
              </div>
            </form>
            <div className={styles.profileSettingsPage__divider} />
            {/* Password form */}
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
                  <>
                    <Input
                      className={styles.profileSettingsPage__input}
                      type="password"
                      placeholder="New password"
                      value={password}
                      minLength={6}
                      required
                      onChange={e => setPassword(e.target.value)}
                    />
                    <Button
                      type="submit"
                      className={styles.profileSettingsPage__saveBtn}
                      disabled={savingPassword || !password}
                      variant="primary"
                    >
                      {savingPassword ? "Saving…" : "Save Password"}
                    </Button>
                  </>
                )}
              </div>
              {showPw && savedPassword && (
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
 * Production Notes:
 * - Loads profile and avatar from backend API, saves via API only.
 * - Avatars properly managed via blob URL cleanup.
 * - All forms use unified Button and Input.
 * - No mock/demo—fully wire up to real endpoints for profile update, avatar upload, and password change.
 */