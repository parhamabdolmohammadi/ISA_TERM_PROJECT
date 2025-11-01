const API_URL = "http://localhost:3000/api/users";

async function loadUsers() {
  const res = await fetch(API_URL);
  const data = await res.json();
  const list = document.getElementById("userList");
  list.innerHTML = "";
  data.forEach(u => {
    const li = document.createElement("li");
    li.textContent = `${u.id}: ${u.name}`;
    list.appendChild(li);
  });
}

async function addUser() {
  const name = document.getElementById("nameInput").value;
  if (!name.trim()) return alert("Please enter a name");

  await fetch(`${API_URL}/add`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name }),
  });

  document.getElementById("nameInput").value = "";
  loadUsers();
}

loadUsers();
