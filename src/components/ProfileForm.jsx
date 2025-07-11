import React, { useState } from 'react';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';

const daysOfWeek = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
];

const ProfileForm = ({ onProfileAdded }) => {
  const [form, setForm] = useState({
    photo: null,
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    kin1: '',
    kin2: '',
    gender: '',
    availableDays: [],
  });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!form.photo) newErrors.photo = 'Photo is required';
    if (!form.firstName) newErrors.firstName = 'First name is required';
    if (!form.lastName) newErrors.lastName = 'Last name is required';
    if (!form.email) newErrors.email = 'Email is required';
    else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email)) newErrors.email = 'Invalid email address';
    if (!form.phone || form.phone.length < 7) newErrors.phone = 'Valid phone number is required';
    if (!form.gender) newErrors.gender = 'Gender is required';
    if (form.availableDays.length === 0) newErrors.availableDays = 'Select at least one available day';
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value, files, type, checked } = e.target;
    if (name === 'availableDays') {
      setForm((prev) => ({
        ...prev,
        availableDays: checked
          ? [...prev.availableDays, value]
          : prev.availableDays.filter((day) => day !== value),
      }));
    } else {
      setForm((prev) => ({
        ...prev,
        [name]: files ? files[0] : value,
      }));
    }
  };

  const handlePhoneChange = (value) => {
    setForm((prev) => ({ ...prev, phone: value }));
  };

  const handleReset = () => {
    setForm({ photo: null, firstName: '', lastName: '', email: '', phone: '', kin1: '', kin2: '', gender: '', availableDays: [] });
    setErrors({});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;
    const formData = new FormData();
    formData.append('photo', form.photo);
    formData.append('firstName', form.firstName);
    formData.append('lastName', form.lastName);
    formData.append('email', form.email);
    formData.append('phone', form.phone);
    formData.append('kin1', form.kin1);
    formData.append('kin2', form.kin2);
    formData.append('gender', form.gender);
    form.availableDays.forEach(day => formData.append('availableDays', day));

    try {
      const response = await fetch('http://localhost:9000/api/profiles', {
        method: 'POST',
        body: formData,
      });
      if (response.ok) {
        alert('Profile saved!');
        handleReset();
        if (onProfileAdded) onProfileAdded();
      } else {
        const error = await response.json();
        alert('Error: ' + error.error);
      }
    } catch (err) {
      alert('Network error: ' + err.message);
    }
  };

  return (
    <div className="bg-white rounded-md shadow p-8 m-8">
      <h2 className="mb-6 text-2xl font-bold">Add New Profile</h2>
      <form onSubmit={handleSubmit}>
        <div className="flex gap-8 mb-6">
          {/* Photo Upload */}
          <div className="flex flex-col items-center min-w-[120px]">
            <div className="w-[100px] h-[100px] rounded-full bg-gray-200 mb-3 overflow-hidden flex items-center justify-center">
              {form.photo ? (
                <img src={URL.createObjectURL(form.photo)} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <span className="text-gray-400">Photo</span>
              )}
            </div>
            <input type="file" accept="image/*" name="photo" onChange={handleChange} className="cursor-pointer" />
            {errors.photo && <div className="text-red-600 text-xs mt-1">{errors.photo}</div>}
          </div>
          {/* Fields */}
          <div className="flex-1">
            <div className="flex gap-4 mb-4">
              <div className="flex-1">
                <input name="firstName" value={form.firstName} onChange={handleChange} placeholder="First Name" className="w-full p-2 rounded border border-gray-300" />
                {errors.firstName && <div className="text-red-600 text-xs mt-1">{errors.firstName}</div>}
              </div>
              <div className="flex-1">
                <input name="lastName" value={form.lastName} onChange={handleChange} placeholder="Last Name" className="w-full p-2 rounded border border-gray-300" />
                {errors.lastName && <div className="text-red-600 text-xs mt-1">{errors.lastName}</div>}
              </div>
            </div>
            <div className="flex gap-4 mb-4">
              <div className="flex-1">
                <input name="email" value={form.email} onChange={handleChange} placeholder="Email Address" className="w-full p-2 rounded border border-gray-300" />
                {errors.email && <div className="text-red-600 text-xs mt-1">{errors.email}</div>}
              </div>
              <div className="flex-1">
                <PhoneInput
                  country={'us'}
                  value={form.phone}
                  onChange={handlePhoneChange}
                  inputClass="w-full !py-2 !pl-10 !pr-2 !rounded !border !border-gray-300"
                  dropdownClass="!z-50"
                  inputStyle={{ width: '100%' }}
                />
                {errors.phone && <div className="text-red-600 text-xs mt-1">{errors.phone}</div>}
              </div>
            </div>
            <div className="flex gap-4 mb-4">
              <input name="kin1" value={form.kin1} onChange={handleChange} placeholder="Next of Kin 1" className="flex-1 p-2 rounded border border-gray-300" />
              <input name="kin2" value={form.kin2} onChange={handleChange} placeholder="Next of Kin 2" className="flex-1 p-2 rounded border border-gray-300" />
            </div>
            <div className="flex gap-4 mb-4">
              <div className="flex-1">
                <select name="gender" value={form.gender} onChange={handleChange} className="w-full p-2 rounded border border-gray-300">
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
                {errors.gender && <div className="text-red-600 text-xs mt-1">{errors.gender}</div>}
              </div>
            </div>
            {/* Available Days */}
            <div className="mb-4">
              <label className="font-bold mb-2 block">Available Working Days:</label>
              <div className="flex gap-3 flex-wrap">
                {daysOfWeek.map((day) => (
                  <label key={day} className="flex items-center gap-1 cursor-pointer">
                    <input
                      type="checkbox"
                      name="availableDays"
                      value={day}
                      checked={form.availableDays.includes(day)}
                      onChange={handleChange}
                      className="cursor-pointer"
                    />
                    {day}
                  </label>
                ))}
              </div>
              {errors.availableDays && <div className="text-red-600 text-xs mt-1">{errors.availableDays}</div>}
            </div>
          </div>
        </div>
        {/* Display selected days for demonstration */}
        <div className="mt-6 mb-6">
          <label className="font-bold text-blue-900 block mb-2">Selected Days:</label>
          <div className="flex gap-2 flex-wrap">
            {form.availableDays.length === 0 ? (
              <span className="text-gray-400">None</span>
            ) : (
              form.availableDays.map((day) => (
                <span key={day} className="bg-blue-900 text-white rounded-full px-4 py-1 text-sm font-medium shadow">{day}</span>
              ))
            )}
          </div>
        </div>
        <div className="flex gap-4">
          <button type="submit" className="bg-orange-400 text-white border-none px-8 py-2 rounded font-bold cursor-pointer">SAVE</button>
          <button type="button" onClick={handleReset} className="bg-blue-900 text-white border-none px-8 py-2 rounded font-bold cursor-pointer shadow">RESET</button>
        </div>
      </form>
      
    </div>
  );
};

export default ProfileForm; 