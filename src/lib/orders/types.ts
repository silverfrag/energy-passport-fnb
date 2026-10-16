export type FulfillmentMethod = 'pickup' | 'delivery'
export type PaymentStatus = 'pending_quote' | 'awaiting_payment' | 'payment_review' | 'paid'
export type FulfillmentStatus = 'unconfirmed' | 'confirmed' | 'preparing' | 'ready' | 'out_for_delivery' | 'completed' | 'cancelled'

export interface CreateOrderInput {
  idempotencyKey: string
  fulfillment: FulfillmentMethod
  customer: { name: string; phone: string; address?: string }
  note?: string
  items: { productId: string; quantity: number }[]
}

export interface OrderItem {
  productId: string
  slug: string
  name: string
  unitPrice: number
  quantity: number
  lineTotal: number
}

export interface BankAccount {
  bankBin: string
  bankName: string
  accountNumber: string
  accountName: string
}

export interface PaymentSettings extends BankAccount {
  enabled: boolean
  /** null means staff must quote each delivery before payment. Pickup is always zero. */
  deliveryFee: number | null
  version: number
}

export interface Order {
  id: string
  code: string
  fulfillment: FulfillmentMethod
  customer: { name: string; phone: string; address: string | null }
  note: string | null
  items: OrderItem[]
  subtotal: number
  deliveryFee: number | null
  total: number | null
  paymentStatus: PaymentStatus
  fulfillmentStatus: FulfillmentStatus
  version: number
  createdAt: string
  updatedAt: string
  paidAt: string | null
  /** Present only after total is known, before payment/cancellation. Never a proof of payment. */
  payment: (BankAccount & { amount: number; transferContent: string; qrPayload: string }) | null
}

export type AdminOrderAction =
  | { version: number; action: 'quote_delivery'; deliveryFee: number }
  | { version: number; action: 'confirm_payment' }
  | { version: number; action: 'set_fulfillment'; status: FulfillmentStatus }
  | { version: number; action: 'cancel' }

export interface OrderRecord {
  id: string
  code: string
  idempotency_key: string
  request_hash: string
  access_token_hash: string
  fulfillment: FulfillmentMethod
  customer_name: string
  customer_phone: string
  customer_address: string | null
  note: string | null
  items: OrderItem[]
  subtotal: number
  delivery_fee: number | null
  total: number | null
  bank_snapshot: BankAccount
  payment_status: PaymentStatus
  fulfillment_status: FulfillmentStatus
  version: number
  created_at: string
  updated_at: string
  paid_at: string | null
}
