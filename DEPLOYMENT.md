# Vercel Deployment Guide 🚀

Follow these steps to deploy **CashFlow OS** to Vercel with a production database.

## 1. Database (Supabase)
1. Your project reference is: `rusoqiooaucnbmhpnuam`
2. Go to **Project Settings > Database**.
3. Use the following URLs in your `.env` (using your real password):
   - `DATABASE_URL`: `postgresql://postgres:[YOUR-PASSWORD]@db.rusoqiooaucnbmhpnuam.supabase.co:5432/postgres?pgbouncer=true`
   - `DIRECT_URL`: `postgresql://postgres:[YOUR-PASSWORD]@db.rusoqiooaucnbmhpnuam.supabase.co:5432/postgres`

## 2. Telegram Bot Webhook
To receive messages in real-time, you must set the webhook URL:
```bash
curl "https://api.telegram.org/bot[YOUR_BOT_TOKEN]/setWebhook?url=https://your-domain.vercel.app/api/telegram/webhook"
```

## 3. Vercel Setup
1. Push your code to a GitHub repository.
2. Import the project into [Vercel](https://vercel.com).
3. Add the following **Environment Variables**:
   - `DATABASE_URL`
   - `DIRECT_URL`
   - `NEXTAUTH_SECRET`
   - `NEXTAUTH_URL` (Set to your domain)
   - `GOOGLE_CLIENT_ID`
   - `GOOGLE_CLIENT_SECRET`
   - `TELEGRAM_BOT_TOKEN`
   - `OPENAI_API_KEY`

## 4. Build Commands
Vercel will automatically run:
- `npm run build` (which includes `prisma generate`)

## 5. Deployment
- Hit **Deploy**.
- Once live, verify your Telegram Bot by sending it a message.

## 💡 Troubleshooting
- **Database Connection**: Ensure you are using the pgbouncer connection for `DATABASE_URL` if using Supabase on Vercel.
- **Webhook Status**: Check your bot's webhook status using `https://api.telegram.org/bot[YOUR_BOT_TOKEN]/getWebhookInfo`.
