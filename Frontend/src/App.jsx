import { useEffect, useState } from "react";

function App() {
  const [users, setUser] = useState([]);
  const [error, setError] = useState(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:3000/users");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const jsonRes = await response.json();
        setUser(jsonRes.data);
      } catch (err) {
        setError(err.message); // Catch and set error
        console.error("Fetch error:", err);
      }
    };
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:3000/users", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({ name, email }),
      });
      if (!response.ok) {
        throw new Error("Failed to create user");
      }
      const jsonRes = await response.json();
      setUser((prevUser) => [...prevUser, jsonRes.data]);
      setEmail("");
      setName("");
    } catch (err) {
      setError(err.message);
    }
  };
  //DELETE USERS
  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:3000/users/${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        setUser(users.filter((user) => user._id !== id));
      } else {
        console.error('Failed to delete user:', response.statusText);
      }
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  //UPDATE USERS
  const handleEdit = async(id, updateData) =>{
    try {
      const response = await fetch(`http://localhost:3000/users/${id}`,{
        method: 'PUT',
        headers: {
          'Content-type': 'application/json'
        },
        body: JSON.stringify(updateData)
      })
      if(response.ok){
        const updateUser = await response.json();
        setUser((prev) =>
        prev.map(user => (user.id === id ? updateUser : user)))
      }
    } catch (error) {
       console.error('Error updating user:', error);
    }
  }
  
  return ( 
    <div className="text-center mt-6 bg-slate-300 -mr-3.5">
    <h1 className="font-bold text-4xl p-8">Exploring the Basics of CRUD Operations</h1>
    {error && <div>Error: {error}</div>}
    <form onSubmit={handleSubmit} className="flex flex-col items-center mb-4">
      <div className="mb-4">
        <input
          type="text"
          placeholder="Enter Your Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="px-4 py-2 border w-96 border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div className="mb-4">
        <input
          type="text"
          placeholder="Enter Your Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="px-4 py-2 w-96 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <button type="submit" className="bg-blue-500 px-4 py-2 text-white rounded hover:bg-blue-600">Create User</button>
    </form>
    <div className="">
      {users.length === 0 ? (
        <div>No Users Found</div>
      ) : (
        users.map((item) => (
          <div key={item._id} className="flex text-center p-2 border-b">
            <div className="flex-1 text-left ml-52">
              <span className="font-semibold">Name: {item.name}</span>
              <span className="block">Email: {item.email}</span>
            </div>
            <div>
              <button 
                onClick={() => handleEdit(item._id)} 
                className="bg-green-500 px-4 py-2 text-white rounded hover:bg-green-600 ml-2"
              >
                Edit
              </button>
              <button 
                onClick={() => handleDelete(item._id)} 
                className="bg-red-500 px-4 py-2 text-white rounded hover:bg-red-600 ml-2 mr-64"
              >
                Delete
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  </div>
);
}

export default App;