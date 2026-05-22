export async function getActiveProject() {
  const res = await fetch("/api/firebase/project/active", {
    method: "GET",
    cache: "no-store",
  });

  return res.json();
}

export async function getProjects() {
  const res = await fetch("/api/firebase/project/list", {
    method: "GET",
    cache: "no-store",
  });

  return res.json();
}