
// Updated Item interface to match Django model
export interface Item {
  id?: number;
  item_name: string;
  description: string;
  category: string;
  item_prize: number;
  item_sale_prize: number;
  item_quantity: number;
  quantity_type: string;
  last_update?: string;
  last_updated_by?: string;
  deduction_on_return?: number;
  is_active: boolean;
}


export interface Customer {
  id?: number;
  customer_name: string;  // Matches `customer_name` in the Django model
  customer_address: string;  // Matches `customer_address`
  mobile_number: string;  // Matches `mobile_number`, we'll use string for flexibility
  balance: number; // Matches `balance`
  last_updated_by: string;  // Assuming this will be populated dynamically
  lastBought: string;  // Assuming this will be populated dynamically
  creation_datetime?: string;
}
