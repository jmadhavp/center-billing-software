
import React, { useState } from 'react';
import { useQuery, useMutation } from 'react-query';
import { getCustomers, deleteCustomer } from '../../services/api';
import { Card, CardContent, CardHeader, Button, Table, TableBody, TableCell, TableHead, TableRow, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { Link } from 'react-router-dom';

const Customers = () => {
  const { data: customers } = useQuery('customers', getCustomers);
  const [deleteCustomerMutation] = useMutation(deleteCustomer);

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure?')) {
      await deleteCustomerMutation(id);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <Typography variant="h4">Customers</Typography>
        <Button component={Link} to="/customers/new" variant="contained">New Customer</Button>
      </div>
      <Card>
        <CardContent>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Phone</TableCell>
                <TableCell>Address</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {customers?.map((customer: any) => (
                <TableRow key={customer.id}>
                  <TableCell>{customer.id}</TableCell>
                  <TableCell>{customer.name}</TableCell>
                  <TableCell>{customer.email}</TableCell>
                  <TableCell>{customer.phone}</TableCell>
                  <TableCell>{customer.address}</TableCell>
                  <TableCell>
                    <IconButton component={Link} to={`/customers/${customer.id}/edit`} size="small"><EditIcon /></IconButton>
                    <IconButton onClick={() => handleDelete(customer.id)} size="small"><DeleteIcon /></IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default Customers;
