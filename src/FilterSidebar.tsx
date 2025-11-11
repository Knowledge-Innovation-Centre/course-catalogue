import { Slider } from './components/Slider';
import { Dropdown } from './components/Dropdown';
import { theme } from './theme';

export function FilterSidebar() {
  const categories = [
    'Education',
    'Arts and humanities',
    'Social sciences, journalism and information',
    'Business, administration and law',
    'Natural sciences, mathematics and statistics',
    'Information and communication technologies',
    'Engineering, manufacturing and construction',
    'Agriculture, forestry, fisheries and veterinary',
    'Health and welfare',
    'Services'
  ];

  const deliveryModes = [
    { label: 'Online', checked: true },
    { label: 'In person', checked: false },
    { label: 'Blended', checked: true }
  ];

  const assessmentTypes = [
    { label: 'No assessment', checked: false },
    { label: 'Final exam', checked: true },
    { label: 'Graded assignments', checked: false },
    { label: 'Other', checked: false }
  ];

  const languages = ['All languages', 'English', 'Spanish', 'French', 'German', 'Italian'];
  const locations = ['All locations', 'Ireland', 'United Kingdom', 'Europe', 'Online'];

  return (
    <div className="bg-white border border-gray-200 rounded-lg w-[328px] flex flex-col max-h-[calc(100vh-280px)]">
      <div className="flex flex-col rounded-[inherit] w-[328px] h-full overflow-hidden">
        {/* Search */}
        <div className="bg-white border-b border-gray-200 w-full shrink-0">
          <div className="flex gap-4 items-center px-6 py-5 w-full">
            <svg className="w-4 h-4 shrink-0 text-gray-400" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.5"/>
              <path d="M11 11L14 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            <input
              type="text"
              placeholder="Search courses..."
              className="flex-1 font-normal text-sm text-gray-900 placeholder:text-gray-400 outline-none bg-transparent"
            />
          </div>
        </div>

        {/* Filters */}
        <div className="flex-1 bg-white flex flex-col gap-6 overflow-y-auto p-6 w-full">
          {/* Category */}
          <div className="flex flex-col gap-3 w-full">
            <p className="font-semibold text-sm text-gray-500 tracking-wider uppercase">CATEGORY</p>
            <div className="flex flex-col gap-1 w-full">
              {categories.map(category => (
                <label key={category} className="flex items-center gap-2.5 px-2 py-1.5 rounded-md cursor-pointer hover:bg-gray-50 transition-colors group">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded border-gray-300 cursor-pointer"
                    style={{ accentColor: theme.colors.primary }}
                  />
                  <span className="flex-1 font-normal text-sm text-gray-700 group-hover:text-gray-900">{category}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Delivery Mode */}
          <div className="flex flex-col gap-3 w-full">
            <p className="font-semibold text-sm text-gray-500 tracking-wider uppercase">DELIVERY MODE</p>
            <div className="flex flex-col gap-1 w-full">
              {deliveryModes.map(mode => (
                <label key={mode.label} className="flex items-center gap-2.5 px-2 py-1.5 rounded-md cursor-pointer hover:bg-gray-50 transition-colors group">
                  <input
                    type="checkbox"
                    defaultChecked={mode.checked}
                    className="w-4 h-4 rounded border-gray-300 cursor-pointer"
                    style={{ accentColor: theme.colors.primary }}
                  />
                  <span className={`flex-1 text-sm ${mode.checked ? 'font-semibold text-gray-900' : 'font-normal text-gray-700'} group-hover:text-gray-900`}>
                    {mode.label}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Assessment Type */}
          <div className="flex flex-col gap-3 w-full">
            <p className="font-semibold text-sm text-gray-500 tracking-wider uppercase">ASSESSMENT TYPE</p>
            <div className="flex flex-col gap-1 w-full">
              {assessmentTypes.map(type => (
                <label key={type.label} className="flex items-center gap-2.5 px-2 py-1.5 rounded-md cursor-pointer hover:bg-gray-50 transition-colors group">
                  <input
                    type="checkbox"
                    defaultChecked={type.checked}
                    className="w-4 h-4 rounded border-gray-300 cursor-pointer"
                    style={{ accentColor: theme.colors.primary }}
                  />
                  <span className={`flex-1 text-sm ${type.checked ? 'font-semibold text-gray-900' : 'font-normal text-gray-700'} group-hover:text-gray-900`}>
                    {type.label}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Price */}
          <Slider label="PRICE" min={0} max={5000} defaultValue={2500} step={100} unit="€" />

          {/* Level of Experience */}
          <Slider label="LEVEL (EQF)" min={1} max={8} defaultValue={6} />

          {/* Workload (ECTS) */}
          <Slider label="WORKLOAD" min={1} max={60} defaultValue={5} unit=" ECTS" />

          {/* Language */}
          <Dropdown label="LANGUAGE" options={languages} defaultValue="All languages" />

          {/* Location */}
          <Dropdown label="LOCATION" options={locations} defaultValue="All locations" />
        </div>

        {/* Footer Buttons */}
        <div className="bg-white border-t border-gray-200 flex flex-col p-6 w-full shrink-0">
          <div className="flex gap-3 w-full">
            <button className="bg-white border border-gray-200 h-10 px-4 py-2 rounded-lg font-medium text-sm text-gray-700 hover:bg-gray-50 hover:border-gray-300 active:scale-95 transition-all duration-200 cursor-pointer">
              Reset all
            </button>
            <button
              className="flex-1 h-10 px-4 py-2 rounded-lg font-medium text-sm text-white hover:opacity-90 active:scale-95 transition-all duration-200 cursor-pointer"
              style={{ backgroundColor: theme.colors.primary }}
            >
              Apply filters
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
