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
  id: string;
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
  id: string;
  project_id: string;
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
  id: string;
  project_id: string;
  min_amount: number;
  title: string;
  description: string;
  image_url: string;
  created_at: string;
  items?: {
    id: string;
    reward_id: string;
    item_name: string;
    qty: number;
    has_option: boolean;
    active: number;
    option_name: string;
    options?:{
      id: string;
      option_name: string;
      option_value: string;
      sort_order: number;
      active: number;
    }[];
  }[];
};

// ------------------------
// 🔹 DONATION
// ------------------------
export type Donation = {
  id: string;
  project_id: string;
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
  order_no: string;
  amount: number;
  created_at: string;
  project: {
    id: string;
    name: string;
    image_url: string;
  };
  items?: {
    user_reward_id: string;
    reward_id: string;
    title: string;
    description: string;
    image_url: string;
    qty: number;
    price: number;
    total: number;
    details?: {
      reward_item_id: string;
      item_name: string;
      has_option: number;
      option_name: string;
      selected_option: string;
      qty: number;
    }[];
  }[];
};
export type HistoryDonation = {
  donation_id: string;
  project: {
    id: string;
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
    options?: {
      reward_item_id: string;
      item_name: string;
      option_name: string;
      selected_option: string;
      qty: number;
    }[];
    details?:{
      reward_item_id: string;
      item_name: string;
      has_option: string;
      option_name: string;
      selected_option: string;
      qty: number;
    }[];
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
      reward_id: string;
      title: string;
      total_qty: number;
      image_url?: string;
      price?: number;
      description?: string;
    }[];
    itemSummary?: {
      name: string;
      qty: number;
    }[];
    optionSummary?: {
      item_name: string;
      option_name: string;
      options?: {
        option_value: string;
        qty: number;
      }[];
    }[];
  };
  donation?: {
    targets?: {
      id: string;
      step: number;
      amout: number;
      title: string;
      description: string;
      image_url: string;
      created_at: string;
    }[];
    reward_summary?: {
      reward_id: string;
      title: string;
      total_qty: number;
    }[];
    item_usage_summary?: {
      item_name: string;
      total_qty: number;
    }[];
  }
}
export type AdminOrderList = {
  user: {
    uuid: string;
    username: string;
    name?: string;
    address?: string;
    phone?: string;
  };
  shipment: {
    id: string;
    tracking_no: string;
    carrier: string;
  };
  total_amount: number;
  total_qty: number;
  orders?: {
    reward_id: string;
    title: string;
    qty: number;
    details?:{
      reward_item_id: string;
      item_name: string;
      has_option: number;
      option_name: string;
      selected_option: string;
      qty: number;
    }[];
  }[];
}

export type ActiveProjectResponse = ApiResponse<ActiveProjectData | null>;
export type AdminBanksResponse = ApiResponse<Bank[] | null>;
export type AdminUsersResponse = ApiResponse<User[] | null>;
export type AdminProjectDetailResponse = ApiResponse<AdminProjectDetail | null>;
export type AdminProjectOrderResponse = ApiResponse<AdminOrderList[] | null>;
