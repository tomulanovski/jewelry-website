import { jsPDF } from 'jspdf';

/**
 * Generates and immediately downloads a PDF receipt for an order.
 *
 * @param {Object} order - The order object from orderDetails (location.state.orderDetails)
 *   Expected shape:
 *     order.id             - The order ID / number
 *     order.subtotal       - Number
 *     order.total          - Number
 *     order.shippingMethod - 'express' | 'standard'
 *     order.shipping       - { firstName, lastName, address, apartment, city, postalCode, country }
 * @param {Array} orderItems - Array of { title, quantity, price } items for this order
 */
export function generateReceipt(order, orderItems) {
    if (!order.shipping) {
        return;
    }

    const orderNumber = order.id ?? order.orderId ?? 'N/A';
    if (orderNumber === 'N/A') {
        console.warn('generateReceipt: order has no id or orderId; falling back to "N/A"');
    }

    const doc = new jsPDF({ unit: 'pt', format: 'a4' });

    const GOLD = [180, 160, 110];   // muted gold — readable on white
    const BLACK = [0, 0, 0];
    const DARK_GRAY = [60, 60, 60];
    const LIGHT_GRAY = [200, 200, 200];
    const PAGE_W = doc.internal.pageSize.getWidth();
    const MARGIN = 50;
    const CONTENT_W = PAGE_W - MARGIN * 2;

    let y = MARGIN;

    // ── Header ─────────────────────────────────────────────────────────────
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(26);
    doc.setTextColor(...GOLD);
    doc.text('CJbijoux', MARGIN, y);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(...DARK_GRAY);
    const orderDate = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
    doc.text(orderDate, PAGE_W - MARGIN, y, { align: 'right' });

    y += 8;
    doc.setDrawColor(...GOLD);
    doc.setLineWidth(1.5);
    doc.line(MARGIN, y, PAGE_W - MARGIN, y);
    y += 20;

    // ── Order number ────────────────────────────────────────────────────────
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(...BLACK);
    doc.text('Order Confirmation', MARGIN, y);
    y += 16;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(...DARK_GRAY);
    doc.text(`Order #${orderNumber}`, MARGIN, y);
    y += 28;

    // ── Items table header ──────────────────────────────────────────────────
    const COL = {
        product: MARGIN,
        qty: MARGIN + CONTENT_W * 0.55,
        unit: MARGIN + CONTENT_W * 0.70,
    };

    doc.setFillColor(240, 240, 240);
    doc.rect(MARGIN, y - 12, CONTENT_W, 18, 'F');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(...BLACK);
    doc.text('Product', COL.product + 4, y);
    doc.text('Qty', COL.qty, y);
    doc.text('Unit Price', COL.unit, y);
    doc.text('Subtotal', PAGE_W - MARGIN, y, { align: 'right' });
    y += 14;

    doc.setDrawColor(...LIGHT_GRAY);
    doc.setLineWidth(0.5);
    doc.line(MARGIN, y, PAGE_W - MARGIN, y);
    y += 10;

    // ── Items rows ──────────────────────────────────────────────────────────
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(...DARK_GRAY);

    const items = Array.isArray(orderItems) && orderItems.length > 0 ? orderItems : null;

    if (!items) {
        doc.text('No items found', COL.product + 4, y);
        y += 18;
    }

    (items ?? []).forEach((item, idx) => {
        if (idx % 2 === 1) {
            doc.setFillColor(249, 249, 249);
            doc.rect(MARGIN, y - 10, CONTENT_W, 16, 'F');
        }

        const lineSubtotal = (item.price * item.quantity).toFixed(2);

        // Truncate long product names to keep layout clean
        const maxNameWidth = COL.qty - COL.product - 10;
        const title = doc.splitTextToSize(item.title, maxNameWidth)[0];

        doc.setTextColor(...DARK_GRAY);
        doc.text(title, COL.product + 4, y);
        doc.text(String(item.quantity), COL.qty, y);
        doc.text(`$${Number(item.price).toFixed(2)}`, COL.unit, y);
        doc.text(`$${lineSubtotal}`, PAGE_W - MARGIN, y, { align: 'right' });

        y += 18;
    });

    y += 4;
    doc.setDrawColor(...LIGHT_GRAY);
    doc.line(MARGIN, y, PAGE_W - MARGIN, y);
    y += 14;

    // ── Totals ──────────────────────────────────────────────────────────────
    const shippingCost =
        order.shippingMethod === 'express' ? '$40.00' : 'Free';

    const totalsX = PAGE_W - MARGIN - 160;

    const printRow = (label, value, bold = false) => {
        doc.setFont('helvetica', bold ? 'bold' : 'normal');
        doc.setFontSize(9);
        const rowColor = bold ? BLACK : DARK_GRAY;
        doc.setTextColor(...rowColor);
        doc.text(label, totalsX, y);
        doc.text(value, PAGE_W - MARGIN, y, { align: 'right' });
        y += 14;
    };

    printRow('Subtotal:', `$${(order.subtotal ?? 0).toFixed(2)}`);
    printRow('Shipping:', shippingCost);
    y += 4;
    doc.setDrawColor(...LIGHT_GRAY);
    doc.line(totalsX, y, PAGE_W - MARGIN, y);
    y += 10;
    printRow('Total:', `$${(order.total ?? 0).toFixed(2)}`, true);

    y += 20;

    // ── Shipping address ────────────────────────────────────────────────────
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(...BLACK);
    doc.text('Shipping Address', MARGIN, y);
    y += 14;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(...DARK_GRAY);

    const s = order.shipping;
    const addressLines = [
        `${s.firstName} ${s.lastName}`,
        s.address + (s.apartment ? `, ${s.apartment}` : ''),
        `${s.city}, ${s.postalCode}`,
        s.country,
    ];

    addressLines.forEach((line) => {
        doc.text(line, MARGIN, y);
        y += 13;
    });

    // ── Footer ──────────────────────────────────────────────────────────────
    const pageH = doc.internal.pageSize.getHeight();
    doc.setDrawColor(...GOLD);
    doc.setLineWidth(1);
    doc.line(MARGIN, pageH - 50, PAGE_W - MARGIN, pageH - 50);

    doc.setFont('helvetica', 'italic');
    doc.setFontSize(9);
    doc.setTextColor(...DARK_GRAY);
    doc.text(
        'Thank you for your order — CJbijoux',
        PAGE_W / 2,
        pageH - 34,
        { align: 'center' }
    );

    // ── Save ─────────────────────────────────────────────────────────────────
    doc.save(`CJbijoux-receipt-${orderNumber}.pdf`);
}
