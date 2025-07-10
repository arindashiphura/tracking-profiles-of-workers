import React, { useEffect, useState } from 'react';
import { FaEye, FaEdit, FaTrash } from 'react-icons/fa';

const daysOfWeek = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
];

const ProfileList = () => {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [viewProfile, setViewProfile] = useState(null);
  const [editProfile, setEditProfile] = useState(null);
  const [editForm, setEditForm] = useState(null);
  const [editErrors, setEditErrors] = useState({});
  const [editSuccess, setEditSuccess] = useState(null);
  const [editReview, setEditReview] = useState(null);
  const [deleteProfile, setDeleteProfile] = useState(null);
  const [deleteSuccess, setDeleteSuccess] = useState(false);

  const fetchProfiles = async () => {
    try {
      const res = await fetch('http://localhost:9000/api/profiles');
      if (!res.ok) throw new Error('Failed to fetch profiles');
      const data = await res.json();
      setProfiles(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfiles();
  }, []);

  const filteredProfiles = profiles.filter(
    (p) =>
      p.firstName.toLowerCase().includes(search.toLowerCase()) ||
      p.lastName.toLowerCase().includes(search.toLowerCase()) ||
      p.email.toLowerCase().includes(search.toLowerCase())
  );

  const openEditModal = (profile) => {
    setEditProfile(profile);
    setEditForm({
      firstName: profile.firstName,
      lastName: profile.lastName,
      email: profile.email,
      phone: profile.phone,
      kin1: profile.kin1,
      kin2: profile.kin2,
      gender: profile.gender,
      availableDays: profile.availableDays || [],
      photo: null,
    });
    setEditErrors({});
  };

  const handleEditChange = (e) => {
    const { name, value, files, checked } = e.target;
    if (name === 'availableDays') {
      setEditForm((prev) => ({
        ...prev,
        availableDays: checked
          ? [...prev.availableDays, value]
          : prev.availableDays.filter((day) => day !== value),
      }));
    } else {
      setEditForm((prev) => ({
        ...prev,
        [name]: files ? files[0] : value,
      }));
    }
  };

  const handleEditPhoneChange = (value) => {
    setEditForm((prev) => ({ ...prev, phone: value }));
  };

  const validateEdit = () => {
    const newErrors = {};
    if (!editForm.firstName) newErrors.firstName = 'First name is required';
    if (!editForm.lastName) newErrors.lastName = 'Last name is required';
    if (!editForm.email) newErrors.email = 'Email is required';
    else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(editForm.email)) newErrors.email = 'Invalid email address';
    if (!editForm.phone || editForm.phone.length < 7) newErrors.phone = 'Valid phone number is required';
    if (!editForm.gender) newErrors.gender = 'Gender is required';
    if (!editForm.availableDays || editForm.availableDays.length === 0) newErrors.availableDays = 'Select at least one available day';
    return newErrors;
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateEdit();
    setEditErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;
    // Instead of submitting, show review modal first
    setEditReview({
      ...editForm,
      _id: editProfile._id,
      reviewPhoto: editForm.photo ? editForm.photo : editProfile.photo
    });
  };

  // Confirm and submit the update after review
  const handleConfirmEdit = async () => {
    const formData = new FormData();
    formData.append('firstName', editReview.firstName);
    formData.append('lastName', editReview.lastName);
    formData.append('email', editReview.email);
    formData.append('phone', editReview.phone);
    formData.append('kin1', editReview.kin1);
    formData.append('kin2', editReview.kin2);
    formData.append('gender', editReview.gender);
    editReview.availableDays.forEach(day => formData.append('availableDays', day));
    if (editReview.photo) {
      formData.append('photo', editReview.photo);
    }
    try {
      const response = await fetch(`http://localhost:9000/api/profiles/${editReview._id}`, {
        method: 'PUT',
        body: formData,
      });
      if (response.ok) {
        const updatedProfile = await response.json();
        setEditProfile(null);
        setEditForm(null);
        setEditReview(null);
        setEditSuccess(updatedProfile);
        fetchProfiles();
      } else {
        const error = await response.json();
        alert('Error: ' + error.error);
      }
    } catch (err) {
      alert('Network error: ' + err.message);
    }
  };

  const handleDelete = async () => {
    if (!deleteProfile) return;
    try {
      const response = await fetch(`http://localhost:9000/api/profiles/${deleteProfile._id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        setDeleteProfile(null);
        setDeleteSuccess(true);
        fetchProfiles();
      } else {
        const error = await response.json();
        alert('Error: ' + error.error);
      }
    } catch (err) {
      alert('Network error: ' + err.message);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#f4f4f4' }}>
      {/* Header */}
      <header style={{ background: '#003399', color: '#fff', padding: '20px 0', textAlign: 'center', fontSize: 24, fontWeight: 'bold', letterSpacing: 1 }}>
        All Profile List
      </header>
      {/* Main Content */}
      <main style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'flex-start', padding: 32 }}>
        <div style={{ background: '#fff', borderRadius: 6, boxShadow: '0 2px 8px #eee', padding: 32, width: '100%', maxWidth: 1200 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
            <span style={{ color: '#888', fontSize: 14 }}>Home - <span style={{ color: '#003399', fontWeight: 500 }}>All Profile List</span></span>
            <div>
              <input
                type="text"
                placeholder="Type Name or Email..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                style={{ padding: 8, borderRadius: 4, border: '1px solid #ccc', marginRight: 8 }}
              />
              <button style={{ background: '#003399', color: '#fff', border: 'none', padding: '8px 24px', borderRadius: 4, fontWeight: 'bold', cursor: 'pointer' }}>SEARCH</button>
            </div>
          </div>
          {loading ? (
            <div>Loading...</div>
          ) : error ? (
            <div style={{ color: 'red' }}>{error}</div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 15 }}>
              <thead>
                <tr style={{ background: '#f4f4f4' }}>
                  <th style={{ padding: 8, border: '1px solid #ddd' }}><input type="checkbox" /></th>
                  <th style={{ padding: 8, border: '1px solid #ddd' }}>ID No.</th>
                  <th style={{ padding: 8, border: '1px solid #ddd' }}>Photo</th>
                  <th style={{ padding: 8, border: '1px solid #ddd' }}>Name</th>
                  <th style={{ padding: 8, border: '1px solid #ddd' }}>Gender</th>
                  <th style={{ padding: 8, border: '1px solid #ddd' }}>Mobile No.</th>
                  <th style={{ padding: 8, border: '1px solid #ddd' }}>Email</th>
                  <th style={{ padding: 8, border: '1px solid #ddd' }}>Next of Kin 1</th>
                  <th style={{ padding: 8, border: '1px solid #ddd' }}>Next of Kin 2</th>
                  <th style={{ padding: 8, border: '1px solid #ddd' }}>Available Days</th>
                  <th style={{ padding: 8, border: '1px solid #ddd' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredProfiles.map((profile, idx) => (
                  <tr key={profile._id}>
                    <td style={{ padding: 8, border: '1px solid #ddd', textAlign: 'center' }}><input type="checkbox" /></td>
                    <td style={{ padding: 8, border: '1px solid #ddd', textAlign: 'center' }}># {2901 + idx}</td>
                    <td style={{ padding: 8, border: '1px solid #ddd', textAlign: 'center' }}>
                      {profile.photo ? (
                        <img src={`http://localhost:9000/uploads/${profile.photo}`} alt="Profile" style={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'cover' }} />
                      ) : (
                        <span style={{ color: '#aaa' }}>No Photo</span>
                      )}
                    </td>
                    <td style={{ padding: 8, border: '1px solid #ddd' }}>{profile.firstName} {profile.lastName}</td>
                    <td style={{ padding: 8, border: '1px solid #ddd' }}>{profile.gender || '-'}</td>
                    <td style={{ padding: 8, border: '1px solid #ddd' }}>{profile.phone}</td>
                    <td style={{ padding: 8, border: '1px solid #ddd' }}>{profile.email}</td>
                    <td style={{ padding: 8, border: '1px solid #ddd' }}>{profile.kin1}</td>
                    <td style={{ padding: 8, border: '1px solid #ddd' }}>{profile.kin2}</td>
                    <td style={{ padding: 8, border: '1px solid #ddd' }}>
                      {profile.availableDays && profile.availableDays.length > 0 ? (
                        profile.availableDays.map((day, i) => (
                          <span key={i} style={{ background: '#003399', color: '#fff', borderRadius: 8, padding: '2px 8px', marginRight: 4, fontSize: 12 }}>{day}</span>
                        ))
                      ) : (
                        <span style={{ color: '#aaa' }}>None</span>
                      )}
                    </td>
                    <td style={{ padding: 8, border: '1px solid #ddd', textAlign: 'center' }}>
                      <div className="flex items-center justify-center space-x-3">
                        <button title="View" className="text-gray-700 hover:text-blue-600 cursor-pointer" onClick={() => setViewProfile(profile)}>
                          <FaEye size={20} />
                        </button>
                        <button title="Edit" className="text-green-600 hover:text-green-800 cursor-pointer" onClick={() => openEditModal(profile)}>
                          <FaEdit size={20} />
                        </button>
                        <button title="Delete" className="text-red-600 hover:text-red-800 cursor-pointer" onClick={() => setDeleteProfile(profile)}>
                          <FaTrash size={20} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>
      {/* View Profile Modal */}
      {viewProfile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-red-600 text-2xl font-bold cursor-pointer"
              onClick={() => setViewProfile(null)}
              title="Close"
            >
              &times;
            </button>
            <div className="flex flex-col items-center mb-4">
              {viewProfile.photo ? (
                <img src={`http://localhost:9000/uploads/${viewProfile.photo}`} alt="Profile" className="w-24 h-24 rounded-full object-cover mb-2" />
              ) : (
                <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center mb-2">No Photo</div>
              )}
              <h3 className="text-xl font-bold mb-1">{viewProfile.firstName} {viewProfile.lastName}</h3>
              <div className="text-gray-600 mb-1">{viewProfile.gender}</div>
            </div>
            <div className="mb-2"><span className="font-semibold">Email:</span> {viewProfile.email}</div>
            <div className="mb-2"><span className="font-semibold">Phone:</span> {viewProfile.phone}</div>
            <div className="mb-2"><span className="font-semibold">Next of Kin 1:</span> {viewProfile.kin1}</div>
            <div className="mb-2"><span className="font-semibold">Next of Kin 2:</span> {viewProfile.kin2}</div>
            <div className="mb-2">
              <span className="font-semibold">Available Days:</span>
              <div className="flex gap-2 flex-wrap mt-1">
                {viewProfile.availableDays && viewProfile.availableDays.length > 0 ? (
                  viewProfile.availableDays.map((day, i) => (
                    <span key={i} className="bg-blue-900 text-white rounded-full px-3 py-1 text-xs font-medium shadow">{day}</span>
                  ))
                ) : (
                  <span className="text-gray-400">None</span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Edit Profile Modal */}
      {editProfile && editForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-red-600 text-2xl font-bold cursor-pointer"
              onClick={() => setEditProfile(null)}
              title="Close"
            >
              &times;
            </button>
            <h3 className="text-xl font-bold mb-4">Edit Profile</h3>
            <form onSubmit={handleEditSubmit}>
              <div className="flex flex-col items-center mb-4">
                {editProfile.photo && !editForm.photo ? (
                  <img src={`http://localhost:9000/uploads/${editProfile.photo}`} alt="Profile" className="w-20 h-20 rounded-full object-cover mb-2" />
                ) : editForm.photo ? (
                  <img src={URL.createObjectURL(editForm.photo)} alt="Profile" className="w-20 h-20 rounded-full object-cover mb-2" />
                ) : (
                  <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center mb-2">No Photo</div>
                )}
                <input type="file" accept="image/*" name="photo" onChange={handleEditChange} className="cursor-pointer" />
                {editErrors.photo && <div className="text-red-600 text-xs mt-1">{editErrors.photo}</div>}
              </div>
              <div className="flex gap-4 mb-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium mb-1" htmlFor="firstName">First Name</label>
                  <input id="firstName" name="firstName" value={editForm.firstName} onChange={handleEditChange} placeholder="First Name" className="w-full p-2 rounded border border-gray-300" />
                  {editErrors.firstName && <div className="text-red-600 text-xs mt-1">{editErrors.firstName}</div>}
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium mb-1" htmlFor="lastName">Last Name</label>
                  <input id="lastName" name="lastName" value={editForm.lastName} onChange={handleEditChange} placeholder="Last Name" className="w-full p-2 rounded border border-gray-300" />
                  {editErrors.lastName && <div className="text-red-600 text-xs mt-1">{editErrors.lastName}</div>}
                </div>
              </div>
              <div className="flex gap-4 mb-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium mb-1" htmlFor="email">Email Address</label>
                  <input id="email" name="email" value={editForm.email} onChange={handleEditChange} placeholder="Email Address" className="w-full p-2 rounded border border-gray-300" />
                  {editErrors.email && <div className="text-red-600 text-xs mt-1">{editErrors.email}</div>}
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium mb-1" htmlFor="phone">Phone Number</label>
                  <input id="phone" name="phone" value={editForm.phone} onChange={e => handleEditPhoneChange(e.target.value)} placeholder="Phone Number" className="w-full p-2 rounded border border-gray-300" />
                  {editErrors.phone && <div className="text-red-600 text-xs mt-1">{editErrors.phone}</div>}
                </div>
              </div>
              <div className="flex gap-4 mb-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium mb-1" htmlFor="kin1">Next of Kin 1</label>
                  <input id="kin1" name="kin1" value={editForm.kin1} onChange={handleEditChange} placeholder="Next of Kin 1" className="w-full p-2 rounded border border-gray-300" />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium mb-1" htmlFor="kin2">Next of Kin 2</label>
                  <input id="kin2" name="kin2" value={editForm.kin2} onChange={handleEditChange} placeholder="Next of Kin 2" className="w-full p-2 rounded border border-gray-300" />
                </div>
              </div>
              <div className="flex gap-4 mb-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium mb-1" htmlFor="gender">Gender</label>
                  <select id="gender" name="gender" value={editForm.gender} onChange={handleEditChange} className="w-full p-2 rounded border border-gray-300">
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                  {editErrors.gender && <div className="text-red-600 text-xs mt-1">{editErrors.gender}</div>}
                </div>
              </div>
              <div className="mb-4">
                <label className="font-bold mb-2 block">Available Days:</label>
                <div className="flex gap-3 flex-wrap">
                  {daysOfWeek.map((day) => (
                    <label key={day} className="flex items-center gap-1 cursor-pointer">
                      <input
                        type="checkbox"
                        name="availableDays"
                        value={day}
                        checked={editForm.availableDays.includes(day)}
                        onChange={handleEditChange}
                        className="cursor-pointer"
                      />
                      {day}
                    </label>
                  ))}
                </div>
                {editErrors.availableDays && <div className="text-red-600 text-xs mt-1">{editErrors.availableDays}</div>}
              </div>
              <div className="flex gap-4">
                <button type="submit" className="bg-green-600 text-white border-none px-8 py-2 rounded font-bold cursor-pointer">Update</button>
                <button type="button" onClick={() => setEditProfile(null)} className="bg-gray-400 text-white border-none px-8 py-2 rounded font-bold cursor-pointer">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Edit Review Modal */}
      {editReview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md relative">
            <h3 className="text-xl font-bold mb-4 text-blue-700">Review All Details</h3>
            <div className="flex flex-col items-center mb-4">
              {editReview.reviewPhoto ? (
                typeof editReview.reviewPhoto === 'string' ? (
                  <img src={`http://localhost:9000/uploads/${editReview.reviewPhoto}`} alt="Profile" className="w-20 h-20 rounded-full object-cover mb-2" />
                ) : (
                  <img src={URL.createObjectURL(editReview.reviewPhoto)} alt="Profile" className="w-20 h-20 rounded-full object-cover mb-2" />
                )
              ) : (
                <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center mb-2">No Photo</div>
              )}
              <h3 className="text-lg font-bold mb-1">{editReview.firstName} {editReview.lastName}</h3>
              <div className="text-gray-600 mb-1">{editReview.gender}</div>
            </div>
            <div className="mb-2"><span className="font-semibold">Email:</span> {editReview.email}</div>
            <div className="mb-2"><span className="font-semibold">Phone:</span> {editReview.phone}</div>
            <div className="mb-2"><span className="font-semibold">Next of Kin 1:</span> {editReview.kin1}</div>
            <div className="mb-2"><span className="font-semibold">Next of Kin 2:</span> {editReview.kin2}</div>
            <div className="mb-2">
              <span className="font-semibold">Available Days:</span>
              <div className="flex gap-2 flex-wrap mt-1">
                {editReview.availableDays && editReview.availableDays.length > 0 ? (
                  editReview.availableDays.map((day, i) => (
                    <span key={i} className="bg-blue-900 text-white rounded-full px-3 py-1 text-xs font-medium shadow">{day}</span>
                  ))
                ) : (
                  <span className="text-gray-400">None</span>
                )}
              </div>
            </div>
            <div className="flex gap-4 mt-6">
              <button
                className="bg-green-600 text-white border-none px-8 py-2 rounded font-bold cursor-pointer"
                onClick={handleConfirmEdit}
              >
                Confirm Changes
              </button>
              <button
                className="bg-gray-400 text-white border-none px-8 py-2 rounded font-bold cursor-pointer"
                onClick={() => setEditReview(null)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Edit Success Confirmation Modal */}
      {editSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md relative">
            <h3 className="text-xl font-bold mb-4 text-green-700">Last Profile Updated Successfully!</h3>
            <div className="flex flex-col items-center mb-4">
              {editSuccess.photo ? (
                <img src={`http://localhost:9000/uploads/${editSuccess.photo}`} alt="Profile" className="w-20 h-20 rounded-full object-cover mb-2" />
              ) : (
                <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center mb-2">No Photo</div>
              )}
              <h3 className="text-lg font-bold mb-1">{editSuccess.firstName} {editSuccess.lastName}</h3>
              <div className="text-gray-600 mb-1">{editSuccess.gender}</div>
            </div>
            <div className="mb-2"><span className="font-semibold">Email:</span> {editSuccess.email}</div>
            <div className="mb-2"><span className="font-semibold">Phone:</span> {editSuccess.phone}</div>
            <div className="mb-2"><span className="font-semibold">Next of Kin 1:</span> {editSuccess.kin1}</div>
            <div className="mb-2"><span className="font-semibold">Next of Kin 2:</span> {editSuccess.kin2}</div>
            <div className="mb-2">
              <span className="font-semibold">Available Days:</span>
              <div className="flex gap-2 flex-wrap mt-1">
                {editSuccess.availableDays && editSuccess.availableDays.length > 0 ? (
                  editSuccess.availableDays.map((day, i) => (
                    <span key={i} className="bg-blue-900 text-white rounded-full px-3 py-1 text-xs font-medium shadow">{day}</span>
                  ))
                ) : (
                  <span className="text-gray-400">None</span>
                )}
              </div>
            </div>
            <button
              className="mt-6 bg-green-600 text-white border-none px-8 py-2 rounded font-bold cursor-pointer"
              onClick={() => setEditSuccess(null)}
            >
              OK
            </button>
          </div>
        </div>
      )}
      {/* Delete Confirmation Modal */}
      {deleteProfile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md relative">
            <h3 className="text-xl font-bold mb-4 text-red-700">Confirm Delete</h3>
            <div className="flex flex-col items-center mb-4">
              {deleteProfile.photo ? (
                <img src={`http://localhost:9000/uploads/${deleteProfile.photo}`} alt="Profile" className="w-20 h-20 rounded-full object-cover mb-2" />
              ) : (
                <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center mb-2">No Photo</div>
              )}
              <h3 className="text-lg font-bold mb-1">{deleteProfile.firstName} {deleteProfile.lastName}</h3>
              <div className="text-gray-600 mb-1">{deleteProfile.gender}</div>
            </div>
            <div className="mb-2"><span className="font-semibold">Email:</span> {deleteProfile.email}</div>
            <div className="mb-2"><span className="font-semibold">Phone:</span> {deleteProfile.phone}</div>
            <div className="mb-2"><span className="font-semibold">Next of Kin 1:</span> {deleteProfile.kin1}</div>
            <div className="mb-2"><span className="font-semibold">Next of Kin 2:</span> {deleteProfile.kin2}</div>
            <div className="mb-2">
              <span className="font-semibold">Available Days:</span>
              <div className="flex gap-2 flex-wrap mt-1">
                {deleteProfile.availableDays && deleteProfile.availableDays.length > 0 ? (
                  deleteProfile.availableDays.map((day, i) => (
                    <span key={i} className="bg-blue-900 text-white rounded-full px-3 py-1 text-xs font-medium shadow">{day}</span>
                  ))
                ) : (
                  <span className="text-gray-400">None</span>
                )}
              </div>
            </div>
            <div className="flex gap-4 mt-6">
              <button
                className="bg-red-600 text-white border-none px-8 py-2 rounded font-bold cursor-pointer"
                onClick={handleDelete}
              >
                Delete
              </button>
              <button
                className="bg-gray-400 text-white border-none px-8 py-2 rounded font-bold cursor-pointer"
                onClick={() => setDeleteProfile(null)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Delete Success Modal */}
      {deleteSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md relative">
            <h3 className="text-xl font-bold mb-4 text-green-700">Profile Deleted Successfully!</h3>
            <button
              className="mt-6 bg-green-600 text-white border-none px-8 py-2 rounded font-bold cursor-pointer"
              onClick={() => setDeleteSuccess(false)}
            >
              OK
            </button>
          </div>
        </div>
      )}
      {/* Footer */}
      <footer style={{ background: '#003399', color: '#fff', textAlign: 'center', padding: 16, fontSize: 16 }}>
        &copy; {new Date().getFullYear()} Expense Tracker
      </footer>
    </div>
  );
};

export default ProfileList; 