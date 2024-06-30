import Footer from "@/components/footer";
import Header from "@/components/header";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <>
      <Header />
      <div className="w-full h-full flex-grow">{children}</div>
      <Footer />
    </>
  );
};

export default Layout;
