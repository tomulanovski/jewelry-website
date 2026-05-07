import nodemailer from 'nodemailer';

function createTransporter() {
  const user = process.env.EMAIL_USER;
  const pass = process.env.EMAIL_APP_PASSWORD;

  if (!user || !pass) {
    return null;
  }

  return nodemailer.createTransport({
    service: 'gmail',
    auth: { user, pass }
  });
}

function formatAddress(shippingAddress) {
  if (!shippingAddress) return 'N/A';
  const addr = typeof shippingAddress === 'string'
    ? JSON.parse(shippingAddress)
    : shippingAddress;
  const parts = [
    addr.address,
    addr.apartment,
    addr.city,
    addr.postalCode,
    addr.country
  ].filter(Boolean);
  return parts.join(', ');
}

function formatItemsHtml(items) {
  if (!items || items.length === 0) return '<p>No items</p>';
  const rows = items.map(item => {
    const name = item.title || item.name || `Product #${item.product_id || item.id}`;
    const qty = item.quantity;
    const price = Number(item.price || item.price_at_time || 0).toFixed(2);
    const lineTotal = (qty * Number(item.price || item.price_at_time || 0)).toFixed(2);
    return `
      <tr>
        <td style="padding:6px 12px;border-bottom:1px solid #f0e8df;">${name}</td>
        <td style="padding:6px 12px;border-bottom:1px solid #f0e8df;text-align:center;">${qty}</td>
        <td style="padding:6px 12px;border-bottom:1px solid #f0e8df;text-align:right;">$${price}</td>
        <td style="padding:6px 12px;border-bottom:1px solid #f0e8df;text-align:right;">$${lineTotal}</td>
      </tr>`;
  }).join('');
  return `
    <table style="width:100%;border-collapse:collapse;margin:12px 0;">
      <thead>
        <tr style="background:#f7f0eb;">
          <th style="padding:8px 12px;text-align:left;font-weight:600;">Item</th>
          <th style="padding:8px 12px;text-align:center;font-weight:600;">Qty</th>
          <th style="padding:8px 12px;text-align:right;font-weight:600;">Unit Price</th>
          <th style="padding:8px 12px;text-align:right;font-weight:600;">Line Total</th>
        </tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>`;
}

export async function sendOrderConfirmation(order, items, customerEmail) {
  const transporter = createTransporter();
  if (!transporter) {
    console.log('[email] EMAIL_USER or EMAIL_APP_PASSWORD not set — skipping customer confirmation email.');
    return;
  }

  const orderNumber = order.id || order.paypal_order_id || 'N/A';
  const total = Number(order.total_amount || 0).toFixed(2);
  const address = formatAddress(order.shipping_address);
  const itemsHtml = formatItemsHtml(items);

  const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#fdf8f4;font-family:Georgia,'Times New Roman',serif;color:#3a2e28;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#fdf8f4;padding:32px 0;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:8px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08);">
        <!-- Header -->
        <tr>
          <td style="background:#3a2e28;padding:28px 40px;text-align:center;">
            <h1 style="margin:0;color:#f7e8d4;font-size:26px;letter-spacing:2px;font-weight:400;">CJbijoux</h1>
            <p style="margin:6px 0 0;color:#c8a98a;font-size:13px;letter-spacing:1px;">Handmade Jewelry by Catherine Ulanovski</p>
          </td>
        </tr>
        <!-- Body -->
        <tr>
          <td style="padding:36px 40px;">
            <h2 style="margin:0 0 8px;font-size:20px;font-weight:600;color:#3a2e28;">Your order is confirmed!</h2>
            <p style="margin:0 0 24px;color:#7a6558;font-size:15px;">Thank you for your purchase. We're delighted to be crafting something special for you.</p>

            <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
              <tr>
                <td style="padding:10px 14px;background:#f7f0eb;border-radius:6px;">
                  <span style="font-size:13px;color:#7a6558;text-transform:uppercase;letter-spacing:1px;">Order number</span><br>
                  <span style="font-size:17px;font-weight:600;color:#3a2e28;">#${orderNumber}</span>
                </td>
              </tr>
            </table>

            <h3 style="margin:0 0 4px;font-size:14px;text-transform:uppercase;letter-spacing:1px;color:#7a6558;">Items ordered</h3>
            ${itemsHtml}

            <table width="100%" cellpadding="0" cellspacing="0" style="margin-top:4px;">
              <tr>
                <td align="right" style="padding:10px 12px;background:#f7f0eb;border-radius:6px;">
                  <span style="font-size:14px;color:#7a6558;">Total: </span>
                  <span style="font-size:18px;font-weight:700;color:#3a2e28;">$${total}</span>
                </td>
              </tr>
            </table>

            <h3 style="margin:24px 0 4px;font-size:14px;text-transform:uppercase;letter-spacing:1px;color:#7a6558;">Shipping to</h3>
            <p style="margin:0 0 24px;font-size:15px;color:#3a2e28;">${address}</p>

            <p style="margin:0 0 8px;font-size:15px;color:#3a2e28;line-height:1.7;">
              Your order will be carefully prepared and dispatched within <strong>1 week</strong>. Each piece is handmade with love and attention to detail, so we appreciate your patience while we create your jewellery.
            </p>
            <p style="margin:0;font-size:15px;color:#3a2e28;line-height:1.7;">
              If you have any questions, simply reply to this email and we'll be happy to help.
            </p>
          </td>
        </tr>
        <!-- Footer -->
        <tr>
          <td style="background:#f7f0eb;padding:20px 40px;text-align:center;border-top:1px solid #e8ddd5;">
            <p style="margin:0;font-size:12px;color:#a08878;">With warmth, Catherine &amp; CJbijoux</p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;

  try {
    await transporter.sendMail({
      from: `"CJbijoux" <${process.env.EMAIL_USER}>`,
      to: customerEmail,
      subject: `Order Confirmed — CJbijoux #${orderNumber}`,
      html
    });
    console.log(`[email] Order confirmation sent to ${customerEmail} for order #${orderNumber}`);
  } catch (err) {
    console.error(`[email] Failed to send order confirmation to ${customerEmail}:`, err.message);
  }
}

export async function sendOwnerNotification(order, items) {
  const transporter = createTransporter();
  if (!transporter) {
    console.log('[email] EMAIL_USER or EMAIL_APP_PASSWORD not set — skipping owner notification email.');
    return;
  }

  const ownerEmail = process.env.OWNER_EMAIL;
  if (!ownerEmail) {
    console.log('[email] OWNER_EMAIL not set — skipping owner notification email.');
    return;
  }

  const orderNumber = order.id || order.paypal_order_id || 'N/A';
  const total = Number(order.total_amount || 0).toFixed(2);
  const address = formatAddress(order.shipping_address);
  const customerName = order.customer_name || 'N/A';
  const customerEmail = order.guest_email || order.email || 'N/A';
  const itemsHtml = formatItemsHtml(items);

  const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#fdf8f4;font-family:Georgia,'Times New Roman',serif;color:#3a2e28;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#fdf8f4;padding:32px 0;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:8px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08);">
        <!-- Header -->
        <tr>
          <td style="background:#3a2e28;padding:24px 40px;text-align:center;">
            <h1 style="margin:0;color:#f7e8d4;font-size:22px;letter-spacing:2px;font-weight:400;">CJbijoux — New Order</h1>
          </td>
        </tr>
        <!-- Body -->
        <tr>
          <td style="padding:32px 40px;">
            <h2 style="margin:0 0 20px;font-size:20px;font-weight:600;color:#3a2e28;">New Order #${orderNumber}</h2>

            <h3 style="margin:0 0 8px;font-size:14px;text-transform:uppercase;letter-spacing:1px;color:#7a6558;">Customer</h3>
            <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;background:#f7f0eb;border-radius:6px;">
              <tr>
                <td style="padding:10px 14px;">
                  <strong>Name:</strong> ${customerName}<br>
                  <strong>Email:</strong> <a href="mailto:${customerEmail}" style="color:#3a2e28;">${customerEmail}</a>
                </td>
              </tr>
            </table>

            <h3 style="margin:0 0 4px;font-size:14px;text-transform:uppercase;letter-spacing:1px;color:#7a6558;">Items ordered</h3>
            ${itemsHtml}

            <table width="100%" cellpadding="0" cellspacing="0" style="margin-top:4px;">
              <tr>
                <td align="right" style="padding:10px 12px;background:#f7f0eb;border-radius:6px;">
                  <span style="font-size:14px;color:#7a6558;">Total: </span>
                  <span style="font-size:18px;font-weight:700;color:#3a2e28;">$${total}</span>
                </td>
              </tr>
            </table>

            <h3 style="margin:24px 0 4px;font-size:14px;text-transform:uppercase;letter-spacing:1px;color:#7a6558;">Ship to</h3>
            <p style="margin:0;font-size:15px;color:#3a2e28;">${address}</p>
          </td>
        </tr>
        <!-- Footer -->
        <tr>
          <td style="background:#f7f0eb;padding:16px 40px;text-align:center;border-top:1px solid #e8ddd5;">
            <p style="margin:0;font-size:12px;color:#a08878;">CJbijoux Order Management</p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;

  try {
    await transporter.sendMail({
      from: `"CJbijoux Orders" <${process.env.EMAIL_USER}>`,
      to: ownerEmail,
      subject: `New Order #${orderNumber} — CJbijoux`,
      html
    });
    console.log(`[email] Owner notification sent for order #${orderNumber}`);
  } catch (err) {
    console.error(`[email] Failed to send owner notification for order #${orderNumber}:`, err.message);
  }
}
