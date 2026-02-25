
import React, { useState } from 'react';
import { useQuery } from 'react-query';
import { getInvoices, getCustomers, getProducts } from '../../services/api';
import { format, subDays } from 'date-fns';
import { Card, CardContent, CardHeader, Typography, Button, Table, TableBody, TableCell, TableHead, TableRow, FormControl, InputLabel, Select, MenuItem } from '@mui/material';

const Reports = () => {
  const { data: invoices } = useQuery('invoices', getInvoices);
  const { data: customers } = useQuery('customers', getCustomers);
  const { data: products } = useQuery('products', getProducts);

  const [dateRange, setDateRange] = useState({
    start: format(subDays(new Date(), 30), 'yyyy-MM-dd'),
    end: format(new Date(), 'yyyy-MM-dd'),
  });

  const filteredInvoices = invoices?.filter(
    (inv: any) => inv.date >= dateRange.start && inv.date <= dateRange.end
  ) || [];

  const totalSales = filteredInvoices.reduce((sum: number, inv: any) => sum + inv.total, 0);
  const totalTax = filteredInvoices.reduce((sum: number, inv: any) => sum + inv.tax, 0);
  const totalDiscount = filteredInvoices.reduce((sum: number, inv: any) => sum + inv.discount, 0);

  const productSales = filteredInvoices.reduce((acc: any, inv: any) => {
    inv.items.forEach((item: any) => {
      if (!acc[item.productId]) {
        acc[item.productId] = { name: '', quantity: 0, amount: 0 };
      }
      acc[item.productId].name = item.productName;
      acc[item.productId].quantity += item.quantity;
      acc[item.productId].amount += item.amount;
    });
    return acc;
  }, {});

  return (
    <div style={{ padding: '20px' }}>
      <Typography variant="h4" gutterBottom>
        Reports
      </Typography>

      <Card style={{ marginBottom: '20px' }}>
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>Date Range</InputLabel>
                <Select
                  value={dateRange.start}
                  onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                >
                  <MenuItem value={format(subDays(new Date(), 7), 'yyyy-MM-dd')}>Last 7 Days</MenuItem>
                  <MenuItem value={format(subDays(new Date(), 30), 'yyyy-MM-dd')}>Last 30 Days</MenuItem>
                  <MenuItem value={format(subDays(new Date(), 90), 'yyyy-MM-dd')}>Last 90 Days</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                type="date"
                label="Start Date"
                value={dateRange.start}
                onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                type="date"
                label="End Date"
                value={dateRange.end}
                onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                fullWidth
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Card style={{ marginBottom: '20px' }}>
        <CardHeader title="Summary" />
        <CardContent>
          <Grid container spacing={3}>
            <Grid item xs={12} md={3}>
              <Typography variant="h6">Total Sales</Typography>
              <Typography variant="h4">₹{totalSales.toLocaleString()}</Typography>
            </Grid>
            <Grid item xs={12} md={3}>
              <Typography variant="h6">Total Tax</Typography>
              <Typography variant="h4">₹{totalTax.toLocaleString()}</Typography>
            </Grid>
            <Grid item xs={12} md={3}>
              <Typography variant="h6">Total Discount</Typography>
              <Typography variant="h4">₹{totalDiscount.toLocaleString()}</Typography>
            </Grid>
            <Grid item xs={12} md={3}>
              <Typography variant="h6">Total Invoices</Typography>
              <Typography variant="h4">{filteredInvoices.length}</Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Card>
        <CardHeader title="Product Sales Report" />
        <CardContent>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Product</TableCell>
                <TableCell>Quantity Sold</TableCell>
                <TableCell>Total Amount</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {Object.values(productSales).map((sale: any, index: number) => (
                <TableRow key={index}>
                  <TableCell>{sale.name}</TableCell>
                  <TableCell>{sale.quantity}</TableCell>
                  <TableCell>₹{sale.amount.toLocaleString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default Reports;
