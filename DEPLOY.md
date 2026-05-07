# DigitalOcean Droplet Deployment Guide

Migrating **catherineulanovski.com** from Render to a DigitalOcean Droplet.

**Stack:** React (static build) + Express.js (Node 20, ES Modules) + PostgreSQL 15 + AWS S3 + PayPal

---

## Table of Contents

1. [Create the Droplet](#1-create-the-droplet)
2. [Initial Server Setup](#2-initial-server-setup)
3. [Migrate the Database from Render](#3-migrate-the-database-from-render)
4. [Deploy the App](#4-deploy-the-app)
5. [Configure PM2](#5-configure-pm2)
6. [Configure Nginx](#6-configure-nginx)
7. [Set Up SSL with Certbot](#7-set-up-ssl-with-certbot)
8. [Update Environment Variables](#8-update-environment-variables)
9. [DNS Update](#9-dns-update)
10. [Post-Deploy Verification Checklist](#10-post-deploy-verification-checklist)

---

## 1. Create the Droplet

1. Log in to [DigitalOcean](https://cloud.digitalocean.com) and click **Create → Droplet**.
2. **Image:** Ubuntu 22.04 (LTS) x64
3. **Size:** Basic — 2 GB RAM / 1 vCPU (~$12/month) is sufficient.
4. **Authentication:** SSH keys (do **not** use a password).
   - If you do not have an SSH key pair yet, generate one locally:
     ```bash
     ssh-keygen -t ed25519 -C "your_email@example.com"
     ```
   - Paste the contents of `~/.ssh/id_ed25519.pub` into the DigitalOcean SSH key field.
5. Choose a datacenter region close to your users.
6. Click **Create Droplet** and note the public IP address.

---

## 2. Initial Server Setup

SSH into the Droplet as root (replace `<DROPLET_IP>` throughout):

```bash
ssh root@<DROPLET_IP>
```

### 2a. Update packages

```bash
apt update && apt upgrade -y
```

### 2b. Create a non-root user (recommended)

```bash
adduser deploy
usermod -aG sudo deploy
# Copy your SSH key to the new user
rsync --archive --chown=deploy:deploy ~/.ssh /home/deploy
```

From here you can `ssh deploy@<DROPLET_IP>` and use `sudo` for privileged commands.

### 2c. Install Node.js 20 LTS

```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
node -v   # should print v20.x.x
```

### 2d. Install PostgreSQL 15

```bash
sudo apt install -y postgresql postgresql-contrib
sudo systemctl enable postgresql
sudo systemctl start postgresql
```

### 2e. Install Nginx

```bash
sudo apt install -y nginx
sudo systemctl enable nginx
sudo systemctl start nginx
```

### 2f. Install PM2 globally

```bash
sudo npm install -g pm2
```

### 2g. Install Certbot

```bash
sudo apt install -y certbot python3-certbot-nginx
```

---

## 3. Migrate the Database from Render

### 3a. Export from Render

Run this **on your local machine** (requires `pg_dump` installed — comes with any PostgreSQL client install):

```bash
pg_dump \
  "postgresql://<RENDER_USER>:<RENDER_PASSWORD>@<RENDER_HOST>/<RENDER_DB>?sslmode=require" \
  --no-owner \
  --no-acl \
  -F c \
  -f render_backup.dump
```

Find the full connection string in your Render dashboard under **Databases → [your DB] → Connection → External Connection String**.

### 3b. Create the database and user on the Droplet

```bash
sudo -u postgres psql
```

Inside the psql shell:

```sql
CREATE USER cjbijoux_user WITH PASSWORD 'choose_a_strong_password';
CREATE DATABASE cjbijoux OWNER cjbijoux_user;
GRANT ALL PRIVILEGES ON DATABASE cjbijoux TO cjbijoux_user;
\q
```

### 3c. Transfer the dump to the Droplet

Run this **on your local machine**:

```bash
scp render_backup.dump deploy@<DROPLET_IP>:/home/deploy/render_backup.dump
```

### 3d. Restore the dump on the Droplet

```bash
pg_restore \
  -U cjbijoux_user \
  -d cjbijoux \
  -h localhost \
  --no-owner \
  --no-acl \
  /home/deploy/render_backup.dump
```

### 3e. Verify row counts

```bash
sudo -u postgres psql -d cjbijoux -c "\dt"
sudo -u postgres psql -d cjbijoux -c "SELECT COUNT(*) FROM products;"
sudo -u postgres psql -d cjbijoux -c "SELECT COUNT(*) FROM orders;"
sudo -u postgres psql -d cjbijoux -c "SELECT COUNT(*) FROM users;"
```

Compare these numbers against the same queries run on Render before you shut it down.

---

## 4. Deploy the App

### 4a. Clone the repository

```bash
cd /home/deploy
git clone https://github.com/<your-org>/jewelry-website.git
cd jewelry-website
```

Alternatively, upload via rsync from your local machine:

```bash
rsync -avz --exclude 'node_modules' --exclude '.env' \
  /path/to/local/jewelry-website/ \
  deploy@<DROPLET_IP>:/home/deploy/jewelry-website/
```

### 4b. Install server dependencies

```bash
cd /home/deploy/jewelry-website/server
npm install
```

### 4c. Build the React client

```bash
cd /home/deploy/jewelry-website/client
npm install
npm run build
```

The production static files will be at `client/build/`.

### 4d. Create the server `.env` file

```bash
nano /home/deploy/jewelry-website/server/.env
```

Paste in all required variables (see [Section 8](#8-update-environment-variables)).

---

## 5. Configure PM2

### 5a. Start the server

```bash
cd /home/deploy/jewelry-website
pm2 start server/index.js --name cjbijoux
```

> The server has no `npm start` script — point PM2 directly at `server/index.js`.

### 5b. Check it is running

```bash
pm2 status
pm2 logs cjbijoux --lines 50
```

### 5c. Persist across reboots

```bash
pm2 save
pm2 startup
# Run the command that pm2 startup prints (it looks like:
#   sudo env PATH=... pm2 startup systemd -u deploy --hp /home/deploy
# Copy-paste that exact command and run it.)
```

---

## 6. Configure Nginx

### 6a. Create the site config

```bash
sudo nano /etc/nginx/sites-available/cjbijoux
```

Paste the following (replace `catherineulanovski.com` if the domain differs):

```nginx
server {
    listen 80;
    server_name catherineulanovski.com www.catherineulanovski.com;

    # Serve React build
    root /home/deploy/jewelry-website/client/build;
    index index.html;

    # React SPA: serve index.html for any unmatched path
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Proxy API and auth routes to Express
    location ~ ^/(auth|cart|orders|shop|product|payment|images|products)(/.*)?$ {
        proxy_pass         http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header   Upgrade $http_upgrade;
        proxy_set_header   Connection 'upgrade';
        proxy_set_header   Host $host;
        proxy_set_header   X-Real-IP $remote_addr;
        proxy_set_header   X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header   X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### 6b. Enable the site

```bash
sudo ln -s /etc/nginx/sites-available/cjbijoux /etc/nginx/sites-enabled/
sudo nginx -t          # must print "syntax is ok" and "test is successful"
sudo systemctl reload nginx
```

---

## 7. Set Up SSL with Certbot

With your DNS A record already pointing to the Droplet (see [Section 9](#9-dns-update)):

```bash
sudo certbot --nginx -d catherineulanovski.com -d www.catherineulanovski.com
```

Follow the prompts. Certbot will:
- Obtain a Let's Encrypt certificate.
- Automatically update the Nginx config to listen on port 443 and redirect HTTP → HTTPS.

Auto-renewal is configured automatically. Test it with:

```bash
sudo certbot renew --dry-run
```

### 7a. Secure cookies in production

The session cookie is already configured to use `secure: process.env.NODE_ENV === 'production'` in `server/index.js`. As long as `NODE_ENV=production` is set in the server `.env` file (see [Section 8](#8-update-environment-variables)), secure cookies are enabled automatically once HTTPS is live — no manual code change needed.

Restart PM2 after updating `.env` if you haven't already:

```bash
pm2 restart cjbijoux
```

---

## 8. Update Environment Variables

Create or update `/home/deploy/jewelry-website/server/.env`:

```env
# ── Server ───────────────────────────────────────────────────────────────────
NODE_ENV=production
PORT=3000

# ── Database (local PostgreSQL on this Droplet) ───────────────────────────────
# DB_URL format: postgresql://USER:PASSWORD@localhost:5432/DB_NAME
DB_URL=postgresql://cjbijoux_user:choose_a_strong_password@localhost:5432/cjbijoux

# ── Session ───────────────────────────────────────────────────────────────────
SESSION_SECRET=replace_with_a_long_random_string

# ── AWS S3 (unchanged from Render) ───────────────────────────────────────────
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_REGION=your_s3_region
AWS_BUCKET_NAME=your_s3_bucket_name

# ── PayPal (unchanged from Render) ───────────────────────────────────────────
PAYPAL_CLIENT_ID=your_paypal_client_id
PAYPAL_CLIENT_SECRET=your_paypal_client_secret
PAYPAL_TEST_ID=your_paypal_sandbox_client_id
PAYPAL_TEST_SECRET=your_paypal_sandbox_client_secret

# ── Email ─────────────────────────────────────────────────────────────────────
EMAIL_USER=your_email@gmail.com
EMAIL_APP_PASSWORD=your_gmail_app_password
OWNER_EMAIL=owner@example.com

# ── CORS / Frontend ───────────────────────────────────────────────────────────
FRONTEND_URL=https://catherineulanovski.com
```

> **Important notes:**
> - `NODE_ENV=production` activates the SSL database path in `server/db.js`. Because the DB is now on `localhost`, the SSL setting (`rejectUnauthorized: false`) is harmless — PostgreSQL will simply use a local socket connection.
> - `DB_URL` must point to `localhost`, **not** the old Render hostname.
> - `FRONTEND_URL` is read by the CORS config in `server/index.js`. Make sure it matches the exact origin the browser sends (including `https://`). The domain `https://catherineulanovski.com` is also hardcoded in the CORS array, so both the bare domain and `www` subdomain will need to be present. If you add `www`, append it to the hardcoded array in `server/index.js`:
>   ```js
>   'https://www.catherineulanovski.com',
>   ```
> - `PORT=3000` must be set; the server has no default and will not start without it.

### Client environment variables

Create `/home/deploy/jewelry-website/client/.env.production` **before** running `npm run build`:

```env
REACT_APP_API_URL=https://catherineulanovski.com
REACT_APP_PAYPAL_CLIENT_ID=your_live_paypal_client_id
REACT_APP_PAYPAL_TEST_ID=your_sandbox_paypal_client_id
```

After updating, rebuild the client:

```bash
cd /home/deploy/jewelry-website/client
npm run build
```

---

## 9. DNS Update

In your domain registrar / DNS provider:

| Type  | Name | Value              | TTL  |
|-------|------|--------------------|------|
| A     | @    | `<DROPLET_IP>`     | 300  |
| A     | www  | `<DROPLET_IP>`     | 300  |

(Use a low TTL like 300 seconds during the migration so you can roll back quickly. Raise it to 3600 after everything is confirmed working.)

Allow up to 24 hours for DNS propagation, though in practice it is usually under an hour.

---

## 10. Post-Deploy Verification Checklist

Run through every item before announcing the migration complete.

### Infrastructure

- [ ] `ssh deploy@<DROPLET_IP>` works without a password prompt
- [ ] `pm2 status` shows `cjbijoux` as **online**
- [ ] `pm2 logs cjbijoux --lines 50` shows no crash loops or unhandled errors
- [ ] `sudo nginx -t` prints `syntax is ok`
- [ ] `curl -I http://localhost:3000/` returns a 200 from Express

### Database

- [ ] Row counts in `products`, `orders`, `users`, `order_items` match the Render export
- [ ] `psql -U cjbijoux_user -d cjbijoux -h localhost` connects without error

### HTTP / HTTPS

- [ ] `http://catherineulanovski.com` redirects to `https://` (Certbot handles this)
- [ ] `https://catherineulanovski.com` loads the React app without console errors
- [ ] `https://www.catherineulanovski.com` also resolves correctly
- [ ] Browser shows a valid SSL certificate (Let's Encrypt)

### App Functionality

- [ ] Home page and shop page load products
- [ ] Product images load from AWS S3 (not broken)
- [ ] User can register and log in
- [ ] Session persists across page reloads
- [ ] Add to cart works; cart survives a page refresh
- [ ] Checkout flow reaches PayPal without errors
- [ ] Admin routes (`/admin`, `/admin/products`, `/admin/orders`) are accessible after admin login
- [ ] Image upload via admin panel saves to S3

### Security

- [ ] `secure: true` is set on the session cookie in `server/index.js` (after SSL is live)
- [ ] Firewall: only ports 22, 80, 443 are open (`sudo ufw status`)
- [ ] `.env` file is **not** committed to the repository and is **not** publicly readable

### Optional hardening

- [ ] Set up `ufw`: `sudo ufw allow OpenSSH && sudo ufw allow 'Nginx Full' && sudo ufw enable`
- [ ] Configure automatic security updates: `sudo apt install unattended-upgrades -y`
- [ ] Set up Droplet monitoring alerts in the DigitalOcean console (CPU, memory, disk)

---

## Quick Reference: Common Commands

```bash
# Restart the app
pm2 restart cjbijoux

# View live logs
pm2 logs cjbijoux

# Reload Nginx after config change
sudo nginx -t && sudo systemctl reload nginx

# Renew SSL certificate manually
sudo certbot renew

# Connect to the local database
sudo -u postgres psql -d cjbijoux

# Pull latest code and redeploy
cd /home/deploy/jewelry-website
git pull
cd client && npm run build
pm2 restart cjbijoux
```
