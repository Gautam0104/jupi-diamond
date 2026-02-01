// templates/orderConfirmationTemplate.js
export const getOrderConfirmationTemplate = (data) => {
  const {
    customerName,
    orderId,
    items,
    totalAmount,
    discountAmount,
    gstAmount,
    orderDate,
  } = data;
  console.log("items=", items);

  const formattedItems = items
    .map(
      (item) => `
      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 12px; border: 1px solid #e0e0e0; border-radius: 8px; background-color: #fdfdfd;">
        <tr>
          <td style="padding: 16px;">
            <table width="100%" cellpadding="0" cellspacing="0" border="0">
              <tr>
                <td width="80" valign="top" style="padding-right: 12px;">
                  <img src="${item.imageUrl}" alt="${item.productName}" width="80" style="display: block; width: 80px; height: auto; border-radius: 4px;"/>
                </td>
                <td valign="top" style="font-family: sans-serif; font-size: 14px; color: #333;">
                  <p style="margin: 0; font-weight: 600;">${item.productName}</p>
                  <p style="margin: 6px 0 0 0; font-size: 13px; color: #555;">
                    Qty: ${item.quantity}<br/>
                    Price: ₹${item.priceAtPurchase}
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    `
    )
    .join("");

  return `
    <div style="max-width: 600px; margin: auto; font-family: 'Segoe UI', sans-serif; background-color: #fff; border: 1px solid #eee; border-radius: 8px; overflow: hidden;">
      <!-- Header -->
      <div style="background-color: #ce967e; padding: 24px; text-align: center;">
        <img src="https://yourdomain.com/logo.png" alt="Jewellery Logo" style="max-height: 40px;" />
      </div>

      <!-- Content -->
<div style="padding: 24px;">
  <!-- Title with Icon -->
  <div style="text-align: center; margin-bottom: 20px;">
    <img src="https://cdn-icons-png.flaticon.com/512/190/190411.png" alt="Confirmed" width="40" style="vertical-align: middle;" />
    <h2 style="display: inline-block; margin: 0 0 0 10px; font-size: 22px; color: #2e7d32; font-weight: 700; vertical-align: middle;">
      Order Confirmed
    </h2>
  </div>

  <!-- Greeting and Confirmation -->
  <p style="font-size: 16px; color: #333;">Hi <strong>${customerName}</strong>,</p>
  <p style="font-size: 15px; color: #444;">Thank you for shopping with us! Your order <strong>#${orderId}</strong> placed on <strong>${orderDate}</strong> has been successfully confirmed.</p>

  <!-- Items -->
  <h3 style="margin-top: 30px; font-size: 18px; color: #2e7d32;">Items Ordered</h3>
  ${formattedItems}

  <!-- Price Breakdown -->
  <h3 style="margin-top: 30px; font-size: 18px; color: #2e7d32;">Price Breakdown</h3>
  <table style="width: 100%; font-size: 15px; border-collapse: collapse; color: #333;">
    <tr><td style="padding: 6px 0;">Discount</td><td style="text-align: right;">- ₹${discountAmount}</td></tr>
    <tr><td style="padding: 6px 0;">GST</td><td style="text-align: right;">₹${gstAmount}</td></tr>
    <tr style="border-top: 1px solid #ccc; font-weight: bold;">
      <td style="padding: 10px 0;">Total</td>
      <td style="text-align: right;">₹${totalAmount}</td>
    </tr>
  </table>

  <!-- Track Order Button -->
  <div style="text-align: center; margin-top: 30px;">
    <a href="#" style="background-color: #2e7d32; color: #fff; padding: 12px 30px; text-decoration: none; font-weight: bold; border-radius: 6px; display: inline-block;">
      Track Your Order
    </a>
  </div>

  <!-- Info Note -->
  <p style="font-size: 13px; color: #555; margin-top: 30px;">
    You’ll receive updates once your order ships. If you have any questions, feel free to reach out to our support team.
  </p>
</div>


      <!-- Footer -->
      <div style="background-color: #f2f2f2; text-align: center; padding: 16px; font-size: 13px; color: #666;">
        © ${new Date().getFullYear()} YourJewelleryBrand. All rights reserved.
        <br/>
        <a href="https://jupidiamonds.com/contact" style="color: #444; text-decoration: underline;">Contact Us</a> |
        <a href="https://api.jupidiamonds.com/privacy" style="color: #444; text-decoration: underline;">Privacy Policy</a>
      </div>
    </div>
  `;
};
