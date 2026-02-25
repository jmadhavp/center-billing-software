
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from 'react-query';
import { getProducts, createProduct, updateProduct } from '../../services/api';
import { Card, CardContent, CardHeader, TextField, Button } from '@mui/material';

const ProductForm = () => {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const isEdit = !!id;

  const { data: products } = useQuery('products', getProducts);
  const [createProductMutation, { isLoading: isCreating }] = useMutation(createProduct);
  const [updateProductMutation, { isLoading: isUpdating }] = useMutation(updateProduct);

  const [product, setProduct] = useState({
    id: '',
    name: '',
    description: '',
    rate: 0,
    stock: 0,
  });

  useEffect(() => {
    if (isEdit && products) {
      const existingProduct = products.find((p: any) => p.id === id);
      if (existingProduct) {
        setProduct(existingProduct);
      }
    }
  }, [isEdit, id, products]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isEdit) {
        await updateProductMutation(id, product);
      } else {
        await createProductMutation(product);
      }
      navigate('/products');
    } catch (error) {
      console.error('Error saving product:', error);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <Typography variant="h4">{isEdit ? 'Edit Product' : 'Create Product'}</Typography>
        <Button component={Link} to="/products" variant="contained">Back</Button>
      </div>
      <Card>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Name"
              value={product.name}
              onChange={(e) => setProduct(prev => ({ ...prev, name: e.target.value }))}
              style={{ marginBottom: '20px' }}
            />
            <TextField
              fullWidth
              label="Description"
              value={product.description}
              onChange={(e) => setProduct(prev => ({ ...prev, description: e.target.value }))}
              style={{ marginBottom: '20px' }}
            />
            <TextField
              fullWidth
              label="Rate"
              type="number"
              value={product.rate}
              onChange={(e) => setProduct(prev => ({ ...prev, rate: parseFloat(e.target.value) || 0 }))}
              style={{ marginBottom: '20px' }}
            />
            <TextField
              fullWidth
              label="Stock"
              type="number"
              value={product.stock}
              onChange={(e) => setProduct(prev => ({ ...prev, stock: parseInt(e.target.value) || 0 }))}
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

export default ProductForm;
