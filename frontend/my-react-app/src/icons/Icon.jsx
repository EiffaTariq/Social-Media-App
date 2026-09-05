// All icons in one object so you can call <Icon.Home />, <Icon.Heart />, etc.
import logout from "../assets/images/logout.png";
const Icon = {
  Home: (p) => (<svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M3 11.5 12 4l9 7.5"/><path d="M5.5 10v9a1 1 0 0 0 1 1H10v-6h4v6h3.5a1 1 0 0 0 1-1v-9"/></svg>),
  Compass: (p) => (<svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="9"/><path d="m14.8 9.2-1.8 5.4-5.4 1.8 1.8-5.4z"/></svg>),
  Chat: (p) => (<svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M21 11.5a8.5 8.5 0 0 1-12.4 7.6L3 20l1-5.2A8.5 8.5 0 1 1 21 11.5Z"/></svg>),
  Heart: (p) => (<svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M12 20.2s-7.4-4.6-9.7-9A5.4 5.4 0 0 1 12 6.4 5.4 5.4 0 0 1 21.7 11.2c-2.3 4.4-9.7 9-9.7 9Z"/></svg>),
  User: (p) => (<svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="8.5" r="3.5"/><path d="M4.5 20c1.4-3.8 4.4-5.6 7.5-5.6s6.1 1.8 7.5 5.6"/></svg>),
  Search: (p) => (<svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.2-3.2"/></svg>),
  Bell: (p) => (<svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M6 10a6 6 0 0 1 12 0c0 4 1.4 5.2 1.4 5.2H4.6S6 14 6 10Z"/><path d="M10 18.5a2 2 0 0 0 4 0"/></svg>),
  X: (p) => (<svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 6l12 12M18 6 6 18"/></svg>),
  Star: (p) => (<svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="m12 3 2.7 6 6.3.6-4.8 4.2 1.4 6.2L12 16.9 6.4 20l1.4-6.2L3 9.6l6.3-.6z"/></svg>),
  Plus: (p) => (<svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14M5 12h14"/></svg>),
  Bookmark: (p) => (<svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M6 4h12v16l-6-4-6 4Z"/></svg>),
  Send: (p) => (<svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="m3 11 18-8-8 18-2.5-7.5L3 11Z"/></svg>),
  Mail: (p) => (<svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m4 6.5 8 6 8-6"/></svg>),
  Lock: (p) => (<svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="5" y="10.5" width="14" height="9" rx="2"/><path d="M8 10.5V7.5a4 4 0 0 1 8 0v3"/></svg>),
  Dots: (p) => (<svg {...p} viewBox="0 0 24 24" fill="currentColor" stroke="none"><circle cx="5" cy="12" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="19" cy="12" r="2"/></svg>),
  Clock: (p) => (<svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.5 2"/></svg>),
  logout,
  BarChart: (p) => (<svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M4 20V10M12 20V4M20 20v-7"/></svg>),
};

export default Icon;
