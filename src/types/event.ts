export type Participant = {
  id: string;
  project_id: string;
  queue: number;
  full_name: string;
  user_id: string;
  phone: string;
  twitter: string;
  checked_in: boolean;
  checked_in_at?: any;
  checked_in_by: string;
  username: string;
};

export type ImportRow = {
  queue: number;
  name: string;
  uuid: string;
  phone: string;
  twitter: string;
};