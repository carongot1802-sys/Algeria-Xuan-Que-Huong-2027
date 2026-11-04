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
    lead: 'Chọn cách xem phù hợp. Kho tài liệu dùng để tải bản kế hoạch về trình bày với Đại sứ, còn phần Proposal trình bày toàn bộ kế hoạch ngay trên trang, rồi tới moodboard và không gian 3D của sân tổ chức.',
    docsTitle: 'Kho lưu trữ tài liệu mềm',
    docsDesc: 'Bản kế hoạch truyền thông tổng quan dạng văn bản, phục vụ tải về để chỉnh sửa hoặc in.',
    proposalTitle: 'Proposal',
    proposalDesc: 'Xem kế hoạch truyền thông tổng quan và timeline truyền thông online, offline của chương trình.',
    proposalButton: 'Mở phần Proposal'
  },

  documents: [
    { label: 'Bản Word', file: 'assets/docs/ke-hoach-truyen-thong-tong-quan.docx', note: 'Dùng để chỉnh sửa hoặc trình bày với Đại sứ' },
    { label: 'Bản PDF', file: 'assets/docs/ke-hoach-truyen-thong-tong-quan.pdf', note: 'Dùng để xem nhanh và in' }
  ],

  proposal: {
    title: 'Proposal truyền thông',
    lead: 'Kế hoạch truyền thông tổng quan và timeline truyền thông online, offline cho chương trình Xuân Quê hương Đinh Mùi 2027 tại Algeria.',
    overview: {
      title: 'Kế hoạch truyền thông tổng quan',
      info: [
        { k: 'Tên chương trình', v: 'Xuân Quê hương - Đinh Mùi 2027 tại Algeria.' },
        { k: 'Thời gian, địa điểm', v: 'Dự kiến đầu tháng 02/2027 tại Algiers; ngày, giờ và địa điểm cụ thể do Đại sứ quán phê duyệt.' },
        { k: 'Quy mô, công chúng', v: 'Khoảng 150 khách mời: cộng đồng người Việt Nam tại Algeria; đại diện chính quyền, tổ chức và bạn bè sở tại.' },
        { k: 'Hình thức tổ chức', v: 'Chương trình gặp mặt, chúc Tết kết hợp giao lưu và trải nghiệm văn hóa truyền thống Việt Nam, với các hoạt động dự kiến như biểu diễn văn nghệ, gói bánh chưng, thưởng trà và cà phê Việt, thưởng thức ẩm thực truyền thống, giao lưu và chụp ảnh lưu niệm.' },
        { k: 'Phương châm truyền thông', v: 'Lấy không khí sum vầy và các hoạt động trải nghiệm văn hóa làm trọng tâm, qua đó khơi gợi tình cảm gắn bó với quê hương trong cộng đồng người Việt Nam tại Algeria. Đồng thời, giới thiệu những nét đặc sắc của Tết cổ truyền và lan tỏa hình ảnh một Việt Nam giàu bản sắc, thân thiện, hiếu khách tới bạn bè sở tại.' }
      ],
      purpose: 'Tạo không gian đón Tết ấm áp, gắn kết cộng đồng người Việt Nam tại Algeria, khơi gợi tình yêu quê hương và ý thức gìn giữ bản sắc văn hóa dân tộc. Đồng thời, giới thiệu những nét đẹp của Tết cổ truyền tới bạn bè sở tại, góp phần tăng cường sự hiểu biết và tình hữu nghị Việt Nam - Algeria.',
      goals: [
        { k: 'Về nhận thức', v: 'Giúp cộng đồng người Việt, đặc biệt là thế hệ trẻ tại Algeria, hiểu và trân trọng các giá trị văn hóa truyền thống. Đồng thời, giúp khách mời sở tại tìm hiểu ý nghĩa Tết Nguyên đán, phong tục sum họp và nét đẹp văn hóa Việt Nam thông qua các hoạt động trải nghiệm và ấn phẩm song ngữ.' },
        { k: 'Về cảm nhận', v: 'Khơi gợi tình cảm gắn bó, niềm tự hào quê hương và tinh thần đoàn kết trong cộng đồng người Việt; đồng thời thể hiện sự quan tâm của Đại sứ quán đối với kiều bào. Qua các hoạt động giao lưu, tạo ấn tượng tốt đẹp về một Việt Nam giàu bản sắc, thân thiện và hiếu khách trong lòng bạn bè Algeria.' },
        { k: 'Về hành vi', v: 'Khuyến khích cộng đồng người Việt tích cực giao lưu, tham gia các hoạt động đón Tết, chia sẻ và gìn giữ phong tục truyền thống. Đồng thời, tạo cơ hội để khách mời sở tại trải nghiệm gói bánh chưng, thưởng thức ẩm thực, trà, cà phê Việt và các tiết mục văn nghệ, qua đó lan tỏa văn hóa Việt Nam và tăng cường sự kết nối giữa hai cộng đồng.' }
      ],
      audienceIntro: 'Chương trình hướng tới cộng đồng người Việt Nam tại Algeria, đồng thời mở rộng hoạt động giao lưu văn hóa tới đại diện chính quyền và bạn bè sở tại. Nội dung truyền thông được xây dựng phù hợp với đặc điểm của từng nhóm công chúng.',
      audiences: [
        { group: 'Cộng đồng người Việt tại Algeria', need: 'Mong muốn đón Tết trong không khí quê nhà, gặp gỡ đồng hương, gắn kết các thế hệ và gìn giữ bản sắc dân tộc.', approach: 'Khơi gợi tinh thần đoàn viên, tình yêu quê hương thông qua các hoạt động đón Tết, gói bánh chưng, giao lưu và chia sẻ những khoảnh khắc sum vầy.' },
        { group: 'Đại diện chính quyền, cơ quan và khách mời sở tại', need: 'Quan tâm đến văn hóa, hình ảnh đất nước, con người Việt Nam và quan hệ hữu nghị Việt Nam - Algeria.', approach: 'Đề cao tính trang trọng và giao lưu văn hóa thông qua phát biểu, giới thiệu phong tục Tết, ấn phẩm song ngữ và các hoạt động trải nghiệm.' },
        { group: 'Bạn bè Algeria, gia đình Việt - Algeria', need: 'Mong muốn tìm hiểu văn hóa, phong tục và ẩm thực Việt Nam qua những trải nghiệm gần gũi.', approach: 'Giới thiệu bản sắc văn hóa Việt Nam qua hoạt động gói bánh chưng, thưởng thức ẩm thực, trà, cà phê và văn nghệ truyền thống.' },
        { group: 'Công chúng tiếp cận qua các kênh truyền thông của Đại sứ quán', need: 'Quan tâm đến hoạt động cộng đồng và những nét đặc sắc trong văn hóa Việt Nam.', approach: 'Lan tỏa hình ảnh Tết Việt qua bài tổng kết, hình ảnh nổi bật trên Facebook và bản tin chính thức trên website Đại sứ quán.' }
      ],
      keyMessage: '“Xuân Quê hương - Đinh Mùi 2027” là dịp cộng đồng người Việt tại Algeria sum họp, cùng bạn bè sở tại trải nghiệm hương vị và phong tục Tết Việt, qua đó tăng cường gắn kết với quê hương và vun đắp tình hữu nghị giữa nhân dân hai nước.',
      hookName: 'Gói trọn Xuân quê',
      hook: 'Key visual của chương trình lấy hình con dê vàng, biểu tượng năm Đinh Mùi, làm trung tâm; hình ảnh bánh chưng được dùng làm điểm nhấn trên các ấn phẩm, tượng trưng cho việc gìn giữ truyền thống và chia sẻ văn hóa. Đây là ý tưởng hỗ trợ nội dung, không thay thế tên gọi chính thức hay làm lu mờ tính trang trọng của sự kiện.',
      pillars: [
        { name: 'Xuân đoàn viên', focus: 'Gắn kết cộng đồng người Việt xa quê, khơi gợi tình cảm hướng về quê hương và sự kết nối giữa các thế hệ.', activities: 'Gặp mặt, chúc Tết, giao lưu đồng hương, ghi lại những khoảnh khắc sum vầy.' },
        { name: 'Xuân mang bản sắc', focus: 'Gìn giữ, giới thiệu và lan tỏa các giá trị văn hóa truyền thống Việt Nam.', activities: 'Tìm hiểu văn hóa, văn nghệ, gói bánh chưng, thưởng trà, cà phê Việt, thưởng thức ẩm thực, tìm hiểu phong tục Tết cổ truyền.' },
        { name: 'Xuân của tình hữu nghị', focus: 'Tôn vinh sự giao lưu, gắn kết giữa cộng đồng người Việt Nam và bạn bè Algeria. Qua đó, góp phần tăng cường sự hiểu biết, tình cảm hữu nghị và lan tỏa hình ảnh đất nước.', activities: 'Thưởng thức ẩm thực truyền thống, biểu diễn văn nghệ và cùng trải nghiệm văn hóa Tết Việt.' }
      ],
      phases: [
        { k: 'Trước sự kiện', v: 'Phối hợp gửi thư mời, xác nhận khách tham dự, chuẩn bị brochure song ngữ Việt - Pháp, backdrop, ấn phẩm giới thiệu các hoạt động trải nghiệm và kế hoạch ghi hình, chụp ảnh. Trên kênh online, đăng thông báo chương trình cùng key visual, giới thiệu các hoạt động trải nghiệm và đăng bài nhắc lịch trước ngày diễn ra.' },
        { k: 'Trong sự kiện', v: 'Bố trí ấn phẩm truyền thông, ghi nhận thông tin và hình ảnh các hoạt động nổi bật, tập trung vào không khí đoàn viên, hoạt động chúc Tết, trải nghiệm văn hóa và giao lưu Việt Nam - Algeria.' },
        { k: 'Sau sự kiện', v: 'Biên tập 01 bài tổng kết trên Facebook kèm 8-12 ảnh tiêu biểu và 01 bản tin trên website Đại sứ quán kèm 4-6 ảnh. Nội dung được kiểm duyệt trước khi đăng tải, dự kiến trong 1-3 ngày làm việc sau chương trình.' }
      ],
      channels: [
        { k: 'Online', v: 'Sử dụng Facebook và website chính thức của Đại sứ quán để đăng tải bài thông báo, giới thiệu chương trình và nhắc lịch trước sự kiện, bài viết tổng kết, hình ảnh các hoạt động nổi bật và thông tin về chương trình sau sự kiện. Nội dung được kiểm duyệt trước khi công bố.' },
        { k: 'Offline', v: 'Triển khai thư mời chính thức, backdrop, brochure song ngữ Việt - Pháp, bảng giới thiệu tại các khu trải nghiệm văn hóa và các vật phẩm trang trí Tết, góp phần tạo không gian ấm cúng, trang trọng và quảng bá bản sắc văn hóa Việt Nam.' }
      ]
    },
    timeline: {
      title: 'Timeline truyền thông',
      note: 'D là ngày diễn ra sự kiện. Các mốc tính theo tuần hoặc ngày so với ngày D.',
      groups: [
        { name: 'Trước sự kiện', rows: [
          { when: '4-5 tuần trước sự kiện', offline: ['Chốt ngày, giờ, địa điểm với ĐSQ', 'Chốt danh sách khách mời (~150 người)', 'Chốt key visual “Gói trọn Xuân quê” và nội dung brochure VI-FR'], online: ['Chuẩn bị sẵn khung bài Facebook và bản tin website', 'Chốt nội dung và lịch đăng, gửi ĐSQ duyệt kế hoạch bài'] },
          { when: 'D-4 tuần', offline: ['Hoàn thiện thiết kế backdrop, brochure song ngữ, bảng giới thiệu các khu trải nghiệm', 'Gửi ĐSQ duyệt'], online: [] },
          { when: 'D-3 tuần', offline: ['Gửi thư mời chính thức', 'Gửi in backdrop, brochure, bảng giới thiệu'], online: [] },
          { when: 'D-2 tuần', offline: ['Theo dõi và xác nhận khách tham dự', 'Lên kế hoạch ghi hình, chụp ảnh (phân công người chụp, danh sách khoảnh khắc cần có theo 3 pillar)'], online: ['Thông báo chương trình, key visual “Gói trọn Xuân quê”'] },
          { when: 'D-1 tuần', offline: ['Nhận và kiểm tra ấn phẩm in', 'Chuẩn bị vật phẩm trang trí Tết', 'Chốt phương án bố trí không gian'], online: ['Giới thiệu các hoạt động trải nghiệm', 'Đăng hình ảnh thư mời tham dự Chương trình'] },
          { when: 'D-1 hôm trước', offline: ['Dựng backdrop, bố trí ấn phẩm, bảng giới thiệu và đồ trang trí', 'Chạy thử, tổng duyệt'], online: ['Đăng bài nhắc lịch “ngày mai diễn ra” (thời gian, địa điểm)'] }
        ] },
        { name: 'Ngày sự kiện', rows: [
          { when: 'D', offline: ['Phát brochure cho khách', 'Ghi hình, chụp ảnh các điểm nhấn: chúc Tết, văn nghệ, gói bánh chưng, trà, cà phê, ẩm thực, giao lưu Việt - Algeria'], online: ['Ghi nhận hình ảnh, thông tin để làm bài tổng kết'] }
        ] },
        { name: 'Sau sự kiện', rows: [
          { when: 'D+1', offline: ['Lọc ảnh', 'Rà soát thông tin (tên, chức danh khách mời)'], online: ['Soạn bài tổng kết Facebook (8-12 ảnh)', 'Soạn bản tin website (4-6 ảnh)'] },
          { when: 'D+1 đến D+2', offline: ['Gửi ĐSQ kiểm duyệt nội dung'], online: ['Chỉnh sửa theo góp ý của ĐSQ'] },
          { when: 'D+1 đến D+3 ngày làm việc', offline: [], online: ['Đăng bài lên Facebook và website chính thức của ĐSQ'] }
        ] }
      ]
    }
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

  proposalRev: 1,
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
