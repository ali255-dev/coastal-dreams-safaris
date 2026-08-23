import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";

export const MEMBER_DISCOUNT_PERCENT = 10;

export type MembershipStatus = {
  isMember: boolean;
  joinedAt: string | null;
  tier: string | null;
  paidTrips: number;
  /** discount that will be applied to the next booking */
  discountPercent: number;
  loading: boolean;
};

export function useMembership(): MembershipStatus {
  const { user } = useAuth();
  const [state, setState] = useState<MembershipStatus>({
    isMember: false, joinedAt: null, tier: null, paidTrips: 0, discountPercent: 0, loading: true,
  });

  useEffect(() => {
    if (!user) {
      setState({ isMember: false, joinedAt: null, tier: null, paidTrips: 0, discountPercent: 0, loading: false });
      return;
    }
    let cancelled = false;
    (async () => {
      const [{ data: m }, { count }] = await Promise.all([
        supabase.from("memberships").select("tier,active,joined_at").eq("user_id", user.id).maybeSingle(),
        supabase.from("bookings").select("*", { count: "exact", head: true }).eq("payment_status", "paid"),
      ]);
      if (cancelled) return;
      const isMember = !!m?.active;
      const paidTrips = count ?? 0;
      setState({
        isMember,
        tier: m?.tier ?? null,
        joinedAt: m?.joined_at ?? null,
        paidTrips,
        discountPercent: isMember && paidTrips > 0 ? MEMBER_DISCOUNT_PERCENT : 0,
        loading: false,
      });
    })();
    return () => { cancelled = true; };
  }, [user]);

  return state;
}
