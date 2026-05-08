// ------------------------
// 🔹 BASE
// ------------------------
export type ApiResponse<T> = {
  success: boolean;
  data: T;
};

// ------------------------
// 🔹 USER
// ------------------------
export type ProfileSummary = {
  totalProjects: number | 0;
  totalOrders: number | 0;
  totalAmount: number | 0;
};

// ------------------------
// 🔹 PROJECT
// ------------------------
export type Project = {
  id: number;
  name: string;
  description: string;
  image_url: string;
  start_date: string;
  end_date: string;
  target_amount: number;
  current_amount: number;
  status: "open" | "closed";
  created_at: string;
  closed_at: string | null;
  type: "shop" | "donation";
  theme_color?: string;
  status_sub?: string;
  img_more?: string;
};

// ------------------------
// 🔹 TARGET
// ------------------------
export type Target = {
  id: number;
  project_id: number;
  step: number;
  amout: number; // ⚠️ สะกดตาม API (ถ้าแก้ได้ควรเป็น amount)
  title: string;
  description: string;
  image_url: string;
  created_at: string;
};

// ------------------------
// 🔹 REWARD
// ------------------------
export type Reward = {
  id: number;
  project_id: number;
  min_amount: number;
  title: string;
  description: string;
  image_url: string;
  created_at: string;
};

// ------------------------
// 🔹 DONATION
// ------------------------
export type Donation = {
  id: number;
  project_id: number;
  user_id: string;
  input_amount: number;
  verified_amount: number;
  status: boolean;
  ref_id: string;
  is_counted: string;
  message: string;
  created_at: string;
  verified_at: string;
};

// ------------------------
// 🔹 TOP SPENDER
// ------------------------
export type TopSpender = {
  name: string;
  total: number;
};

export type Bank = {
  id: string;
  bank_name: string;
  bank_short_name: string;
  account_name: string;
  account_name_en: string;
  account_no: string;
  qrcode: string;
  active: boolean;
  created_at: string;
};

export type HistoryShop = {
  order_id: string;
  amount: number;
  created_at: string;
  project: {
    id: number;
    name: string;
    image_url: string;
  };
  items: {
    reward_id: number;
    title: string;
    description: string;
    image_url: string;
    qty: number;
    price: number;
    total: number;
  }[];
};
export type HistoryDonation = {
  donation_id: number;
  project: {
    id: number;
    name: string;
    image_url: string;
  };
  amount: number;
  created_at: string;
};
export type History = {
  shop: HistoryShop[];
  donation: HistoryDonation[];
};

export type UserPurchaseSummery = {
  total_amount: number;
  items: {
    reward_id: string;
    title: string;
    min_amount: number;
    qty: number;
  }[];
  shipment: {
    tracking_no: string;
    carrier: string;
    status: string;
  };
  sub_status: string;
};

export type User = {
  uuid: string;
  name: string;
  username: string;
  phone: string;
  address: string;
  team: string;
  active: boolean;
  created_at: string;
};

// ------------------------
// 🔹 RESPONSES
// ------------------------
export type ProfileSummaryResponse = ApiResponse<ProfileSummary>;
export type ProfileHistoryResponse = ApiResponse<History>;

export type UserPurchaseSummeryResponse = ApiResponse<UserPurchaseSummery>;

export type ProjectListResponse = ApiResponse<Project[]>;

export type ActiveProjectData = {
  project: Project;
  targets: Target[];
  rewards: Reward[];
  topSpenders: TopSpender[];
  totalDonors: number;
  recent: Donation[];
  bank: Bank;
};

export type AdminProjectDetail = {
  project: Project;
  summary: {
    totalRevenue: number;
    totalOrders: number;
    totalUsers: number;
  };
  shop?: {
    rewardSummary?: {
      reward_id: number;
      title: string;
      total_qty: number;
      image_url?: string;
      price?: number;
    }[];
    itemSummary?: {
      name: string;
      qty: number;
    }[];
  };
  donation?: {
    targets?: {
      id: number;
      step: number;
      amout: number;
      title: string;
      description: string;
      image_url: string;
      created_at: string;
    }[];
    reward_summary?: {
      reward_id: number;
      title: string;
      total_qty: number;
    }[];
    item_usage_summary?: {
      item_name: string;
      total_qty: number;
    }[];
  }
}

export type ActiveProjectResponse = ApiResponse<ActiveProjectData | null>;

export type AdminBanksResponse = ApiResponse<Bank[] | null>;
export type AdminUsersResponse = ApiResponse<User[] | null>;
export type AdminProjectDetailResponse = ApiResponse<AdminProjectDetail | null>;
