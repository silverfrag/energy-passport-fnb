-- Fame Drink online ordering. Apply via Supabase SQL Editor / migrations.
-- No customer-facing Supabase client may read or write these tables.
-- Only server API uses SUPABASE_SERVICE_ROLE_KEY; never put that key in NEXT_PUBLIC_*.
BEGIN;

CREATE TABLE IF NOT EXISTS public.online_payment_settings (
  id text PRIMARY KEY CHECK (id = 'primary'),
  enabled boolean NOT NULL DEFAULT false,
  bank_bin text NOT NULL DEFAULT '',
  bank_name text NOT NULL DEFAULT '',
  account_number text NOT NULL DEFAULT '',
  account_name text NOT NULL DEFAULT '',
  delivery_fee integer DEFAULT 0 CHECK (delivery_fee BETWEEN 0 AND 1000000),
  version integer NOT NULL DEFAULT 1 CHECK (version > 0),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CHECK (NOT enabled OR (bank_bin ~ '^[0-9]{6}$' AND account_number ~ '^[0-9]{6,19}$' AND length(trim(bank_name)) > 0 AND length(trim(account_name)) > 0))
);
INSERT INTO public.online_payment_settings (id) VALUES ('primary') ON CONFLICT DO NOTHING;

CREATE TABLE IF NOT EXISTS public.online_orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text NOT NULL UNIQUE CHECK (code ~ '^FD[A-F0-9]{12}$'),
  idempotency_key uuid NOT NULL UNIQUE,
  request_hash text NOT NULL CHECK (request_hash ~ '^[a-f0-9]{64}$'),
  access_token_hash text NOT NULL CHECK (access_token_hash ~ '^[a-f0-9]{64}$'),
  fulfillment text NOT NULL CHECK (fulfillment IN ('pickup', 'delivery')),
  customer_name text NOT NULL CHECK (length(customer_name) BETWEEN 1 AND 100),
  customer_phone text NOT NULL CHECK (customer_phone ~ '^0[35789][0-9]{8}$'),
  customer_address text CHECK (length(customer_address) BETWEEN 8 AND 400),
  note text CHECK (length(note) <= 500),
  items jsonb NOT NULL CHECK (jsonb_typeof(items) = 'array' AND jsonb_array_length(items) BETWEEN 1 AND 20),
  subtotal integer NOT NULL CHECK (subtotal > 0 AND subtotal <= 10000000),
  delivery_fee integer CHECK (delivery_fee BETWEEN 0 AND 1000000),
  total integer CHECK (total > 0 AND total <= 10000000),
  bank_snapshot jsonb NOT NULL CHECK (jsonb_typeof(bank_snapshot) = 'object'),
  payment_status text NOT NULL CHECK (payment_status IN ('pending_quote', 'awaiting_payment', 'payment_review', 'paid')),
  fulfillment_status text NOT NULL DEFAULT 'unconfirmed' CHECK (fulfillment_status IN ('unconfirmed', 'confirmed', 'preparing', 'ready', 'out_for_delivery', 'completed', 'cancelled')),
  version integer NOT NULL DEFAULT 1 CHECK (version > 0),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  paid_at timestamptz,
  CHECK ((delivery_fee IS NULL AND total IS NULL AND payment_status = 'pending_quote') OR (delivery_fee IS NOT NULL AND total IS NOT NULL AND total = subtotal + delivery_fee AND payment_status <> 'pending_quote')),
  CHECK (fulfillment <> 'pickup' OR (delivery_fee = 0 AND customer_address IS NULL)),
  CHECK (fulfillment <> 'delivery' OR customer_address IS NOT NULL),
  CHECK ((payment_status = 'paid') = (paid_at IS NOT NULL)),
  CHECK (fulfillment_status IN ('unconfirmed', 'cancelled') OR payment_status = 'paid')
);
CREATE INDEX IF NOT EXISTS online_orders_created ON public.online_orders (created_at DESC, id DESC);

CREATE TABLE IF NOT EXISTS public.online_order_events (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  order_id uuid NOT NULL REFERENCES public.online_orders(id) ON DELETE CASCADE,
  version integer NOT NULL,
  payment_status text NOT NULL,
  fulfillment_status text NOT NULL,
  total integer,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (order_id, version)
);

CREATE OR REPLACE FUNCTION public.fd_log_order_event() RETURNS trigger
LANGUAGE plpgsql SET search_path = public AS $$
BEGIN
  INSERT INTO public.online_order_events (order_id, version, payment_status, fulfillment_status, total)
  VALUES (NEW.id, NEW.version, NEW.payment_status, NEW.fulfillment_status, NEW.total);
  RETURN NEW;
END;
$$;
DROP TRIGGER IF EXISTS fd_order_event ON public.online_orders;
CREATE TRIGGER fd_order_event AFTER INSERT OR UPDATE ON public.online_orders FOR EACH ROW EXECUTE FUNCTION public.fd_log_order_event();

CREATE TABLE IF NOT EXISTS public.online_rate_limits (
  key text PRIMARY KEY,
  count integer NOT NULL,
  window_start timestamptz NOT NULL,
  expires_at timestamptz NOT NULL
);
CREATE INDEX IF NOT EXISTS online_rate_limits_expiry ON public.online_rate_limits (expires_at);

CREATE OR REPLACE FUNCTION public.fd_consume_rate_limit(p_key text, p_limit integer, p_seconds integer) RETURNS boolean
LANGUAGE plpgsql SET search_path = public AS $$
DECLARE v_count integer; v_now timestamptz := clock_timestamp();
BEGIN
  IF p_limit < 1 OR p_limit > 1000 OR p_seconds < 1 OR p_seconds > 86400 OR p_key !~ '^[a-f0-9]{64}$' THEN
    RAISE EXCEPTION 'Invalid rate limit parameters';
  END IF;
  INSERT INTO public.online_rate_limits (key, count, window_start, expires_at)
  VALUES (p_key, 1, v_now, v_now + make_interval(secs => p_seconds))
  ON CONFLICT (key) DO UPDATE SET
    count = CASE WHEN online_rate_limits.expires_at <= v_now THEN 1 ELSE least(online_rate_limits.count + 1, p_limit + 1) END,
    window_start = CASE WHEN online_rate_limits.expires_at <= v_now THEN v_now ELSE online_rate_limits.window_start END,
    expires_at = CASE WHEN online_rate_limits.expires_at <= v_now THEN v_now + make_interval(secs => p_seconds) ELSE online_rate_limits.expires_at END
  RETURNING count INTO v_count;
  -- Opportunistic bounded cleanup, so no customer/IP hashes accumulate indefinitely.
  DELETE FROM public.online_rate_limits WHERE key IN (
    SELECT key FROM public.online_rate_limits WHERE expires_at < v_now - interval '1 day' LIMIT 100
  );
  RETURN v_count <= p_limit;
END;
$$;

ALTER TABLE public.online_payment_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.online_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.online_order_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.online_rate_limits ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.online_payment_settings, public.online_orders, public.online_order_events, public.online_rate_limits FROM anon, authenticated;
REVOKE ALL ON public.online_payment_settings, public.online_orders, public.online_order_events, public.online_rate_limits FROM service_role;
GRANT SELECT, UPDATE ON public.online_payment_settings TO service_role;
GRANT SELECT, INSERT, UPDATE ON public.online_orders TO service_role;
GRANT SELECT, INSERT ON public.online_order_events TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.online_rate_limits TO service_role;
GRANT USAGE, SELECT ON SEQUENCE public.online_order_events_id_seq TO service_role;
REVOKE ALL ON FUNCTION public.fd_consume_rate_limit(text, integer, integer) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.fd_consume_rate_limit(text, integer, integer) TO service_role;
REVOKE ALL ON FUNCTION public.fd_log_order_event() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.fd_log_order_event() TO service_role;

COMMIT;
