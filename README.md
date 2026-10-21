# Amma's Kitchen

Mobile-first monthly tiffin-service web app for Hyderabad, built with React, TypeScript, Vite, Tailwind CSS, and Supabase JS.

## Start locally

1. Install Node.js 20 or later.
2. In this folder, run `npm install`.
3. Run `npm run dev` and open the local URL Vite prints.
4. Run `npm run build` to create the production bundle.

## Supabase setup

1. Create a Supabase project and enable Phone auth / SMS OTP in Authentication settings.
2. Copy `.env.example` to `.env.local`, then set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.
3. Run `supabase/schema.sql` in the Supabase SQL editor.
4. Configure carefully reviewed RLS policies for customer subscriptions, bulk enquiries, menus, prices, and delivery pauses before allowing production writes. Keep the service-role key server-side; never put it in Vite variables.

Without credentials, the app runs in demo mode. Subscribe forms show confirmation locally; OTP explains that Supabase credentials are needed. Admin records are sample preview data, and price edits only persist for the current browser session.

## Current scope and production checklist

- Implemented: responsive home, package cards with Veg/Non-Veg pricing, all Ultra schedules, weekly menu, subscribe form and price summary, customer calendar pause/skip interaction, party/bulk enquiry UI, click-to-call and WhatsApp contact links, language toggle UI, admin preview tabs/price editing/area filtering, UPI placeholder, Supabase subscription insert and phone OTP request integration.
- Before launch: add real Supabase RLS policies and data-loading/mutations for customer dashboard and admin; verify admin roles server-side; implement OTP verification and session-based customer accounts; connect bulk enquiry, menu, price, pauses, delivery completion to secure policies/RPCs; add server-side payment provider integration if taking payments; complete Telugu translations; verify food service area and menu details. Never trust client-side price values for payment.

The demo customer/admin data and menu are illustrative. Replace with confirmed operating details before publication.
