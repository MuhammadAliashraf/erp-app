# Implementation Plan: Purchase Order Module

This plan outlines the steps to build the Purchase Order (PO) flow, enabling users to select a supplier and add multiple products to an order.

## 1. Backend Architecture (NestJS)

### Entities
We will create two new entities to represent the one-to-many relationship between an order and its items.

*   **`PurchaseOrder` Entity**:
    *   `id`: Primary Key.
    *   `orderNumber`: Unique string (e.g., PO-2024-001).
    *   `supplierId`: Foreign key linking to the `Supplier` entity.
    *   `orderDate`: Date of the order.
    *   `status`: Enum (`Draft`, `Pending`, `Received`, `Cancelled`).
    *   `totalAmount`: Decimal, auto-calculated sum of items.
    *   `notes`: Optional text.
    *   **Relations**: Many-to-One with `Supplier`, One-to-Many with `PurchaseOrderItem`.

*   **`PurchaseOrderItem` Entity**:
    *   `id`: Primary Key.
    *   `purchaseOrderId`: Foreign key.
    *   `productId`: Foreign key linking to `Product`.
    *   `quantity`: Integer.
    *   `unitPrice`: Decimal (price at the time of purchase).
    *   `totalPrice`: Decimal (quantity * unitPrice).
    *   **Relations**: Many-to-One with `PurchaseOrder`, Many-to-One with `Product`.

### API Module (`PurchaseOrdersModule`)
*   **`PurchaseOrdersController`**:
    *   `POST /purchase-orders`: Create a new PO with items (transactional).
    *   `GET /purchase-orders`: List all POs with Supplier details.
    *   `GET /purchase-orders/:id`: Get full details of a specific PO including items.
    *   `PUT /purchase-orders/:id`: Update status or details.
    *   `DELETE /purchase-orders/:id`: Delete a PO.
*   **`PurchaseOrdersService`**:
    *   Handle the logic of saving the header and iterating through the items list to save them.

## 2. Frontend Integration (React)

### Services
*   **`purchase-order-service.js`**: Methods to interact with the new backend endpoints.

### Components
*   **`PurchaseOrderList`**:
    *   Table displaying POs (Date, Supplier, Status, Total).
    *   Badges for status (e.g., Yellow for Pending, Green for Received).

*   **`PurchaseOrderForm` (Complex Component)**:
    *   **Step 1: Header Details**:
        *   Select `Supplier` (Dropdown populated from `SupplierService`).
        *   Date Picker.
        *   Status Selector.
    *   **Step 2: Order Items (Dynamic List)**:
        *   "Add Item" button to append a new row.
        *   **Product Select**: Dropdown populated from `ProductService`.
        *   **Quantity Input**: Numeric field.
        *   **Unit Price Input**: Pre-filled from Product but editable.
        *   **Line Total**: Auto-calculated (Qty * Price).
    *   **Step 3: Summary**:
        *   Live calculation of Grand Total.

### Navigation
*   Add **"Purchase Orders"** link to the Sidebar (Icon: `ClipboardList` or `ShoppingCart`).
*   Add Route `/purchase-orders`.
