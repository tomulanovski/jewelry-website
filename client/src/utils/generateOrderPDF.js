import { jsPDF } from 'jspdf';

/**
 * Generates and immediately downloads a PDF packing slip / order summary for admin use.
 *
 * @param {Object} order - The order object from the admin orders API
 *   order.id                  - Order number
 *   order.customer_name       - Customer full name
 *   order.guest_email         - Customer email
 *   order.created_at          - Order date string
 *   order.total_amount        - Total amount
 *   order.status              - e.g. "completed"
 *   order.paypal_order_id     - PayPal reference
 *   order.shipping_address    - { address, apartment, city, postalCode, country, phone }
 *   order.items               - [{ id, quantity, price_at_time, product: { title, materials } }]
 */
export function generateOrderPDF(order) {
    const doc = new jsPDF({ unit: 'pt', format: 'a4' });

    const GOLD      = [180, 160, 120];
    const BLACK     = [0, 0, 0];
    const DARK_GRAY = [60, 60, 60];
    const LIGHT_GRAY = [200, 200, 200];
    const PAGE_W    = doc.internal.pageSize.getWidth();
    const MARGIN    = 50;
    const CONTENT_W = PAGE_W - MARGIN * 2;

    let y = MARGIN;

    // ── Header ──────────────────────────────────────────────────────────────
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(22);
    doc.setTextColor(...BLACK);
    doc.text(`Order #${order.id ?? 'N/A'}`, MARGIN, y);

    const orderDate = order.created_at
        ? new Date(order.created_at).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
          })
        : 'N/A';

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(...DARK_GRAY);
    doc.text(orderDate, PAGE_W - MARGIN, y, { align: 'right' });

    y += 10;
    doc.setDrawColor(...GOLD);
    doc.setLineWidth(1.5);
    doc.line(MARGIN, y, PAGE_W - MARGIN, y);
    y += 22;

    // ── Customer ─────────────────────────────────────────────────────────────
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(...BLACK);
    doc.text('Customer', MARGIN, y);
    y += 14;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(...DARK_GRAY);
    doc.text(`Name:   ${order.customer_name ?? 'N/A'}`, MARGIN, y);   y += 13;
    doc.text(`Email:  ${order.guest_email ?? 'N/A'}`,    MARGIN, y);   y += 13;
    doc.text(`Phone:  ${order.shipping_address?.phone ?? 'N/A'}`, MARGIN, y); y += 22;

    // ── Ship To ───────────────────────────────────────────────────────────────
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(...BLACK);
    doc.text('Ship To', MARGIN, y);
    y += 14;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(...DARK_GRAY);

    const sa = order.shipping_address;
    if (sa) {
        doc.text(sa.address ?? 'N/A', MARGIN, y); y += 13;
        if (sa.apartment) {
            doc.text(`Apt ${sa.apartment}`, MARGIN, y); y += 13;
        }
        doc.text(`${sa.city ?? ''}, ${sa.postalCode ?? ''}`.trim().replace(/^,\s*/, ''), MARGIN, y); y += 13;
        doc.text(sa.country ?? 'N/A', MARGIN, y); y += 13;
    } else {
        doc.text('No address provided', MARGIN, y); y += 13;
    }
    y += 10;

    // ── Items table ───────────────────────────────────────────────────────────
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(...BLACK);
    doc.text('Items', MARGIN, y);
    y += 14;

    // Column X positions
    const COL = {
        product:   MARGIN,
        materials: MARGIN + CONTENT_W * 0.38,
        qty:       MARGIN + CONTENT_W * 0.58,
        unit:      MARGIN + CONTENT_W * 0.70,
        total:     PAGE_W - MARGIN,
    };

    // Table header row
    doc.setFillColor(240, 240, 240);
    doc.rect(MARGIN, y - 11, CONTENT_W, 16, 'F');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(...BLACK);
    doc.text('Product',    COL.product + 4, y);
    doc.text('Materials',  COL.materials,   y);
    doc.text('Qty',        COL.qty,         y);
    doc.text('Unit Price', COL.unit,        y);
    doc.text('Total',      COL.total,       y, { align: 'right' });
    y += 6;

    doc.setDrawColor(...LIGHT_GRAY);
    doc.setLineWidth(0.5);
    doc.line(MARGIN, y, PAGE_W - MARGIN, y);
    y += 10;

    // Item rows
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(...DARK_GRAY);

    const items = Array.isArray(order.items) ? order.items : [];
    let subtotal = 0;

    items.forEach((item, idx) => {
        if (idx % 2 === 1) {
            doc.setFillColor(249, 249, 249);
            doc.rect(MARGIN, y - 10, CONTENT_W, 16, 'F');
        }

        const unitPrice  = parseFloat(item.price_at_time ?? 0);
        const qty        = item.quantity ?? 0;
        const lineTotal  = unitPrice * qty;
        subtotal        += lineTotal;

        const maxProductW   = COL.materials - COL.product - 8;
        const maxMaterialsW = COL.qty - COL.materials - 8;

        const productTitle = doc.splitTextToSize(
            item.product?.title ?? `Item #${item.id ?? '?'}`,
            maxProductW
        )[0];

        const materials = doc.splitTextToSize(
            item.product?.materials ?? '—',
            maxMaterialsW
        )[0];

        doc.setTextColor(...DARK_GRAY);
        doc.text(productTitle,            COL.product + 4, y);
        doc.text(materials,               COL.materials,   y);
        doc.text(String(qty),             COL.qty,         y);
        doc.text(`$${unitPrice.toFixed(2)}`, COL.unit,     y);
        doc.text(`$${lineTotal.toFixed(2)}`, COL.total,    y, { align: 'right' });

        y += 18;
    });

    if (items.length === 0) {
        doc.text('No items found', COL.product + 4, y);
        y += 18;
    }

    // Subtotal row
    y += 4;
    doc.setDrawColor(...LIGHT_GRAY);
    doc.line(MARGIN, y, PAGE_W - MARGIN, y);
    y += 12;

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(...BLACK);
    doc.text('Subtotal:', COL.unit, y);
    doc.text(`$${subtotal.toFixed(2)}`, COL.total, y, { align: 'right' });
    y += 24;

    // ── Payment ───────────────────────────────────────────────────────────────
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(...BLACK);
    doc.text('Payment', MARGIN, y);
    y += 14;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(...DARK_GRAY);

    doc.setFont('helvetica', 'bold');
    doc.text(`Total Amount:  $${order.total_amount ?? 'N/A'}`, MARGIN, y);
    doc.setFont('helvetica', 'normal');
    y += 13;
    doc.text(`Status:        ${order.status ?? 'N/A'}`, MARGIN, y);   y += 13;
    doc.text(`PayPal ID:     ${order.paypal_order_id ?? 'N/A'}`, MARGIN, y); y += 22;

    // ── Footer ────────────────────────────────────────────────────────────────
    const pageH = doc.internal.pageSize.getHeight();
    doc.setDrawColor(...GOLD);
    doc.setLineWidth(1);
    doc.line(MARGIN, pageH - 50, PAGE_W - MARGIN, pageH - 50);

    doc.setFont('helvetica', 'italic');
    doc.setFontSize(9);
    doc.setTextColor(...DARK_GRAY);
    doc.text(
        'Catherine Ulanovski — Order Management',
        PAGE_W / 2,
        pageH - 34,
        { align: 'center' }
    );

    // ── Save ──────────────────────────────────────────────────────────────────
    const safeName = order.customer_name?.replace(/\s+/g, '-') || 'guest';
    doc.save(`order-${order.id ?? 'unknown'}-${safeName}.pdf`);
}
