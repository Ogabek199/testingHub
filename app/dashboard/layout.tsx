import { redirect } from "next/navigation";

export default function DashboardLayout({
  children,
}: {
  children?: React.ReactNode;
}) {
  // Dashboard sahifasiga kirish taqiqlangan - Bosh sahifaga yo'naltiriladi
  redirect("/");
  return null;
}

