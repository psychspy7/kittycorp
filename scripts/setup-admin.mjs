import { createClient } from "@supabase/supabase-js";

// One-time local setup only. Secrets come from ignored environment variables.
for (const key of [
  "SUPABASE_URL",
  "SUPABASE_SECRET_KEY",
  "ADMIN_EMAIL",
  "ADMIN_PASSWORD",
]) {
  if (!process.env[key]) throw new Error(`Missing ${key}. See README.md.`);
}
const client = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SECRET_KEY,
  {
    auth: { persistSession: false, autoRefreshToken: false },
  },
);
const { data, error } = await client.auth.admin.createUser({
  email: process.env.ADMIN_EMAIL,
  password: process.env.ADMIN_PASSWORD,
  email_confirm: true,
  app_metadata: { kitty_website_admin: true },
});
if (error) throw new Error(error.message);
console.log(`Admin created. Set ADMIN_USER_ID=${data.user.id}`);
console.log(
  "Add this user ID to kitty_website_private.admins using the SQL in README.md.",
);
