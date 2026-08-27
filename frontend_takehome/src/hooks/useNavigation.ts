import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';

export interface Navigation {
  activeTab: string;
  switchTo: (tabId: string) => void;
}

// Tabs are static routes (e.g. /settings, /breakdown) rather than a dynamic
// /:tabId segment, so the active tab is derived from the pathname itself
// rather than a route param -- see Layout.
export function useNavigation(): Navigation {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const activeTab = location.pathname.slice(1);

  function switchTo(tabId: string) {
    navigate({ pathname: `/${tabId}`, search: searchParams.toString() });
  }

  return { activeTab, switchTo };
}
