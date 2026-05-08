import { useEffect, useState } from "react";
import API from "../api";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const [user, setUser] = useState();
  const [projects, setProjects] = useState([]);
  const [name, setName] = useState("");
  const [selectedProject, setSelectedProject] = useState(null);

  const [members, setMembers] = useState([]);
  const [username, setUsername] = useState("");
  const [assignedUser, setAssignedUser] = useState("");
  const [tasks, setTasks] = useState({
    TODO: [],
    IN_PROGRESS: [],
    COMPLETED: [],
  });

  const [taskTitle, setTaskTitle] = useState("");

  const navigate = useNavigate();

  // 🔹 Fetch user
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await API.get("/auth/me/");
        setUser(res.data);
      } catch {
        localStorage.removeItem("access");
        navigate("/login");
      }
    };
    fetchUser();
  }, [navigate]);

  // 🔹 Fetch projects
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await API.get("/projects/");
        setProjects(res.data);
      } catch (err) {
        console.log(err.response?.data);
      }
    };
    fetchProjects();
  }, []);

  // 🔹 Fetch members when project changes
  useEffect(() => {
    if (selectedProject) {
      fetchMembers(selectedProject.id);
      fetchBoard(selectedProject.id);
    }
  }, [selectedProject]);

  // 🔹 Fetch board
  const fetchBoard = async (projectId) => {
    try {
      const res = await API.get(`/tasks/board/?project=${projectId}`);
      setTasks(res.data);
    } catch (err) {
      console.log(err.response?.data);
    }
  };

  // 🔹 Fetch members (FIXED)
  const fetchMembers = async (projectId) => {
    try {
      const res = await API.get(`/project-members/?project=${projectId}`);
      console.log("MEMBERS:", res.data); // 👈 DEBUG
      setMembers(res.data);
    } catch (err) {
      console.log("FETCH MEMBERS ERROR:", err.response?.data);
    }
  };

  // 🔹 Create project
  const createProject = async () => {
    try {
      const res = await API.post("/projects/", {
        project_name: name,
      });

      setProjects((prev) => [...prev, res.data]);
      setName("");
    } catch (err) {
      console.log(err.response?.data);
    }
  };

  // 🔹 Create task
  const createTasks = async () => {
    if (!taskTitle || !selectedProject) return;

    try {
      await API.post("/tasks/", {
        title: taskTitle,
        project: selectedProject.id,
        status: "TODO",
        assigned_to: assignedUser || null,
      });

      setTaskTitle("");
      fetchBoard(selectedProject.id);
    } catch (err) {
      console.log(err.response?.data);
    }
  };

  // 🔹 Update task status
  const updateTaskStatus = async (taskId, newStatus) => {
    try {
      await API.patch(`/tasks/${taskId}/`, {
        status: newStatus,
      });

      fetchBoard(selectedProject.id);
    } catch (err) {
      console.log(err.response?.data);
    }
  };

  // 🔹 Add member (FIXED)
  const addMember = async () => {
    if (!username || !selectedProject) return;

    try {
      await API.post("/project-members/", {
        project: selectedProject.id,
        username: username,
        role: "MEMBER",
      });

      setUsername("");
      fetchMembers(selectedProject.id);
    } catch (err) {
      console.log(err.response?.data);
      alert(err.response?.data?.detail || "Failed to add member");
    }
  };

  // 🔹 Stats
  const totalTasks =
    tasks.TODO.length +
    tasks.IN_PROGRESS.length +
    tasks.COMPLETED.length;

  const completedTasks = tasks.COMPLETED.length;

  return (
    <div className="flex h-screen bg-gray-100">

      {/* Sidebar */}
      <div className="w-64 bg-white shadow-md p-4">
        <h2 className="text-xl font-bold mb-6">TeamFlow</h2>

        <ul className="space-y-4">
          <li>Dashboard</li>
          <li>Projects</li>
          <li>Tasks</li>
          <li>Profile</li>
        </ul>
      </div>

      {/* Main */}
      <div className="flex-1 p-6 overflow-y-auto">

        {/* Topbar */}
        <div className="flex justify-between mb-6">
          <h1 className="text-2xl font-bold">Dashboard</h1>

          <button
            onClick={() => {
              localStorage.removeItem("access");
              navigate("/login");
            }}
            className="bg-red-500 text-white px-6 py-1 rounded"
          >
            Logout
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-white p-4 rounded shadow">
            <p>Projects</p>
            <p className="font-bold">{projects.length}</p>
          </div>

          <div className="bg-white p-4 rounded shadow">
            <p>Tasks</p>
            <p className="font-bold">{totalTasks}</p>
          </div>

          <div className="bg-white p-4 rounded shadow">
            <p>Completed</p>
            <p className="font-bold">{completedTasks}</p>
          </div>
        </div>

        {/* Create Project */}
        <div className="bg-white p-4 rounded shadow mb-6">
          <div className="flex gap-2">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Project name"
              className="border p-2 flex-1"
            />
            <button onClick={createProject} className="bg-blue-500 text-white px-4 py-2 rounded">
              Add
            </button>
          </div>
        </div>

        {/* Projects */}
        <div className="bg-white p-4 rounded shadow">
          <h2 className="font-bold mb-4">Projects</h2>

          {projects.map((p) => (
            <div
              key={p.id}
              className="border-b py-2 cursor-pointer"
              onClick={() => setSelectedProject(p)}
            >
              {p.project_name}
            </div>
          ))}
        </div>

        {/* Members */}
        {selectedProject && (
          <div className="bg-white p-4 rounded shadow mt-6">
            <h2 className="font-bold mb-3">Members</h2>

            {members.map((m) => (
              <div key={m.id} className="flex justify-between border-b py-2 text-black">
                <span>{m.user}</span>
                <span className="text-xs bg-gray-200 px-2 rounded">{m.role}</span>
              </div>
            ))}

            <div className="flex gap-2 mt-3">
              <input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter Username"
                className="border p-2 flex-1"
              />

              <button onClick={addMember} className="bg-green-500 text-white px-3 py-1 rounded">
                Add
              </button>
            </div>
          </div>
        )}

        {/* Board */}
        {selectedProject && (
          <div className="mt-8 grid grid-cols-3 gap-4">

            {["TODO", "IN_PROGRESS", "COMPLETED"].map((status) => (
              <div key={status} className="bg-gray-100 p-4 rounded">
                <h3 className="font-bold mb-3">{status}</h3>

                {tasks[status].map((t) => (
                  <div key={t.id} className="bg-white p-2 mb-2 rounded shadow">
                    <p>{t.title}</p>
                    <p className="text-xs text-gray-500"> {t.assigned_to ? `👤 ${t.assigned_to}` : "Unassigned"}</p>
                    <div className="flex gap-2 mt-2">
                      {status !== "TODO" && (
                        <button
                          onClick={() => updateTaskStatus(t.id, "TODO")}
                          className="text-xs bg-gray-200 px-2 rounded"
                        >
                          TODO
                        </button>
                      )}

                      {status !== "IN_PROGRESS" && (
                        <button
                          onClick={() => updateTaskStatus(t.id, "IN_PROGRESS")}
                          className="text-xs bg-yellow-200 px-2 rounded"
                        >
                          IN_PROGRESS
                        </button>
                      )}
                        <select
  className="border p-1 text-xs w-full mt-1"
  onChange={async (e) => {
    await API.patch(`/tasks/${t.id}/`, {
      assigned_to: e.target.value || null,
    });
    fetchBoard(selectedProject.id);
  }}
>
  <option value="">Unassigned</option>
  {members.map((m) => (
    <option key={m.id} value={m.username}>
      {m.username}
    </option>
  ))}
</select>
                      {status !== "COMPLETED" && (
                        <button
                          onClick={() => updateTaskStatus(t.id, "COMPLETED")}
                          className="text-xs bg-green-200 px-2 rounded"
                        >
                          DONE
                        </button>
                      )}
                    </div>
                  </div>
                ))}

                {status === "TODO" && (
                  <>
                    <input
                      value={taskTitle}
                      onChange={(e) => setTaskTitle(e.target.value)}
                      className="border p-2 w-full mb-2"
                    />
                    <input
                      value={assignedUser}
                      onChange={(e) => setAssignedUser(e.target.value)}
                      placeholder="Assign to username"
                      className="border p-2 w-full mb-2"
                   />
                    <button onClick={createTasks} className="bg-blue-500 text-white w-full">
                      Add
                    </button>
                  </>
                )}
              </div>
            ))}

          </div>
        )}

      </div>
    </div>
  );
}

export default Dashboard;