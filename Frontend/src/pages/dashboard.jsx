function Dashboard() {
  return (
    <div className="flex h-screen bg-gray-100">

      {/* Sidebar */}
      <div className="w-64 bg-white shadow-md p-4">
        <h2 className="text-xl font-bold mb-6">TeamFlow</h2>

        <ul className="space-y-4">
          <li className="cursor-pointer hover:text-blue-500">Dashboard</li>
          <li className="cursor-pointer hover:text-blue-500">Projects</li>
          <li className="cursor-pointer hover:text-blue-500">Tasks</li>
          <li className="cursor-pointer hover:text-blue-500">Profile</li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6">

        {/* Topbar */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Dashboard</h1>

          <button
            onClick={() => {
              localStorage.removeItem("access");
              window.location.href = "/login";
            }}
            className="bg-red-500 text-white px-4 py-2 rounded"
          >
            Logout
          </button>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-3 gap-4 mb-6">

          <div className="bg-white p-4 rounded shadow">
            <h3 className="text-gray-500">Projects</h3>
            <p className="text-xl font-bold">12</p>
          </div>

          <div className="bg-white p-4 rounded shadow">
            <h3 className="text-gray-500">Tasks</h3>
            <p className="text-xl font-bold">34</p>
          </div>

          <div className="bg-white p-4 rounded shadow">
            <h3 className="text-gray-500">Completed</h3>
            <p className="text-xl font-bold">20</p>
          </div>

        </div>

        {/* Main Content Area */}
        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-lg font-bold mb-4">Welcome 👋</h2>
          <p className="text-gray-600">
            You’re now inside your dashboard. Let’s build something powerful.
          </p>
        </div>

      </div>
    </div>
  );
}

export default Dashboard;