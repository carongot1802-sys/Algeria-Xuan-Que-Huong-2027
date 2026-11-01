# Kế hoạch truyền thông Xuân Quê hương 2027

Trang web trình bày kế hoạch truyền thông gồm sáu phần theo thứ tự xem: mở đầu, nội dung trình bày, proposal (slide), moodboard và visual cue, không gian 3D khu sân tổ chức, lời cảm ơn.

## Đưa lên GitHub Pages

Tạo một repo mới trên GitHub, giải nén file zip và tải toàn bộ nội dung bên trong lên repo (index.html phải nằm ngay ở gốc). Vào Settings, chọn Pages, ở mục Source chọn Deploy from a branch, chọn nhánh main và thư mục root rồi Save. Sau khoảng một phút trang có địa chỉ dạng https://ten-tai-khoan.github.io/ten-repo/.

Không mở index.html bằng cách bấm đúp trên máy, vì trình duyệt sẽ chặn phần 3D. Hãy xem trên địa chỉ GitHub Pages.

## Trang quản trị

Mở địa chỉ trang web rồi thêm /admin.html (hoặc bấm chữ Quản trị ở cuối trang). Ở đó chỉnh được chữ, tài liệu, link Canva hoặc ảnh slide, ảnh moodboard, bảng màu, font, elements, phông nền 3D, bảng hiệu Đại sứ quán, câu đối, món ăn buffet, mô tả từng khu và lời cảm ơn. Thêm, bớt, đổi thứ tự ảnh đều làm bằng nút, không cần sửa code.

Để xuất bản thay đổi cần một token GitHub. Vào github.com, bấm ảnh đại diện, Settings, kéo xuống Developer settings, Personal access tokens, Fine-grained tokens, Generate new token. Chọn Only select repositories và chọn đúng repo này. Ở mục Repository permissions, đặt Contents thành Read and write. Tạo token rồi sao chép ngay. Trong trang quản trị bấm Kết nối GitHub, điền tên tài khoản, tên repo, dán token, rồi bấm Kết nối. Sau khi kết nối thành công, nút kết nối tự ẩn đi. Sau khi chỉnh xong bấm Xuất bản, khoảng một phút sau trang web cập nhật. Chỉ người có token mới xuất bản được, nên đừng chia sẻ token.

## Điều khiển trong không gian 3D

Chế độ Xoay quanh dùng chuột trái để xoay, chuột phải hoặc phím W A S D để di chuyển, cuộn để phóng to và nhấp đúp vào sàn để bay tới đó. Chế độ Đi bộ bắt đầu từ cổng vào, kéo để nhìn quanh, dùng W A S D hoặc mũi tên để đi, giữ Shift để đi nhanh, bấm vào sàn để tự đi tới đó. Trên điện thoại có cần điều khiển ở góc trái. Nút Bắn pháo hoa giấy tạo mưa giấy màu từ hai bên sân khấu.

Kích thước và vị trí trong mô hình là ước lượng từ ảnh, vị trí các khu nằm ở đầu file js/world.js.
