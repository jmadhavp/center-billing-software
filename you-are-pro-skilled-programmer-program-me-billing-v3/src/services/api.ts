
const API_BASE = 'http://localhost:5000/api';

const api = {
  async get(endpoint: string) {
    const response = await fetch(`${API_BASE}/${endpoint}`);
    return response.json();
  },

  async post(endpoint: string, data: any) {
    const response = await fetch(`${API_BASE}/${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return response.json();
  },

  async put(endpoint: string, id: string, data: any) {
    const response = await fetch(`${API_BASE}/${endpoint}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return response.json();
  },

  async delete(endpoint: string, id: string) {
    const response = await fetch(`${API_BASE}/${endpoint}/${id}`, {
      method: 'DELETE',
    });
    return response.ok;
  },
};

export const getInvoices = () => api.get('invoices');
export const createInvoice = (invoice: any) => api.post('invoices', invoice);
export const updateInvoice = (id: string, invoice: any) => api.put('invoices', id, invoice);
export const deleteInvoice = (id: string) => api.delete('invoices', id);

export const getProducts = () => api.get('products');
export const createProduct = (product: any) => api.post('products', product);
export const updateProduct = (id: string, product: any) => api.put('products', id, product);
export const deleteProduct = (id: string) => api.delete('products', id);

export const getCustomers = () => api.get('customers');
export const createCustomer = (customer: any) => api.post('customers', customer);
export const updateCustomer = (id: string, customer: any) => api.put('customers', id, customer);
export const deleteCustomer = (id: string) => api.delete('customers', id);
