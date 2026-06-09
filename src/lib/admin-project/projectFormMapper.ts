import {
  defaultProjectForm,
  ProjectFormState,
} from "@/lib/admin-project/projectFormDefault";

function toDateInput(value: any) {
  if (!value) return "";

  if (typeof value === "string") {
    if (/^\d{4}-\d{2}-\d{2}/.test(value)) {
      return value.slice(0, 10);
    }

    const date = new Date(value);
    if (!isNaN(date.getTime())) {
      return date.toISOString().slice(0, 10);
    }

    return "";
  }

  if (value?._seconds) {
    return new Date(value._seconds * 1000).toISOString().slice(0, 10);
  }

  if (typeof value?.toDate === "function") {
    return value.toDate().toISOString().slice(0, 10);
  }

  return "";
}

function safeNumber(value: any) {
  return Number(value || 0);
}

function safeArray(value: any) {
  return Array.isArray(value) ? value : [];
}

export function mapProjectDetailToForm(data: any): ProjectFormState {
  const project = data?.project || data || {};

  const themeColor = project.theme_color || "";

  return {
    ...defaultProjectForm,

    id: project.id || project.docId || "",
    name: project.name || project.title || "",
    description: project.description || "",

    image_url: project.image_url || "",
    image_file: null,
    image_delete_url: "",

    img_more: safeArray(project.img_more),
    img_more_files: [],
    img_more_delete_urls: [],

    start_date: toDateInput(project.start_date),
    end_date: toDateInput(project.end_date),

    target_amount: safeNumber(project.target_amount),
    current_amount: safeNumber(project.current_amount),

    status: project.status || "draft",
    type: project.type || "donation",

    theme_color: {
      secondary: themeColor.secondary || "#ff6fa3",
      accent: themeColor.accent || "#ffe4ec",
    },

    bank_id: project.bank_id || "",
    sub_status: project.sub_status || "",

    targets: safeArray(data?.targets || project.targets).map(
      (target: any, index: number) => ({
        id: target.id || target.docId || "",
        step: safeNumber(target.step || index + 1),
        amount: safeNumber(target.amount),
        title: target.title || "",
        description: target.description || "",
        image_url: target.image_url || "",
        image_file: null,
        image_delete_url: "",
      }),
    ),

    rewards: safeArray(data?.rewards || project.rewards).map((reward: any) => ({
      id: reward.id || reward.docId || "",
      title: reward.title || "",
      description: reward.description || "",
      min_amount: safeNumber(reward.min_amount),
      price: safeNumber(reward.price || reward.min_amount),
      image_url: reward.image_url || "",
      image_file: null,
      image_delete_url: "",
      items: safeArray(reward.items).map((item: any) => ({
        id: item.id || item.docId || "",
        reward_id: item.reward_id || reward.id || reward.docId || "",
        item_name: item.item_name || "",
        qty: safeNumber(item.qty || 1),
        has_option: Number(item.has_option || 0),
        option_name: item.option_name || "",
        options: safeArray(item.options).map((option: any) => ({
          option_value: option.option_value || option.value || "",
        })),
      })),
    })),

    event_enabled: Boolean(project.event_enabled),
    event_type: project.event_type || "restricted",
    event_location_name: project.event_location_name || "",
    event_location_url: project.event_location_url || "",
  };
}

export function buildProjectPayload(form: ProjectFormState) {
  return {
    id: form.id || "",
    name: form.name.trim(),
    description: form.description.trim(),

    image_url: form.image_url || "",
    image_file: form.image_file || null,
    image_delete_url: form.image_delete_url || "",

    img_more: form.img_more || [],
    img_more_files: form.img_more_files || [],
    img_more_delete_urls: form.img_more_delete_urls || [],

    start_date: form.start_date || "",
    end_date: form.end_date || "",

    target_amount: Number(form.target_amount || 0),
    current_amount: Number(form.current_amount || 0),

    status: form.status,
    type: form.type,

    theme_color: form.theme_color,

    bank_id: form.bank_id || "",
    sub_status: form.sub_status || "",

    targets: form.targets.map((target, index) => ({
      id: target.id || "",
      step: Number(target.step || index + 1),
      amount: Number(target.amount || 0),
      title: target.title || "",
      description: target.description || "",
      image_url: target.image_url || "",
      image_file: target.image_file || null,
      image_delete_url: target.image_delete_url || "",
    })),

    rewards: form.rewards.map((reward) => ({
      id: reward.id || "",
      title: reward.title || "",
      description: reward.description || "",
      min_amount: Number(reward.min_amount || 0),
      price: Number(reward.price || reward.min_amount || 0),
      image_url: reward.image_url || "",
      image_file: reward.image_file || null,
      image_delete_url: reward.image_delete_url || "",
      items: reward.items.map((item) => ({
        id: item.id || "",
        reward_id: item.reward_id || reward.id || "",
        item_name: item.item_name || "",
        qty: Number(item.qty || 1),
        has_option: Number(item.has_option || 0),
        option_name: item.option_name || "",
        options: item.options || [],
      })),
    })),

    event_enabled: form.event_enabled,
    event_type: form.event_type,
    event_location_name: form.event_location_name || "",
    event_location_url: form.event_location_url || "",
  };
}
