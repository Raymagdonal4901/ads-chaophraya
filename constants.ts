import { AdSpot, MediaType, SuccessStory, Equipment, EquipmentType, EquipmentStatus } from './types';

export const MOCK_AD_SPOTS: AdSpot[] = [
  {
    id: 'P-WANG-LANG',
    name: 'ท่าวังหลัง (Wang Lang Pier)',
    type: MediaType.PIER,
    category: 'ท่าเรือข้ามฟาก',
    lat: 13.7555,
    lng: 100.4878,
    pricePerDay: 5000,
    dimensions: '2x2 เมตร',
    availability: 'ว่าง',
    impressions: 24000,
    imageUrl: 'https://images.unsplash.com/photo-1563804803700-163ec400df4b?w=800&q=80',
    nearbyLandmarks: ['โรงพยาบาลศิริราช', 'ตลาดวังหลัง', 'วัดระฆังโฆสิตาราม'],
    audience: {
      monthlyTraffic: [
        { name: 'ม.ค.', value: 24000 },
        { name: 'ก.พ.', value: 23000 },
        { name: 'มี.ค.', value: 25000 },
        { name: 'เม.ย.', value: 22000 },
        { name: 'พ.ค.', value: 24000 },
        { name: 'มิ.ย.', value: 24000 },
        { name: 'ก.ค.', value: 23500 },
        { name: 'ส.ค.', value: 24500 },
        { name: 'ก.ย.', value: 23000 },
        { name: 'ต.ค.', value: 25000 },
        { name: 'พ.ย.', value: 26000 },
        { name: 'ธ.ค.', value: 27000 },
      ],
      trafficBreakdown: { weekday: 18000, weekend: 6000, holiday: 0 },
      topInterests: [
        { category: 'สุขภาพ', value: 95 },
        { category: 'อาหาร', value: 90 },
        { category: 'ช้อปปิ้ง', value: 85 },
        { category: 'ครอบครัว', value: 80 },
        { category: 'การศึกษา', value: 70 }
      ]
    },
    serviceInfo: {
      serviceDays: 'ทุกวัน',
      serviceHours: '06.00 – 21.00 น.',
      tripsPerDay: 'เรือข้ามฟากให้บริการไป-กลับ จาก 3 ท่าเรือ',
      routeDescription: 'อยู่ใกล้โรงพยาบาลศิริราช ตลาดวังหลัง ชุมชนวังหลัง วัดระฆังโฆสิตาราม และเป็นจุดเชื่อมต่อการเดินทางในฝั่งธนบุรี เช่น รถตู้ รถสามล้อและรถสองแถว',
      pierCount: '1',
      pierList: 'ท่าพระจันทร์ / ท่ามหาราช / ท่าช้าง และตั้งติดกับท่าเรือด่วนเจ้าพระยา (ท่าพรานนก)'
    },
    pricingPackages: [
      {
        name: 'ออกบูธจัดกิจกรรม',
        quantityLabel: '2 x 2 เมตร',
        material: '-',
        boatCount: '-',
        duration: 'รายวัน',
        pricePerMonth: '5,000 บาท / วัน',
        productionCost: 'พนักงานไม่เกิน 5 ท่าน / ครั้ง\nห้ามใช้เครื่องขยายเสียงทุกชนิด\nต้องอยู่ในพื้นที่ที่ท่าเรือจัดให้เท่านั้น'
      },
      {
        name: 'ยืนแจกสินค้า',
        quantityLabel: '-',
        material: '-',
        boatCount: '-',
        duration: 'รายวัน',
        pricePerMonth: '3,500 บาท / วัน',
        productionCost: 'แจ้งจองพื้นที่ล่วงหน้าไม่น้อยกว่า 2 วัน\nกรณีใช้ไฟฟ้าคิดเพิ่ม 700 บาท / วัน\nระยะเวลาใช้พื้นที่ 06.00 – 19.00 น.'
      }
    ],
    customLayout: [
      { id: 'pier-1', type: 'PIER', x: 30, y: 12, label: 'โป๊ะเรือ', subType: 'arrow-up' },
      { id: 'pier-2', type: 'PIER', x: 70, y: 12, label: 'โป๊ะเรือ', subType: 'arrow-down' },
      { id: 'booth-1', type: 'BOOTH', x: 35, y: 35, label: 'พื้นที่ตั้งบูธประชาสัมพันธ์' },
      { id: 'star-1', type: 'STAR', x: 45, y: 35, label: 'จุดยืนแจก 1' },
      { id: 'star-2', type: 'STAR', x: 75, y: 35, label: 'จุดยืนแจก 2' },
      { id: 'shop-1', type: 'SHOP', x: 45, y: 55, label: 'ร้านค้า' },
      { id: 'shop-2', type: 'SHOP', x: 53, y: 55, label: 'ร้านค้า' },
      { id: 'shop-3', type: 'SHOP', x: 61, y: 55, label: 'ร้านค้า' },
      { id: 'shop-4', type: 'SHOP', x: 69, y: 55, label: 'ร้านค้า' },
      { id: 'shop-5', type: 'SHOP', x: 77, y: 55, label: 'ร้านค้า' },
      { id: 'shop-6', type: 'SHOP', x: 85, y: 55, label: 'ร้านค้า' },
      { id: 'shop-7', type: 'SHOP', x: 93, y: 45, label: 'ร้านค้า' },
      { id: 'shop-8', type: 'SHOP', x: 45, y: 70, label: 'ร้านค้า' },
      { id: 'shop-9', type: 'SHOP', x: 53, y: 70, label: 'ร้านค้า' },
      { id: 'shop-10', type: 'SHOP', x: 61, y: 70, label: 'ร้านค้า' },
      { id: 'shop-11', type: 'SHOP', x: 69, y: 70, label: 'ร้านค้า' },
      { id: 'shop-12', type: 'SHOP', x: 77, y: 70, label: 'ร้านค้า' },
      { id: 'shop-13', type: 'SHOP', x: 85, y: 70, label: 'ร้านค้า' },
      { id: 'shop-14', type: 'SHOP', x: 93, y: 70, label: 'ร้านค้า' },
    ]
  },
  {
    id: 'P-RATCHAWONG',
    name: 'ท่าราชวงศ์ (Ratchawong Pier)',
    type: MediaType.PIER,
    category: 'Hub การค้า & ท่องเที่ยว',
    lat: 13.7395,
    lng: 100.5055,
    pricePerDay: 7500,
    dimensions: 'Multiple Areas',
    availability: 'ว่าง 2 จุด',
    impressions: 55000,
    imageUrl: 'https://images.unsplash.com/photo-1583491470869-7be19665a770?w=800&q=80',
    nearbyLandmarks: ['ถนนเยาวราช (Chinatown)', 'ตลาดสำเพ็ง (Wholesale Market)', 'คลองถม', 'วัดมังกรกมลาวาส'],
    audience: {
      monthlyTraffic: [
        { name: 'ม.ค.', value: 55000 },
        { name: 'ก.พ.', value: 60000 },
        { name: 'มี.ค.', value: 52000 },
        { name: 'เม.ย.', value: 48000 },
        { name: 'พ.ค.', value: 50000 },
        { name: 'มิ.ย.', value: 51000 },
        { name: 'ก.ค.', value: 53000 },
        { name: 'ส.ค.', value: 54000 },
        { name: 'ก.ย.', value: 52000 },
        { name: 'ต.ค.', value: 58000 },
        { name: 'พ.ย.', value: 62000 },
        { name: 'ธ.ค.', value: 65000 },
      ],
      trafficBreakdown: { weekday: 35000, weekend: 20000, holiday: 10000 },
      topInterests: [
        { category: 'อาหาร (Street Food)', value: 98 },
        { category: 'การค้าส่ง/ปลีก', value: 95 },
        { category: 'ท่องเที่ยวเชิงวัฒนธรรม', value: 92 },
        { category: 'ทองคำ/เครื่องประดับ', value: 85 },
        { category: 'วัตถุมงคล', value: 80 }
      ]
    },
    serviceInfo: {
      serviceDays: 'ทุกวัน',
      serviceHours: '06.00 – 20.00 น.',
      tripsPerDay: 'เรือด่วนเจ้าพระยา (ทุกธง) + เรือข้ามฟากท่าดินแดง',
      routeDescription: 'ประตูสู่เยาวราชและสำเพ็ง เป็นจุดเชื่อมต่อการค้าที่สำคัญที่สุดแห่งหนึ่ง รองรับทั้งพ่อค้าแม่ค้า นักท่องเที่ยวชาวไทยและต่างชาติ รวมถึงพนักงานออฟฟิศย่านเยาวราช มีเรือด่วนจอดทุกธง ทำให้ Traffic หนาแน่นตลอดวัน',
      pierCount: '2 โป๊ะ',
      pierList: 'เชื่อมต่อ ท่าดินแดง / ท่าสาทร / ท่านนทบุรี'
    },
    pricingPackages: [
      {
        name: 'ลานกิจกรรมหน้าท่า (Event Space)',
        quantityLabel: '3 x 3 เมตร',
        material: 'Open Space',
        boatCount: '-',
        duration: 'รายวัน',
        pricePerMonth: '7,500 บาท / วัน',
        productionCost: 'เหมาะสำหรับแจก Sampling หรือลงทะเบียน\nมีจุดปลั๊กไฟให้บริการ (คิดค่าไฟเพิ่ม)'
      },
      {
        name: 'ป้ายกล่องไฟทางเดิน (Lightbox)',
        quantityLabel: '1 ป้าย',
        material: 'Vinyl Backlit',
        boatCount: '-',
        duration: 'รายเดือน',
        pricePerMonth: '15,000 บาท / เดือน',
        productionCost: 'ค่าผลิตและติดตั้ง 3,500 บาท'
      },
      {
        name: 'Media Wrap เสาท่าเรือ',
        quantityLabel: '4 ต้น',
        material: 'Sticker PVC',
        boatCount: '-',
        duration: 'รายเดือน',
        pricePerMonth: '25,000 บาท / เดือน',
        productionCost: 'ตามขนาดจริง'
      }
    ],
    customLayout: [
      { id: 'pier-ferry', type: 'PIER', x: 30, y: 15, label: 'ท่าข้ามฟาก', subType: 'arrow-up' },
      { id: 'pier-express', type: 'PIER', x: 70, y: 15, label: 'ท่าเรือด่วน', subType: 'arrow-down' },
      { id: 'ad-pillar-1', type: 'TEXT', x: 25, y: 35, label: 'ป้ายเสา 1' },
      { id: 'ad-pillar-2', type: 'TEXT', x: 75, y: 35, label: 'ป้ายเสา 2' },
      { id: 'star-sample-1', type: 'STAR', x: 45, y: 30, label: 'จุดแจก 1' },
      { id: 'star-sample-2', type: 'STAR', x: 55, y: 30, label: 'จุดแจก 2' },
      { id: 'booth-main', type: 'BOOTH', x: 50, y: 55, label: 'Event Space' },
      { id: 'shop-l1', type: 'SHOP', x: 20, y: 50, label: 'Shop' },
      { id: 'shop-l2', type: 'SHOP', x: 20, y: 60, label: 'Shop' },
      { id: 'shop-l3', type: 'SHOP', x: 20, y: 70, label: 'Shop' },
      { id: 'shop-r1', type: 'SHOP', x: 80, y: 50, label: 'Shop' },
      { id: 'shop-r2', type: 'SHOP', x: 80, y: 60, label: 'Shop' },
      { id: 'shop-r3', type: 'SHOP', x: 80, y: 70, label: 'Shop' },
      { id: 'ad-banner-in', type: 'TEXT', x: 50, y: 85, label: 'ป้ายทางเข้า (Overhead)' },
    ]
  },
  {
    id: '1',
    name: 'เรือด่วนเจ้าพระยา (ธงส้ม) - Orange Flag',
    type: MediaType.EXPRESS_BOAT,
    category: 'เรือด่วน (Express)',
    lat: 13.719,
    lng: 100.514, // Start at Sathorn
    route: [
      { lat: 13.835, lng: 100.493 }, // Nonthaburi
      { lat: 13.791, lng: 100.511 }, // Kiakkai
      { lat: 13.755, lng: 100.487 }, // Wang Lang
      { lat: 13.744, lng: 100.489 }, // Wat Arun
      { lat: 13.737, lng: 100.508 }, // Ratchawong
      { lat: 13.729, lng: 100.510 }, // IconSiam
      { lat: 13.719, lng: 100.514 }, // Sathorn
      { lat: 13.705, lng: 100.503 }  // Wat Rajsingkorn
    ],
    routeColor: '#f97316',
    pricePerDay: 5000,
    dimensions: '2ม. x 15ม. (หุ้มรอบลำ)',
    fileFormat: ['AI', 'PDF', 'PSD'],
    availability: 'ว่าง',
    availabilityCalendar: [true, true, false, false, true, true, true, true, false, true, true, true, true, true, true],
    impressions: 45000,
    imageUrl: 'https://pic.in.th/image/468569e5-58b1-49d5-a00f-5ee19b9e3849.jxtk26',
    videoUrl: '',
    videoGallery: [],
    panoramaUrl: 'https://pannellum.org/images/milan.jpg',
    gallery: [
      'https://picsum.photos/id/10/200/200',
      'https://picsum.photos/id/11/200/200',
      'https://picsum.photos/id/12/200/200',
      'https://picsum.photos/id/13/200/200'
    ],
    audience: {
      monthlyTraffic: [
        { name: 'ม.ค.', value: 45000 },
        { name: 'ก.พ.', value: 42000 },
        { name: 'มี.ค.', value: 48000 },
        { name: 'เม.ย.', value: 55000 },
        { name: 'พ.ค.', value: 40000 },
        { name: 'มิ.ย.', value: 38000 },
        { name: 'ก.ค.', value: 39000 },
        { name: 'ส.ค.', value: 41000 },
        { name: 'ก.ย.', value: 37000 },
        { name: 'ต.ค.', value: 46000 },
        { name: 'พ.ย.', value: 52000 },
        { name: 'ธ.ค.', value: 58000 },
      ],
      trafficBreakdown: { weekday: 35000, weekend: 55000, holiday: 75000 },
      topInterests: [
        { category: 'ท่องเที่ยว', value: 92 },
        { category: 'อาหาร', value: 85 },
        { category: 'ถ่ายภาพ', value: 78 },
        { category: 'ช้อปปิ้ง', value: 72 },
        { category: 'ครอบครัว', value: 65 },
        { category: 'แฟชั่น', value: 58 },
        { category: 'สุขภาพ', value: 45 },
        { category: 'ดนตรี', value: 40 },
        { category: 'เทคโนโลยี', value: 35 },
        { category: 'ความงาม', value: 30 }
      ]
    },
    boatNumber: 'E-12',
    boatNumberColor: '#FFFFFF',
    boatFlag: 'ORANGE',
    boatSchedules: [
      {
        boatName: 'เรือธงส้ม (Orange Flag)',
        themeColor: 'ORANGE',
        days: 'จันทร์ – อาทิตย์',
        hours: '(เช้า) 06.00 – 09.10 น.\n(เย็น) 15.00 – 18.10 น.',
        route: 'ท่านนทบุรี – ท่าวัดราชสิงขร\n(ไป - กลับ) = ทุก 15 - 30 นาที',
        pierLabel: 'เส้นทาง 27 ท่าเรือ',
        pierList: 'ท่านนทบุรี / ท่าพระราม 5 / ท่าวัดเขียน / ท่าวัดตึก / ท่าพระราม 7 / ท่าวัดสร้อยทอง / ท่าบางโพ / ท่าเกียกกาย / ท่าเขียวไข่กา / ท่ากรมชลประทาน / ท่าพายัพ / ท่าสะพานกรุงธน (ซังฮี้) / ท่าเทเวศร์ / ท่าพระอาทิตย์ / ท่าพระปิ่นเกล้า / ท่ารถไฟ / ท่าพรานนก (วังหลัง) / ท่าช้าง / ท่าวัดอรุณ / ท่าราชินี / ท่าสะพานพุทธ / ท่าราชวงศ์ / ท่ากรมเจ้าท่า / ท่าสี่พระยา / ท่าไอคอนสยาม / ท่าโอเรียนเต็ล / ท่าสาทร / ท่าวัดเศวตฉัตร / ท่าวัดราชสิงขร'
      }
    ],
    pricingPackages: [
      {
        name: 'รอบเรือด้านนอก (Body Wrap)',
        quantityLabel: '1 ลำ',
        material: 'Sticker 3M Outdoor',
        boatCount: '14 ลำ',
        duration: '1 ปี',
        pricePerMonth: '150,000',
        productionCost: '120,000'
      },
      {
        name: 'ป้ายด้านในเรือ (Inside Banner)',
        quantityLabel: '12 จุด / ลำ',
        material: 'สติ๊กเกอร์ + See Through',
        boatCount: '14 ลำ',
        duration: '6 เดือน',
        pricePerMonth: '45,000',
        productionCost: '15,000'
      },
      {
        name: 'จอ LCD ภายในเรือ (TV Ad)',
        quantityLabel: '4 จอ / ลำ',
        material: 'MP4 Video',
        boatCount: '14 ลำ',
        duration: '1 เดือน',
        pricePerMonth: '15,000',
        productionCost: '-'
      }
    ]
  },
  {
    id: '101',
    name: 'เรือด่วนเจ้าพระยา (ธงแดง) - Red Flag',
    type: MediaType.EXPRESS_BOAT,
    category: 'เรือด่วน (Express)',
    lat: 13.835,
    lng: 100.493, // Nonthaburi
    route: [
      { lat: 13.835, lng: 100.493 }, // Nonthaburi
      { lat: 13.755, lng: 100.487 }, // Wang Lang
      { lat: 13.729, lng: 100.510 }, // IconSiam
      { lat: 13.719, lng: 100.514 } // Sathorn
    ],
    routeColor: '#ef4444',
    pricePerDay: 4500,
    dimensions: '2ม. x 15ม. (หุ้มรอบลำ)',
    fileFormat: ['AI', 'PDF'],
    availability: 'ว่าง',
    impressions: 40000,
    imageUrl: 'https://picsum.photos/id/237/200/200',
    boatFlag: 'RED',
    audience: {
      monthlyTraffic: [
        { name: 'ม.ค.', value: 40000 },
        { name: 'ก.พ.', value: 38000 },
        { name: 'มี.ค.', value: 42000 },
        { name: 'เม.ย.', value: 35000 },
        { name: 'พ.ค.', value: 39000 },
        { name: 'มิ.ย.', value: 41000 },
        { name: 'ก.ค.', value: 40000 },
        { name: 'ส.ค.', value: 42000 },
        { name: 'ก.ย.', value: 39000 },
        { name: 'ต.ค.', value: 38000 },
        { name: 'พ.ย.', value: 43000 },
        { name: 'ธ.ค.', value: 36000 },
      ],
      trafficBreakdown: { weekday: 32000, weekend: 5000, holiday: 3000 },
      topInterests: [
        { category: 'ข่าวสาร', value: 95 },
        { category: 'การเงิน', value: 88 },
        { category: 'การลงทุน', value: 82 },
        { category: 'เทคโนโลยี', value: 75 },
        { category: 'อสังหาริมทรัพย์', value: 70 },
        { category: 'สุขภาพ', value: 65 },
        { category: 'ประกันภัย', value: 60 },
        { category: 'รถยนต์', value: 55 },
        { category: 'อาหาร', value: 45 },
        { category: 'ท่องเที่ยว', value: 40 }
      ]
    },
    boatSchedules: [
      {
        boatName: 'เรือธงแดง (Red Flag)',
        themeColor: 'RED',
        days: 'จันทร์ - ศุกร์',
        hours: '(เช้า) 06.00 – 09.00 น.\n(เย็น) 17.00 – 19.30 น.',
        route: 'ท่านนทบุรี – ท่าสาทร\n(ไป - กลับ) = ทุก 30 นาที',
        pierLabel: 'เส้นทาง 15 ท่าเรือ',
        pierList: 'ท่านนทบุรี / ท่าพระราม 7 / ท่าบางโพ / ท่าเกียกกาย / ท่าเทเวศร์ / ท่าพรานนก (วังหลัง) / ท่าราชินี / ท่าราชวงศ์ / ท่าไอคอนสยาม / ท่าสาทร'
      }
    ],
    pricingPackages: [
      {
        name: 'รอบเรือด้านนอก',
        quantityLabel: '1 ลำ',
        material: 'Vinyl Outdoor',
        boatCount: '4 ลำ',
        duration: '1 ปี',
        pricePerMonth: '250,000',
        productionCost: '150,000'
      },
      {
        name: 'ป้ายด้านในเรือชั้น 1',
        quantityLabel: '9 ป้าย / ลำ',
        material: 'สติ๊กเกอร์ + See Through',
        boatCount: '4 ลำ',
        duration: '6 เดือน',
        pricePerMonth: '230,000',
        productionCost: '220,000'
      },
      {
        name: 'ป้ายด้านหลังเก้าอี้ ชั้น 2',
        quantityLabel: '10 ป้าย / ลำ',
        material: 'สติ๊กเกอร์ + See Through',
        boatCount: '4 ลำ',
        duration: '6 เดือน',
        pricePerMonth: '230,000',
        productionCost: '220,000'
      }
    ]
  },
  {
    id: '102',
    name: 'เรือด่วนเจ้าพระยา (ธงเหลือง) - Yellow Flag',
    type: MediaType.EXPRESS_BOAT,
    category: 'เรือด่วน (Express)',
    lat: 13.84,
    lng: 100.49, // Nonthaburi
    route: [
      { lat: 13.84, lng: 100.49 }, // Nonthaburi
      { lat: 13.78, lng: 100.51 }, // Kiak Kai
      { lat: 13.750, lng: 100.495 }, // Siriraj
      { lat: 13.719, lng: 100.514 }  // Sathorn
    ],
    routeColor: '#eab308',
    pricePerDay: 4800,
    dimensions: '2ม. x 15ม. (หุ้มรอบลำ)',
    fileFormat: ['AI', 'PDF'],
    availability: 'ว่าง',
    impressions: 42000,
    imageUrl: 'https://images.unsplash.com/photo-1563720223523-491ff04651de?w=400&q=80',
    boatFlag: 'YELLOW',
    audience: {
      monthlyTraffic: [
        { name: 'ม.ค.', value: 41000 },
        { name: 'ก.พ.', value: 39000 },
        { name: 'มี.ค.', value: 43000 },
        { name: 'เม.ย.', value: 36000 },
        { name: 'พ.ค.', value: 40000 },
        { name: 'มิ.ย.', value: 42000 },
        { name: 'ก.ค.', value: 41000 },
        { name: 'ส.ค.', value: 43000 },
        { name: 'ก.ย.', value: 40000 },
        { name: 'ต.ค.', value: 42000 },
        { name: 'พ.ย.', value: 45000 },
        { name: 'ธ.ค.', value: 48000 },
      ],
      trafficBreakdown: { weekday: 38000, weekend: 12000, holiday: 8000 },
      topInterests: [
        { category: 'ท่องเที่ยว', value: 90 },
        { category: 'อาหาร', value: 85 },
        { category: 'วัฒนธรรม', value: 80 },
        { category: 'ครอบครัว', value: 75 },
        { category: 'สุขภาพ', value: 70 },
        { category: 'ถ่ายภาพ', value: 65 },
        { category: 'ช้อปปิ้ง', value: 60 },
        { category: 'ธรรมะ', value: 55 },
        { category: 'การออม', value: 50 },
        { category: 'บ้านและสวน', value: 45 }
      ]
    },
    boatSchedules: [
      {
        boatName: 'เรือธงเหลือง (Yellow Flag)',
        themeColor: 'YELLOW',
        days: 'จันทร์ - ศุกร์',
        hours: '(เช้า) 06.00 – 08.00 น.\n(เย็น) 16.15 – 19.05 น.',
        route: 'ท่านนทบุรี – ท่าสาทร\n(ไป - กลับ) = ทุก 20 นาที',
        pierLabel: 'เส้นทาง 15 ท่าเรือ',
        pierList: 'ท่านนทบุรี / ท่าพระราม 7 / ท่าบางโพ / ท่าเกียกกาย / ท่าพายัพ / ท่าเทเวศร์ / ท่าพระปิ่นเกล้า / ท่ารถไฟ / ท่าพรานนก (วังหลัง) / ท่าช้าง / ท่าราชินี / ท่าราชวงศ์ / ท่ากรมเจ้าท่า / ท่าสี่พระยา / ท่าสาทร'
      }
    ],
    pricingPackages: [
      {
        name: 'ป้ายด้านนอกเรือ (Body Wrap)',
        quantityLabel: '1 ลำ',
        material: 'ไวนิลคุณภาพสูง',
        boatCount: '3 ลำ',
        duration: '1 ปี',
        pricePerMonth: '180,000',
        productionCost: '150,000'
      },
      {
        name: 'ป้ายแขวนราวจับ (Hand Grip)',
        quantityLabel: '40 ป้าย / ลำ',
        material: 'พลาสติกแข็ง',
        boatCount: '3 ลำ',
        duration: '6 เดือน',
        pricePerMonth: '45,000',
        productionCost: '25,000'
      },
      {
        name: 'จอ Digital (ในเรือ)',
        quantityLabel: '4 จอ / ลำ',
        material: 'LED TV 32"',
        boatCount: '3 ลำ',
        duration: 'รายเดือน',
        pricePerMonth: '30,000',
        productionCost: 'รวมในค่าบริการ'
      }
    ]
  },
  {
    id: '103',
    name: 'เรือด่วนเจ้าพระยา (ธงเขียว) - Green Flag',
    type: MediaType.EXPRESS_BOAT,
    category: 'เรือด่วน (Express)',
    lat: 13.913,
    lng: 100.496, // Pakkret
    route: [
      { lat: 13.913, lng: 100.496 }, // Pakkret
      { lat: 13.84, lng: 100.49 },   // Nonthaburi
      { lat: 13.719, lng: 100.514 }  // Sathorn
    ],
    routeColor: '#22c55e',
    pricePerDay: 5500,
    dimensions: '2ม. x 15ม. (หุ้มรอบลำ)',
    fileFormat: ['AI', 'PDF'],
    availability: 'ว่าง',
    impressions: 48000,
    imageUrl: 'https://images.unsplash.com/photo-1623944890637-264dcb8292d3?w=400&q=80',
    boatFlag: 'GREEN',
    audience: {
      monthlyTraffic: [
        { name: 'ม.ค.', value: 45000 },
        { name: 'ก.พ.', value: 43000 },
        { name: 'มี.ค.', value: 47000 },
        { name: 'เม.ย.', value: 40000 },
        { name: 'พ.ค.', value: 44000 },
        { name: 'มิ.ย.', value: 46000 },
        { name: 'ก.ค.', value: 45000 },
        { name: 'ส.ค.', value: 47000 },
        { name: 'ก.ย.', value: 44000 },
        { name: 'ต.ค.', value: 46000 },
        { name: 'พ.ย.', value: 49000 },
        { name: 'ธ.ค.', value: 52000 },
      ],
      trafficBreakdown: { weekday: 45000, weekend: 5000, holiday: 2000 },
      topInterests: [
        { category: 'อสังหาริมทรัพย์', value: 95 },
        { category: 'การเงิน', value: 90 },
        { category: 'รถยนต์', value: 85 },
        { category: 'สุขภาพ', value: 80 },
        { category: 'ประกันภัย', value: 75 },
        { category: 'เทคโนโลยี', value: 70 },
        { category: 'ข่าวสาร', value: 65 },
        { category: 'การศึกษา', value: 60 },
        { category: 'ของตกแต่งบ้าน', value: 55 },
        { category: 'อาหารคลีน', value: 50 }
      ]
    },
    boatSchedules: [
      {
        boatName: 'เรือธงเขียว (Green Flag)',
        themeColor: 'GREEN',
        days: 'จันทร์ - ศุกร์',
        hours: '(เช้า) 06.00 – 07.50 น.\n(เย็น) 16.00 – 17.45 น.',
        route: 'ท่าปากเกร็ด – ท่าสาทร\n(ไป - กลับ) = ทุก 20 นาที',
        pierLabel: 'เส้นทาง 20 ท่าเรือ',
        pierList: 'ท่าปากเกร็ด / ท่าวัดกลาง / ท่าบ้านพักข้าราชบริพารติวานนท์ / ท่ากระทรวงพาณิชย์ / ท่าสะพานพระนั่งเกล้า / ท่านนทบุรี / ท่าพระราม 7 / ท่าบางโพ / ท่าเกียกกาย / ท่าพายัพ / ท่าเทเวศร์ / ท่าพระปิ่นเกล้า / ท่ารถไฟ / ท่าพรานนก (วังหลัง) / ท่าช้าง / ท่าราชินี / ท่าราชวงศ์ / ท่ากรมเจ้าท่า / ท่าสี่พระยา / ท่าสาทร'
      }
    ],
    pricingPackages: [
      {
        name: 'ป้ายด้านนอกเรือ (Body Wrap)',
        quantityLabel: '1 ลำ',
        material: 'ไวนิลเกรด A',
        boatCount: '2 ลำ',
        duration: '1 ปี',
        pricePerMonth: '200,000',
        productionCost: '160,000'
      },
      {
        name: 'ป้ายภายในห้องโดยสาร',
        quantityLabel: '12 จุด / ลำ',
        material: 'สติ๊กเกอร์ PVC',
        boatCount: '2 ลำ',
        duration: '6 เดือน',
        pricePerMonth: '80,000',
        productionCost: '40,000'
      }
    ]
  },
  {
    id: '201',
    name: 'MINE SMART FERRY: สายสีเขียว (City Line)',
    type: MediaType.MINE_SMART_FERRY,
    category: 'เรือไฟฟ้า (Electric Boat)',
    lat: 13.73,
    lng: 100.51,
    route: [
      { lat: 13.719, lng: 100.514 },
      { lat: 13.76, lng: 100.49 }
    ],
    routeColor: '#4ade80',
    pricePerDay: 6000,
    dimensions: 'Full Wrap (Body)',
    fileFormat: ['AI', 'PDF'],
    availability: 'ว่าง',
    impressions: 60000,
    imageUrl: 'https://images.unsplash.com/photo-1621516039472-386629237072?w=800&q=80',
    boatFlag: 'MINE_GREEN',
    audience: {
      monthlyTraffic: [
        { name: 'ม.ค.', value: 60000 },
        { name: 'ก.พ.', value: 58000 },
        { name: 'มี.ค.', value: 62000 },
      ],
      trafficBreakdown: { weekday: 45000, weekend: 10000, holiday: 5000 },
      topInterests: [
        { category: 'เทคโนโลยี', value: 95 },
        { category: 'สิ่งแวดล้อม', value: 90 },
        { category: 'สุขภาพ', value: 85 },
        { category: 'การเงิน', value: 80 },
        { category: 'ท่องเที่ยว', value: 75 },
        { category: 'Gadgets', value: 70 },
        { category: 'อาหารคลีน', value: 65 },
        { category: 'Startups', value: 60 },
        { category: 'ถ่ายภาพ', value: 55 },
        { category: 'Cafe Hopping', value: 50 }
      ]
    },
    boatSchedules: [
      {
        boatName: 'MINE SMART FERRY (CITY LINE)',
        themeColor: 'MINT',
        days: 'จันทร์ - อาทิตย์',
        hours: '(ช่วง 1) 06.00 – 12.00 น.\n(ช่วง 2) 12.01 – 18.45 น.',
        route: 'ท่าสาทร – ท่าพระปิ่นเกล้า\n(ไป - กลับ) = เรือทุก 40 นาที',
        pierLabel: '8 ท่าเรือ',
        pierList: 'ท่าสาทร / ท่าไอคอนสยาม / ท่าราชวงศ์ / ท่าราชินี / ท่าวัดอรุณ / ท่าท่าช้าง / ท่าพรานนก / ท่าพระปิ่นเกล้า'
      }
    ],
    pricingPackages: [
      {
        name: 'รอบเรือด้านนอก 3 ด้าน (ซ้าย-ขวา-หลัง)',
        quantityLabel: '1 ลำ',
        material: 'สติ๊กเกอร์ + See Through',
        boatCount: '5 ลำ (ว่าง 1 ลำ)',
        duration: '1 ปี',
        pricePerMonth: '180,000',
        productionCost: '160,000'
      }
    ]
  },
  {
    id: '202',
    name: 'MINE SMART FERRY: สายสีม่วง (Urban Line)',
    type: MediaType.MINE_SMART_FERRY,
    category: 'เรือไฟฟ้า (Electric Boat)',
    lat: 13.8,
    lng: 100.5,
    route: [
      { lat: 13.719, lng: 100.514 },
      { lat: 13.86, lng: 100.48 }
    ],
    routeColor: '#a855f7',
    pricePerDay: 6500,
    dimensions: 'Full Wrap (Body)',
    fileFormat: ['AI', 'PDF'],
    availability: 'ว่าง 1 ลำ',
    impressions: 55000,
    imageUrl: 'https://images.unsplash.com/photo-1559599232-4428af4379a7?w=800&q=80',
    boatFlag: 'MINE_PURPLE',
    audience: {
      monthlyTraffic: [
        { name: 'ม.ค.', value: 55000 },
        { name: 'ก.พ.', value: 52000 },
        { name: 'มี.ค.', value: 58000 },
      ],
      trafficBreakdown: { weekday: 40000, weekend: 10000, holiday: 5000 },
      topInterests: [
        { category: 'อสังหาริมทรัพย์', value: 92 },
        { category: 'การลงทุน', value: 88 },
        { category: 'รถยนต์ไฟฟ้า', value: 85 },
        { category: 'ข่าวสาร', value: 80 },
        { category: 'เทคโนโลยี', value: 78 },
        { category: 'ประกันภัย', value: 75 },
        { category: 'การศึกษา', value: 70 },
        { category: 'ตกแต่งบ้าน', value: 65 },
        { category: 'ครอบครัว', value: 60 },
        { category: 'อาหาร', value: 55 }
      ]
    },
    boatSchedules: [
      {
        boatName: 'MINE SMART FERRY (URBAN LINE)',
        themeColor: 'PURPLE',
        days: 'จันทร์ - อาทิตย์',
        hours: '06.00 – 18.00 น.',
        route: 'ท่าสาทร – ท่าพระนั่งเกล้า\n(ไป - กลับ) = เรือทุก 20 นาที',
        pierLabel: '16 ท่าเรือ',
        pierList: 'ท่าสาทร / ท่าไอคอนสยาม / ท่ากรมเจ้าท่า / ท่าราชวงศ์ / ท่าราชินี / ท่าวัดอรุณ / ท่าท่าเตียน / ท่าพรานนก / ท่าพระปิ่นเกล้า / ท่าเทเวศร์ / ท่าพายัพ / ท่าเขียวไข่กา / ท่าบางโพ / ท่าพระนั่งเกล้า'
      }
    ],
    pricingPackages: [
      {
        name: 'รอบเรือด้านนอก 3 ด้าน',
        quantityLabel: '1 ลำ',
        material: 'สติ๊กเกอร์ + See Through',
        boatCount: '6 ลำ (ว่าง 1 ลำ)',
        duration: '1 ปี',
        pricePerMonth: '220,000',
        productionCost: '220,000'
      }
    ]
  },
  {
    id: 'TOURIST-01',
    name: 'Chao Phraya Tourist Boat (Blue Flag)',
    type: MediaType.TOURIST_BOAT,
    category: 'เรือท่องเที่ยว (Tourist)',
    lat: 13.72,
    lng: 100.512,
    route: [
      { lat: 13.719, lng: 100.514 }, // Sathorn
      { lat: 13.755, lng: 100.487 }, // Wang Lang
      { lat: 13.76, lng: 100.495 } // Arthit
    ],
    routeColor: '#0ea5e9',
    pricePerDay: 8000,
    dimensions: 'Wrap Around',
    fileFormat: ['AI', 'PDF'],
    availability: 'ว่าง 2 ลำ',
    impressions: 80000,
    imageUrl: 'https://images.unsplash.com/photo-1549608276-5786777e6587?w=800&q=80',
    boatFlag: 'BLUE',
    audience: {
      monthlyTraffic: [{ name: 'ม.ค.', value: 80000 }, { name: 'ก.พ.', value: 85000 }],
      trafficBreakdown: { weekday: 30000, weekend: 40000, holiday: 10000 },
      topInterests: [{ category: 'ท่องเที่ยว', value: 99 }, { category: 'ถ่ายภาพ', value: 90 }]
    },
    boatSchedules: [
      {
        boatName: 'Tourist Boat (Blue Flag)',
        themeColor: 'BLUE',
        days: 'Everyday',
        hours: '08.30 – 19.00',
        route: 'Sathorn – Phra Arthit (Hop-on Hop-off)',
        pierLabel: '11 Piers',
        pierList: 'Sathorn / ICONSIAM / Ratchawong / Wat Arun / Tha Chang / Tha Maharaj / Prannok / Phra Arthit / Asiatique / Lhong 1919'
      }
    ],
    pricingPackages: [
      {
        name: 'Full Body Wrap',
        quantityLabel: '1 Boat',
        material: 'Sticker 3M',
        boatCount: '8 Boats',
        duration: '1 Year',
        pricePerMonth: '350,000',
        productionCost: '200,000'
      }
    ]
  },
  {
    id: 'TOURIST-02',
    name: 'Chao Phraya Tourist Boat (Red Flag)',
    type: MediaType.TOURIST_BOAT,
    category: 'เรือท่องเที่ยว (Tourist)',
    lat: 13.73,
    lng: 100.50,
    route: [
      { lat: 13.719, lng: 100.514 }, // Sathorn
      { lat: 13.74, lng: 100.49 } // Arun
    ],
    routeColor: '#ef4444',
    pricePerDay: 7000,
    dimensions: 'Standard',
    fileFormat: ['AI', 'PDF'],
    availability: 'ว่าง 1 ลำ',
    impressions: 60000,
    imageUrl: 'https://images.unsplash.com/photo-1528127551383-7f72a7258a39?w=800&q=80',
    boatFlag: 'RED',
    audience: {
      monthlyTraffic: [{ name: 'ม.ค.', value: 60000 }],
      trafficBreakdown: { weekday: 20000, weekend: 30000, holiday: 10000 },
      topInterests: [{ category: 'ท่องเที่ยว', value: 99 }]
    },
    boatSchedules: [
      {
        boatName: 'Express Sightseeing',
        themeColor: 'RED',
        days: 'Everyday',
        hours: '09.00 – 17.00',
        route: 'Sathorn – Wat Arun Direct',
        pierLabel: '2 Piers',
        pierList: 'Sathorn / Wat Arun'
      }
    ],
    pricingPackages: [
      {
        name: 'Side Banner',
        quantityLabel: '2 Sides',
        material: 'Vinyl',
        boatCount: '5 Boats',
        duration: '6 Months',
        pricePerMonth: '150,000',
        productionCost: '80,000'
      }
    ]
  },
  {
    id: '2',
    name: 'จอ Mega LED ท่าเรือสาทร (Hub)',
    type: MediaType.DIGITAL_SCREEN,
    lat: 13.719,
    lng: 100.514,
    pricePerDay: 8500,
    dimensions: '6ม. x 3ม.',
    resolution: '1920x1080 px (Full HD)',
    fileFormat: ['MP4', 'JPG'],
    availability: 'ว่างใน 3 วัน',
    availabilityCalendar: [false, false, false, true, true, true, true, false, false, true, true, true, true, true, true],
    impressions: 120000,
    imageUrl: 'https://picsum.photos/id/200/600/400',
    panoramaUrl: 'https://pannellum.org/images/cerro-toco-0.jpg',
    audience: {
      monthlyTraffic: [
        { name: 'ม.ค.', value: 110000 },
        { name: 'ก.พ.', value: 105000 },
        { name: 'มี.ค.', value: 115000 },
        { name: 'เม.ย.', value: 90000 },
        { name: 'พ.ค.', value: 100000 },
        { name: 'มิ.ย.', value: 102000 },
        { name: 'ก.ค.', value: 105000 },
        { name: 'ส.ค.', value: 108000 },
        { name: 'ก.ย.', value: 100000 },
        { name: 'ต.ค.', value: 112000 },
      ],
      trafficBreakdown: { weekday: 120000, weekend: 45000, holiday: 30000 },
      topInterests: [
        { category: 'ธุรกิจ', value: 95 },
        { category: 'การเงิน', value: 88 },
        { category: 'อสังหาริมทรัพย์', value: 82 },
        { category: 'เทคโนโลยี', value: 75 },
        { category: 'ข่าวสาร', value: 70 },
        { category: 'การลงทุน', value: 68 },
        { category: 'รถยนต์', value: 60 },
        { category: 'นาฬิกา', value: 55 },
        { category: 'กอล์ฟ', value: 40 },
        { category: 'ไวน์', value: 35 }
      ]
    }
  },
  {
    id: '3',
    name: 'เรือข้ามฟาก @ ท่านนทบุรี (Ferry Boat)',
    type: MediaType.FERRY,
    category: 'เรือข้ามฟาก (Ferry)',
    lat: 13.84,
    lng: 100.49,
    route: [
      { lat: 13.84, lng: 100.49 }, // Nonthaburi
      { lat: 13.83, lng: 100.48 }  // Bangsrimuang
    ],
    routeColor: '#0070c0', // Ferry Blue
    pricePerDay: 4500,
    dimensions: 'Multiple Sizes (Wrap/Banner)',
    fileFormat: ['AI', 'PDF'],
    availability: 'ว่าง',
    availabilityCalendar: [true, true, true, true, true, true, true, true, true, true, true, true, true, true, true],
    impressions: 600000,
    imageUrl: 'https://picsum.photos/id/401/600/400', // Placeholder
    panoramaUrl: 'https://pannellum.org/images/bma-0.jpg',
    audience: {
      monthlyTraffic: [
        { name: 'ม.ค.', value: 600000 },
        { name: 'ก.พ.', value: 580000 },
        { name: 'มี.ค.', value: 620000 },
      ],
      trafficBreakdown: { weekday: 450000, weekend: 100000, holiday: 50000 },
      topInterests: [
        { category: 'การเดินทาง', value: 98 },
        { category: 'อาหาร', value: 85 },
        { category: 'ช้อปปิ้ง', value: 80 },
        { category: 'ครอบครัว', value: 75 }
      ]
    },
    boatSchedules: [
      {
        boatName: 'เรือข้ามฟากนนทบุรี – บางศรีเมือง',
        themeColor: 'BLUE',
        days: 'จันทร์ – อาทิตย์',
        hours: '05.00 – 21.00 น.',
        route: 'ท่านนทบุรี – ท่าบางศรีเมือง (ไป - กลับ)',
        frequency: 'ทุก 5-10 นาที',
        boatCount: '6 ลำ',
        passengers: '10,000+',
        eyeballs: '600,000+'
      }
    ],
    pricingPackages: [
      {
        name: 'แบนเนอร์ด้านข้างเรือ (Side Banner)',
        quantityLabel: '2 ด้าน / ลำ',
        material: 'Vinyl 3M',
        boatCount: '6 ลำ',
        duration: '6 เดือน',
        pricePerMonth: '25,000',
        productionCost: '12,000'
      }
    ]
  },
  {
    id: '401',
    name: 'เรือหางยาว (Thai Long Tail Boat)',
    type: MediaType.LONGTAIL_BOAT,
    category: 'เรือท่องเที่ยว (Tourist)',
    lat: 13.7437,
    lng: 100.4889, // Near Wat Arun
    route: [
      { lat: 13.72, lng: 100.51 },
      { lat: 13.76, lng: 100.48 }
    ],
    routeColor: '#f59e0b', // Amber/Orange-ish for longtail
    pricePerDay: 1500, // Avg
    dimensions: 'Custom',
    availability: 'ว่าง 5 ลำ',
    availabilityCalendar: [true, true, true, true, true, true, true, true, true, true, true, true, true, true, true],
    impressions: 15000,
    imageUrl: 'https://images.unsplash.com/photo-1598970792370-137b0c807758?w=800&q=80',
    boatSchedules: [
      {
        boatName: 'Longtail Canal Tour',
        themeColor: 'ORANGE',
        days: 'Everyday',
        hours: '08.00 - 18.00',
        route: 'Bangkok Noi / Bangkok Yai Canal Tour',
        pierLabel: 'Common Piers',
        pierList: 'Sathorn / Tha Chang / Tha Tien'
      }
    ],
    pricingPackages: [
      {
        name: 'หลังคาเรือ (Roof Top)',
        quantityLabel: '1 ลำ',
        material: 'Paint / Sticker',
        boatCount: '20 ลำ',
        duration: '3 เดือน',
        pricePerMonth: '5,000',
        productionCost: '3,000'
      }
    ]
  }
];

export const SUCCESS_STORIES: SuccessStory[] = [
  {
    id: 's1',
    client: 'แบรนด์เครื่องดื่มระดับโลก',
    title: 'Summer Fresh 2024',
    type: MediaType.EXPRESS_BOAT,
    metric: '+40% ยอดขาย',
    imageUrl: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&q=80',
    description: 'สร้างยอดขายพุ่งสูงขึ้น 40% ในช่วงหน้าร้อน ด้วยการ Wrap เรือด่วนเจ้าพระยา 10 ลำ'
  },
  {
    id: 's2',
    client: 'คอนโดมิเนียมหรูริมน้ำ',
    title: 'Luxury Living by the River',
    type: MediaType.MINE_SMART_FERRY,
    metric: 'ปิดการขาย 20 ยูนิต',
    imageUrl: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80',
    description: 'ปิดการขายได้กว่า 20 ยูนิต ภายใน 1 เดือน ผ่านสื่อ VDO บนเรือไฟฟ้า MINE Smart Ferry'
  },
  {
    id: 's3',
    client: 'ธนาคารชั้นนำ',
    title: 'Easy App - จ่ายง่าย ได้คืน',
    type: MediaType.DIGITAL_SCREEN,
    metric: '+15% Downloads',
    imageUrl: 'https://images.unsplash.com/photo-1565514020176-87d29635b671?w=800&q=80',
    description: 'โปรโมทแคมเปญ Cash back ผ่านจุด Media ท่าเรือสาทร และวังหลัง เข้าถึงกลุ่มคนทำงานกว่า 100,000 คนต่อวัน'
  }
];

export const MOCK_EQUIPMENT_LIST: Equipment[] = [
  {
    id: 'eq-001',
    name: 'Samsung 55" Digital Signage',
    type: EquipmentType.TV_SCREEN,
    serialNumber: 'S/N: TH-55-2023-001',
    purchaseDate: '2023-01-15',
    warrantyExpireDate: '2026-01-15',
    status: EquipmentStatus.INSTALLED,
    location: 'ท่าวังหลัง (Wang Lang Pier)',
    lat: 13.7550,
    lng: 100.4870,
    imageUrl: 'https://images.unsplash.com/photo-1593305841991-05c2e449ee44?w=800&q=80',
    isOnline: true
  },
  {
    id: 'eq-002',
    name: 'Android Box X96 Max+',
    type: EquipmentType.ANDROID_BOX,
    serialNumber: 'AB-2023-888',
    purchaseDate: '2023-02-10',
    warrantyExpireDate: '2024-02-10',
    status: EquipmentStatus.INSTALLED,
    location: 'ท่าวังหลัง (Wang Lang Pier)',
    lat: 13.7551,
    lng: 100.4872,
    isOnline: true
  },
  {
    id: 'eq-003',
    name: 'LG 43" Standard Signage',
    type: EquipmentType.TV_SCREEN,
    serialNumber: 'LG-43-2022-999',
    purchaseDate: '2022-11-05',
    warrantyExpireDate: '2025-11-05',
    status: EquipmentStatus.BROKEN,
    location: 'Waiting Repair',
    lat: 13.7200,
    lng: 100.5100,
    imageUrl: 'https://images.unsplash.com/photo-1577979749830-f1d742b96791?w=800&q=80',
    isOnline: false
  }
];

// Sales Kit Pages for Presentation
export const SALES_KIT_PAGES: any[] = [
  {
    type: 'COVER',
    title: 'CHAO PHRAYA',
    subtitle: 'MEDIA NETWORK',
    thaiTitle: 'สื่อโฆษณาทางน้ำ',
    thaiSubtitle: 'เครือข่ายสื่อโฆษณาเรือและท่าเรือเจ้าพระยา',
    image: 'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?w=1200&q=80'
  },
  {
    type: 'OVERVIEW_BOATS',
    title: 'สื่อบนเรือ (Boat Media)',
    images: [
      'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?w=800&q=80',
      'https://images.unsplash.com/photo-1563720223523-491ff04651de?w=400&q=80',
      'https://images.unsplash.com/photo-1621516039472-386629237072?w=400&q=80'
    ],
    items: [
      { name: 'เรือด่วนเจ้าพระยา (Express Boat)', desc: 'ธงส้ม, แดง, เหลือง, เขียว', icon: 'ship' },
      { name: 'MINE Smart Ferry', desc: 'เรือไฟฟ้าสายสีเขียว / สีม่วง', icon: 'ship' },
      { name: 'เรือท่องเที่ยว (Tourist Boat)', desc: 'Hop-on Hop-off', icon: 'ship' },
      { name: 'เรือข้ามฟาก (Ferry)', desc: 'บริการข้ามฝั่ง', icon: 'ferry' }
    ]
  },
  {
    type: 'PIER_DETAIL',
    title: 'ท่าวังหลัง',
    engTitle: 'Wang Lang Pier',
    pierId: 'P-WANG-LANG',
    traffic: 24000,
    hours: '06.00 – 21.00',
    desc: 'อยู่ใกล้โรงพยาบาลศิริราช ตลาดวังหลัง ชุมชนวังหลัง วัดระฆังโฆสิตาราม และเป็นจุดเชื่อมต่อการเดินทางในฝั่งธนบุรี',
    mapType: 'WANG_LANG',
    packages: [
      { name: 'ออกบูธจัดกิจกรรม', size: '2 x 2 เมตร', price: 5000, note: 'พนักงานไม่เกิน 5 ท่าน / ครั้ง' },
      { name: 'ยืนแจกสินค้า', size: 'จุดยืน', price: 3500, note: 'แจ้งจองพื้นที่ล่วงหน้าไม่น้อยกว่า 2 วัน' }
    ]
  },
  {
    type: 'PIER_DETAIL',
    title: 'ท่าราชวงศ์',
    engTitle: 'Ratchawong Pier',
    pierId: 'P-RATCHAWONG',
    traffic: 55000,
    hours: '06.00 – 20.00',
    desc: 'ประตูสู่เยาวราชและสำเพ็ง เป็นจุดเชื่อมต่อการค้าที่สำคัญที่สุดแห่งหนึ่ง รองรับทั้งพ่อค้าแม่ค้า นักท่องเที่ยวชาวไทยและต่างชาติ',
    mapType: 'PHRACHAN',
    packages: [
      { name: 'ลานกิจกรรมหน้าท่า', size: '3 x 3 เมตร', price: 7500, note: 'เหมาะสำหรับแจก Sampling' },
      { name: 'ป้ายกล่องไฟทางเดิน', size: 'Lightbox', price: 15000, note: 'รายเดือน' }
    ]
  },
  {
    type: 'REMARKS',
    title: 'ข้อกำหนดและเงื่อนไข',
    engTitle: 'TERMS & CONDITIONS',
    items: [
      'ราคาดังกล่าวยังไม่รวม VAT 7%',
      'ชำระเงินล่วงหน้า 50% ก่อนเริ่มแคมเปญ',
      'ระยะเวลาจองขั้นต่ำ 1 สัปดาห์',
      'ผู้ลงโฆษณาต้องจัดเตรียมชิ้นงานตามสเปกที่กำหนด',
      'บริษัทขอสงวนสิทธิ์ในการปฏิเสธชิ้นงานที่ไม่เหมาะสม'
    ]
  }
];