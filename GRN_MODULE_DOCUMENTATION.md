# Goods Receiving Note (GRN) Module Documentation

## Overview
The GRN module manages the receipt of goods from suppliers based on approved Purchase Orders. It ensures that inventory levels are updated accurately upon the arrival of items.

## Workflow
1. **Selection**: User selects an existing Purchase Order (PO) to receive items against.
2. **Review & Adjustment**: The system fetches items from the PO. The user can review and adjust quantities (e.g., if a partial delivery was made) or prices (if they differ from the PO).
3. **Posting**: Upon submission (posting) of the GRN:
    - A GRN record is created.
    - Inventory levels for the received products are incremented.
    - The Purchase Order status may be updated (e.g., to 'Received').

## Database Schema

### Entity: Grn
| Column | Type | Description |
|--------|------|-------------|
| id | UUID/Integer | Primary Key |
| purchaseOrderId | Foreign Key | Reference to the Purchase Order |
| supplierId | Foreign Key | Reference to the Supplier (for ease of querying) |
| grnNumber | String | Unique reference number (e.g., GRN-2023-001) |
| receivedDate | Date | Date goods were received |
| notes | Text | Optional comments |
| status | Enum | 'Draft', 'Posted' |

### Entity: GrnItem
| Column | Type | Description |
|--------|------|-------------|
| id | UUID/Integer | Primary Key |
| grnId | Foreign Key | Reference to the GRN |
| productId | Foreign Key | Reference to the Product |
| receivedQuantity | Integer/Float | Quantity actually received |
| unitPrice | Decimal | Price per unit (allows update from PO) |
| totalPrice | Decimal | `receivedQuantity * unitPrice` |

## Backend Architecture (NestJS)

### Module: `GrnModule`

### Controller: `GrnController`
- `POST /grn`: Create a new GRN.
- `GET /grn`: List all GRNs.
- `GET /grn/:id`: Get details of a specific GRN.

### Service: `GrnService`
- `createGrn(createGrnDto)`:
    - Transactional operation.
    - Validate PO exists.
    - Create `Grn` entity.
    - For each item:
        - Create `GrnItem` entity.
        - **Inventory Update**: Find `Product` and increment `stockQuantity`.
    - Update `PurchaseOrder` status to `Received`.

## Frontend Architecture (React)

### Components
- `GrnList`: Table displaying past GRNs.
- `GrnCreate`:
    - **PO Selection**: Dropdown/Autocomplete to search for 'Pending' POs.
    - **Item Table**: Pre-filled with PO items. Editable 'Received Qty' and 'Price' columns.
    - **Submit Button**: Triggers the API.

### Service: `grn-service.js`
- `createGrn(data)`
- `getAllGrns()`
- `getGrnById(id)`

## Integration Points
- **Purchase Order Module**: Source of expectation data.
- **Inventory (Product) Module**: Destination of stock updates.
