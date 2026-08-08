import { useState, useRef, useEffect } from 'react';
import { Calendar, CalendarPlus, Download, ExternalLink, Check, ChevronDown } from 'lucide-react';
import { EVENT_DETAILS } from '../data/eventData';

interface AddToCalendarProps {
  className?: string;
  variant?: 'primary' | 'outline' | 'compact';
}

export default function AddToCalendar({ className = '', variant = 'primary' }: AddToCalendarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const title = EVENT_DETAILS.title;
  const description = `Gaan Bristy Grand Get-Together 2026 at Gulshan Club, Dhaka.\nDate: ${EVENT_DETAILS.dateBengali}\nTime: ${EVENT_DETAILS.timeBengali}\nVenue: ${EVENT_DETAILS.venueAddress}\nContact: ${EVENT_DETAILS.agencyPhone}`;
  const location = `${EVENT_DETAILS.venueNameBengali}, ${EVENT_DETAILS.venueAddress}`;

  // Start & End in UTC format for Google / iCal
  // Event: September 20, 2026, 19:00 to 23:00 Dhaka time (UTC+6)
  // UTC: 20260920T130000Z to 20260920T170000Z
  const startTimeISO = "20260920T130000Z";
  const endTimeISO = "20260920T170000Z";

  // Google Calendar URL
  const googleUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
    title
  )}&dates=${startTimeISO}/${endTimeISO}&details=${encodeURIComponent(
    description
  )}&location=${encodeURIComponent(location)}`;

  // Outlook Web URL
  const outlookUrl = `https://outlook.live.com/calendar/0/deeplink/compose?path=/calendar/action/compose&rru=addevent&subject=${encodeURIComponent(
    title
  )}&startdt=2026-09-20T19:00:00%2B06:00&enddt=2026-09-20T23:00:00%2B06:00&body=${encodeURIComponent(
    description
  )}&location=${encodeURIComponent(location)}`;

  // Office 365 URL
  const office365Url = `https://outlook.office.com/calendar/0/deeplink/compose?path=/calendar/action/compose&rru=addevent&subject=${encodeURIComponent(
    title
  )}&startdt=2026-09-20T19:00:00%2B06:00&enddt=2026-09-20T23:00:00%2B06:00&body=${encodeURIComponent(
    description
  )}&location=${encodeURIComponent(location)}`;

  // Download .ics file for Apple / Outlook desktop / general iCal
  const handleDownloadIcs = () => {
    const icsContent = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//Gaan Bristy//Get-Together 2026//BN",
      "CALSCALE:GREGORIAN",
      "METHOD:PUBLISH",
      "BEGIN:VEVENT",
      `SUMMARY:${title}`,
      `DESCRIPTION:${description.replace(/\n/g, '\\n')}`,
      `LOCATION:${location}`,
      `DTSTART:${startTimeISO}`,
      `DTEND:${endTimeISO}`,
      "STATUS:CONFIRMED",
      "SEQUENCE:0",
      "END:VEVENT",
      "END:VCALENDAR"
    ].join("\r\n");

    const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute("download", "Gaan_Bristy_Get_Together_2026.ics");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
    setIsOpen(false);
  };

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const calendarOptions = [
    {
      name: 'Google Calendar',
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M19 4H5C3.89543 4 3 4.89543 3 6V20C3 21.1046 3.89543 22 5 22H19C20.1046 22 21 21.1046 21 20V6C21 4.89543 20.1046 4 19 4Z" fill="#1A73E8"/>
          <path d="M16 2V6M8 2V6M3 10H21" stroke="white" strokeWidth="2" strokeLinecap="round"/>
          <text x="12" y="18" textAnchor="middle" fill="white" fontSize="8" fontWeight="bold" fontFamily="sans-serif">20</text>
        </svg>
      ),
      url: googleUrl,
      isExternal: true,
      color: 'hover:bg-blue-950/60 hover:border-blue-500/40'
    },
    {
      name: 'Outlook Calendar',
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M2 6C2 4.89543 2.89543 4 4 4H20C21.1046 4 22 4.89543 22 6V18C22 19.1046 21.1046 20 20 20H4C2.89543 20 2 19.1046 2 18V6Z" fill="#0078D4"/>
          <path d="M12 12L21 6H3L12 12Z" fill="#28A8EA"/>
        </svg>
      ),
      url: outlookUrl,
      isExternal: true,
      color: 'hover:bg-cyan-950/60 hover:border-cyan-500/40'
    },
    {
      name: 'Office 365',
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M21 4H3C2.44772 4 2 4.44772 2 5V19C2 19.5523 2.44772 20 3 20H21C21.5523 20 22 19.5523 22 19V5C22 4.44772 21.5523 4 21 4Z" fill="#D83B01"/>
          <path d="M12 7V17M8 12H16" stroke="white" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      ),
      url: office365Url,
      isExternal: true,
      color: 'hover:bg-orange-950/60 hover:border-orange-500/40'
    },
    {
      name: 'Apple / iCal (ICS File)',
      icon: <Download className="w-5 h-5 text-amber-400" />,
      onClick: handleDownloadIcs,
      isExternal: false,
      color: 'hover:bg-amber-950/60 hover:border-amber-500/40'
    }
  ];

  const getButtonStyles = () => {
    if (variant === 'compact') {
      return "px-3 py-2 bg-slate-900 border border-amber-500/30 hover:border-amber-400 hover:bg-slate-800 text-amber-300 text-xs font-bold rounded-xl transition flex items-center gap-1.5 shadow-md";
    }
    if (variant === 'outline') {
      return "w-full py-3 px-4 bg-slate-900 hover:bg-slate-800 border-2 border-amber-500/40 hover:border-amber-400 text-amber-300 font-bold rounded-2xl transition text-sm flex items-center justify-center gap-2 shadow-lg";
    }
    return "w-full sm:w-auto px-6 py-3.5 bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-black rounded-2xl transition shadow-xl text-sm flex items-center justify-center gap-2.5 transform hover:-translate-y-0.5";
  };

  return (
    <div className={`relative inline-block ${className}`} ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={getButtonStyles()}
        type="button"
        aria-expanded={isOpen}
      >
        <CalendarPlus className="w-5 h-5 shrink-0" />
        <span>ক্যালেন্ডারে যুক্ত করুন (Add to Calendar)</span>
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute left-0 sm:right-0 sm:left-auto mt-2 w-72 bg-slate-950 border-2 border-amber-500/40 rounded-2xl p-2 shadow-2xl z-50 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="px-3 py-2 border-b border-slate-800">
            <p className="text-xs font-bold text-amber-300 font-serif flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-amber-400" />
              <span>ইভেন্টের তারিখ সেভ করুন</span>
            </p>
            <p className="text-[10px] text-slate-400 mt-0.5">
              ২০ সেপ্টেম্বর ২০২৬, সন্ধ্যা ৭:০০ টা
            </p>
          </div>

          <div className="py-1 space-y-1">
            {calendarOptions.map((opt, idx) => {
              if (opt.isExternal) {
                return (
                  <a
                    key={idx}
                    href={opt.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center justify-between px-3 py-2.5 rounded-xl border border-transparent ${opt.color} text-slate-200 transition text-xs font-semibold group`}
                  >
                    <div className="flex items-center gap-2.5">
                      {opt.icon}
                      <span>{opt.name}</span>
                    </div>
                    <ExternalLink className="w-3.5 h-3.5 text-slate-500 group-hover:text-white transition" />
                  </a>
                );
              }

              return (
                <button
                  key={idx}
                  onClick={opt.onClick}
                  type="button"
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl border border-transparent ${opt.color} text-slate-200 transition text-xs font-semibold group`}
                >
                  <div className="flex items-center gap-2.5">
                    {opt.icon}
                    <span>{opt.name}</span>
                  </div>
                  <Download className="w-3.5 h-3.5 text-slate-500 group-hover:text-amber-400 transition" />
                </button>
              );
            })}
          </div>

          {copied && (
            <div className="mt-1 p-2 bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-[11px] font-bold rounded-xl text-center flex items-center justify-center gap-1.5">
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span>.ICS ফাইলটি ডাউনলোড হয়েছে!</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
