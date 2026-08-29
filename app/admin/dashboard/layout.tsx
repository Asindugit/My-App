import AdminAuth from "@/app/components/AdminAuth";


export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminAuth>
      {children}
    </AdminAuth>
  );
}