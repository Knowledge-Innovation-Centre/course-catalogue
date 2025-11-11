import { Link } from 'react-router-dom';
import { theme } from './theme';

export function Header() {
  return (
    <div
      className="flex items-center justify-center px-[100px] py-5"
      style={{ backgroundColor: theme.colors.primary }}
    >
      <div className="flex gap-3 items-center max-w-[1240px] w-full">
        <Link to="/" className="flex gap-3 items-center hover:opacity-90 transition-opacity">
          <div className="h-9 relative shrink-0 w-[37px]">
            <div className="absolute inset-0 overflow-hidden">
              <img
                alt={`${theme.logo.name} Logo`}
                className="h-full w-full object-contain"
                src={theme.logo.url}
              />
            </div>
          </div>
          <p className="flex-1 font-semibold text-xl text-white">
            {theme.logo.name}
          </p>
        </Link>
      </div>
    </div>
  );
}
