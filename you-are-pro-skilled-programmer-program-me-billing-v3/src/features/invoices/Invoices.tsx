
import React, { useState } from 'react';
import { useQuery, useMutation } from 'react-query';
import { getInvoices, deleteInvoice } from '../../services/api';
import { Card, CardContent, CardHeader, Button, Table, TableBody, TableHead, TableRow, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { Link } from 'react-router-dom';

const Invoices = () => {
  const { data: invoices } = useQuery('invoices', getInvoices);
  const [deleteInvoiceMutation] = useMutation(deleteInvoice);

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure?')) {
      await deleteInvoiceMutation(id);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <Typography variant="h4">Invoices</Typography>
        <Button component={Link} to="/invoices/new" variant="contained">New Invoice</Button>
      </div>
      <Card>
        <CardContent>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Customer</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Total</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {invoices?.map((invoice: any) => (
                <TableRow key={invoice.id}>
                  <TableCell>{invoice.id}</TableCell>
                  <TableCell>{invoice.customer.name}</TableCell>
                  <TableCell>{invoice.date}</TableCell>
                  <TableCell>₹{invoice.total.toFixed(2)}</TableCell>
                  <TableCell>
                    <IconButton component={Link} to={`/invoices/${invoice.id}/edit`} size="small"><EditIcon /></IconButton>
                    <IconButton onClick={() => handleDelete(invoice.id)} size="small"><DeleteIcon /></IconButton>
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

export default Invoices;
