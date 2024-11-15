
// Invoice items array (dynamic rows)
export interface SaleItem 
{
  id: number;
  item: number;
  item_sale_price: number;
  item_quantity: number;
  item_quantity_type: string;
  invoice_id?: number;
  total: number;
  customItem: boolean; 
}

// Invoice items array (dynamic rows)
export interface ReturnItem extends SaleItem 
{
  name: string;
  debuction: number;  
  deduction_on_return?: number;
}

// Updated Item interface to match Django model
export interface Invoice{
  id?: number;
  customer: number;
  invoiceItems: SaleItem[]
  returnItems: ReturnItem[]
  discount: number; 
  saleItemsTotal: number; 
  returnItemsTotal: number; 
  customerPay: number;
  customerReturn: number;
  invoiceTotal: number;
  last_updated_by: string;
  creation_datetime: string;
}
