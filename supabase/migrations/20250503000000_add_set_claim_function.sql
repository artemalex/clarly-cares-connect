
-- Create a function to set a claim in the current database session
CREATE OR REPLACE FUNCTION public.set_claim(uid TEXT, claim TEXT, value JSONB)
RETURNS VOID LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  -- Set a claim in the current session
  PERFORM set_config('app.current_' || claim, value::TEXT, false);
END;
$$;
