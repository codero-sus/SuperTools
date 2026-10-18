import React, { useState, useEffect } from 'react';
import { Globe, Clock, Search } from 'lucide-react';

interface CityTime {
  name: string;
  country: string;
  timeZone: string;
  offset: string;
}

const CITIES: CityTime[] = [
  { name: 'San Francisco', country: 'United States', timeZone: 'America/Los_Angeles', offset: 'UTC-7' },
  { name: 'New York', country: 'United States', timeZone: 'America/New_York', offset: 'UTC-4' },
  { name: 'London', country: 'United Kingdom', timeZone: 'Europe/London', offset: 'UTC+1' },
  { name: 'Paris', country: 'France', timeZone: 'Europe/Paris', offset: 'UTC+2' },
  { name: 'Berlin', country: 'Germany', timeZone: 'Europe/Berlin', offset: 'UTC+2' },
  { name: 'Dubai', country: 'United Arab Emirates', timeZone: 'Asia/Dubai', offset: 'UTC+4' },
  { name: 'New Delhi', country: 'India', timeZone: 'Asia/Kolkata', offset: 'UTC+5:30' },
  { name: 'Singapore', country: 'Singapore', timeZone: 'Asia/Singapore', offset: 'UTC+8' },
  { name: 'Tokyo', country: 'Japan', timeZone: 'Asia/Tokyo', offset: 'UTC+9' },
  { name: 'Sydney', country: 'Australia', timeZone: 'Australia/Sydney', offset: 'UTC+10' },
  { name: 'Auckland', country: 'New Zealand', timeZone: 'Pacific/Auckland', offset: 'UTC+12' },
  { name: 'Sao Paulo', country: 'Brazil', timeZone: 'America/Sao_Paulo', offset: 'UTC-3' }
];

export const WorldClockTool: React.FC = () => {
  const [now, setNow] = useState(new Date());
  const [search, setSearch] = useState('');
  const [is24Hour, setIs24Hour] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const filteredCities = CITIES.filter(
    c => c.name.toLowerCase().includes(search.toLowerCase()) ||
         c.country.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Search and Toggle */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search city or country..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
          />
        </div>
        <button
          onClick={() => setIs24Hour(!is24Hour)}
          className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
        >
          Format: {is24Hour ? '24-Hour (14:30)' : '12-Hour (2:30 PM)'}
        </button>
      </div>

      {/* World Clock Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCities.map(city => {
          const timeStr = now.toLocaleTimeString('en-US', {
            timeZone: city.timeZone,
            hour12: !is24Hour,
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
          });

          const dateStr = now.toLocaleDateString('en-US', {
            timeZone: city.timeZone,
            weekday: 'short',
            month: 'short',
            day: 'numeric'
          });

          return (
            <div
              key={city.name}
              className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between hover:border-indigo-400/60 transition-all"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-bold text-base text-slate-900 dark:text-white">
                    {city.name}
                  </h3>
                  <p className="text-xs text-slate-400">{city.country}</p>
                </div>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-500 font-semibold">
                  {city.offset}
                </span>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-baseline justify-between">
                <span className="font-mono text-2xl font-black text-indigo-600 dark:text-indigo-400">
                  {timeStr}
                </span>
                <span className="text-xs font-medium text-slate-400">
                  {dateStr}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
