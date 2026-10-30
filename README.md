# Kế hoạch truyền thông Xuân Quê hương 2027

Trang web trình bày kế hoạch truyền thông gồm năm phần theo thứ tự xem: mở đầu, nội dung trình bày, proposal (slide), moodboard và visual cue, không gian 3D khu sân tổ chức.

## Đưa lên GitHub Pages

Tạo một repo mới trên GitHub, giải nén thư mục này và tải toàn bộ nội dung lên (index.html phải nằm ngay ở gốc repo). Vào Settings, chọn Pages, ở mục Source chọn Deploy from a branch, chọn nhánh main và thư mục root, rồi Save. Sau khoảng một phút, trang sẽ có địa chỉ dạng https://ten-tai-khoan.github.io/ten-repo/.

Không mở index.html bằng cách bấm đúp trực tiếp, vì trình duyệt sẽ chặn phần 3D. Để xem thử trên máy, mở terminal trong thư mục này và chạy `python3 -m http.server 8000`, rồi vào http://localhost:8000.

## Thay nội dung

Mọi thứ cần thay đều nằm trong js/config.js, có chú thích từng mục. Các thư mục ảnh và file nằm trong assets.

Ảnh thiết kế trang mở đầu bỏ vào assets/hero với tên key-visual.jpg. File tài liệu bỏ vào assets/docs với tên ke-hoach-truyen-thong-tong-quan.docx và .pdf. Link nhúng Canva dán vào proposal.canvaEmbedUrl. Ảnh moodboard bỏ vào assets/moodboard rồi liệt kê trong config. Thiết kế phông nền sân khấu bỏ vào assets/backdrop với tên backdrop-2027.jpg, phông sẽ tự hiện trên sân khấu 3D.

## Nội dung 3D

Mô hình sân được dựng từ ảnh chương trình năm 2026 (trong assets/ref). Vị trí các khu nằm ở đầu file js/scene3d.js, chữ mô tả từng khu nằm trong config.js. Kích thước trong mô hình tính bằng mét và là ước lượng, cần đối chiếu với mặt bằng thật trước khi dùng cho việc khác ngoài trình bày.
