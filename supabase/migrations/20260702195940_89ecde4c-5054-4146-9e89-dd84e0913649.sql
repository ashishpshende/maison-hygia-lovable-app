
REVOKE ALL ON FUNCTION public.has_paid_order(uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.has_paid_order(uuid) TO authenticated, service_role;
