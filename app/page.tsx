import InformationPage from "@/app/components/InformationPage";
export const metadata = {
  title: "Information Page",
};

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <InformationPage />
    </div>
  );
}
