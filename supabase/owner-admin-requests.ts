// Tempel blok ini di Edge Function `owner-admin`, tepat SEBELUM baris:
//   return json({ error: "Aksi tidak dikenal." }, 400);
// lalu deploy ulang fungsinya.

    if (action === "requests") {
      // Pengajuan upgrade dari aplikasi POS (billing.audit_log, action = 'upgrade_requested').
      // "handled" = sudah ada plan_changed ke paket yang diminta setelah pengajuan.
      const requests = await sql`
        select a.id::text id, a.created_at, a.store_id::text store_id,
          a.details->>'plan' plan, a.details->>'interval' billing_interval, a.details->>'from' from_plan,
          s.name store_name, s.code store_code,
          u.id::text owner_id, u.name owner_name, u.email, u.phone,
          sub.plan_code cur_plan, sub.status sub_status, sub.current_period_end, sub.trial_ends_at,
          pr.currency, pr.amount_minor::text amount_minor,
          exists (select 1 from billing.audit_log b
                   where b.store_id = a.store_id and b.action = 'plan_changed'
                     and b.created_at > a.created_at and b.details->>'to' = a.details->>'plan') handled
        from billing.audit_log a
        join pos.stores s on s.id = a.store_id
        left join pos.t_users u on u.id = s.owner_id
        left join lateral (select * from billing.subscriptions x where x.store_id = s.id order by x.created_at desc limit 1) sub on true
        left join lateral (select * from billing.prices p where p.plan_code = a.details->>'plan' and p."interval" = a.details->>'interval' and p.is_active limit 1) pr on true
        where a.action = 'upgrade_requested'
        order by a.created_at desc limit 50`;
      return json({ requests });
    }
