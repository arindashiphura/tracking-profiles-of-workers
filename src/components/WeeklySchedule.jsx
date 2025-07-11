import React, { useState, useEffect } from 'react';
import { FaCalendarWeek, FaUser, FaClock, FaUsers } from 'react-icons/fa';

const daysOfWeek = [
  'Monday',
  'Tuesday', 
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
];

const WeeklySchedule = () => {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDay, setSelectedDay] = useState(null);
  const [viewMode, setViewMode] = useState('weekly'); // 'weekly' or 'daily'

  // Fetch all profiles
  const fetchProfiles = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:10000/api/profiles');
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

  // Get profiles working on a specific day
  const getProfilesForDay = (day) => {
    return profiles.filter(profile => 
      profile.availableDays && profile.availableDays.includes(day)
    );
  };

  // Get total count for each day
  const getDayCount = (day) => {
    return getProfilesForDay(day).length;
  };

  // Get most popular days
  const getMostPopularDays = () => {
    const dayCounts = daysOfWeek.map(day => ({
      day,
      count: getDayCount(day)
    }));
    return dayCounts.sort((a, b) => b.count - a.count);
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-4 md:p-8 m-2 md:m-8">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-900"></div>
          <span className="ml-2">Loading schedules...</span>
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

  return (
    <div className="bg-white rounded-lg shadow-lg p-4 md:p-8 m-2 md:m-8">
      <div className="flex items-center gap-2 mb-4 md:mb-6">
        <FaCalendarWeek className="text-blue-900 text-xl md:text-2xl" />
        <h2 className="text-xl md:text-2xl font-bold text-blue-900">Weekly Schedule</h2>
      </div>

      {/* View Mode Toggle */}
      <div className="flex flex-col sm:flex-row gap-2 md:gap-4 mb-4 md:mb-6">
        <button
          onClick={() => setViewMode('weekly')}
          className={`px-3 md:px-4 py-2 rounded font-medium text-sm md:text-base ${
            viewMode === 'weekly' 
              ? 'bg-blue-900 text-white' 
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Weekly View
        </button>
        <button
          onClick={() => setViewMode('daily')}
          className={`px-3 md:px-4 py-2 rounded font-medium text-sm md:text-base ${
            viewMode === 'daily' 
              ? 'bg-blue-900 text-white' 
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Daily View
        </button>
      </div>

      {/* Summary Stats */}
      <div className="bg-gray-50 rounded-lg p-3 md:p-4 mb-4 md:mb-6">
        <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2 text-sm md:text-base">
          <FaUsers className="text-blue-900" />
          Schedule Summary
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 text-xs md:text-sm">
          <div>
            <div className="text-gray-600">Total Staff</div>
            <div className="font-bold text-blue-900">{profiles.length}</div>
          </div>
          <div>
            <div className="text-gray-600">Most Popular Day</div>
            <div className="font-bold text-green-600">
              {getMostPopularDays()[0]?.day} ({getMostPopularDays()[0]?.count})
            </div>
          </div>
          <div>
            <div className="text-gray-600">Least Popular Day</div>
            <div className="font-bold text-orange-600">
              {getMostPopularDays()[6]?.day} ({getMostPopularDays()[6]?.count})
            </div>
          </div>
          <div>
            <div className="text-gray-600">Avg Staff/Day</div>
            <div className="font-bold text-purple-600">
              {Math.round(daysOfWeek.reduce((sum, day) => sum + getDayCount(day), 0) / 7)}
            </div>
          </div>
        </div>
      </div>

      {viewMode === 'weekly' ? (
        /* Weekly View */
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-2 md:gap-4">
          {daysOfWeek.map((day) => {
            const dayProfiles = getProfilesForDay(day);
            const isSelected = selectedDay === day;
            
            return (
              <div 
                key={day} 
                className={`border rounded-lg p-2 md:p-4 cursor-pointer transition-all ${
                  isSelected 
                    ? 'border-blue-900 bg-blue-50' 
                    : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                }`}
                onClick={() => {
                  if (isSelected) {
                    setSelectedDay(null);
                    setViewMode('weekly');
                  } else {
                    setSelectedDay(day);
                    setViewMode('daily');
                  }
                }}
              >
                <div className="flex items-center justify-between mb-2 md:mb-3">
                  <h3 className="font-bold text-gray-800 text-xs md:text-sm lg:text-base">{day}</h3>
                  <span className="bg-blue-900 text-white rounded-full px-1 md:px-2 py-1 text-xs font-medium">
                    {dayProfiles.length}
                  </span>
                </div>
                
                {dayProfiles.length === 0 ? (
                  <div className="text-center py-2 md:py-4 text-gray-400">
                    <FaUser className="text-lg md:text-2xl mx-auto mb-1" />
                    <p className="text-xs">No staff</p>
                  </div>
                ) : (
                  <div className="space-y-1 md:space-y-2">
                    {dayProfiles.slice(0, 3).map((profile) => (
                      <div key={profile._id} className="flex items-center gap-1 md:gap-2">
                        {profile.photo ? (
                          <img 
                            src={`http://localhost:10000/uploads/${profile.photo}`} 
                            alt="Profile" 
                            className="w-4 h-4 md:w-6 md:h-6 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-4 h-4 md:w-6 md:h-6 rounded-full bg-gray-200 flex items-center justify-center">
                            <FaUser className="text-xs text-gray-400" />
                          </div>
                        )}
                        <span className="text-xs text-gray-700 truncate">
                          {profile.firstName} {profile.lastName}
                        </span>
                      </div>
                    ))}
                    {dayProfiles.length > 3 && (
                      <div className="text-xs text-gray-500 text-center">
                        +{dayProfiles.length - 3} more
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        /* Daily View */
        <div>
          {selectedDay ? (
            <div>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 md:gap-4 mb-4">
                <h3 className="text-lg md:text-xl font-bold text-gray-800 flex items-center gap-2">
                  <FaClock className="text-blue-900" />
                  {selectedDay} - Staff Schedule
                </h3>
                <button
                  onClick={() => {
                    setSelectedDay(null);
                    setViewMode('weekly');
                  }}
                  className="text-gray-500 hover:text-gray-700 text-sm md:text-base"
                >
                  ← Back to Weekly View
                </button>
              </div>
              
              <div className="grid gap-3 md:gap-4">
                {getProfilesForDay(selectedDay).map((profile) => (
                  <div key={profile._id} className="border border-gray-200 rounded-lg p-3 md:p-4 hover:shadow-md transition-shadow">
                    <div className="flex flex-col md:flex-row items-start gap-3 md:gap-4">
                      {/* Profile Photo */}
                      <div className="flex-shrink-0">
                        {profile.photo ? (
                          <img 
                            src={`http://localhost:10000/uploads/${profile.photo}`} 
                            alt="Profile" 
                            className="w-12 h-12 md:w-16 md:h-16 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-gray-200 flex items-center justify-center">
                            <span className="text-gray-400 text-xs md:text-sm">No Photo</span>
                          </div>
                        )}
                      </div>

                      {/* Profile Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-2 mb-2">
                          <h4 className="text-base md:text-lg font-semibold text-gray-800 truncate">
                            {profile.firstName} {profile.lastName}
                          </h4>
                          <span className="text-xs md:text-sm text-gray-500">({profile.gender})</span>
                        </div>
                        
                        <div className="text-xs md:text-sm text-gray-600 mb-3 space-y-1">
                          <div className="truncate">{profile.email}</div>
                          <div>{profile.phone}</div>
                        </div>

                        {/* Full Schedule */}
                        <div>
                          <span className="text-xs md:text-sm font-medium text-gray-700">Full Schedule:</span>
                          <div className="flex gap-1 flex-wrap mt-1">
                            {daysOfWeek.map((day) => (
                              <span 
                                key={day} 
                                className={`rounded-full px-1 md:px-2 py-1 text-xs font-medium ${
                                  profile.availableDays && profile.availableDays.includes(day)
                                    ? day === selectedDay
                                      ? 'bg-blue-900 text-white'
                                      : 'bg-green-100 text-green-800'
                                    : 'bg-gray-100 text-gray-400'
                                }`}
                              >
                                {day.slice(0, 3)}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Contact Info */}
                      <div className="flex-shrink-0 text-right">
                        <div className="text-xs md:text-sm text-gray-600">
                          <div>Next of Kin 1:</div>
                          <div className="font-medium">{profile.kin1 || 'N/A'}</div>
                        </div>
                        <div className="text-xs md:text-sm text-gray-600 mt-2">
                          <div>Next of Kin 2:</div>
                          <div className="font-medium">{profile.kin2 || 'N/A'}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <FaCalendarWeek className="text-3xl md:text-4xl mx-auto mb-2 text-gray-300" />
              <p className="text-sm md:text-base">Click on any day above to view detailed staff schedule</p>
            </div>
          )}
        </div>
      )}

      {/* Popular Days Chart */}
      <div className="mt-6 md:mt-8 bg-gray-50 rounded-lg p-3 md:p-4">
        <h3 className="font-semibold text-gray-800 mb-3 text-sm md:text-base">Staff Distribution by Day</h3>
        <div className="space-y-2">
          {getMostPopularDays().map(({ day, count }) => (
            <div key={day} className="flex items-center gap-3">
              <div className="w-16 md:w-20 text-xs md:text-sm font-medium text-gray-700">{day}</div>
              <div className="flex-1 bg-gray-200 rounded-full h-3 md:h-4">
                <div 
                  className="bg-blue-900 h-3 md:h-4 rounded-full transition-all duration-300"
                  style={{ 
                    width: `${(count / Math.max(...getMostPopularDays().map(d => d.count))) * 100}%` 
                  }}
                ></div>
              </div>
              <div className="w-6 md:w-8 text-xs md:text-sm font-bold text-gray-700">{count}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WeeklySchedule; 