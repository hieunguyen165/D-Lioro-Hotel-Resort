import { QuotationData } from '../types';
import { formatCurrency, QuotationResult } from './calculator';

export const generateEmailHtml = (data: QuotationData, quotation: QuotationResult): string => {
  const roomDetails = quotation.rooms.map(r => `${r.name} (${r.count} phòng)`).join(', ');
  
  const checkInDate = new Date(data.checkIn).toLocaleDateString('vi-VN');
  const checkOutDate = new Date(data.checkOut).toLocaleDateString('vi-VN');
  
  const surchargeDetails = [];
  if (quotation.totalRoomRate > 0) surchargeDetails.push('tiền phòng');
  if (quotation.surchargeBreakdown.childrenUnder12.count > 0) surchargeDetails.push('phụ thu trẻ em 6-11 tuổi');
  if (quotation.surchargeBreakdown.childrenOver12.count > 0) surchargeDetails.push('phụ thu trẻ em ≥ 12 tuổi');
  if (quotation.surchargeBreakdown.extraAdults.count > 0) surchargeDetails.push('phụ thu người lớn thêm');
  if (quotation.surchargeBreakdown.extraBeds.count > 0) surchargeDetails.push('phụ thu extra bed');
  
  const surchargeText = surchargeDetails.length > 0 ? `(Bao gồm ${surchargeDetails.join(' và ')})` : '';
  
  const depositAmount = quotation.grandTotal / 2; // Assuming 50% deposit

  return `<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Xác nhận đặt phòng</title>
</head>

<body style="margin:0; padding:0; background-color:#f4f6f8; font-family:Arial, Helvetica, sans-serif;">

  <table width="100%" cellpadding="0" cellspacing="0" style="padding:30px 0;">
    <tr>
      <td align="center">

        <!-- Container -->
        <table width="620" cellpadding="0" cellspacing="0" style="background:#ffffff; border-radius:10px; overflow:hidden; box-shadow:0 4px 12px rgba(0,0,0,0.05);">

          <!-- Header -->
          <tr>
            <td style="background:#0f172a; color:#ffffff; padding:24px 32px;">
              <div style="font-size:18px; letter-spacing:1px;">
                D'Lioro Hotel & Resort
              </div>
              <div style="font-size:13px; opacity:0.8;">
                Hotline: (+84) 984 555 588
              </div>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding:32px; color:#333; font-size:15px; line-height:1.7;">

              <p style="margin:0 0 16px;">Kính gửi Quý khách ${data.guestName || ''},</p>

              <p style="margin:0 0 16px;">
                Cảm ơn Quý khách đã lựa chọn dịch vụ tại D'Lioro Hotel & Resort.
              </p>

              <!-- Booking Info -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc; border-radius:8px; padding:16px; margin-bottom:20px;">
                <tr><td>
                  <div style="margin-bottom:8px;">- Hạng phòng: ${roomDetails}</div>
                  <div style="margin-bottom:8px;">- Thời gian lưu trú: ${checkInDate} – ${checkOutDate} (${quotation.numNights} đêm)</div>
                  <div style="margin-bottom:8px;">- Tổng chi phí: ${formatCurrency(quotation.grandTotal)}</div>
                  <div style="font-size:13px; color:#666;">${surchargeText}</div>
                </td></tr>
              </table>

              <p style="margin:0 0 12px;">
                Để đảm bảo giữ phòng, Quý khách vui lòng đặt cọc trước:
              </p>

              <!-- Deposit -->
              <div style="background:#ecfdf5; border:1px solid #10b981; padding:14px; border-radius:8px; margin-bottom:20px;">
                <div style="color:#065f46;">
                  Số tiền đặt cọc: <strong>${formatCurrency(depositAmount)}</strong>
                </div>
              </div>

              <!-- Payment Info -->
              <p style="margin:0 0 10px;">Thông tin chuyển khoản:</p>

              <!-- No VAT -->
              <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e5e7eb; border-radius:8px; margin-bottom:14px;">
                <tr>
                  <td style="padding:14px;">
                    <div style="margin-bottom:6px; color:#111;">Không xuất hóa đơn</div>
                    <div>- Ngân hàng: BIDV</div>
                    <div>- Chủ tài khoản: Nguyễn Đức Dương</div>
                    <div>- Số tài khoản: 44866002996688</div>
                  </td>
                </tr>
              </table>

              <!-- VAT -->
              <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e5e7eb; border-radius:8px; margin-bottom:14px;">
                <tr>
                  <td style="padding:14px;">
                    <div style="margin-bottom:6px; color:#111;">Xuất hóa đơn VAT</div>
                    <div>- Ngân hàng: Vietcombank – Chi nhánh Hạ Long</div>
                    <div>- Chủ tài khoản: Công ty TNHH Đức Dương - Chi nhánh Hạ Long</div>
                    <div>- Số tài khoản: 100 329 8589</div>
                  </td>
                </tr>
              </table>

              <p style="margin:0 0 16px;">
                Nội dung chuyển khoản: ${data.guestName || '[Tên khách]'} – ${checkInDate}
              </p>

              <p style="margin:0 0 16px;">
                Sau khi chuyển khoản, Quý khách vui lòng gửi lại xác nhận để chúng tôi tiến hành giữ phòng.
              </p>

              <div style="font-size:13px; color:#6b7280; margin-bottom:20px;">
                Lưu ý: Báo giá có hiệu lực trong vòng 24 giờ.
              </div>

              <p style="margin:0;">
                Trân trọng,<br>
                D'Lioro Hotel & Resort
              </p>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#f9fafb; padding:16px; text-align:center; font-size:12px; color:#9ca3af;">
              D'Lioro Hotel & Resort · Hotline (+84) 984 555 588
            </td>
          </tr>

        </table>

      </td>
    </tr>
  </table>

</body>
</html>`;
};
