
import React from 'react';
import { useQuery } from 'react-query';
import { getInvoices, getCustomers, getProducts } from '../../services/api';
import { format, subDays } from 'date-fns';
import { Card, CardContent, CardHeader, Typography } from '@mui/material';

const Dashboard = () => {
  const { data: invoices } = useQuery('invoices', getInvoices);
  const { data: customers } = useQuery('customers', getCustomers);
  const { data: products } = useQuery('products', getProducts);

  const today = format(new Date(), 'yyyy-MM-dd');
  const weekAgo = format(subDays(new Date(), 7), 'yyyy-MM-dd');

  const weeklyInvoices = invoices?.filter(
    (inv: any) => inv.date >= weekAgo && inv.date <= today
  ) || [];
  const weeklySales = weeklyInvoices.reduce((sum: number, inv: any) => sum + inv.total, 0);

  return (
    <div style={{ padding: '20px' }}>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
        <Card>
          <CardHeader title="Total Invoices" />
          <CardContent>{invoices?.length || 0}</CardContent>
        </Card>
        <Card>
          <CardHeader title="Total Customers" />
          <CardContent>{customers?.length || 0}</CardContent>
        </Card>
        <Card>
          <CardHeader title="Total Products" />
          <CardContent>{products?.length || 0}</CardContent>
        </Card>
        <Card>
          <CardHeader title="Weekly Sales" />
          <CardContent>₹{weeklySales.toLocaleString()}</CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
