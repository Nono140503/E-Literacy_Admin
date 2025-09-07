import React, { useState } from "react";
// Import profile images - TODO: Replace with user profile images from database
import profileImg1 from "../assets/1.jpg";
import profileImg2 from "../assets/2.jpg";
import profileImg3 from "../assets/3.jpg";
import profileImg4 from "../assets/4.jpg";

// Replace these dummy arrays with API/database calls:
// Example: useEffect(() => { fetch('/api/practitioners').then(...) }, [])
// Practitioners (approved) - TODO: Replace certification, level, and isDisabled fields with actual database data
const dummyPractitioners = [
  { id: 1, name: "Dr. Jane Smith", email: "jane@clinic.com", status: "approved", profileImage: profileImg1, certification: "PhD in Education Technology", level: "Expert", isDisabled: false },
  { id: 2, name: "Dr. John Doe", email: "john@clinic.com", status: "approved", profileImage: profileImg2, certification: "Master's in Digital Literacy", level: "Advanced", isDisabled: false },
  { id: 4, name: "Prof. Mary Johnson", email: "mary@university.edu", status: "approved", profileImage: profileImg3, certification: "PhD in Computer Science Education", level: "Expert", isDisabled: true },
  { id: 5, name: "Dr. David Wilson", email: "david@tech.org", status: "approved", profileImage: profileImg4, certification: "Master's in Information Systems", level: "Intermediate", isDisabled: false },
];
// Pending practitioners (awaiting approval) - TODO: Replace certification and level fields with actual database data
const dummyPending = [
  { id: 3, name: "Dr. Alice Brown", email: "alice@clinic.com", status: "pending", profileImage: profileImg3, certification: "Bachelor's in Computer Science", level: "Intermediate" },
  { id: 6, name: "Sarah Martinez", email: "sarah@school.edu", status: "pending", profileImage: profileImg1, certification: "Master's in Educational Technology", level: "Advanced" },
  { id: 7, name: "Mike Chen", email: "mike@institute.org", status: "pending", profileImage: profileImg2, certification: "Certificate in Digital Literacy Training", level: "Beginner" },
];
// Registered users (non-practitioners) - TODO: Add profileImage and isDisabled fields from database
const dummyUsers = [
  { id: 4, name: "Michael Green", email: "michael@gmail.com", role: "user", profileImage: profileImg4, isDisabled: false },
  { id: 5, name: "Sarah Lee", email: "sarah@gmail.com", role: "user", profileImage: profileImg1, isDisabled: false },
];

const ManageUsers: React.FC = () => {
  // TODO: Replace dummy state with data from your backend/database
  // Example: useEffect(() => { fetch('/api/pending').then(...) }, [])
  const [pending, setPending] = useState(dummyPending); // Pending practitioners from DB
  const [practitioners, setPractitioners] = useState(dummyPractitioners); // Approved practitioners from DB
  const [users, setUsers] = useState(dummyUsers); // Registered users from DB
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [modalType, setModalType] = useState<'success' | 'error'>('success');

  const handleAccept = (id: number) => {
    const accepted = pending.find(u => u.id === id);
    if (accepted) {
      setPractitioners([...practitioners, { ...accepted, status: "approved" }]);
      setPending(pending.filter(u => u.id !== id));
      setModalMessage(`${accepted.name} has been approved as a practitioner.`);
      setModalType('success');
      setShowModal(true);
    }
  };
  
  const handleDeny = (id: number) => {
    const denied = pending.find(u => u.id === id);
    if (denied) {
      setPending(pending.filter(u => u.id !== id));
      setModalMessage(`${denied.name}'s application has been denied.`);
      setModalType('error');
      setShowModal(true);
    }
  };

  // TODO: Replace with API call to update user account status in database
  const handleToggleAccount = (id: number, userType: 'practitioner' | 'user') => {
    if (userType === 'practitioner') {
      const updatedPractitioners = practitioners.map(p => 
        p.id === id ? { ...p, isDisabled: !p.isDisabled } : p
      );
      setPractitioners(updatedPractitioners);
      const user = practitioners.find(p => p.id === id);
      if (user) {
        setModalMessage(`${user.name}'s account has been ${user.isDisabled ? 'enabled' : 'disabled'}.`);
        setModalType(user.isDisabled ? 'success' : 'error');
        setShowModal(true);
      }
    } else {
      const updatedUsers = users.map(u => 
        u.id === id ? { ...u, isDisabled: !u.isDisabled } : u
      );
      setUsers(updatedUsers);
      const user = users.find(u => u.id === id);
      if (user) {
        setModalMessage(`${user.name}'s account has been ${user.isDisabled ? 'enabled' : 'disabled'}.`);
        setModalType(user.isDisabled ? 'success' : 'error');
        setShowModal(true);
      }
    }
  };

  return (
    <div className="max-w-full mx-auto p-6 -mx-8">
      {/* Back Button */}
      <div className="mb-4">
        <button
          onClick={() => {
            window.location.hash = '';
          }}
          className="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
          </svg>
          Back to User Insights
        </button>
      </div>
      
      <h2 className="text-2xl font-bold mb-6 text-gray-900">Manage Users</h2>
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-2 text-gray-800">Pending Practitioners</h3>
        {pending.length === 0 ? (
          <div className="text-gray-500">No pending requests.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pending.map(u => (
              <div key={u.id} className="bg-gray-50 border rounded-lg p-4 flex gap-3 shadow-sm">
                {/* TODO: Replace with profile image from database */}
                <img 
                  src={u.profileImage} 
                  alt={`${u.name} profile`}
                  className="w-12 h-12 rounded-full object-cover flex-shrink-0"
                />
                <div className="flex-1">
                  <div className="font-semibold text-gray-900">{u.name}</div>
                  <div className="text-sm text-gray-600">{u.email}</div>
                  {/* TODO: Replace with certification and level from database */}
                  <div className="text-xs text-blue-600 font-medium mt-1">{u.certification}</div>
                  <div className="text-xs text-purple-600 font-semibold">Level: {u.level}</div>
                  <div className="flex gap-2 mt-2">
                    <button className="bg-green-500 text-white px-3 py-1 rounded" onClick={() => handleAccept(u.id)}>Accept</button>
                    <button className="bg-red-500 text-white px-3 py-1 rounded" onClick={() => handleDeny(u.id)}>Deny</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-2 text-gray-800">Registered Practitioners</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {practitioners.map(u => (
            <div key={u.id} className="bg-gray-50 border rounded-lg p-4 flex gap-3 shadow-sm">
              {/* TODO: Replace with profile image from database */}
              <img 
                src={u.profileImage} 
                alt={`${u.name} profile`}
                className="w-12 h-12 rounded-full object-cover flex-shrink-0"
              />
              <div className="flex-1">
                <div className="font-semibold text-gray-900">{u.name}</div>
                <div className="text-sm text-gray-600">{u.email}</div>
                {/* TODO: Replace with certification and level from database */}
                <div className="text-xs text-blue-600 font-medium mt-1">{u.certification}</div>
                <div className="text-xs text-purple-600 font-semibold">Level: {u.level}</div>
                <div className="flex items-center justify-between mt-2">
                  <span className={`text-xs font-semibold ${u.isDisabled ? 'text-red-600' : 'text-green-600'}`}>
                    {u.isDisabled ? 'Disabled' : 'Approved'}
                  </span>
                  <button
                    onClick={() => handleToggleAccount(u.id, 'practitioner')}
                    className={`px-3 py-1 rounded text-xs font-semibold ${
                      u.isDisabled 
                        ? 'bg-green-500 text-white hover:bg-green-600' 
                        : 'bg-red-500 text-white hover:bg-red-600'
                    }`}
                  >
                    {u.isDisabled ? 'Enable' : 'Disable'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div>
        <h3 className="text-lg font-semibold mb-2 text-gray-800">Registered Users</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {users.map(u => (
            <div key={u.id} className="bg-gray-50 border rounded-lg p-4 flex gap-3 shadow-sm">
              {/* TODO: Replace with profile image from database */}
              <img 
                src={u.profileImage} 
                alt={`${u.name} profile`}
                className="w-12 h-12 rounded-full object-cover flex-shrink-0"
              />
              <div className="flex-1">
                <div className="font-semibold text-gray-900">{u.name}</div>
                <div className="text-sm text-gray-600">{u.email}</div>
                <div className="flex items-center justify-between mt-2">
                  <span className={`text-xs font-semibold ${u.isDisabled ? 'text-red-600' : 'text-orange-600'}`}>
                    {u.isDisabled ? 'Disabled' : 'User'}
                  </span>
                  <button
                    onClick={() => handleToggleAccount(u.id, 'user')}
                    className={`px-3 py-1 rounded text-xs font-semibold ${
                      u.isDisabled 
                        ? 'bg-green-500 text-white hover:bg-green-600' 
                        : 'bg-red-500 text-white hover:bg-red-600'
                    }`}
                  >
                    {u.isDisabled ? 'Enable' : 'Disable'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* TODO: Replace dummy data with API/database fetch */}
      {/*
        To fetch users from your database, replace the dummy arrays and useEffect hooks above with your API calls.
        Example:
        useEffect(() => {
          fetch('/api/practitioners').then(res => res.json()).then(setPractitioners);
          fetch('/api/pending').then(res => res.json()).then(setPending);
          fetch('/api/users').then(res => res.json()).then(setUsers);
        }, []);
      */}

      {/* Success/Error Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setShowModal(false)} />
          <div className="relative bg-white rounded-xl shadow-lg max-w-md w-full mx-4 p-6 z-10">
            <div className="flex items-center justify-center mb-4">
              {modalType === 'success' ? (
                <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                </div>
              ) : (
                <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                  <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </div>
              )}
            </div>
            <h3 className={`text-lg font-semibold text-center mb-2 ${modalType === 'success' ? 'text-green-800' : 'text-red-800'}`}>
              {modalType === 'success' ? 'User Approved' : 'Application Denied'}
            </h3>
            <p className="text-gray-600 text-center mb-6">{modalMessage}</p>
            <button
              onClick={() => setShowModal(false)}
              className={`w-full py-2 px-4 rounded-lg font-semibold text-white ${
                modalType === 'success' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'
              }`}
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageUsers;
