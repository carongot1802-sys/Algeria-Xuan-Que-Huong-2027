# Kế hoạch truyền thông Xuân Quê hương 2027

Trang web trình bày kế hoạch truyền thông gồm sáu phần theo thứ tự xem: mở đầu, nội dung trình bày, proposal (kế hoạch và timeline trình bày thẳng trên trang), moodboard và visual cue, không gian 3D khu sân tổ chức, lời cảm ơn.

## Đưa lên GitHub Pages hoặc Vercel

Tạo một repo mới trên GitHub, giải nén file zip và tải toàn bộ nội dung bên trong lên repo (index.html phải nằm ngay ở gốc). Vào Settings, chọn Pages, ở mục Source chọn Deploy from a branch, chọn nhánh main và thư mục root rồi Save. Sau khoảng một phút trang có địa chỉ dạng https://ten-tai-khoan.github.io/ten-repo/.

Không mở index.html bằng cách bấm đúp trên máy, vì trình duyệt sẽ chặn phần 3D. Hãy xem trên địa chỉ GitHub Pages.

## Chỉnh nội dung

Trang không còn trang quản trị. Muốn sửa chữ, link tài liệu, nội dung Proposal hay lời cảm ơn thì sửa trong `js/config.js` rồi tải lại lên host.

## Điều khiển trong không gian 3D

Chế độ Xoay quanh dùng chuột trái để xoay, chuột phải hoặc phím W A S D để di chuyển, cuộn để phóng to và nhấp đúp vào sàn để bay tới đó. Chế độ Đi bộ bắt đầu từ cổng vào, kéo để nhìn quanh, dùng W A S D hoặc mũi tên để đi, giữ Shift để đi nhanh, bấm vào sàn để tự đi tới đó. Trên điện thoại có nút bi tròn ở góc trái để đi, kéo ngón tay lên màn hình để nhìn quanh. Nhân vật không đi xuyên tường, bàn, cây hay quầy, gặp vật cản sẽ trượt dọc theo vật đó. Trên điện thoại chỉ dùng nút bi để đi, một ngón kéo trên màn hình để xoay nhìn. Bấm vào cây đào hoặc cây mai cạnh bàn đón tiếp để hái lộc, bấm vào chồng brochure trên bàn để xem và lật hai mặt, rồi chọn Cầm theo brochure. Nút Bắn pháo hoa giấy tạo mưa giấy màu từ hai bên sân khấu.

Kích thước và vị trí trong mô hình là ước lượng từ ảnh, vị trí các khu nằm ở đầu file js/world.js.

## Giao diện, font và tài nguyên chính thức

- Font nội dung của web và không gian 3D là hệ EB Garamond (file nằm ở `assets/fonts`): Regular cho chữ thường, SemiBold cho chữ cần nổi bật. Tiêu đề giữ nguyên font Fraunces, đổi trong `js/config.js`.
- Bảng màu theo moodboard: đỏ #841B1A, đỏ quạt nan #A71F02, xanh rêu #23402F, hồng đào #FE909D và bốn sắc vàng #EFBF69, #F0C270, #FDD05A, #F0A622.
- Icon hoa mai ở thanh trên và trang cảm ơn là `assets/brand/hoa-mai.png`. Nền thẻ lì xì là `assets/texture/li-xi-do.jpg`.
- Ảnh moodboard, phông nền, hai mặt brochure và poster Facebook chính thức đã có sẵn trong `assets/moodboard`, `assets/backdrop`, `assets/brochure`, `assets/poster`. Muốn thay bằng bản mới, thay file ảnh cùng tên.
- Bàn thứ sáu của khu buffet là bàn nem rán.
