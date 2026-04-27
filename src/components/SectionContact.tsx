export default function SectionContact() {
  return (
    <section className="mt-12 text-center px-4 mb-28">
      {/* logo */}
      <div className="w-16 h-16 mx-auto rounded-full overflow-hidden border border-pinkSecondary/50">
        <img src={`/icon/june_logo_circle.png`} className="w-full h-full object-cover" />
      </div>

      {/* title */}
      <div className="text-[18px] font-semibold mt-4 text-gray-800">
        Welcome to June Nannirin Official
      </div>

      {/* social */}
      <div className="flex justify-center gap-4 mt-4">
        <a href="https://x.com/Junenannirin_TH" className="w-8 h-8" target="_blank">
          <img src={`/icon/social_x.png`}/>
        </a>

        <a href="https://www.tiktok.com/@junenannirin_th" className="w-8 h-8" target="_blank"> 
          <img src={`/icon/social_tiktok.png`}/>
        </a>

        <a href="https://www.instagram.com/junenannirin_th" className="w-8 h-8" target="_blank">
          <img src={`/icon/social_ig.png`}/>
        </a>

        <a href="#" className="w-8 h-8" target="_blank">
          <img src={`/icon/social_line.png`}/>
        </a>

        <a href="https://www.youtube.com/@Junenannirin_TH" className="w-8 h-8" target="_blank">
          <img src={`/icon/social_youtube.png`}/>
        </a>
      </div>
    </section>
  );
}
