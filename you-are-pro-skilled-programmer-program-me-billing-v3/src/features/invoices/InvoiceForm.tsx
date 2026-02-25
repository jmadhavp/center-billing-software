
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery, useMutation } from 'react-query';
import { getCustomers, getProducts, getInvoices, createInvoice, updateInvoice } from '../../services/api';
import { Card, CardContent, CardHeader, TextField, Button, Grid, MenuItem, Select, InputLabel, FormControl, Chip, IconButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';

const InvoiceForm = () => {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const isEdit = !!id;

  const { data: customers } = useQuery('customers', getCustomers);
  const { data: products } = useQuery('products', getProducts);
  const { data: invoices } = useQuery('invoices', getInvoices);

  const [invoice, setInvoice] = useState({
    id: '',
    customerId: '',
    date: new Date().toISOString().split('T')[0],
    items: [{ productId: '', quantity: 1, rate: 0, amount: 0 }],
    total: 0,
    tax: 0,
    discount: 0,
    grandTotal: 0,
  });

  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);

  useEffect(() => {
    if (isEdit && invoices) {
      const existingInvoice = invoices.find((inv: any) => inv.id === id);
      if (existingInvoice) {
        setInvoice(existingInvoice);
        setSelectedCustomer(customers?.find((c: any) => c.id === existingInvoice.customerId));
      }
    }
  }, [isEdit, id, invoices, customers]);

  const [createInvoiceMutation, { isLoading: isCreating }] = useMutation(createInvoice);
  const [updateInvoiceMutation, { isLoading: isUpdating }] = useMutation(updateInvoice);

  const handleAddItem = () => {
    setInvoice(prev => ({
      ...prev,
      items: [...prev.items, { productId: '', quantity: 1, rate: 0, amount: 0 }],
    }));
  };

  const handleRemoveItem = (index: number) => {
    setInvoice(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }));
  };

  const handleItemChange = (index: number, field: string, value: any) => {
    const newItems = [...invoice.items];
    newItems[index][field] = value;
    if (field === 'quantity' || field === 'rate') {
      newItems[index].amount = newItems[index].quantity * newItems[index].rate;
    }
    setInvoice(prev => ({
      ...prev,
      items: newItems,
    }));
    calculateTotals();
  };

  const calculateTotals = () => {
    const total = invoice.items.reduce((sum, item) => sum + item.amount, 0);
    const discount = parseFloat(invoice.discount) || 0;
    const tax = parseFloat(invoice.tax) || 0;
    const grandTotal = total + tax - discount;

    setInvoice(prev => ({
      ...prev,
      total,
      grandTotal,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isEdit) {
        await updateInvoiceMutation({ ...invoice, customerId: selectedCustomer?.id });
      } else {
        await createInvoiceMutation({ ...invoice, customerId: selectedCustomer?.id });
      }
      navigate('/invoices');
    } catch (error) {
      console.error('Error saving invoice:', error);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <Typography variant="h4">{isEdit ? 'Edit Invoice' : 'Create Invoice'}</Typography>
        <div>
          <Button component={Link} to="/invoices" variant="contained" style={{ marginRight: '10px' }}>Back</Button>
          <Button disabled={!selectedCustomer || invoice.items.some((item: any) => !item.productId)} onClick={handleSubmit} variant="contained" color="primary">
            {isCreating || isUpdating ? 'Saving...' : 'Save'}
          </Button>
        </div>
      </div>
      <Card>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Customer</InputLabel>
                  <Select
                    value={selectedCustomer?.id || ''}
                    onChange={(e) => {
                      const customer = customers?.find((c: any) => c.id === e.target.value);
                      setSelectedCustomer(customer);
                      setInvoice(prev => ({ ...prev, customerId: e.target.value }));
                    }}
                  >
                    {customers?.map((customer: any) => (
                      <MenuItem key={customer.id} value={customer.id}>
                        {customer.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  type="date"
                  label="Date"
                  value={invoice.date}
                  onChange={(e) => setInvoice(prev => ({ ...prev, date: e.target.value }))}
                />
              </Grid>
            </Grid>

            <div style={{ marginTop: '20px' }}>
              <Typography variant="h6">Items</Typography>
              {invoice.items.map((item: any, index: number) => (
                <Grid container spacing={2} key={index} style={{ marginBottom: '10px', alignItems: 'center' }}>
                  <Grid item xs={12} md={4}>
                    <FormControl fullWidth>
                      <Select
                        value={item.productId}
                        onChange={(e) => {
                          const product = products?.find((p: any) => p.id === e.target.value);
                          if (product) {
                            handleItemChange(index, 'productId', e.target.value);
                            handleItemChange(index, 'rate', product.rate);
                            handleItemChange(index, 'amount', product.rate * item.quantity);
                          }
                        }}
                      >
                        <MenuItem value="">Select Product</MenuItem>
                        {products?.map((product: any) => (
                          <MenuItem key={product.id} value={product.id}>
                            {product.name} (₹{product.rate})
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={6} md={2}>
                    <TextField
                      type="number"
                      value={item.quantity}
                      onChange={(e) => handleItemChange(index, 'quantity', parseFloat(e.target.value) || 0)}
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={6} md={2}>
                    <TextField
                      type="number"
                      value={item.rate}
                      onChange={(e) => handleItemChange(index, 'rate', parseFloat(e.target.value) || 0)}
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={6} md={2}>
                    <TextField
                      value={item.amount.toFixed(2)}
                      disabled
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={6} md={2}>
                    <IconButton onClick={() => handleRemoveItem(index)} color="error">
                      <DeleteIcon />
                    </IconButton>
                  </Grid>
                </Grid>
              ))}
              <Button startIcon={<AddIcon />} onClick={handleAddItem} variant="outlined" color="primary">
                Add Item
              </Button>
            </div>

            <Grid container spacing={3} style={{ marginTop: '20px' }}>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Tax (%)"
                  type="number"
                  value={invoice.tax}
                  onChange={(e) => setInvoice(prev => ({ ...prev, tax: parseFloat(e.target.value) || 0 }))}
                  onBlur={calculateTotals}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Discount"
                  type="number"
                  value={invoice.discount}
                  onChange={(e) => setInvoice(prev => ({ ...prev, discount: parseFloat(e.target.value) || 0 }))}
                  onBlur={calculateTotals}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Total"
                  value={`₹${invoice.total.toFixed(2)}`}
                  disabled
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Grand Total"
                  value={`₹${invoice.grandTotal.toFixed(2)}`}
                  disabled
                />
              </Grid>
            </Grid>

            <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end' }}>
              <Button type="submit" disabled={!selectedCustomer || invoice.items.some((item: any) => !item.productId)} variant="contained" color="primary">
                {isCreating || isUpdating ? 'Saving...' : 'Save'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default InvoiceForm;
