import {
  defaultProjectForm,
  ProjectFormState,
} from "@/lib/admin-project/projectFormDefault";

function safeCommaArray(value: any) {
  if (Array.isArray(value)) return value;

  if (!value) return [];

  // รองรับของเก่าที่เคยเป็น JSON array
  try {
    const parsed = JSON.parse(value);

    if (Array.isArray(parsed)) {
      return parsed;
    }
  } catch {}

  // รูปแบบใหม่ url,url,url
  return String(value)
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function safeTheme(value: any) {
  if (typeof value === "object" && value) {
    return {
      secondary: value.secondary || "#ff6fa3",
      accent: value.accent || "#ffe4ec",
    };
  }

  if (!value) {
    return {
      secondary: "#ff6fa3",
      accent: "#ffe4ec",
    };
  }

  // รองรับของเก่าที่เคยเป็น JSON
  try {
    const parsed = JSON.parse(value);

    return {
      secondary: parsed.secondary || "#ff6fa3",
      accent: parsed.accent || "#ffe4ec",
    };
  } catch {}

  // รูปแบบใหม่ #ff6fa3,#ffe4ec
  const parts = String(value)
    .split(",")
    .map((item) => item.trim());

  return {
    secondary: parts[0] || "#ff6fa3",
    accent: parts[1] || "#ffe4ec",
  };
}

export function mapProjectDetailToForm(data: any): ProjectFormState {
  const project = data?.project || {};

  const targetsSource = data?.targets || data?.donation?.targets || [];

  const rewardsSource =
    data?.rewards || data?.shop?.rewardSummary || data?.donation?.rewards || [];

  return {
    ...defaultProjectForm,

    id: project.id || "",
    name: project.name || "",
    description: project.description || "",
    image_url: project.image_url || "",

    // เปลี่ยนจาก JSON array เป็น comma string
    // แต่ยังรองรับของเก่าได้
    img_more: safeCommaArray(project.img_more),

    start_date: project.start_date || "",
    end_date: project.end_date || "",
    target_amount: Number(project.target_amount || 0),
    current_amount: Number(project.current_amount || 0),
    status: project.status || "draft",
    type: project.type || "donation",

    // รองรับทั้ง JSON เดิม และ comma string ใหม่
    theme_color: safeTheme(project.theme_color),

    bank_id: project.bank_id || "",
    sub_status: project.sub_status || "pre-order",

    targets: Array.isArray(targetsSource)
      ? targetsSource.map((target: any, index: number) => ({
          id: target.id || "",
          step: Number(target.step || index + 1),
          amount: Number(target.amount || target.amout || 0),
          title: target.title || "",
          description: target.description || "",
          image_url: target.image_url || "",
          image_file: null,
        }))
      : [],

    rewards: Array.isArray(rewardsSource)
      ? rewardsSource.map((reward: any) => ({
          id: reward.id || reward.reward_id || "",
          title: reward.title || "",
          description: reward.description || "",
          min_amount: Number(reward.min_amount || reward.price || 0),
          price: Number(reward.price || reward.min_amount || 0),
          image_url: reward.image_url || "",
          image_file: null,
          items: Array.isArray(reward.items)
            ? reward.items.map((item: any) => ({
                item_name: item.item_name || "",
                qty: Number(item.qty || 1),
                has_option: Number(item.has_option || 0),
                option_name: item.option_name || "",
                options: Array.isArray(item.options)
                  ? item.options.map((option: any) => ({
                      option_value: option.option_value || "",
                    }))
                  : [],
              }))
            : [],
        }))
      : [],
  };
}

export function buildProjectPayload(form: ProjectFormState) {
  return {
    id: form.id || "",
    name: form.name,
    description: form.description,

    image_url: form.image_url,
    image_file: form.image_file || null,

    // ไม่ JSON.stringify แล้ว
    // ให้ GAS เก็บเป็น comma string
    img_more: (form.img_more || []).join(","),
    img_more_files: form.img_more_files || [],

    start_date: form.start_date,
    end_date: form.end_date,
    target_amount: Number(form.target_amount || 0),
    current_amount: Number(form.current_amount || 0),
    status: form.status,
    type: form.type,

    // ไม่ JSON.stringify แล้ว
    // เก็บเป็น #ff6fa3,#ffe4ec
    theme_color: `${form.theme_color.secondary || "#ff6fa3"},${
      form.theme_color.accent || "#ffe4ec"
    }`,

    bank_id: form.bank_id,
    sub_status: form.type === "shop" ? form.sub_status || "pre-order" : "",

    targets:
      form.type === "donation"
        ? form.targets.map((target, index) => ({
            id: target.id || "",
            step: Number(target.step || index + 1),
            amount: Number(target.amount || 0),
            title: target.title,
            description: target.description,
            image_url: target.image_url,
            image_file: target.image_file || null,
          }))
        : [],

    rewards: form.rewards.map((reward) => ({
      id: reward.id || "",
      title: reward.title,
      description: reward.description,
      min_amount: Number(reward.min_amount || reward.price || 0),
      price: Number(reward.price || reward.min_amount || 0),
      image_url: reward.image_url,
      image_file: reward.image_file || null,

      items: reward.items.map((item) => ({
        item_name: item.item_name,
        qty: Number(item.qty || 1),
        has_option: Number(item.has_option || 0),
        option_name: Number(item.has_option || 0) === 1 ? item.option_name : "",
        options:
          Number(item.has_option || 0) === 1
            ? item.options
                .map((option) => ({
                  option_value: String(option.option_value || "").trim(),
                }))
                .filter((option) => option.option_value)
            : [],
      })),
    })),
  };
}