import React, { useEffect, useState } from 'react'
import Button from '../../components/Button';
import { getUserList, searchUser } from '../../services/userService';
import DataTable from '../../components/Table';
import { getImageUrl } from '../../services/apiConfig';
import Pfp from '../../assets/images.png'
import { useNavigate } from 'react-router-dom';
const ManageUser = () => {
  const[search,setSearch] = useState();
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState('all');
  const [users, setUsers] = useState([])
  const navigate = useNavigate();
  // const [popup, setPopup] = useState(false)
  const columns = [
    {
      header: 'User',
      render: (user) => (
        <img
          src={user.pfpUrl === null || user.pfpUrl== "" ? Pfp :getImageUrl(user.pfpUrl)}
          alt="User"
          className="h-10 w-10 rounded-full object-cover"
        />
      ),
    },
    { header: 'Name', accessor: 'name' },
    { header: 'Role', accessor: 'role' },
    
    {
      header: 'Action',
      render: (user) => (
        <div className="flex gap-2">
          <Button style="bg-blue-500 text-white px-2 py-1 rounded text-sm" onClick={() => navigate(`/admin/${user.id}/detail`)}>Details</Button>
          {/* <Button style="bg-red-500 text-white px-2 py-1 rounded text-sm" onClick={()=> setPopup(true)}>Delete</Button> */}
        </div>
      ),
    },
    
  ];

   useEffect(() => {
      fetchUsers();
      handleSearch();
    }, [search]);
    
  const fetchUsers = async () => {
        try {
        
          const data = await getUserList();
          setUsers(data);

          //console.log({})
          //setStatus(data.st)
        } catch (err) {
          console.error("Error loading events", err);
        } finally {
          setLoading(false);
        }
  };

  const handleSearch = async (value) => {
    setLoading(true)
      if (!value.trim()) {
    setFilter("all");
    await fetchUsers();
    return;
  }

  try {
    const results = await searchUser(value);
    setUsers(results);
    setFilter(results.length === 0 ? 'all' : '');
    
  } catch (err) {
    console.error("Search failed", err);
  }finally{
    setLoading(false)
  }
    };
    
    const handleAllFilter = async () => {
    await fetchUsers();
    setFilter('all');
    setSearch('');
  };

  const filteredUsers = users.filter(user => {
    if (filter === 'user') return user.role === 'User';
    if (filter === 'organizer') return user.role === 'Organizer';
    return true;
  });

    
  return (
    <div className='p-6'>
       <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Manage Users</h2>
              <div className="flex gap-3">
              <input
                type="text"
                placeholder="Search event"
                value={search}
                onChange={(e) => {const value = e.target.value;
    setSearch(value);
    handleSearch(value);}}
              />
                {search ? (
                  <button
                  onClick={handleAllFilter}
                  className="px-3 py-1 bg-gray-300 rounded"
                  >
                    Clear Search
                  </button>
                ) : 
                
                <button onClick={handleSearch} type="submit">Search</button>
                }
      
                <Button
                  onClick={handleAllFilter}
                  style={`px-4 py-2 rounded ${filter === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800'}`}
                >
                  All
                </Button>
      
                <Button
                  onClick={() => setFilter('user')}
                  style={`px-4 py-2 rounded ${filter === 'user' ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-800'}`}
                >
                  User
                </Button>
                <Button
                  onClick={() => setFilter('organizer')}
                  style={`px-4 py-2 rounded ${filter === 'organizer' ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-800'}`}
                >
                  Organizer
                </Button>
              </div>
            </div>
      {loading ? (
        <p>Loading users...</p>
      ) : (
        <DataTable columns={columns} data={filteredUsers} />
      )}
    </div>
  )
}

export default ManageUser
