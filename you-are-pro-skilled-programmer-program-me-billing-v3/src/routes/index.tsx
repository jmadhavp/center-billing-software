
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Dashboard from '../features/dashboard/Dashboard';
import Invoices from '../features/invoices/Invoices';
import InvoiceForm from '../features/invoices/InvoiceForm';
import Products from '../features/products/Products';
import ProductForm from '../features/products/ProductForm';
import Customers from '../features/customers/Customers';
import CustomerForm from '../features/customers/CustomerForm';
import Reports from '../features/reports/Reports';
import Settings from '../features/settings/Settings';

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<Dashboard />} />
    <Route path="/invoices" element={<Invoices />} />
    <Route path="/invoices/new" element={<InvoiceForm />} />
    <Route path="/invoices/:id/edit" element={<InvoiceForm />} />
    <Route path="/products" element={<Products />} />
    <Route path="/products/new" element={<ProductForm />} />
    <Route path="/products/:id/edit" element={<ProductForm />} />
    <Route path="/customers" element={<Customers />} />
    <Route path="/customers/new" element={<CustomerForm />} />
    <Route path="/customers/:id/edit" element={<CustomerForm />} />
    <Route path="/reports" element={<Reports />} />
    <Route path="/settings" element={<Settings />} />
  </Routes>
);

export default AppRoutes;
