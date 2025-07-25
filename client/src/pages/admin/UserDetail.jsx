import React, { useEffect, useState } from 'react'
import pfp from '../../assets/images.png';
import UserCard from '../../components/UserCard';
import { useNavigate, useParams } from 'react-router-dom';
import { deleteUser, getUserByID } from '../../services/userService';
import Loading from '../../components/Loading'
import { getTicketByID, getTicketByUserID, getUserTicket } from '../../services/ticketService';
import DataTable from '../../components/Table';
import Popup from '../../components/Popup';
const UserDetail = () => {
  const {id} = useParams();
  //const navigate = useNavigate();
  const [user, setUser] = useState();
  const [loading, setLoading] = useState(false);
  const [tickets, setTickets] = useState();
  const [popup, setPopup] = useState(false);
  const navigate = useNavigate()
const columns = [
  //{ header: 'User',  accessor: 'userName' },
  { header: 'Event', accessor: 'eventTitle' },
  { header: 'Ticket No', accessor: 'ticketNumber' },
  {
    header: 'Date',
    accessor: 'bookingTime',
    render: row => new Date(row.bookingTime).toLocaleString(undefined, {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true, 
}),  // ✅ Converts UTC to local    //(row) => {
    // const date = new Date(row.bookingTime); // UTC ISO string
    // return date.toLocaleString(); // Converts to user local time
  } ,
  { header: 'Price', accessor: 'totalPrice', render: r => `$${r.totalPrice.toFixed(2)}` },
];



const fetchUser = async () => {
  setLoading(true);
  try {
    const userData = await getUserByID(id);
    //console.log(userData);
    setUser(userData);
  } catch (err) {
    console.error('error while fetching user', err);
  } finally {
    setLoading(false);
  }
};

const fetchUserTicket = async () => {
  setLoading(true);
    try{
      const userTicket = await getTicketByUserID(id);
      console.log(userTicket)
      setTickets(userTicket);
    }catch (err) {
      console.error('error while fetching user', err);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    Promise.all([fetchUser(), fetchUserTicket()]).finally(() => setLoading(false));
  },[id]);

  const handleDelete = async (id) => {
    setLoading(true);
    try{
      await deleteUser(id);
      navigate('/admin/users')
    }catch(err){
      console.error('error deleting user', err)
    }finally{
      setLoading(false)
    }
  }
  
  console.log('ticket log', tickets)
  //console.log('user log',user)
  if(loading) return <Loading message='Loading user Detail'/>
  return (
    <>
      { popup 
        ? (<Popup h={`Delete ${user?.name} `} d={'are sure to delete user'} onConfirm={() => handleDelete(id)} onCancel={() =>setPopup(false)}/>)
        :
        (<div>
        {user ? (
          <UserCard
          user={user}
          //onEdit={(id) => console.log("Edit user", id)}
          onDelete={(id) => (console.log("Delete user", id), setPopup(true))}
          />
        ) : (
          <p className="text-center text-gray-500 mt-4">User not found.</p>
        )}
      {tickets 
        ? (
          <section>
          <h2 className="text-xl font-semibold mb-4">User Tickets</h2>
          <DataTable columns={columns} data={tickets} />
          </section>
        )
        :  ( <p className="text-center text-gray-500 mt-4">User Tickets not found.</p>)
      }
    </div>
    )}
    </>
  )
}

export default UserDetail
