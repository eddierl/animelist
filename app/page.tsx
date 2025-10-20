import InformationPage from "@/app/components/InformationPage";
import { Suspense } from "react";

export const metadata = {
  title: "Information Page",
};

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Suspense fallback={<div>Loading...</div>}>
        <InformationPage />
      </Suspense>
    </div>
  );
}
