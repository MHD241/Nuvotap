-- NUVOTAP V8. Review and execute in the dedicated NUVOTAP Supabase SQL Editor.
-- Admin account must already exist in public.nuvotap_admins.
GRANT SELECT, UPDATE ON public.nuvotap_orders TO authenticated;
GRANT SELECT ON public.nuvotap_events TO authenticated;
DROP POLICY IF EXISTS "Nuvotap admin reads orders" ON public.nuvotap_orders;
CREATE POLICY "Nuvotap admin reads orders" ON public.nuvotap_orders FOR SELECT TO authenticated USING (EXISTS (SELECT 1 FROM public.nuvotap_admins a WHERE a.user_id = (SELECT auth.uid())));
DROP POLICY IF EXISTS "Nuvotap admin updates orders" ON public.nuvotap_orders;
CREATE POLICY "Nuvotap admin updates orders" ON public.nuvotap_orders FOR UPDATE TO authenticated USING (EXISTS (SELECT 1 FROM public.nuvotap_admins a WHERE a.user_id = (SELECT auth.uid()))) WITH CHECK (EXISTS (SELECT 1 FROM public.nuvotap_admins a WHERE a.user_id = (SELECT auth.uid())));
DROP POLICY IF EXISTS "Nuvotap admin reads events" ON public.nuvotap_events;
CREATE POLICY "Nuvotap admin reads events" ON public.nuvotap_events FOR SELECT TO authenticated USING (EXISTS (SELECT 1 FROM public.nuvotap_admins a WHERE a.user_id = (SELECT auth.uid())));
