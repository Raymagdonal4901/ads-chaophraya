
export enum MediaType {
  EXPRESS_BOAT = 'EXPRESS_BOAT',
  MINE_SMART_FERRY = 'MINE_SMART_FERRY',
  TOURIST_BOAT = 'TOURIST_BOAT',
  FERRY = 'FERRY',
  LONGTAIL_BOAT = 'LONGTAIL_BOAT',
  OTHER = 'OTHER',
  PIER = 'PIER',
  DIGITAL_SCREEN = 'DIGITAL_SCREEN'
}

export type UserRole = 'ADMIN' | 'SALE' | 'GUEST';

export interface User {
  username: string;
  name: string;
  role: UserRole;
}

export interface StoredUser extends User {
  password?: string;
}

export interface RoutePoint {
  lat: number;
  lng: number;
}

export interface TrafficBreakdown {
  weekday: number;
  weekend: number;
  holiday: number;
}

export interface AudienceData {
  monthlyTraffic: { name: string; value: number }[];
  trafficBreakdown: TrafficBreakdown;
  topInterests: { category: string; value: number }[];
}

export interface ServiceInfo {
  serviceDays: string;
  serviceHours: string;
  tripsPerDay: string;
  routeDescription: string;
  pierCount: string;
  pierList: string;
}

export interface BoatSchedule {
  boatName?: string; // Optional for Ferry route name
  themeColor: 'RED' | 'BLUE' | 'YELLOW' | 'GREEN' | 'ORANGE' | 'PURPLE' | 'MINT' | 'CYAN';
  days?: string;
  hours: string;
  route: string;
  frequency?: string; // Added for specific trip frequency
  pierLabel?: string;
  pierList?: string;
  // New fields for Ferry
  boatCount?: string;
  passengers?: string;
  eyeballs?: string;
}

export interface PricingPackage {
  name: string;
  quantityLabel: string;
  material?: string;
  warranty?: string; // Added for Media Warranty
  boatCount: string;
  duration?: string;
  pricePerMonth: string;
  productionCost: string;
  images?: string[];
}

export interface CustomLayoutItem {
  id: string;
  type: 'BOOTH' | 'STAR' | 'TEXT' | 'SHOP' | 'PIER';
  label?: string;
  x: number; // Percentage 0-100
  y: number; // Percentage 0-100
  width?: number;
  height?: number;
  color?: string;
  subType?: 'arrow-up' | 'arrow-down'; // For piers
}

export interface AdSpot {
  id: string;
  name: string;
  type: MediaType;
  category?: string;
  lat: number;
  lng: number;
  route?: RoutePoint[];
  routeColor?: string;
  pricePerDay: number;
  dimensions: string;
  resolution?: string;
  fileFormat?: string[];
  availability: string;
  availabilityCalendar?: boolean[];
  impressions: number;
  imageUrl: string;
  videoUrl?: string;
  videoGallery?: string[];
  panoramaUrl?: string;
  gallery?: string[];
  nearbyLandmarks?: string[];
  audience: AudienceData;
  serviceInfo?: ServiceInfo;
  boatSchedules?: BoatSchedule[];
  pricingPackages?: PricingPackage[];
  boatNumber?: string;
  boatNumberColor?: string;
  boatFlag?: string;
  customLayout?: CustomLayoutItem[]; // New field for draggable layout items
}

export interface SuccessStory {
  id: string;
  client: string;
  title: string;
  type: MediaType;
  metric: string;
  description: string;
  imageUrl: string;
}

export interface CartItem extends AdSpot {
  startDate: string;
  endDate: string;
  frequency: number;
  status: 'PENDING' | 'APPROVED';
}

export interface RFPFormData {
  contactName: string;
  companyName: string;
  email: string;
  phone: string;
  budget: number;
  notes: string;
}

export enum ViewState {
  HOME = 'HOME',
  MAP = 'MAP',
  INSIGHTS = 'INSIGHTS',
  DASHBOARD = 'DASHBOARD',
  USER_MANAGEMENT = 'USER_MANAGEMENT',
  EQUIPMENT = 'EQUIPMENT',
  MARKETING = 'MARKETING'
}

// --- Equipment System Types ---

export enum EquipmentStatus {
  AVAILABLE = 'AVAILABLE',
  INSTALLED = 'INSTALLED',
  WAITING_PURCHASE = 'WAITING_PURCHASE',
  IN_REPAIR = 'IN_REPAIR',
  BROKEN = 'BROKEN',
  LOST = 'LOST'
}

export enum EquipmentType {
  TV_SCREEN = 'TV_SCREEN',
  ANDROID_BOX = 'ANDROID_BOX',
  SPLITTER = 'SPLITTER',
  TIMER = 'TIMER',
  EQUIPMENT_BOX = 'EQUIPMENT_BOX',
  HDMI_CABLE = 'HDMI_CABLE',
  LAN_CABLE = 'LAN_CABLE',
  POWER_CABLE = 'POWER_CABLE',
  ROUTER_4G = 'ROUTER_4G',
  SIM_AIS = 'SIM_AIS',
  OTHER = 'OTHER'
}

export interface Equipment {
  id: string;
  name: string;
  type: EquipmentType;
  serialNumber: string;
  details?: string;
  purchaseDate: string;
  warrantyExpireDate: string;
  installationDate?: string;  // วันที่ติดตั้ง
  noWarranty?: boolean;       // สินค้าไม่มีประกัน
  status: EquipmentStatus;
  location?: string;
  lat?: number;
  lng?: number;
  imageUrl?: string;
  images?: string[];
  notes?: string;
  isOnline?: boolean;
}

// --- SIM Card Registration Types ---

export type SimCardStatus = 'ACTIVE' | 'BROKEN' | 'LOST';

export interface SimCard {
  id: string;
  phoneNumber: string;
  status: SimCardStatus;
  location?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}
