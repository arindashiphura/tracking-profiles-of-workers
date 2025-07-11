import React, { useState, useEffect } from 'react';
import { FaSearch, FaUsers, FaCalendarAlt } from 'react-icons/fa';

const daysOfWeek = [
  'Monday',
  'Tuesday', 
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
];

const WorkScheduleMatcher = () => {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDays, setSelectedDays] = useState([]);
  const [filteredProfiles, setFilteredProfiles] = useState([]);

  // Fetch all profiles
  const fetchProfiles = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/profiles`);
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

  // Handle day selection
  const handleDayToggle = (day) => {
    setSelectedDays(prev => 
      prev.includes(day) 
        ? prev.filter(d => d !== day)
        : [...prev, day]
    );
  };

  // Filter profiles based on selected days
  useEffect(() => {
    if (selectedDays.length === 0) {
      setFilteredProfiles([]);
      return;
    }

    const filtered = profiles.filter(profile => 
      profile.availableDays && 
      selectedDays.some(day => profile.availableDays.includes(day))
    );

    // Sort by number of matching days (most matches first)
    filtered.sort((a, b) => {
      const aMatches = selectedDays.filter(day => a.availableDays.includes(day)).length;
      const bMatches = selectedDays.filter(day => b.availableDays.includes(day)).length;
      return bMatches - aMatches;
    });

    setFilteredProfiles(filtered);
  }, [selectedDays, profiles]);

  // Get matching days for a profile
  const getMatchingDays = (profile) => {
    if (!profile.availableDays) return [];
    return selectedDays.filter(day => profile.availableDays.includes(day));
  };

  // Get non-matching days for a profile
  const getNonMatchingDays = (profile) => {
    if (!profile.availableDays) return [];
    return profile.availableDays.filter(day => !selectedDays.includes(day));
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

  return (
    <div className="bg-white rounded-lg shadow-lg p-4 md:p-8 m-2 md:m-8">
      <div className="flex items-center gap-2 mb-4 md:mb-6">
        <FaUsers className="text-blue-900 text-xl md:text-2xl" />
        <h2 className="text-xl md:text-2xl font-bold text-blue-900">Work Schedule Matcher</h2>
      </div>
      
      <p className="text-gray-600 mb-4 md:mb-6 text-sm md:text-base">
        Select the days you want to work and find colleagues who share the same schedule.
      </p>

      {/* Day Selection */}
      <div className="mb-6 md:mb-8">
        <label className="font-bold text-gray-700 block mb-3 flex items-center gap-2 text-sm md:text-base">
          <FaCalendarAlt className="text-blue-900" />
          Select Work Days:
        </label>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-2 md:gap-3">
          {daysOfWeek.map((day) => (
            <label key={day} className="flex items-center gap-2 cursor-pointer text-sm md:text-base">
              <input
                type="checkbox"
                checked={selectedDays.includes(day)}
                onChange={() => handleDayToggle(day)}
                className="cursor-pointer"
              />
              <span className={`px-2 md:px-3 py-1 rounded-full text-xs md:text-sm font-medium ${
                selectedDays.includes(day) 
                  ? 'bg-blue-900 text-white' 
                  : 'bg-gray-200 text-gray-700'
              }`}>
                {day}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Results */}
      <div className="mb-4 md:mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 md:gap-4 mb-4">
          <h3 className="text-base md:text-lg font-bold text-gray-800">
            {selectedDays.length === 0 
              ? 'Select days to find colleagues' 
              : `Found ${filteredProfiles.length} colleague${filteredProfiles.length !== 1 ? 's' : ''}`
            }
          </h3>
          {selectedDays.length > 0 && (
            <span className="text-xs md:text-sm text-gray-600">
              Matching: {selectedDays.join(', ')}
            </span>
          )}
        </div>

        {selectedDays.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <FaSearch className="text-3xl md:text-4xl mx-auto mb-2 text-gray-300" />
            <p className="text-sm md:text-base">Select work days above to find colleagues with matching schedules</p>
          </div>
        ) : filteredProfiles.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <FaUsers className="text-3xl md:text-4xl mx-auto mb-2 text-gray-300" />
            <p className="text-sm md:text-base">No colleagues found working on the selected days</p>
          </div>
        ) : (
          <div className="grid gap-3 md:gap-4">
            {filteredProfiles.map((profile) => {
              const matchingDays = getMatchingDays(profile);
              const nonMatchingDays = getNonMatchingDays(profile);
              
              return (
                <div key={profile._id} className="border border-gray-200 rounded-lg p-3 md:p-4 hover:shadow-md transition-shadow">
                  <div className="flex flex-col md:flex-row items-start gap-3 md:gap-4">
                    {/* Profile Photo */}
                    <div className="flex-shrink-0">
                      {profile.photo ? (
                        <img 
                          src={`${import.meta.env.VITE_API_URL}/uploads/${profile.photo}`} 
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

                      {/* Schedule Info */}
                      <div className="space-y-2">
                        <div>
                          <span className="text-xs md:text-sm font-medium text-green-700">Matching Days ({matchingDays.length}):</span>
                          <div className="flex gap-1 flex-wrap mt-1">
                            {matchingDays.map((day) => (
                              <span key={day} className="bg-green-100 text-green-800 rounded-full px-2 py-1 text-xs font-medium">
                                {day}
                              </span>
                            ))}
                          </div>
                        </div>
                        
                        {nonMatchingDays.length > 0 && (
                          <div>
                            <span className="text-xs md:text-sm font-medium text-gray-600">Also Works On:</span>
                            <div className="flex gap-1 flex-wrap mt-1">
                              {nonMatchingDays.map((day) => (
                                <span key={day} className="bg-gray-100 text-gray-600 rounded-full px-2 py-1 text-xs font-medium">
                                  {day}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Match Percentage */}
                    <div className="flex-shrink-0 text-right">
                      <div className="text-xl md:text-2xl font-bold text-blue-900">
                        {Math.round((matchingDays.length / selectedDays.length) * 100)}%
                      </div>
                      <div className="text-xs text-gray-500">Match</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Summary Stats */}
      {filteredProfiles.length > 0 && (
        <div className="bg-gray-50 rounded-lg p-3 md:p-4 mt-4 md:mt-6">
          <h4 className="font-semibold text-gray-800 mb-2 text-sm md:text-base">Summary</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 text-xs md:text-sm">
            <div>
              <div className="text-gray-600">Total Found</div>
              <div className="font-bold text-blue-900">{filteredProfiles.length}</div>
            </div>
            <div>
              <div className="text-gray-600">Perfect Matches</div>
              <div className="font-bold text-green-600">
                {filteredProfiles.filter(p => getMatchingDays(p).length === selectedDays.length).length}
              </div>
            </div>
            <div>
              <div className="text-gray-600">Partial Matches</div>
              <div className="font-bold text-orange-600">
                {filteredProfiles.filter(p => getMatchingDays(p).length < selectedDays.length).length}
              </div>
            </div>
            <div>
              <div className="text-gray-600">Avg Match %</div>
              <div className="font-bold text-purple-600">
                {Math.round(
                  filteredProfiles.reduce((sum, p) => 
                    sum + (getMatchingDays(p).length / selectedDays.length) * 100, 0
                  ) / filteredProfiles.length
                )}%
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkScheduleMatcher; 