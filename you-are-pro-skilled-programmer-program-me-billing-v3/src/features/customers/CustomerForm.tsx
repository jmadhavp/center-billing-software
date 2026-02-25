
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from 'react-query';
import { getCustomers, createCustomer, updateCustomer } from '../../services/api';
import { Card, CardContent, CardHeader, TextField, Button } from '@mui/material';

const CustomerForm = () => {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const isEdit = !!id;

  const { data: customers } = useQuery('customers', getCustomers);
  const [createCustomerMutation, { isLoading: isCreating }] = useMutation(createCustomer);
  const [updateCustomerMutation, { isLoading: isUpdating }] = useMutation(updateCustomer);

  const [customer, setCustomer] = useState({
    id: '',
    name: '',
    email: '',
    phone: '',
    address: '',
  });

  useEffect(() => {
    if (isEdit && customers) {
      const existingCustomer = customers.find((c: any) => c.id === id);
      if (existingCustomer) {
        setCustomer(existingCustomer);
      }
    }
  }, [isEdit, id, customers]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isEdit) {
        await updateCustomerMutation(id, customer);
      } else {
        await createCustomerMutation(customer);
      }
      navigate('/customers');
    } catch (error) {
      console.error('Error saving customer:', error);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <Typography variant="h4">{isEdit ? 'Edit Customer' : 'Create Customer'}</Typography>
        <Button component={Link} to="/customers" variant="contained">Back</Button>
      </div>
      <Card>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Name"
              value={customer.name}
              onChange={(e) => setCustomer(prev => ({ ...prev, name: e.target.value }))}
              style={{ marginBottom: '20px' }}
            />
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={customer.email}
              onChange={(e) => setCustomer(prev => ({ ...prev, email: e.target.value }))}
              style={{ marginBottom: '20px' }}
            />
            <TextField
              fullWidth
              label="Phone"
              value={customer.phone}
              onChange={(e) => setCustomer(prev => ({ ...prev, phone: e.target.value }))}
              style={{ marginBottom: '20px' }}
            />
            <TextField
              fullWidth
              label="Address"
              value={customer.address}
              onChange={(e) => setCustomer(prev => ({ ...prev, address: e.target.value }))}
              style={{ marginBottom: '20px' }}
            />
            <Button type="submit" disabled={isCreating || isUpdating} variant="contained" color="primary">
              {isCreating || isUpdating ? 'Saving...' : 'Save'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CustomerForm;
