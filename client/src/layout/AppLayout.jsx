function AppLayout({ children }) {
  return (
    <div className="flex h-screen overflow-hidden font-outfit">
      <aside className="w-64 bg-gray-100 p-4 hidden md:block">Sidebar</aside>
      <div className="flex-1 overflow-y-auto">
        <header className="border-b border-gray-200 p-4">TailAdmin</header>
        <main className="p-4 bg-gray-50 min-h-screen">{children}</main>
      </div>
    </div>
  );
}
export default AppLayout;
