import React, { useState, useEffect } from 'react';
import { FaUser, FaCalendarAlt, FaPhone, FaEnvelope, FaSearch, FaFilter } from 'react-icons/fa';

const daysOfWeek = [
  'Monday',
  'Tuesday', 
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
];

const Reserved = () => {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDay, setFilterDay] = useState('');
  const [sortBy, setSortBy] = useState('name'); // 'name', 'days', 'gender'

  // Fetch all profiles
  const fetchProfiles = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:9000/api/profiles');
      if (response.ok) {
        const data = await response.json();
        setProfiles(data);
      } else {
        setError('Failed to fetch profiles');
      }
    } catch (err) {
      setError('Network error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfiles();
  }, []);

  // Filter and sort profiles
  const getFilteredAndSortedProfiles = () => {
    let filtered = profiles;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(profile => 
        profile.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        profile.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        profile.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        profile.phone?.includes(searchTerm)
      );
    }

    // Filter by day
    if (filterDay) {
      filtered = filtered.filter(profile => 
        profile.availableDays && profile.availableDays.includes(filterDay)
      );
    }

    // Sort profiles
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return `${a.firstName} ${a.lastName}`.localeCompare(`${b.firstName} ${b.lastName}`);
        case 'days':
          return (b.availableDays?.length || 0) - (a.availableDays?.length || 0);
        case 'gender':
          return (a.gender || '').localeCompare(b.gender || '');
        default:
          return 0;
      }
    });

    return filtered;
  };

  // Get working days count
  const getWorkingDaysCount = (profile) => {
    return profile.availableDays ? profile.availableDays.length : 0;
  };

  // Get working days display
  const getWorkingDaysDisplay = (profile) => {
    if (!profile.availableDays || profile.availableDays.length === 0) {
      return <span className="text-gray-400">No days selected</span>;
    }
    return profile.availableDays.map((day) => (
      <span key={day} className="bg-blue-900 text-white rounded-full px-2 py-1 text-xs font-medium mr-1 mb-1 inline-block">
        {day}
      </span>
    ));
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-4 md:p-8 m-2 md:m-8">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-900"></div>
          <span className="ml-2">Loading profiles...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-4 md:p-8 m-2 md:m-8">
        <div className="text-red-600 text-center">{error}</div>
        <button 
          onClick={fetchProfiles}
          className="mt-4 bg-blue-900 text-white px-4 py-2 rounded cursor-pointer"
        >
          Retry
        </button>
      </div>
    );
  }

  const filteredProfiles = getFilteredAndSortedProfiles();

  return (
    <div className="bg-white rounded-lg shadow-lg p-4 md:p-8 m-2 md:m-8">
      <div className="flex items-center gap-2 mb-4 md:mb-6">
        <FaUser className="text-blue-900 text-xl md:text-2xl" />
        <h2 className="text-xl md:text-2xl font-bold text-blue-900">Reserved - All Profiles</h2>
      </div>

      {/* Search and Filter Controls */}
      <div className="mb-4 md:mb-6 space-y-3 md:space-y-4">
        {/* Search Bar */}
        <div className="flex flex-col lg:flex-row gap-3 md:gap-4">
          <div className="flex-1 relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, email, or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 md:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent text-sm md:text-base"
            />
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <select
              value={filterDay}
              onChange={(e) => setFilterDay(e.target.value)}
              className="px-3 md:px-4 py-2 md:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent text-sm md:text-base"
            >
              <option value="">All Days</option>
              {daysOfWeek.map((day) => (
                <option key={day} value={day}>{day}</option>
              ))}
            </select>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 md:px-4 py-2 md:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent text-sm md:text-base"
            >
              <option value="name">Sort by Name</option>
              <option value="days">Sort by Working Days</option>
              <option value="gender">Sort by Gender</option>
            </select>
          </div>
        </div>

        {/* Results Summary */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-2 text-xs md:text-sm text-gray-600">
          <div>
            Showing {filteredProfiles.length} of {profiles.length} profiles
            {searchTerm && ` matching "${searchTerm}"`}
            {filterDay && ` working on ${filterDay}`}
          </div>
          <div className="flex items-center gap-3 md:gap-4">
            <span>Total Staff: {profiles.length}</span>
            <span>Active Filters: {(searchTerm ? 1 : 0) + (filterDay ? 1 : 0)}</span>
          </div>
        </div>
      </div>

      {/* Profiles List */}
      {filteredProfiles.length === 0 ? (
        <div className="text-center py-8 md:py-12 text-gray-500">
          <FaUser className="text-3xl md:text-4xl mx-auto mb-2 text-gray-300" />
          <p className="text-base md:text-lg font-medium mb-2">No profiles found</p>
          <p className="text-sm md:text-base">Try adjusting your search or filter criteria</p>
        </div>
      ) : (
        <div className="space-y-3 md:space-y-4">
          {filteredProfiles.map((profile, index) => (
            <div key={profile._id} className="border border-gray-200 rounded-lg p-4 md:p-6 hover:shadow-lg transition-shadow">
              <div className="flex flex-col lg:flex-row items-start gap-4 md:gap-6">
                {/* Profile Photo */}
                <div className="flex-shrink-0">
                  {profile.photo ? (
                    <img 
                      src={`http://localhost:9000/uploads/${profile.photo}`} 
                      alt="Profile" 
                      className="w-16 h-16 md:w-20 md:h-20 rounded-full object-cover border-2 border-gray-200"
                    />
                  ) : (
                    <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-gray-200 flex items-center justify-center border-2 border-gray-300">
                      <FaUser className="text-xl md:text-2xl text-gray-400" />
                    </div>
                  )}
                </div>

                {/* Profile Information */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-4 mb-2 md:mb-3">
                    <h3 className="text-lg md:text-xl font-bold text-gray-800 truncate">
                      {profile.firstName} {profile.lastName}
                    </h3>
                    <span className="bg-blue-900 text-white px-2 md:px-3 py-1 rounded-full text-xs md:text-sm font-medium">
                      #{index + 1}
                    </span>
                    {profile.gender && (
                      <span className="bg-gray-100 text-gray-700 px-2 md:px-3 py-1 rounded-full text-xs md:text-sm font-medium">
                        {profile.gender}
                      </span>
                    )}
                  </div>

                  {/* Contact Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 mb-3 md:mb-4">
                    <div className="flex items-center gap-2 text-gray-600 text-sm md:text-base">
                      <FaEnvelope className="text-blue-900 flex-shrink-0" />
                      <span className="truncate">{profile.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600 text-sm md:text-base">
                      <FaPhone className="text-blue-900 flex-shrink-0" />
                      <span>{profile.phone}</span>
                    </div>
                  </div>

                  {/* Next of Kin */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 mb-3 md:mb-4">
                    <div>
                      <span className="text-xs md:text-sm font-medium text-gray-700">Next of Kin 1:</span>
                      <div className="text-gray-600 text-sm md:text-base">{profile.kin1 || 'Not specified'}</div>
                    </div>
                    <div>
                      <span className="text-xs md:text-sm font-medium text-gray-700">Next of Kin 2:</span>
                      <div className="text-gray-600 text-sm md:text-base">{profile.kin2 || 'Not specified'}</div>
                    </div>
                  </div>

                  {/* Working Days */}
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <FaCalendarAlt className="text-blue-900 flex-shrink-0" />
                      <span className="text-xs md:text-sm font-medium text-gray-700">
                        Working Days ({getWorkingDaysCount(profile)} days)
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {getWorkingDaysDisplay(profile)}
                    </div>
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="flex-shrink-0 text-right">
                  <div className="bg-gray-50 rounded-lg p-2 md:p-3">
                    <div className="text-xl md:text-2xl font-bold text-blue-900">
                      {getWorkingDaysCount(profile)}
                    </div>
                    <div className="text-xs text-gray-500">Days</div>
                    <div className="text-xs text-gray-500 mt-1">
                      {profile.availableDays && profile.availableDays.length > 0 
                        ? `${Math.round((profile.availableDays.length / 7) * 100)}%` 
                        : '0%'
                      } of week
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Summary Footer */}
      {filteredProfiles.length > 0 && (
        <div className="mt-6 md:mt-8 bg-gray-50 rounded-lg p-3 md:p-4">
          <h4 className="font-semibold text-gray-800 mb-3 text-sm md:text-base">Summary Statistics</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 text-xs md:text-sm">
            <div>
              <div className="text-gray-600">Total Profiles</div>
              <div className="font-bold text-blue-900">{profiles.length}</div>
            </div>
            <div>
              <div className="text-gray-600">Average Working Days</div>
              <div className="font-bold text-green-600">
                {Math.round(profiles.reduce((sum, p) => sum + getWorkingDaysCount(p), 0) / profiles.length)}
              </div>
            </div>
            <div>
              <div className="text-gray-600">Most Active Day</div>
              <div className="font-bold text-orange-600">
                {(() => {
                  const dayCounts = daysOfWeek.map(day => ({
                    day,
                    count: profiles.filter(p => p.availableDays && p.availableDays.includes(day)).length
                  }));
                  const mostActive = dayCounts.reduce((max, current) => 
                    current.count > max.count ? current : max
                  );
                  return `${mostActive.day} (${mostActive.count})`;
                })()}
              </div>
            </div>
            <div>
              <div className="text-gray-600">Full-Time Staff</div>
              <div className="font-bold text-purple-600">
                {profiles.filter(p => getWorkingDaysCount(p) >= 5).length}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reserved; 