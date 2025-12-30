import React, { useState, useEffect } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import Card from "../../components/common/Card";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import { useAuthContext } from "../../contexts/AuthContext";
import { useTheme } from "../../contexts/ThemeContext";
import { usersAPI } from "../../services/api";
import { MdPerson, MdLock, MdPalette, MdInfo, MdSave, MdVisibility, MdVisibilityOff } from "react-icons/md";
import { clsx } from "clsx";

const SettingsPage = () => {
  const { user, token } = useAuthContext();
  const { dark, toggleTheme } = useTheme();
  
  // Profile state
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
  });
  
  // Password state
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  
  // UI state
  const [activeTab, setActiveTab] = useState("profile");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  
  // Initialize profile data from user context
  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || "",
        email: user.email || "",
      });
    }
  }, [user]);
  
  // Clear messages after 5 seconds
  useEffect(() => {
    if (success || error) {
      const timer = setTimeout(() => {
        setSuccess(null);
        setError(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [success, error]);
  
  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  
  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(null);
    
    try {
      if (!user?.id) {
        throw new Error("User information not available");
      }
      
      const response = await usersAPI.updateUser(user.id, {
        name: profileData.name,
        email: profileData.email,
      });
      
      setSuccess("Profile updated successfully!");
      // Update user context if needed
      window.location.reload(); // Simple refresh to update user data
    } catch (err) {
      console.error("Error updating profile:", err);
      setError(err.response?.data?.message || err.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };
  
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(null);
    
    // Validation
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError("New passwords do not match");
      setSaving(false);
      return;
    }
    
    if (passwordData.newPassword.length < 6) {
      setError("Password must be at least 6 characters long");
      setSaving(false);
      return;
    }
    
    try {
      if (!user?.id) {
        throw new Error("User information not available");
      }
      
      // Use the reset password endpoint (admin can reset any user's password)
      // Note: This endpoint requires admin role. For self-service password change,
      // we'd need a different endpoint that validates the current password first.
      // For now, using the reset password endpoint with the new password in the body
      await usersAPI.resetUserPassword(user.id, {
        newPassword: passwordData.newPassword,
      });
      
      setSuccess("Password changed successfully!");
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (err) {
      console.error("Error changing password:", err);
      setError(err.response?.data?.message || err.message || "Failed to change password");
    } finally {
      setSaving(false);
    }
  };
  
  const togglePasswordVisibility = (field) => {
    setShowPasswords((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };
  
  const tabs = [
    { id: "profile", label: "Profile", icon: MdPerson },
    { id: "password", label: "Password", icon: MdLock },
    { id: "appearance", label: "Appearance", icon: MdPalette },
    { id: "account", label: "Account Info", icon: MdInfo },
  ];
  
  return (
    <DashboardLayout>
      <div className="p-4 sm:p-6 lg:p-8">
        <h1 className="text-2xl font-bold text-[var(--color-primary-text)] mb-6">
          Settings
        </h1>
        
        {/* Success/Error Messages */}
        {success && (
          <div className="mb-4 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
            <p className="text-green-800 dark:text-green-200">{success}</p>
          </div>
        )}
        
        {error && (
          <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-red-800 dark:text-red-200">{error}</p>
          </div>
        )}
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar Tabs */}
          <div className="lg:col-span-1">
            <Card className="p-2">
              <nav className="space-y-1">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={clsx(
                        "w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors",
                        activeTab === tab.id
                          ? "bg-[var(--color-primary)] text-white"
                          : "text-[var(--color-primary-text)] hover:bg-[var(--color-surface-hover)]"
                      )}
                    >
                      <Icon className="text-lg" />
                      <span className="font-medium">{tab.label}</span>
                    </button>
                  );
                })}
              </nav>
            </Card>
          </div>
          
          {/* Content Area */}
          <div className="lg:col-span-3">
            <Card className="p-6">
              {/* Profile Tab */}
              {activeTab === "profile" && (
                <div>
                  <h2 className="text-xl font-bold text-[var(--color-primary-text)] mb-6">
                    Edit Profile
                  </h2>
                  <form onSubmit={handleProfileSubmit} className="space-y-4">
                    <Input
                      label="Full Name"
                      name="name"
                      type="text"
                      value={profileData.name}
                      onChange={handleProfileChange}
                      required
                      fullWidth
                      placeholder="Enter your full name"
                    />
                    
                    <Input
                      label="Email Address"
                      name="email"
                      type="email"
                      value={profileData.email}
                      onChange={handleProfileChange}
                      required
                      fullWidth
                      placeholder="Enter your email address"
                    />
                    
                    <div className="flex gap-3 pt-4">
                      <Button
                        type="submit"
                        disabled={saving}
                        className="flex items-center gap-2"
                      >
                        {saving ? (
                          <>
                            <LoadingSpinner size="small" />
                            Saving...
                          </>
                        ) : (
                          <>
                            <MdSave />
                            Save Changes
                          </>
                        )}
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setProfileData({
                            name: user?.name || "",
                            email: user?.email || "",
                          });
                          setError(null);
                          setSuccess(null);
                        }}
                      >
                        Cancel
                      </Button>
                    </div>
                  </form>
                </div>
              )}
              
              {/* Password Tab */}
              {activeTab === "password" && (
                <div>
                  <h2 className="text-xl font-bold text-[var(--color-primary-text)] mb-6">
                    Change Password
                  </h2>
                  <form onSubmit={handlePasswordSubmit} className="space-y-4">
                    <div className="relative">
                      <Input
                        label="Current Password"
                        name="currentPassword"
                        type={showPasswords.current ? "text" : "password"}
                        value={passwordData.currentPassword}
                        onChange={handlePasswordChange}
                        fullWidth
                        placeholder="Enter current password"
                      />
                      <button
                        type="button"
                        onClick={() => togglePasswordVisibility("current")}
                        className="absolute right-3 top-9 text-[var(--color-icon-muted)] hover:text-[var(--color-primary-text)]"
                      >
                        {showPasswords.current ? <MdVisibilityOff /> : <MdVisibility />}
                      </button>
                    </div>
                    
                    <div className="relative">
                      <Input
                        label="New Password"
                        name="newPassword"
                        type={showPasswords.new ? "text" : "password"}
                        value={passwordData.newPassword}
                        onChange={handlePasswordChange}
                        required
                        fullWidth
                        placeholder="Enter new password (min 6 characters)"
                        helperText="Password must be at least 6 characters long"
                      />
                      <button
                        type="button"
                        onClick={() => togglePasswordVisibility("new")}
                        className="absolute right-3 top-9 text-[var(--color-icon-muted)] hover:text-[var(--color-primary-text)]"
                      >
                        {showPasswords.new ? <MdVisibilityOff /> : <MdVisibility />}
                      </button>
                    </div>
                    
                    <div className="relative">
                      <Input
                        label="Confirm New Password"
                        name="confirmPassword"
                        type={showPasswords.confirm ? "text" : "password"}
                        value={passwordData.confirmPassword}
                        onChange={handlePasswordChange}
                        required
                        fullWidth
                        placeholder="Confirm new password"
                      />
                      <button
                        type="button"
                        onClick={() => togglePasswordVisibility("confirm")}
                        className="absolute right-3 top-9 text-[var(--color-icon-muted)] hover:text-[var(--color-primary-text)]"
                      >
                        {showPasswords.confirm ? <MdVisibilityOff /> : <MdVisibility />}
                      </button>
                    </div>
                    
                    <div className="flex gap-3 pt-4">
                      <Button
                        type="submit"
                        disabled={saving}
                        className="flex items-center gap-2"
                      >
                        {saving ? (
                          <>
                            <LoadingSpinner size="small" />
                            Changing...
                          </>
                        ) : (
                          <>
                            <MdSave />
                            Change Password
                          </>
                        )}
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setPasswordData({
                            currentPassword: "",
                            newPassword: "",
                            confirmPassword: "",
                          });
                          setError(null);
                          setSuccess(null);
                        }}
                      >
                        Cancel
                      </Button>
                    </div>
                  </form>
                </div>
              )}
              
              {/* Appearance Tab */}
              {activeTab === "appearance" && (
                <div>
                  <h2 className="text-xl font-bold text-[var(--color-primary-text)] mb-6">
                    Appearance Settings
                  </h2>
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-[var(--color-primary-text)] mb-3">
                        Theme
                      </label>
                      <div className="flex items-center gap-4">
                        <div className="flex-1 p-4 border border-[var(--color-border)] rounded-lg bg-[var(--color-surface)]">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium text-[var(--color-primary-text)]">
                                {dark ? "Dark Mode" : "Light Mode"}
                              </p>
                              <p className="text-sm text-[var(--color-secondary-text)] mt-1">
                                {dark
                                  ? "Dark theme is currently active"
                                  : "Light theme is currently active"}
                              </p>
                            </div>
                            <Button onClick={toggleTheme} variant="outline">
                              Switch to {dark ? "Light" : "Dark"} Mode
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Account Info Tab */}
              {activeTab === "account" && (
                <div>
                  <h2 className="text-xl font-bold text-[var(--color-primary-text)] mb-6">
                    Account Information
                  </h2>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 border border-[var(--color-border)] rounded-lg bg-[var(--color-surface)]">
                        <p className="text-sm text-[var(--color-secondary-text)] mb-1">
                          User ID
                        </p>
                        <p className="font-medium text-[var(--color-primary-text)]">
                          {user?.id || "N/A"}
                        </p>
                      </div>
                      
                      <div className="p-4 border border-[var(--color-border)] rounded-lg bg-[var(--color-surface)]">
                        <p className="text-sm text-[var(--color-secondary-text)] mb-1">
                          Role
                        </p>
                        <p className="font-medium text-[var(--color-primary-text)] capitalize">
                          {user?.role || "N/A"}
                        </p>
                      </div>
                      
                      <div className="p-4 border border-[var(--color-border)] rounded-lg bg-[var(--color-surface)]">
                        <p className="text-sm text-[var(--color-secondary-text)] mb-1">
                          Account Status
                        </p>
                        <span
                          className={clsx(
                            "inline-block px-2 py-1 rounded text-xs font-medium",
                            user?.isActive
                              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                              : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                          )}
                        >
                          {user?.isActive ? "Active" : "Inactive"}
                        </span>
                      </div>
                      
                      <div className="p-4 border border-[var(--color-border)] rounded-lg bg-[var(--color-surface)]">
                        <p className="text-sm text-[var(--color-secondary-text)] mb-1">
                          Last Login
                        </p>
                        <p className="font-medium text-[var(--color-primary-text)]">
                          {user?.lastLogin
                            ? new Date(user.lastLogin).toLocaleString()
                            : "Never"}
                        </p>
                      </div>
                    </div>
                    
                    <div className="p-4 border border-[var(--color-border)] rounded-lg bg-[var(--color-surface)]">
                      <p className="text-sm text-[var(--color-secondary-text)] mb-1">
                        Member Since
                      </p>
                      <p className="font-medium text-[var(--color-primary-text)]">
                        {user?.createdAt
                          ? new Date(user.createdAt).toLocaleDateString()
                          : "N/A"}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default SettingsPage;
