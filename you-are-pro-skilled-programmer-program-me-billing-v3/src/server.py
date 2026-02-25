from flask import Flask, jsonify, request, send_from_directory
import json
import os

# Project root (one level above src)
BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))

# Data folder at project root
DATA_DIR = os.path.join(BASE_DIR, 'data')
os.makedirs(DATA_DIR, exist_ok=True)

# Serve static files from project root
app = Flask(__name__, static_folder=BASE_DIR)


def get_data(filename):
    filepath = os.path.join(DATA_DIR, filename)
    if os.path.exists(filepath):
        with open(filepath, 'r', encoding='utf-8') as f:
            return json.load(f)
    return []


def save_data(filename, data):
    filepath = os.path.join(DATA_DIR, filename)
    with open(filepath, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2)


# -------------------------
# Frontend
# -------------------------

@app.route('/')
def index():
    return send_from_directory(BASE_DIR, 'index.html')


@app.route('/<path:path>')
def static_files(path):
    return send_from_directory(BASE_DIR, path)


# -------------------------
# API
# -------------------------

@app.route('/api/invoices', methods=['GET', 'POST'])
def invoices():
    if request.method == 'GET':
        return jsonify(get_data('invoices.json'))

    invoices = get_data('invoices.json')
    invoice = request.json
    invoice['id'] = str(len(invoices) + 1)
    invoices.append(invoice)
    save_data('invoices.json', invoices)
    return jsonify(invoice), 201


@app.route('/api/invoices/<id>', methods=['PUT', 'DELETE'])
def invoice(id):
    invoices = get_data('invoices.json')

    if request.method == 'PUT':
        for i, inv in enumerate(invoices):
            if inv['id'] == id:
                invoices[i] = request.json
                save_data('invoices.json', invoices)
                return jsonify(invoices[i])
        return '', 404

    new_invoices = [inv for inv in invoices if inv['id'] != id]
    save_data('invoices.json', new_invoices)
    return '', 204


@app.route('/api/products', methods=['GET', 'POST'])
def products():
    if request.method == 'GET':
        return jsonify(get_data('products.json'))

    products = get_data('products.json')
    product = request.json
    product['id'] = str(len(products) + 1)
    products.append(product)
    save_data('products.json', products)
    return jsonify(product), 201


@app.route('/api/products/<id>', methods=['PUT', 'DELETE'])
def product(id):
    products = get_data('products.json')

    if request.method == 'PUT':
        for i, prod in enumerate(products):
            if prod['id'] == id:
                products[i] = request.json
                save_data('products.json', products)
                return jsonify(products[i])
        return '', 404

    new_products = [prod for prod in products if prod['id'] != id]
    save_data('products.json', new_products)
    return '', 204


@app.route('/api/customers', methods=['GET', 'POST'])
def customers():
    if request.method == 'GET':
        return jsonify(get_data('customers.json'))

    customers = get_data('customers.json')
    customer = request.json
    customer['id'] = str(len(customers) + 1)
    customers.append(customer)
    save_data('customers.json', customers)
    return jsonify(customer), 201


@app.route('/api/customers/<id>', methods=['PUT', 'DELETE'])
def customer(id):
    customers = get_data('customers.json')

    if request.method == 'PUT':
        for i, cust in enumerate(customers):
            if cust['id'] == id:
                customers[i] = request.json
                save_data('customers.json', customers)
                return jsonify(customers[i])
        return '', 404

    new_customers = [cust for cust in customers if cust['id'] != id]
    save_data('customers.json', new_customers)
    return '', 204


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)