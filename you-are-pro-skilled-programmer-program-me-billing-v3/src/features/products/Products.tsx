
import React, { useState } from 'react';
import { useQuery, useMutation } from 'react-query';
import { getProducts, deleteProduct } from '../../services/api';
import { Card, CardContent, CardHeader, Button, Table, TableBody, TableCell, TableHead, TableRow, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { Link } from 'react-router-dom';

const Products = () => {
  const { data: products } = useQuery('products', getProducts);
  const [deleteProductMutation] = useMutation(deleteProduct);

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure?')) {
      await deleteProductMutation(id);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <Typography variant="h4">Products</Typography>
        <Button component={Link} to="/products/new" variant="contained">New Product</Button>
      </div>
      <Card>
        <CardContent>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Rate</TableCell>
                <TableCell>Stock</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {products?.map((product: any) => (
                <TableRow key={product.id}>
                  <TableCell>{product.id}</TableCell>
                  <TableCell>{product.name}</TableCell>
                  <TableCell>{product.description}</TableCell>
                  <TableCell>₹{product.rate.toFixed(2)}</TableCell>
                  <TableCell>{product.stock}</TableCell>
                  <TableCell>
                    <IconButton component={Link} to={`/products/${product.id}/edit`} size="small"><EditIcon /></IconButton>
                    <IconButton onClick={() => handleDelete(product.id)} size="small"><DeleteIcon /></IconButton>
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

export default Products;
