/*
  NỘI DUNG MẶC ĐỊNH CỦA TRANG WEB
  Nội dung thật được chỉnh trong trang quản trị (admin.html) và lưu ở data/content.json.
  File này chỉ là bản dự phòng khi data/content.json chưa có hoặc thiếu mục nào đó.
*/

export const CONFIG = {
  eventName: 'Xuân Quê hương 2027',
  eventSub: 'Đinh Mùi 2027',
  org: 'Đại sứ quán Việt Nam tại Algeria',
  team: 'Nhóm thực tập sinh',

  hero: { image: 'assets/hero/key-visual.jpg', fit: 'cover', button: 'Bắt đầu xem' },

  content: {
    title: 'Nội dung trình bày',
    lead: 'Chọn cách xem phù hợp. Kho tài liệu dùng để tải bản kế hoạch về trình bày với Đại sứ, còn phần Proposal dẫn qua toàn bộ kế hoạch bằng slide, rồi tới moodboard và không gian 3D của sân tổ chức.',
    docsTitle: 'Kho lưu trữ tài liệu mềm',
    docsDesc: 'Bản kế hoạch truyền thông tổng quan dạng văn bản, phục vụ tải về để chỉnh sửa hoặc in.',
    proposalTitle: 'Proposal',
    proposalDesc: 'Xem kế hoạch truyền thông tổng quan và timeline truyền thông online, offline dưới dạng slide.',
    proposalButton: 'Mở phần slide'
  },

  documents: [
    { label: 'Bản Word', file: 'assets/docs/ke-hoach-truyen-thong-tong-quan.docx', note: 'Dùng để chỉnh sửa hoặc trình bày với Đại sứ' },
    { label: 'Bản PDF', file: 'assets/docs/ke-hoach-truyen-thong-tong-quan.pdf', note: 'Dùng để xem nhanh và in' }
  ],

  proposal: {
    title: 'Proposal truyền thông',
    lead: 'Kế hoạch truyền thông tổng quan, timeline truyền thông online và offline.',
    canvaEmbedUrl: '',
    slideImages: []
  },

  moodboard: {
    title: 'Moodboard và visual cue',
    lead: 'Không khí, hình ảnh nhận diện và các yếu tố đồ họa xuyên suốt chương trình.',
    images: [],
    keyVisual: { image: '', caption: 'Key visual của chương trình' },
    palette: [
      { name: 'Đỏ lụa', hex: '#A8141F', role: 'Màu chủ đạo, khăn bàn, lồng đèn' },
      { name: 'Vàng mai', hex: '#E3B04B', role: 'Chữ tiêu đề, đường viền' },
      { name: 'Hồng đào', hex: '#F2A5B8', role: 'Hoa, dải trang trí' },
      { name: 'Xanh lá dong', hex: '#2F6B3F', role: 'Khu bánh chưng, điểm nhấn' },
      { name: 'Trắng vôi', hex: '#F3F1EC', role: 'Nền, khoảng thở' }
    ],
    fonts: [
      { role: 'Chữ tiêu đề', family: 'Cormorant Garamond', sample: 'Xuân Quê hương Đinh Mùi 2027' },
      { role: 'Chữ nội dung', family: 'Be Vietnam Pro', sample: 'Gắn kết cộng đồng, lan tỏa bản sắc Việt Nam' }
    ],
    elements: []
  },

  scene: {
    backdropImage: 'assets/backdrop/backdrop-2027.jpg',
    backdropSize: [6.4, 3.4],
    useLed: false,
    emblemImage: 'assets/ref/quoc-huy.png',
    embassy: {
      nameVi: 'ĐẠI SỨ QUÁN VIỆT NAM TẠI ALGERIA',
      nameFr: 'AMBASSADE DE LA RÉPUBLIQUE SOCIALISTE DU VIETNAM EN ALGÉRIE',
      address: '30, Chénoua Street, Hydra, Algiers, Algeria'
    },
    couplets: {
      left: 'Xuân Sang Cội Phúc Sinh Nhành Lộc',
      right: 'Tết Về Cây Đức Trổ Thêm Hoa'
    },
    foods: [
      { kind: 'pho', name: 'Phở bò', image: 'assets/food/pho.jpg' },
      { kind: 'banhmi', name: 'Bánh mì', image: 'assets/food/banh-mi.jpg' },
      { kind: 'sup', name: 'Súp', image: 'assets/food/sup.jpg' },
      { kind: 'che', name: 'Chè', image: 'assets/food/che.jpg' },
      { kind: 'banhchung', name: 'Bánh chưng', image: '' },
      { kind: 'drink', name: 'Nước uống', image: '' }
    ]
  },

  thanks: {
    title: 'Xin trân trọng cảm ơn',
    message: 'Nhóm thực tập sinh xin chân thành cảm ơn quý lãnh đạo đã dành thời gian theo dõi kế hoạch truyền thông chương trình Xuân Quê hương 2027. Rất mong nhận được ý kiến đóng góp của quý lãnh đạo để chương trình thêm trọn vẹn.',
    sign: 'Nhóm thực tập sinh, Đại sứ quán Việt Nam tại Algeria'
  },

  zones: [
    {
      id: 'gate', no: 1, name: 'Cổng chào',
      desc: 'Cổng vòm đỏ trang trí hoa giấy, quạt, đồng tiền vàng và lồng đèn, phía trên là biển Xuân Quê hương 2027. Hai bên là hàng rào tre treo nón lá và câu đối chữ thoi. Bên cạnh có bảng hiệu Đại sứ quán kèm quốc huy và địa chỉ.',
      plan: 'Điểm chụp ảnh đầu tiên của khách. Thảm đỏ dẫn thẳng từ cổng tới bàn đón tiếp.',
      refs: ['assets/ref/ref-cong-1.jpg', 'assets/ref/ref-cong-2.jpg', 'assets/ref/ref-cong-3.jpg']
    },
    {
      id: 'reception', no: 2, name: 'Bàn đón tiếp',
      desc: 'Điểm đến đầu tiên sau cổng chào. Quầy phủ đỏ có sổ lưu bút, thiệp và chậu hoa mai, hoa đào hai bên, phía sau là panel chào mừng song ngữ Việt Pháp.',
      plan: 'Nhân sự đón khách, phát sơ đồ chương trình và hướng dẫn khách tới từng khu. Đây cũng là nơi cho khách quét mã QR xem ảnh sau sự kiện.',
      refs: []
    },
    {
      id: 'coffee', no: 3, name: 'Gian thưởng thức cà phê',
      desc: 'Gian hàng lớn với mái che sọc đỏ trắng, banner cà phê phía sau, kệ gỗ bày gói cà phê, quầy có phin và nhiều cốc cà phê. Hai bên treo câu đối và lồng đèn, cạnh gian đặt chậu hoa đào.',
      plan: 'Hình ảnh truyền thông nhấn vào khoảnh khắc cà phê phin nhỏ giọt và khách quốc tế nếm thử, phù hợp quay video ngắn.',
      refs: ['assets/ref/ref-ca-phe.jpg', 'assets/ref/ref-gian-hang.jpg']
    },
    {
      id: 'tea', no: 4, name: 'Gian thưởng thức trà',
      desc: 'Gian trà cùng phong cách với gian cà phê nhưng banner màu xanh lá. Kệ bày hộp và lon trà, quầy có bộ ấm chén và nhiều chén trà để khách nếm thử.',
      plan: 'Biển nhỏ song ngữ giới thiệu văn hóa uống trà ngày Tết đặt cạnh quầy.',
      refs: ['assets/ref/ref-tra.jpg', 'assets/ref/ref-gian-hang.jpg']
    },
    {
      id: 'banhchung', no: 5, name: 'Khu trải nghiệm gói bánh chưng',
      desc: 'Bàn gói có lá dong, nếp, nhân và khuôn, phía trước là ba tấm chiếu cói để khách ngồi gói cùng người hướng dẫn. Nồi bánh đặt ở góc ngoài, dễ nhìn từ lối đi, có hơi nước bốc lên.',
      plan: 'Khu nhiều ảnh và video tương tác nhất, nên bố trí một người chụp quay riêng và người hướng dẫn nói được tiếng Pháp.',
      refs: ['assets/ref/ref-chieu-coi.jpg', 'assets/ref/ref-gian-hang.jpg']
    },
    {
      id: 'cocktail', no: 6, name: 'Bàn tiệc đứng',
      desc: 'Các bàn cao phủ khăn đỏ đặt rải ở giữa sân để khách vừa đứng dùng món vừa trò chuyện, trên bàn có bát giấy kraft và ly kẻ caro đỏ như năm 2026.',
      plan: 'Khu giao lưu chính giữa cộng đồng và đại diện chính quyền sở tại, dễ ghi lại khoảnh khắc tự nhiên.',
      refs: ['assets/ref/ref-ban-tiec-dung.jpg']
    },
    {
      id: 'buffet', no: 7, name: 'Khu buffet món Việt',
      desc: 'Mái che lớn với sáu bàn, mỗi bàn một món có ảnh minh họa. Gồm phở, bánh mì, súp, chè, bánh chưng và quầy nước, đủ phục vụ trên 150 khách chia thành các hàng đợi.',
      plan: 'Biển tên món song ngữ, hai bên mái treo lồng đèn và câu đối. Lối đi giữa các hàng một chiều để khách không dồn lại một điểm.',
      refs: ['assets/ref/ref-quay-buffet.jpg', 'assets/ref/ref-gian-hang.jpg']
    },
    {
      id: 'seating', no: 8, name: 'Khu mời ngồi',
      desc: 'Các bàn tròn cho khách lớn tuổi, gia đình có trẻ nhỏ và khách cần nghỉ chân, đặt bên trái gần sân khấu, dưới tán cây.',
      plan: 'Có thể đặt biển giữ chỗ nhỏ trên bàn cho khách mời chính.',
      refs: []
    },
    {
      id: 'standing', no: 9, name: 'Khu khách đứng',
      desc: 'Khoảng sân rộng trước sân khấu, nơi phần lớn trong khoảng 150 khách đứng theo dõi chương trình phát biểu và giao lưu.',
      plan: 'Chừa lối đi hai bên để nhân sự phục vụ và máy quay di chuyển mà không chắn tầm nhìn.',
      refs: ['assets/ref/ref-san-khau.jpg']
    },
    {
      id: 'stage', no: 10, name: 'Sân khấu',
      desc: 'Bục thấp trải thảm đỏ sát tường trắng, đủ rộng cho phát biểu, trao quà và chụp ảnh tập thể cuối chương trình.',
      plan: 'Hai chậu đào và mai đặt hai đầu bục, dây đèn nhỏ chạy dọc tường phía trên, hai bên phông treo câu đối.',
      refs: ['assets/ref/ref-san-khau.jpg']
    },
    {
      id: 'backdrop', no: 11, name: 'Phông nền',
      desc: 'Năm 2026 phông là tấm in có đèn rọi phía trên, chưa dùng màn LED. Phông 2027 cần có nét giao thoa với nước bạn Algeria. Thiết kế của team được thêm trong trang quản trị và hiện ngay trên sân khấu.',
      plan: 'Phông cũng là nền chụp ảnh tập thể, nên chữ và họa tiết cần đọc rõ khi có đông người đứng phía trước.',
      refs: ['assets/ref/ref-phong-nen-2026.jpg']
    },
    {
      id: 'podium', no: 12, name: 'Bục phát biểu',
      desc: 'Đặt bên trái sân khấu, có micro và biểu tượng chương trình ở mặt trước. Người phát biểu đứng sau bục, gần phông để lên hình nhưng không che chữ chính.',
      plan: 'Cần kiểm tra góc máy từ khu khách đứng để phông luôn nằm gọn sau người phát biểu.',
      refs: ['assets/ref/ref-san-khau.jpg']
    }
  ]
};
