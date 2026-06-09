type Props = {
  className?: string;
  title: string,
  active?: boolean,
  setTab: (tab: string) => void
};

export default function TabButton({
  className = "",
  title,
  active = false,
  setTab
}: Props) {
  
 
  return (
    <button 
      className={`flex-1 p-1 rounded-md border-none outline-none cursor-pointer ${active ? 'bg-pinkSecondary/80 text-white' : ''}`}
      onClick={() => {
        if (title === "Shop") {
          setTab("shop");
        } else if (title === "Donate") {
          setTab("donate");
        }else if (title === "Event"){
          setTab("event");
        }
      }}
    >
      {title}
      </button>
  );
}
