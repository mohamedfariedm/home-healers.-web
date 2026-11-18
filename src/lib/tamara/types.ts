/** GET client/payment/tamara/config */
export type TamaraConfig = {
  enabled: boolean;
  currency: string;
  country_code: string;
  payment_type?: string | null;
  instalments?: number | null;
  test_mode: boolean;
};

/** POST client/payment/tamara/pay */
export type TamaraPayData = {
  attempt_id?: number | null;
  payment_provider?: string | null;
  checkout_url: string;
  tamara_order_id?: string | null;
  amount?: number | null;
  currency?: string | null;
  expires_at?: string | null;
  payment_status?: string | null;
  error?: string | null;
  message?: string | null;
};

/** POST client/payment/tamara/verify */
export type TamaraVerifyData = {
  attempt_id?: number | null;
  payment_provider?: string | null;
  payment_status: string;
  final?: boolean;
  reservation_id?: string | number | null;
  needs_review?: boolean;
  message?: string | null;
  error?: string | null;
};

export type TamaraPaymentStatus =
  | "created"
  | "approved"
  | "paid"
  | "failed"
  | "cancelled"
  | "expired";
