/*
  NỘI DUNG MẶC ĐỊNH CỦA TRANG WEB
  Nội dung thật được chỉnh trong trang quản trị (admin.html) và lưu ở data/content.json.
  File này chỉ là bản dự phòng khi data/content.json chưa có hoặc thiếu mục nào đó.
*/

export const CONFIG = {
  eventName: 'Xuân Quê hương 2027',
  eventSub: 'Đinh Mùi 2027',
  org: 'Đại sứ quán Việt Nam tại Algeria',
  team: 'Nhóm Thực tập sinh',
  footer: 'Kế hoạch truyền thông cho chương trình Xuân Quê hương 2027 tại Đại sứ quán Việt Nam tại Algeria được thực hiện bởi Nhóm Thực tập sinh.',

  theme: {
    headingFont: 'Fraunces',
    bodyFont: 'Be Vietnam Pro',
    customFonts: [
      { name: 'Amarego', file: '' },
      { name: 'Assox', file: '' },
      { name: 'Best Swashed', file: '' },
      { name: 'Beautique Display Condensed', file: '' }
    ],
    colors: {
      brand: '#f3dca3', heroTitle: '#e3b04b', heroText: '#f3dca3',
      pageTitle: '#72101a', sectionTitle: '#72101a', body: '#655658',
      thanksTitle: '#e3b04b', thanksText: '#f3dca3', footer: '#655658',
      bannerTitle: '#f3dca3', bannerSub: '#e3b04b', couplet: '#f3dca3', sign: '#f3dca3'
    }
  },

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
    fonts: {
      title: [],
      body: []
    },
    elements: [],
    products: { backdrop: [] }
  },

  scene: {
    backdropImage: 'assets/backdrop/backdrop-2027.jpg',
    backdropSize: [6.4, 3.4],
    useLed: false,
    gateText: 'XUÂN QUÊ HƯƠNG ĐINH MÙI 2027',
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
    booths: {
      coffee: { vi: 'Gian cà phê', fr: 'Stand de café' },
      tea: { vi: 'Gian trà', fr: 'Stand de thé' }
    },
    lixiTitle: 'Hái lộc đầu xuân',
    lixiCards: [],
    lixiTextPos: 'middle',
    lixiTextColor: '#fbe9b8',
    lixiMessages: [
      "Năm mới an khang, vạn sự như ý.",
      "Chúc bạn một năm nhiều niềm vui và thật nhiều sức khỏe.",
      "Tiền vô như nước, tài lộc đầy nhà.",
      "Bonne année ! Que 2027 vous apporte joie et santé.\nNăm mới vui khỏe, nhiều niềm vui.",
      "Cung chúc tân xuân, vạn sự cát tường.",
      "Tết là đoàn viên: hôm nay có người mình thương ở bên, đó là lộc lớn nhất.",
      "Một năm mới bình an, công việc hanh thông.",
      "Mùi mềm mại, năm mới êm đềm, mọi việc suôn sẻ.",
      "Chúc bạn gặp nhiều may mắn và những người bạn tốt.",
      "Que cette nouvelle année vous apporte prospérité et bonheur.\nChúc năm mới thịnh vượng, hạnh phúc.",
      "Sức khỏe dồi dào, tâm an, ý vui.",
      "Xuân sang hoa nở, lộc đến bên thềm.",
      "Học hành tấn tới, sự nghiệp thăng hoa.",
      "Đi đâu cũng gặp quý nhân, làm gì cũng gặp thuận lợi.",
      "Mong gia đình bạn sum vầy, ấm áp trong ngày Tết.",
      "Meilleurs vœux de santé et de réussite !\nChúc sức khỏe và thành công.",
      "Mỗi nụ cười hôm nay là một tấm lộc đầu năm.",
      "Chúc bạn nhiều bình yên giữa những ngày bận rộn.",
      "Cà phê thơm, trà ngát, năm mới ngọt ngào.",
      "Xuân về mang theo hy vọng mới, chúc bạn mọi điều như ý.",
      "Năm mới, bạn bè gần xa luôn nhớ về nhau.",
      "Chúc tình hữu nghị Việt Nam và Algeria mãi xanh tươi như mùa xuân.\nQue l'amitié Vietnam-Algérie reste éternellement printanière.",
      "Lộc xuân đầu năm, may mắn cả năm.",
      "Một chén trà đầu năm, một năm trọn niềm vui.",
      "Chúc bạn bước sang năm mới với trái tim nhẹ nhàng.",
      "Bánh chưng xanh, câu đối đỏ, Tết này thêm ý nghĩa.",
      "Gặp nhau là duyên, cùng đón Tết là lộc.",
      "Ước gì trong năm mới, điều bạn mong sẽ thành.",
      "Joyeux Têt ! Que l'année du Chèvre vous soit douce.\nVui Tết Đinh Mùi, năm Mùi thật êm ái.",
      "Chúc bạn một năm mới rộn ràng tiếng cười."
],
    foods: [
      { kind: 'pho', name: 'Phở bò', note: 'Xin mời!' },
      { kind: 'banhmi', name: 'Bánh mì', note: 'Xin mời!' },
      { kind: 'sup', name: 'Súp', note: 'Xin mời!' },
      { kind: 'che', name: 'Chè', note: 'Xin mời!' },
      { kind: 'banhchung', name: 'Bánh chưng', note: 'Xin mời!' },
      { kind: 'drink', name: 'Nước uống', note: 'Xin mời!' }
    ]
  },

  brochure: {
    title: 'Brochure chương trình',
    front: 'assets/brochure/sample-mat-truoc.jpg',
    back: 'assets/brochure/sample-mat-sau.jpg',
    frontLabel: 'Mặt tiếng Việt',
    backLabel: 'Mặt tiếng Pháp (Verso)',
    note: 'Brochure được phát tại bàn đón tiếp. Khách có thể cầm theo để xem lại chương trình.'
  },

  thanks: {
    title: 'Xin trân trọng cảm ơn',
    message: 'Nhóm Thực tập sinh xin chân thành cảm ơn quý lãnh đạo đã dành thời gian theo dõi kế hoạch truyền thông chương trình Xuân Quê hương 2027. Rất mong nhận được ý kiến đóng góp của quý lãnh đạo để chương trình thêm trọn vẹn.',
    sign: 'Nhóm Thực tập sinh, Đại sứ quán Việt Nam tại Algeria'
  },

  zonesRev: 3,
  themeRev: 1,
  zones: [
    {
      id: 'gate', no: 1, name: 'Cổng chào',
      desc: 'Cổng vòm đỏ trước tường rào, chữ Xuân Quê hương Đinh Mùi 2027 uốn theo vòm, hai bên là hàng rào tre treo nón lá và câu đối.',
      plan: 'Điểm chụp ảnh đầu tiên của khách, thảm đỏ trải từ mép đường tới bàn đón tiếp.'
    },
    {
      id: 'reception', no: 2, name: 'Bàn đón tiếp',
      desc: 'Quầy phủ đỏ có sổ lưu bút, chồng brochure và hai cây đào, mai treo lì xì, câu đối. Bấm vào cây để hái lộc, bấm vào brochure để xem.',
      plan: 'Nhân sự đón khách, phát brochure và hướng dẫn khách tới từng khu.'
    },
    {
      id: 'coffee', no: 3, name: 'Gian thưởng thức cà phê',
      desc: 'Gian mái sọc đỏ trắng, kệ gỗ bày gói cà phê, quầy phin và nhiều cốc để khách nếm thử.',
      plan: 'Hình ảnh nhấn vào cà phê phin nhỏ giọt, hợp quay video ngắn.'
    },
    {
      id: 'tea', no: 4, name: 'Gian thưởng thức trà',
      desc: 'Cùng phong cách gian cà phê, banner xanh lá, kệ hộp trà và bộ ấm chén để khách nếm thử.',
      plan: 'Biển nhỏ song ngữ giới thiệu văn hóa uống trà ngày Tết.'
    },
    {
      id: 'banhchung', no: 5, name: 'Khu trải nghiệm gói bánh chưng',
      desc: 'Bàn gói có lá dong, nếp, nhân và khuôn, phía trước là ba tấm chiếu cói. Nồi bánh đặt ở góc ngoài, có hơi nước bốc lên.',
      plan: 'Khu nhiều ảnh và video nhất, cần một người chụp quay riêng.'
    },
    {
      id: 'cocktail', no: 6, name: 'Bàn tiệc đứng',
      desc: 'Các bàn cao phủ khăn đỏ ở giữa sân để khách vừa đứng dùng món vừa trò chuyện.',
      plan: 'Khu giao lưu chính, dễ ghi lại khoảnh khắc tự nhiên.'
    },
    {
      id: 'buffet', no: 7, name: 'Khu buffet món Việt',
      desc: 'Mái che lớn với sáu bàn: phở, bánh mì, súp, chè, bánh chưng và quầy nước. Bấm vào từng bàn để xem tên món.',
      plan: 'Bốn góc mái có đèn lớn, lối đi giữa các hàng đi một chiều.'
    },
    {
      id: 'seating', no: 8, name: 'Khu mời ngồi',
      desc: 'Các bàn tròn cho khách lớn tuổi, gia đình có trẻ nhỏ, đặt bên trái gần sân khấu dưới tán cây.',
      plan: 'Có thể đặt biển giữ chỗ cho khách mời chính.'
    },
    {
      id: 'standing', no: 9, name: 'Khu khách đứng',
      desc: 'Khoảng sân rộng trước sân khấu, nơi phần lớn trong 150 khách đứng theo dõi chương trình.',
      plan: 'Chừa lối đi hai bên cho nhân sự và máy quay.'
    },
    {
      id: 'stage', no: 10, name: 'Sân khấu',
      desc: 'Bục thấp trải thảm đỏ sát tường trắng, đủ cho phát biểu, trao quà và chụp ảnh tập thể.',
      plan: 'Hai chậu đào, mai ở hai đầu bục, dây đèn chạy dọc tường phía trên.'
    },
    {
      id: 'backdrop', no: 11, name: 'Phông nền',
      desc: 'Phông 2027 cần nét giao thoa với Algeria. Thiết kế của team được thêm trong trang quản trị và hiện ngay trên sân khấu.',
      plan: 'Là nền chụp ảnh tập thể, chữ và họa tiết phải đọc rõ khi có đông người đứng trước.'
    },
    {
      id: 'podium', no: 12, name: 'Bục phát biểu',
      desc: 'Đặt bên trái sân khấu, có micro và biểu tượng chương trình, người phát biểu đứng gần phông.',
      plan: 'Kiểm tra góc máy từ khu khách đứng để phông luôn nằm gọn sau người phát biểu.'
    }
  ]
};
