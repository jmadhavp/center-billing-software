
import React, { useState, useEffect } from 'react';
import { useQuery, useMutation } from 'react-query';
import { getSettings, updateSettings } from '../../services/api';
import { Card, CardContent, CardHeader, Typography, TextField, Button } from '@mui/material';

const Settings = () => {
  const { data: settings } = useQuery('settings', getSettings);
  const [updateSettingsMutation] = useMutation(updateSettings);

  const [appSettings, setAppSettings] = useState({
    businessName: '',
    gstNumber: '',
    address: '',
    phone: '',
    email: '',
    invoicePrefix: 'INV',
    taxRate: 18,
  });

  useEffect(() => {
    if (settings) {
      setAppSettings(settings);
    }
  }, [settings]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateSettingsMutation(appSettings);
      alert('Settings updated successfully!');
    } catch (error) {
      console.error('Error updating settings:', error);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <Typography variant="h4" gutterBottom>
        Settings
      </Typography>
      <Card>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <Typography variant="h6" gutterBottom>
              Business Information
            </Typography>
            <TextField
              fullWidth
              label="Business Name"
              value={appSettings.businessName}
              onChange={(e) => setAppSettings(prev => ({ ...prev, businessName: e.target.value }))}
              style={{ marginBottom: '20px' }}
            />
            <TextField
              fullWidth
              label="GST Number"
              value={appSettings.gstNumber}
              onChange={(e) => setAppSettings(prev => ({ ...prev, gstNumber: e.target.value }))}
              style={{ marginBottom: '20px' }}
            />
            <TextField
              fullWidth
              label="Address"
              value={appSettings.address}
              onChange={(e) => setAppSettings(prev => ({ ...prev, address: e.target.value }))}
              style={{ marginBottom: '20px' }}
            />
            <TextField
              fullWidth
              label="Phone"
              value={appSettings.phone}
              onChange={(e) => setAppSettings(prev => ({ ...prev, phone: e.target.value }))}
              style={{ marginBottom: '20px' }}
            />
            <TextField
              fullWidth
              label="Email"
              value={appSettings.email}
              onChange={(e) => setAppSettings(prev => ({ ...prev, email: e.target.value }))}
              style={{ marginBottom: '20px' }}
            />

            <Typography variant="h6" gutterBottom style={{ marginTop: '20px' }}>
              Invoice Settings
            </Typography>
            <TextField
              fullWidth
              label="Invoice Prefix"
              value={appSettings.invoicePrefix}
              onChange={(e) => setAppSettings(prev => ({ ...prev, invoicePrefix: e.target.value }))}
              style={{ marginBottom: '20px' }}
            />
            <TextField
              fullWidth
              label="Default Tax Rate (%)"
              type="number"
              value={appSettings.taxRate}
              onChange={(e) => setAppSettings(prev => ({ ...prev, taxRate: parseInt(e.target.value) || 0 }))}
              style={{ marginBottom: '20px' }}
            />

            <Button type="submit" variant="contained" color="primary">
              Save Settings
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Settings;
