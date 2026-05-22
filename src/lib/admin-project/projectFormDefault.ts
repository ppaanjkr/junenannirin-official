export type ProjectType = "donation" | "shop";

export type ProjectStatus = "draft" | "open" | "paused" | "closed" | "close";

export type ProjectFormImageFile = {
  file_name: string;
  mime_type: string;
  base64: string;
};

export type ProjectFormRewardItemOption = {
  option_value: string;
};

export type ProjectFormRewardItem = {
  id?: string;
  reward_id?: string;
  item_name: string;
  qty: number;
  has_option: number;
  option_name: string;
  options: ProjectFormRewardItemOption[];
};

export type ProjectFormReward = {
  id?: string;
  title: string;
  description: string;
  min_amount: number;
  price: number;
  image_url: string;
  image_file?: ProjectFormImageFile | null;
  image_delete_url?: string;
  items: ProjectFormRewardItem[];
};

export type ProjectFormTarget = {
  id?: string;
  step: number;
  amount: number;
  title: string;
  description: string;
  image_url: string;
  image_file?: ProjectFormImageFile | null;
  image_delete_url?: string;
};

export type ProjectFormState = {
  id?: string;
  name: string;
  description: string;

  image_url: string;
  image_file?: ProjectFormImageFile | null;
  image_delete_url?: string;

  img_more: string[];
  img_more_files?: (ProjectFormImageFile | null)[];
  img_more_delete_urls?: string[];

  start_date: string;
  end_date: string;
  target_amount: number;
  current_amount: number;
  status: ProjectStatus;
  type: ProjectType;
  theme_color: {
    secondary: string;
    accent: string;
  };
  bank_id: string;
  sub_status: string;
  targets: ProjectFormTarget[];
  rewards: ProjectFormReward[];
};

export const defaultProjectForm: ProjectFormState = {
  name: "",
  description: "",
  image_url: "",
  image_file: null,
  image_delete_url: "",
  img_more: [],
  img_more_files: [],
  img_more_delete_urls: [],
  start_date: "",
  end_date: "",
  target_amount: 0,
  current_amount: 0,
  status: "draft",
  type: "donation",
  theme_color: {
    secondary: "#ff6fa3",
    accent: "#ffe4ec",
  },
  bank_id: "",
  sub_status: "pre-order",
  targets: [],
  rewards: [],
};