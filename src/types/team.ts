export type TeamImageFile = {
  file_name: string;
  mime_type: string;
  base64: string;
};

export type TeamFormState = {
  id?: string;
  value: string;
  label: string;
  image_url: string;
  image_file?: TeamImageFile | null;
  image_delete_url?: string;
  show_in_register: boolean;
  active: boolean;
};

export const defaultTeamForm: TeamFormState = {
  value: "",
  label: "",
  image_url: "",
  image_file: null,
  image_delete_url: "",
  show_in_register: true,
  active: true,
};