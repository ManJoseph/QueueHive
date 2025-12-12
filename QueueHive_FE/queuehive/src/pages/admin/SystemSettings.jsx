import React from 'react';
import { FaCog, FaBell, FaShieldAlt, FaDatabase } from 'react-icons/fa';
import styles from './SystemSettings.module.css';

const SystemSettings = () => {
  return (
    <div className={styles.settingsContainer}>
      <div className={styles.header}>
        <h1 className={styles.title}>System Settings</h1>
        <p className={styles.subtitle}>Configure system-wide settings and preferences</p>
      </div>

      <div className={styles.settingsGrid}>
        <div className={styles.settingCard}>
          <div className={styles.cardHeader}>
            <FaCog className={styles.cardIcon} />
            <h3>General Settings</h3>
          </div>
          <div className={styles.cardContent}>
            <div className={styles.settingItem}>
              <label>System Name</label>
              <input type="text" defaultValue="QueueHive" disabled />
            </div>
            <div className={styles.settingItem}>
              <label>Maintenance Mode</label>
              <select defaultValue="off">
                <option value="off">Off</option>
                <option value="on">On</option>
              </select>
            </div>
          </div>
        </div>

        <div className={styles.settingCard}>
          <div className={styles.cardHeader}>
            <FaBell className={styles.cardIcon} />
            <h3>Notifications</h3>
          </div>
          <div className={styles.cardContent}>
            <div className={styles.settingItem}>
              <label>Email Notifications</label>
              <select defaultValue="enabled">
                <option value="enabled">Enabled</option>
                <option value="disabled">Disabled</option>
              </select>
            </div>
            <div className={styles.settingItem}>
              <label>SMS Notifications</label>
              <select defaultValue="enabled">
                <option value="enabled">Enabled</option>
                <option value="disabled">Disabled</option>
              </select>
            </div>
          </div>
        </div>

        <div className={styles.settingCard}>
          <div className={styles.cardHeader}>
            <FaShieldAlt className={styles.cardIcon} />
            <h3>Security</h3>
          </div>
          <div className={styles.cardContent}>
            <div className={styles.settingItem}>
              <label>Two-Factor Authentication</label>
              <select defaultValue="optional">
                <option value="required">Required</option>
                <option value="optional">Optional</option>
                <option value="disabled">Disabled</option>
              </select>
            </div>
            <div className={styles.settingItem}>
              <label>Session Timeout (minutes)</label>
              <input type="number" defaultValue="30" min="5" max="120" />
            </div>
          </div>
        </div>

        <div className={styles.settingCard}>
          <div className={styles.cardHeader}>
            <FaDatabase className={styles.cardIcon} />
            <h3>Data Management</h3>
          </div>
          <div className={styles.cardContent}>
            <div className={styles.settingItem}>
              <label>Auto-delete old tokens (days)</label>
              <input type="number" defaultValue="90" min="30" max="365" />
            </div>
            <div className={styles.settingItem}>
              <label>Backup Frequency</label>
              <select defaultValue="daily">
                <option value="hourly">Hourly</option>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.actions}>
        <button className={styles.saveButton}>Save Changes</button>
        <button className={styles.resetButton}>Reset to Defaults</button>
      </div>
    </div>
  );
};

export default SystemSettings;
