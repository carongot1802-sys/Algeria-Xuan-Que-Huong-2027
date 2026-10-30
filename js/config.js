/*
  FILE CẤU HÌNH DUY NHẤT CỦA TRANG WEB
  Team chỉ cần sửa file này để thay nội dung, không cần đụng vào code khác.
  Đường dẫn ảnh và file tính từ thư mục gốc của repo (nơi có index.html).
*/

export const CONFIG = {
  eventName: 'Xuân Quê hương 2027',
  eventSub: 'Đinh Mùi 2027',
  org: 'Đại sứ quán Việt Nam tại Algeria',
  team: 'Nhóm thực tập sinh',

  /* 1. TRANG MỞ ĐẦU
     Thả ảnh thiết kế (đã có sẵn tiêu đề Kế hoạch truyền thông) vào assets/hero/
     rồi sửa tên file bên dưới. Nếu chưa có ảnh, trang sẽ hiện bản tạm.
     fit = 'cover' (phủ kín màn hình) hoặc 'contain' (hiện trọn ảnh, không bị cắt). */
  hero: {
    image: 'assets/hero/key-visual.jpg',
    fit: 'cover'
  },

  /* 2. CHO CÁC DOCUMENTS
     Upload file vào assets/docs/ rồi sửa tên file. Có thể thêm hoặc bớt dòng. */
  documents: [
    {
      label: 'Bản Word',
      file: 'assets/docs/ke-hoach-truyen-thong-tong-quan.docx',
      note: 'Dùng để chỉnh sửa hoặc trình bày với Đại sứ'
    },
    {
      label: 'Bản PDF',
      file: 'assets/docs/ke-hoach-truyen-thong-tong-quan.pdf',
      note: 'Dùng để xem nhanh và in'
    }
  ],

  /* 3. PROPOSAL (SLIDE)
     Cách 1 (nên dùng) dán link nhúng của Canva vào canvaEmbedUrl.
       Trên Canva chọn Chia sẻ, Xem thêm, Nhúng, rồi chép link dạng
       https://www.canva.com/design/XXXX/view?embed
     Cách 2 xuất slide thành ảnh, bỏ vào assets/slides/ rồi liệt kê trong slideImages.
       Với cách này, bấm qua slide cuối trang sẽ tự chuyển sang Moodboard.
     Nếu cả hai cùng trống, trang hiện khung chờ. */
  proposal: {
    canvaEmbedUrl: '',
    slideImages: [
      // 'assets/slides/slide-01.jpg',
      // 'assets/slides/slide-02.jpg',
    ]
  },

  /* 4. MOODBOARD VÀ VISUAL CUE
     Bỏ ảnh vào assets/moodboard/ rồi liệt kê. Khi để trống, trang hiện ô chờ. */
  moodboard: {
    images: [
      // { src: 'assets/moodboard/mb-01.jpg', caption: 'Không khí sum họp' },
    ],
    keyVisual: {
      image: '', // ví dụ 'assets/moodboard/key-visual.jpg'
      caption: 'Key visual của chương trình'
    },
    // Bảng màu đề xuất, rút ra từ ảnh chương trình năm 2026. Team thay bằng bảng màu thật.
    palette: [
      { name: 'Đỏ lụa', hex: '#A8141F', role: 'Màu chủ đạo, khăn bàn, lồng đèn' },
      { name: 'Vàng mai', hex: '#E3B04B', role: 'Chữ tiêu đề, đường viền' },
      { name: 'Hồng đào', hex: '#F2A5B8', role: 'Hoa, dải trang trí' },
      { name: 'Xanh lá dong', hex: '#2F6B3F', role: 'Khu bánh chưng, điểm nhấn' },
      { name: 'Trắng vôi', hex: '#F3F1EC', role: 'Nền, khoảng thở' }
    ],
    typography: {
      display: 'Cormorant Garamond',
      body: 'Be Vietnam Pro',
      sample: 'Xuân Quê hương Đinh Mùi 2027'
    },
    elements: [
      // { src: 'assets/moodboard/el-lantern.png', caption: 'Lồng đèn' },
    ]
  },

  /* 5. KHÔNG GIAN 3D
     backdropImage là ảnh phông nền trong mô hình 3D. Thả file thiết kế phông
     vào assets/backdrop/ để xem thiết kế thật trên sân khấu.
     backdropSize là kích thước phông thật tính bằng mét (rộng, cao).
     useLed = true nếu đổi phông thành màn hình LED (phông sẽ tự phát sáng). */
  scene: {
    backdropImage: 'assets/backdrop/backdrop-2027.jpg',
    backdropSize: [6.4, 3.4],
    useLed: false
  },

  /* Các khu trong mô hình 3D, xếp theo hành trình của khách từ cổng vào đến sân khấu.
     id phải khớp với mã khu trong js/scene3d.js. Chỉ nên sửa chữ. */
  zones: [
    {
      id: 'gate', no: 1, name: 'Cổng chào và bàn đón khách',
      desc: 'Điểm bắt đầu hành trình của khách. Cổng dựng bằng hai trụ đỏ, treo lồng đèn và đặt chậu hoa đào hai bên. Bàn đón khách đặt cạnh cổng để hướng dẫn và phát thiệp.',
      plan: 'Gợi ý truyền thông tại chỗ: biển tên chương trình, mã QR dẫn tới trang đăng ảnh sau sự kiện, và điểm chụp ảnh đầu tiên cho khách.',
      ref: ''
    },
    {
      id: 'coffee', no: 2, name: 'Gian thưởng thức cà phê',
      desc: 'Gian hàng giới thiệu cà phê Việt Nam. Quầy phủ khăn trắng, có dải hoa đào và lồng đèn treo phía trên, phía sau là poster giới thiệu.',
      plan: 'Gợi ý hình ảnh truyền thông: khoảnh khắc cà phê phin nhỏ giọt và khách quốc tế nếm thử. Phù hợp để quay video ngắn.',
      ref: 'assets/ref/ref-gian-hang.jpg'
    },
    {
      id: 'tea', no: 3, name: 'Gian thưởng thức trà',
      desc: 'Gian hàng trà đặt cạnh gian cà phê để khách đi tiếp tự nhiên. Quầy bày ấm, chén và khay trà, bố trí đồng bộ với gian cà phê.',
      plan: 'Gợi ý nội dung: giới thiệu ngắn về văn hóa uống trà ngày Tết, song ngữ Việt Pháp trên biển nhỏ đặt cạnh quầy.',
      ref: 'assets/ref/ref-gian-hang.jpg'
    },
    {
      id: 'banhchung', no: 4, name: 'Khu trải nghiệm gói bánh chưng',
      desc: 'Hai bàn dài có lá dong, gạo nếp, nhân và khuôn gói, kèm ghế đẩu cho khách ngồi gói. Nồi bánh đặt ở góc khu để khách thấy trọn vòng đời của chiếc bánh.',
      plan: 'Đây là khu có nhiều ảnh và video tương tác nhất, nên bố trí một người chuyên chụp và quay ở đây, cùng người hướng dẫn nói được tiếng Pháp.',
      ref: 'assets/ref/ref-gian-hang.jpg'
    },
    {
      id: 'cocktail', no: 5, name: 'Bàn tiệc đứng',
      desc: 'Các bàn cao phủ khăn đỏ đặt rải ở giữa sân, để khách vừa đứng dùng món vừa trò chuyện. Trên bàn có bát giấy kraft và ly giấy kẻ caro đỏ như ở chương trình năm 2026.',
      plan: 'Khu giao lưu chính giữa cộng đồng và đại diện chính quyền sở tại, nơi dễ ghi lại những khoảnh khắc tự nhiên.',
      ref: 'assets/ref/ref-ban-tiec-dung.jpg'
    },
    {
      id: 'buffet', no: 6, name: 'Quầy món ăn buffet',
      desc: 'Hai quầy dài phủ khăn đỏ kẻ caro với khay giữ nóng, bát kraft và cờ Việt Nam nhỏ trên bàn, đặt dưới mái che phía bên phải để tránh gió và mưa.',
      plan: 'Gợi ý vận hành: biển tên món song ngữ và lối đi một chiều giữa hai quầy để khách không dồn lại một điểm.',
      ref: 'assets/ref/ref-quay-buffet.jpg'
    },
    {
      id: 'seating', no: 7, name: 'Khu mời ngồi',
      desc: 'Các bàn tròn dành cho khách lớn tuổi, gia đình có trẻ nhỏ và khách cần nghỉ chân. Đặt ở bên trái gần sân khấu, dưới tán cây để có bóng mát.',
      plan: 'Có thể đặt biển giữ chỗ nhỏ trên bàn cho khách mời chính.',
      ref: ''
    },
    {
      id: 'standing', no: 8, name: 'Khu khách đứng',
      desc: 'Khoảng sân rộng trước sân khấu, nơi phần lớn trong khoảng 150 khách đứng theo dõi chương trình phát biểu và giao lưu.',
      plan: 'Chừa lối đi hai bên để nhân sự phục vụ và máy quay di chuyển mà không chắn tầm nhìn.',
      ref: 'assets/ref/ref-san-khau.jpg'
    },
    {
      id: 'stage', no: 9, name: 'Sân khấu',
      desc: 'Bục thấp trải thảm đỏ đặt sát bức tường trắng. Đủ rộng cho phát biểu, trao quà và chụp ảnh lưu niệm tập thể cuối chương trình.',
      plan: 'Hai chậu hoa đào và hoa mai đặt hai đầu bục, dây đèn nhỏ chạy dọc tường phía trên.',
      ref: 'assets/ref/ref-san-khau.jpg'
    },
    {
      id: 'backdrop', no: 10, name: 'Phông nền',
      desc: 'Theo ảnh năm 2026, phông là tấm in treo trên tường, có thanh đèn rọi phía trên và chưa dùng màn LED. Trong mô hình, thay ảnh trong thư mục assets/backdrop để xem thiết kế phông 2027 ngay trên sân khấu.',
      plan: 'Phông cũng là nền chụp ảnh tập thể, nên chữ và họa tiết cần đọc rõ khi có đông người đứng phía trước.',
      ref: 'assets/ref/ref-phong-nen-2026.jpg'
    },
    {
      id: 'podium', no: 11, name: 'Bục phát biểu',
      desc: 'Đặt lệch về bên phải sân khấu, đủ gần phông để lên hình nhưng không che chữ chính. Có micro và biểu tượng chương trình ở mặt trước.',
      plan: 'Cần kiểm tra góc máy từ khu khách đứng để phông luôn nằm gọn sau người phát biểu.',
      ref: 'assets/ref/ref-san-khau.jpg'
    }
  ]
};
