export function getDriveImage(url: string){
  if (!url) return "";

  if (url.includes("/d/")){
    const id = url.split("/d/")[1].split("/")[0];
    return "https://lh3.googleusercontent.com/d/" + id;
  }

  return url;
}