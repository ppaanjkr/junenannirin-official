// ------------------------
// 🔹 BASE
// ------------------------
export type ApiResponse<T> = {
  success: boolean;
  data: T;
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
}

// ------------------------
// 🔹 RESPONSES
// ------------------------
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

export type ActiveProjectResponse = ApiResponse<ActiveProjectData | null>;