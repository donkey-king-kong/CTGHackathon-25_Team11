-- Fix critical security vulnerability: Restrict donations table access to authenticated users only
-- Currently the donations_select_all policy allows public access with "true" expression
-- This exposes sensitive donor information (names, IDs, amounts) to unauthorized users

-- Drop the existing overly permissive policy
DROP POLICY IF EXISTS donations_select_all ON public.donations;

-- Create a new restrictive policy that requires authentication
CREATE POLICY "donations_select_authenticated" 
ON public.donations 
FOR SELECT 
USING (auth.uid() IS NOT NULL);

-- Add comment explaining the security requirement
COMMENT ON POLICY "donations_select_authenticated" ON public.donations IS 
'Restricts donation data access to authenticated users only to protect donor privacy and prevent unauthorized access to sensitive financial information';