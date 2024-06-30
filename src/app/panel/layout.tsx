import FullSidebar from "@/components/panel/sidebar/full";

interface PanelLayoutProps {
  children: React.ReactNode;
}

const PanelLayout = ({ children }: PanelLayoutProps) => {
  return (
    <div className="flex flex-row w-full h-full flex-grow">
      <FullSidebar />
      <div className="w-full bg-slate-700">{children}</div>
    </div>
  );
};

export default PanelLayout;
