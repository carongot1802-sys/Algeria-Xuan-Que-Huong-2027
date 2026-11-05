/*
  NỘI DUNG MẶC ĐỊNH CỦA TRANG WEB
  Toàn bộ nội dung của trang nằm ở file này.
*/

export const CONFIG = {
  eventName: 'Xuân Quê hương 2027',
  eventSub: 'Xuân Quê Hương - Đinh Mùi 2027',
  credit: 'Được thực hiện bởi: Nguyễn Thị Minh Ngọc, Đào Thu Hiền, Nguyễn Trung Thành',
  org: 'Đại sứ quán Việt Nam tại Algeria',
  team: 'Nhóm Thực tập sinh',
  footer: 'Kế hoạch truyền thông cho chương trình Xuân Quê hương 2027 tại Đại sứ quán Việt Nam tại Algeria được thực hiện bởi Nhóm Thực tập sinh.',

  theme: {
    headingFont: 'Fraunces',
    bodyFont: 'EB Garamond (hệ font của chương trình)',
    customFonts: [
      { name: 'Amarego', file: '' },
      { name: 'Assox', file: '' },
      { name: 'Best Swashed', file: '' },
      { name: 'Beautique Display Condensed', file: '' }
    ],
    colors: {
      brand: '#f6e3b4', heroTitle: '#efbf69', heroText: '#f6e3b4',
      pageTitle: '#841b1a', sectionTitle: '#841b1a', body: '#5d4c4c',
      thanksTitle: '#efbf69', thanksText: '#f6e3b4', footer: '#5d4c4c',
      bannerTitle: '#f6e3b4', bannerSub: '#efbf69', couplet: '#f6e3b4', sign: '#f6e3b4'
    }
  },

  hero: { image: '', fit: 'cover', button: 'Bắt đầu xem', art: 'assets/poster/poster-facebook.jpg' },

  content: {
    title: 'Nội dung trình bày',
    lead: 'Dưới đây là kho lưu trữ gồm bản kế hoạch dạng văn bản và các thiết kế trên Canva để tải về hoặc trình bày. Phần Proposal giới thiệu đầy đủ kế hoạch truyền thông ngay trên trang, tiếp đó là moodboard và không gian 3D mô phỏng sân tổ chức sự kiện.',
    docsTitle: 'Kho lưu trữ tài liệu mềm',
    docsDesc: 'Bản kế hoạch dạng văn bản và đường dẫn tới các thiết kế trên Canva: moodboard, phông nền sân khấu, brochure, poster.',
    proposalTitle: 'Proposal',
    proposalDesc: 'Giới thiệu tổng quan kế hoạch truyền thông và timeline các hoạt động online, offline của chương trình.',
    proposalButton: 'Mở phần Proposal'
  },

  documents: [
    { label: 'Bản Google Docs', file: '', link: 'https://docs.google.com/document/d/1A4qeaC25DkdnlFTa34WX3N4cB76Ttdjz0aQNVgl_0gI/edit?usp=sharing', note: 'Bản kế hoạch dạng văn bản, dùng để xem và góp ý trực tiếp' },
    { label: 'Bản PDF', file: 'assets/docs/ke-hoach-truyen-thong-tong-quan.pdf', link: '', note: 'Dùng để xem nhanh, tải về và in' },
    { label: 'Moodboard', file: '', link: 'https://www.canva.com/d/pJ1kRKRdMtmffJr', note: 'Thiết kế moodboard trên Canva: ý tưởng, bảng màu, visual cue, font, elements' },
    { label: 'Phông nền sân khấu', file: '', link: 'https://www.canva.com/d/NY9zhXnXPNV6Tzj', note: 'Thiết kế phông nền sân khấu trên Canva' },
    { label: 'Brochure', file: '', link: 'https://www.canva.com/d/AD_btush8sa71lJ', note: 'Thiết kế brochure hai mặt, tiếng Việt và tiếng Pháp, trên Canva' },
    { label: 'Poster Facebook', file: '', link: 'https://www.canva.com/d/VWtQS7e9AayC3Qn', note: 'Thiết kế poster đăng Facebook, cũng là key visual của sự kiện' }
  ],

  proposal: {
    title: 'Proposal truyền thông',
    lead: 'Kế hoạch truyền thông tổng thể cho chương trình Xuân Quê hương - Đinh Mùi 2027 tại Algeria, gồm định hướng nội dung, các kênh triển khai và timeline thực hiện online, offline.',
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
    lead: 'Phần này giới thiệu định hướng hình ảnh của chương trình, từ ý tưởng tổng quan, bảng màu, font chữ, các yếu tố đồ họa đến những sản phẩm truyền thông hoàn chỉnh. Sắc đỏ Tết Việt kết hợp với hoa văn Hồi giáo thể hiện sự giao thoa văn hóa Việt Nam và Algeria, mang lại cảm giác ấm áp, trang trọng cho toàn bộ sự kiện.',
    images: [
      { src: 'assets/moodboard/01-y-tuong-tong-quan-v3.jpg', caption: '' }
    ],
    keyVisual: {
      image: 'assets/poster/poster-facebook.jpg',
      caption: 'Thiết kế sử dụng tông nền đỏ chủ đạo, kết hợp họa tiết hoa văn Hồi giáo cùng những hình ảnh trang trí đặc trưng của Tết Việt như nan quạt, hoa mai vàng và hoa đào hồng, gợi lên không khí hân hoan, phấn khởi và hạnh phúc. Hình ảnh chú dê tung tăng dưới những cánh chim én bay lượn vừa tạo cảm giác vui tươi, sinh động, vừa gửi gắm tinh thần lạc quan, hội nhập và khát vọng hướng tới tương lai.'
    },
    palette: [
      { name: 'Đỏ son', hex: '#841B1A', role: 'Nền chủ đạo' },
      { name: 'Đỏ quạt nan', hex: '#A71F02', role: 'Màu họa tiết quạt nan' },
      { name: 'Xanh rêu', hex: '#23402F', role: 'Màu nền sản phẩm truyền thông' },
      { name: 'Hồng đào', hex: '#FE909D', role: 'Màu hoa đào' },
      { name: 'Vàng đồng', hex: '#EFBF69', role: 'Màu font và màu họa tiết' },
      { name: 'Vàng nhạt', hex: '#F0C270', role: 'Màu font và màu họa tiết' },
      { name: 'Vàng mai', hex: '#FDD05D', role: 'Màu hoa mai và màu font' },
      { name: 'Vàng cam', hex: '#F0A622', role: 'Màu font và màu họa tiết' }
    ],
    visualCue: [
          {
                "title": "Khung vòm",
                "text": "Trong phông nền, brochure, poster luôn có sự xuất hiện của khung vòm mang đậm màu sắc Hồi giáo. Hoàn toàn có thể cách điệu để phù hợp với sự giao thoa văn hóa hai nước trong dịp Tết Nguyên Đán.",
                "images": [
                      {
                            "src": "assets/moodboard/cut/khung-vom-tet-viet.webp",
                            "caption": "Khung vòm hoa văn",
                            "w": 1081,
                            "h": 508
                      },
                      {
                            "src": "assets/moodboard/cut/khung-vom-phap.webp",
                            "caption": "Khung vòm viền cánh sen",
                            "w": 1110,
                            "h": 542
                      },
                      {
                            "src": "assets/moodboard/cut/khung-vom-poster.webp",
                            "caption": "Khung vòm đứng",
                            "w": 436,
                            "h": 822
                      }
                ]
          },
          {
                "title": "Nan quạt bán nguyệt",
                "text": "Hình nan quạt bán nguyệt xuất hiện dày đặc, xếp lớp tạo không khí Tết; ghép hai hình bán nguyệt thành hình những nan quạt tròn, tạo điểm nhấn thị giác.",
                "images": [
                      {
                            "src": "assets/moodboard/cut/nan-quat-do.webp",
                            "caption": "Cụm quạt xếp lớp",
                            "w": 988,
                            "h": 556
                      },
                      {
                            "src": "assets/moodboard/cut/nan-quat-hoa.webp",
                            "caption": "Nan quạt bán nguyệt",
                            "w": 656,
                            "h": 552
                      },
                      {
                            "src": "assets/moodboard/cut/nan-quat-ban-nguyet.webp",
                            "caption": "Nan quạt bán nguyệt vàng",
                            "w": 692,
                            "h": 346
                      },
                      {
                            "src": "assets/moodboard/cut/nan-quat-dai.webp",
                            "caption": "Dải nan quạt",
                            "w": 1500,
                            "h": 261
                      },
                      {
                            "src": "assets/moodboard/cut/nan-quat-vien.webp",
                            "caption": "Viền nan quạt đỏ cam",
                            "w": 1413,
                            "h": 260
                      }
                ]
          },
          {
                "title": "Trống đồng và nan quạt tròn",
                "text": "Thiết kế trống đồng, nan quạt tròn đều được sử dụng nhiều trong các thiết kế. Các hình khối này được ghép theo phông nền.",
                "images": [
                      {
                            "src": "assets/moodboard/cut/trong-dong.webp",
                            "caption": "Trống đồng",
                            "w": 813,
                            "h": 812
                      },
                      {
                            "src": "assets/moodboard/cut/trong-dong-bia.webp",
                            "caption": "Trống đồng cách điệu",
                            "w": 662,
                            "h": 652
                      },
                      {
                            "src": "assets/moodboard/cut/nan-quat-tron.webp",
                            "caption": "Nan quạt tròn",
                            "w": 510,
                            "h": 510
                      }
                ]
          },
          {
                "title": "Đường viền và dải trang trí",
                "text": "Những đường viền mảnh dùng để ngăn cách các phần nội dung và làm gọn bố cục trên phông nền, brochure và poster.",
                "images": [
                      {
                            "src": "assets/moodboard/cut/vien-may.webp",
                            "caption": "Viền mây",
                            "w": 1385,
                            "h": 19
                      },
                      {
                            "src": "assets/moodboard/cut/vien-kim-cuong.webp",
                            "caption": "Viền kim cương",
                            "w": 1414,
                            "h": 68
                      },
                      {
                            "src": "assets/moodboard/cut/dai-may.webp",
                            "caption": "Dải mây vàng",
                            "w": 872,
                            "h": 762
                      }
                ]
          }
    ],
    fonts: {
      title: [{ src: 'assets/moodboard/06-font-v2.jpg', caption: '' }],
      body: []
    },
    elements: [
          {
                "title": "Hoa mai và hoa đào",
                "text": "Hoa mai vàng và hoa đào hồng, hai loài hoa gợi không khí Tết Việt.",
                "images": [
                      {
                            "src": "assets/moodboard/cut/hoa-mai-mot.webp",
                            "caption": "Hoa mai",
                            "w": 527,
                            "h": 518
                      },
                      {
                            "src": "assets/moodboard/cut/canh-mai-phang.webp",
                            "caption": "Cành mai",
                            "w": 469,
                            "h": 480
                      },
                      {
                            "src": "assets/moodboard/cut/canh-mai-mau-nuoc.webp",
                            "caption": "Cành mai màu nước",
                            "w": 422,
                            "h": 494
                      },
                      {
                            "src": "assets/moodboard/cut/canh-mai-vang.webp",
                            "caption": "Cành mai vàng",
                            "w": 422,
                            "h": 638
                      },
                      {
                            "src": "assets/moodboard/cut/hoa-dao.webp",
                            "caption": "Hoa đào",
                            "w": 605,
                            "h": 528
                      },
                      {
                            "src": "assets/moodboard/cut/hoa-dao-doi.webp",
                            "caption": "Hoa đào đôi",
                            "w": 706,
                            "h": 533
                      },
                      {
                            "src": "assets/moodboard/cut/canh-hoa-hong.webp",
                            "caption": "Cành hoa hồng phấn",
                            "w": 732,
                            "h": 446
                      }
                ]
          },
          {
                "title": "Chim én và chim lạc",
                "text": "Chim én báo hiệu mùa xuân, chim lạc lấy từ họa tiết trống đồng.",
                "images": [
                      {
                            "src": "assets/moodboard/cut/chim-en.webp",
                            "caption": "Đàn chim én",
                            "w": 1114,
                            "h": 516
                      },
                      {
                            "src": "assets/moodboard/cut/chim-kem.webp",
                            "caption": "Chim vàng kem",
                            "w": 805,
                            "h": 517
                      },
                      {
                            "src": "assets/moodboard/cut/chim-lac.webp",
                            "caption": "Chim lạc",
                            "w": 953,
                            "h": 494
                      }
                ]
          },
          {
                "title": "Biểu tượng",
                "text": "Con dê của năm Đinh Mùi, pháo hoa và nét đường chân trời quê hương.",
                "images": [
                      {
                            "src": "assets/moodboard/cut/de-vang.webp",
                            "caption": "Con dê",
                            "w": 617,
                            "h": 709
                      },
                      {
                            "src": "assets/moodboard/cut/phao-hoa.webp",
                            "caption": "Pháo hoa",
                            "w": 895,
                            "h": 607
                      },
                      {
                            "src": "assets/moodboard/cut/skyline.webp",
                            "caption": "Đường chân trời",
                            "w": 1396,
                            "h": 440
                      }
                ]
          },
          {
                "title": "Ẩm thực",
                "text": "Ảnh decor ẩm thực Việt, tách nền để ghép vào bàn tiệc, tờ rơi và hình quảng bá.",
                "images": [
                      {
                            "src": "assets/moodboard/cut/banh-chung-minh-hoa.webp",
                            "caption": "Bánh chưng minh họa",
                            "w": 842,
                            "h": 559
                      },
                      {
                            "src": "assets/moodboard/cut/banh-chung-that.webp",
                            "caption": "Bánh chưng",
                            "w": 868,
                            "h": 555
                      },
                      {
                            "src": "assets/moodboard/cut/pho.webp",
                            "caption": "Phở",
                            "w": 671,
                            "h": 475
                      },
                      {
                            "src": "assets/moodboard/cut/nem-ran.webp",
                            "caption": "Nem rán",
                            "w": 652,
                            "h": 434
                      },
                      {
                            "src": "assets/moodboard/cut/banh-mi.webp",
                            "caption": "Bánh mì",
                            "w": 791,
                            "h": 288
                      },
                      {
                            "src": "assets/moodboard/cut/ca-phe.webp",
                            "caption": "Cà phê",
                            "w": 381,
                            "h": 510
                      },
                      {
                            "src": "assets/moodboard/cut/la-chuoi.webp",
                            "caption": "Lá chuối",
                            "w": 951,
                            "h": 501
                      },
                      {
                            "src": "assets/moodboard/cut/khan-caro.webp",
                            "caption": "Khăn caro",
                            "w": 727,
                            "h": 604
                      }
                ]
          },
          {
                "title": "Hoa văn Hồi giáo",
                "text": "Họa tiết Hồi giáo dạng lưới hình học, dùng làm góc khung và nền phụ.",
                "images": [
                      {
                            "src": "assets/moodboard/cut/goc-hoi-giao-1.webp",
                            "caption": "Góc hoa văn 1",
                            "w": 683,
                            "h": 676
                      },
                      {
                            "src": "assets/moodboard/cut/goc-hoi-giao-2.webp",
                            "caption": "Góc hoa văn 2",
                            "w": 659,
                            "h": 659
                      },
                      {
                            "src": "assets/moodboard/cut/goc-hoi-giao-3.webp",
                            "caption": "Góc hoa văn 3",
                            "w": 437,
                            "h": 874
                      },
                      {
                            "src": "assets/moodboard/cut/hoa-van-hoi-giao.webp",
                            "caption": "Hoa văn lặp",
                            "w": 750,
                            "h": 750
                      }
                ]
          }
    ],
    products: {
      backdrop: [{ src: 'assets/backdrop/backdrop-2027.jpg', caption: 'Phông nền sân khấu chính thức: Thiết kế 16:9, hiện lên sân khấu trong không gian 3D.' }],
      poster: [{ src: 'assets/poster/poster-facebook.jpg', caption: 'Poster Facebook chính thức: Dùng làm key visual của sự kiện.' }]
    }
  },

  scene: {
    backdropImage: 'assets/backdrop/backdrop-2027.jpg',
    backdropSize: [6.4, 3.6],
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
      { kind: 'nem', name: 'Nem rán', note: 'Xin mời!' }
    ]
  },

  brochure: {
    title: 'Brochure chương trình',
    front: 'assets/brochure/mat-truoc.jpg',
    back: 'assets/brochure/mat-sau.jpg',
    frontLabel: 'Mặt tiếng Việt',
    backLabel: 'Mặt tiếng Pháp (Verso)',
    note: 'Brochure được phát tại bàn đón tiếp. Khách có thể cầm theo để xem lại chương trình.'
  },

  thanks: {
    title: 'Xin trân trọng cảm ơn',
    message: 'Nhóm Thực tập sinh xin chân thành cảm ơn các anh chị tại Đại sứ quán đã dành thời gian theo dõi kế hoạch truyền thông chương trình Xuân Quê hương 2027. Rất mong nhận được ý kiến đóng góp của các anh chị để chương trình thêm trọn vẹn.',
    sign: 'Nhóm Thực tập sinh tại Đại sứ quán Việt Nam tại Algeria'
  },

  proposalRev: 1,
  zonesRev: 4,
  themeRev: 2,
  moodRev: 3,
  docsRev: 1,
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
      plan: 'Cà phê là một trong những mặt hàng nông sản xuất khẩu chủ lực của Việt Nam, và Việt Nam thuộc nhóm các nước xuất khẩu cà phê lớn nhất thế giới. Cà phê phin nhỏ giọt, cà phê sữa đá là những cách thưởng thức đã trở thành nét văn hóa riêng của người Việt.'
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
      desc: 'Các bàn cao phủ khăn đỏ ở giữa sân để khách vừa đứng dùng món vừa trò chuyện.'
    },
    {
      id: 'buffet', no: 7, name: 'Khu buffet món Việt',
      desc: 'Mái che lớn với sáu bàn: phở, bánh mì, súp, chè, bánh chưng và nem rán. Bấm vào từng bàn để xem tên món.'
    },
    {
      id: 'seating', no: 8, name: 'Khu mời ngồi',
      desc: 'Các bàn tròn cho khách lớn tuổi, gia đình có trẻ nhỏ, đặt bên trái gần sân khấu dưới tán cây.'
    },
    {
      id: 'standing', no: 9, name: 'Khu khách đứng',
      desc: 'Khoảng sân rộng trước sân khấu, nơi phần lớn trong 150 khách đứng theo dõi chương trình.'
    },
    {
      id: 'stage', no: 10, name: 'Sân khấu',
      desc: 'Bục thấp trải thảm đỏ sát tường trắng, đủ cho phát biểu, trao quà và chụp ảnh tập thể.'
    },
    {
      id: 'backdrop', no: 11, name: 'Phông nền',
      desc: 'Phông chính thức của chương trình: nền đỏ lì xì, khung vòm vàng mang hoa văn Hồi giáo ôm lấy dòng chữ Xuân Quê Hương, nan quạt và hoa đào, hoa mai ở chân phông.'
    },
    {
      id: 'podium', no: 12, name: 'Bục phát biểu',
      desc: 'Đặt bên trái sân khấu, có micro và biểu tượng chương trình, người phát biểu đứng gần phông.'
    }
  ]
};
