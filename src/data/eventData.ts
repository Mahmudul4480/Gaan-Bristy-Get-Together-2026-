import { TeamMember, ScheduleItem, GalleryPhoto } from '../types';

export const LOGO_URL = "https://i.postimg.cc/XvqDcBGk/de84b0f9-3f92-4302-80c0-f102a03319a7.jpg";

export const EVENT_DETAILS = {
  title: "Gaan Bristy Grand Get-Together 2026",
  subtitle: "Melody at Gulshan Club",
  tagline: "গান গাও প্রাণ খুলে",
  dateBengali: "২০ সেপ্টেম্বর, ২০২৬",
  timeBengali: "সন্ধ্যা ৭:০০ টা",
  dateISO: "2026-09-20T19:00:00",
  registrationDeadlineISO: "2026-09-15T23:59:59",
  registrationDeadlineBengali: "১৫ সেপ্টেম্বর, ২০২৬",
  venueNameBengali: "গুলশান ক্লাব, ঢাকা",
  venueAddress: "Block NW(J), Plot 2, Road 53, Gulshan-1, Dhaka-1212",
  totalSeats: 150,
  reservedSeatsCount: 122,
  feeAdult: 2000,
  feeKid: 1000,
  currency: "টাকা",
  urgencyText: "মাত্র ১৫০ জন অতিথির জন্য আসন সংরক্ষিত",
  agencyName: "Social Media Careing",
  agencyUrl: "https://www.socialmediacareing.com",
  agencyPhone: "01761870650",
  bkashNumber: "01761870650",
  nagadNumber: "01761870650",
  rocketNumber: "01761870650",
};

export const SCHEDULE_DATA: ScheduleItem[] = [
  {
    time: "০৭:০০ PM – ০৭:৩০ PM",
    title: "Red Carpet Welcome",
    titleBengali: "লাল গালিচায় অভ্যর্থনা ও নেটওয়ার্কিং",
    description: "অতিথিদের শুভ আগমন, ওয়েলকাম ড্রিংকস গ্রহণ এবং স্টারমেকার ফ্যামিলি মেম্বারদের সাথে কুশল বিনিময়।",
    iconName: "Sparkles"
  },
  {
    time: "০৭:৩০ PM – ০৮:০০ PM",
    title: "Opening Ceremony & Welcome Speech",
    titleBengali: "উদ্বোধনী সুর ও শুভেচ্ছা বক্তব্য",
    description: "ফ্যামিলি ক্যাপ্টেন ও বিশিষ্ট গুণী অতিথিদের স্বাগত বক্তব্য এবং জাকজমকপূর্ণ কেক কাটার উৎসব।",
    iconName: "Mic"
  },
  {
    time: "০৮:০০ PM – ০৯:১৫ PM",
    title: "StarMaker Unplugged Session",
    titleBengali: "লাইভ আনপ্লাগড মেলোডি",
    description: "স্টারমেকারের সেরা কণ্ঠশিল্পীদের মোহময় লাইভ পারফরম্যান্স এবং অ্যাকোস্টিক মিউজিক এনভায়রনমেন্ট।",
    iconName: "Music"
  },
  {
    time: "০৯:১৫ PM – ১০:১৫ PM",
    title: "Royal Buffet Dinner",
    titleBengali: "রয়্যাল বুফে ডিনার",
    description: "গুলশান ক্লাবের ঐতিহ্যবাহী ও সুস্বাদু খাবারের সাথে ব্যাকগ্রাউন্ডে মনমুগ্ধকর আবহ সঙ্গীত।",
    iconName: "Utensils"
  },
  {
    time: "১০:১৫ PM – ১০:৪৫ PM",
    title: "Awards & Recognition",
    titleBengali: "গুণীজন সম্মাননা ও উপহার বিতরণ",
    description: "স্টারমেকার ফ্যামিলির সক্রিয় সদস্য ও বিশিষ্ট অতিথিদের বিশেষ ক্রেস্ট ও সম্মাননা প্রদান।",
    iconName: "Award"
  },
  {
    time: "১০:৪৫ PM – ১১:০০ PM",
    title: "Photo Session & Closing",
    titleBengali: "ফটো সেশন ও বিদায়ী সুর",
    description: "স্মরণীয় মুহূর্তগুলো গ্র্যান্ড ফ্রেমে বন্দী করা এবং আগামী দিনের প্রত্যাশায় ধন্যবাদ জ্ঞাপন।",
    iconName: "Camera"
  }
];

export const TEAM_MEMBERS: TeamMember[] = [
  // 1 Captain
  {
    id: "capt-1",
    name: "ফ্যামিলি ক্যাপ্টেন (Captain)",
    role: "Captain",
    roleBengali: "ক্যাপ্টেন",
    starMakerId: "@GaanBristy_Captain",
    phone: "01761870650",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=600",
    bio: "গান বৃষ্টি ফ্যামিলির প্রতিষ্ঠাতা ও প্রধান উদ্যোক্তা।"
  },
  // 2-6 Co-Captains (5 members)
  {
    id: "co-1",
    name: "কো-ক্যাপ্টেন ১",
    role: "Co-Captain",
    roleBengali: "কো-ক্যাপ্টেন",
    starMakerId: "@GB_CoCapt1",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=600",
    bio: "ইভেন্ট ম্যানেজমেন্ট ও কালচারাল হেড।"
  },
  {
    id: "co-2",
    name: "কো-ক্যাপ্টেন ২",
    role: "Co-Captain",
    roleBengali: "কো-ক্যাপ্টেন",
    starMakerId: "@GB_CoCapt2",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=600",
    bio: "মিউজিক্যাল ডিরেক্টর ও রিসেপশন হেড।"
  },
  {
    id: "co-3",
    name: "কো-ক্যাপ্টেন ৩",
    role: "Co-Captain",
    roleBengali: "কো-ক্যাপ্টেন",
    starMakerId: "@GB_CoCapt3",
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=600",
    bio: "রেজিস্ট্রেশন ও গেস্ট কেয়ার সমন্বয়কারী।"
  },
  {
    id: "co-4",
    name: "কো-ক্যাপ্টেন ৪ (রেজা)",
    role: "Co-Captain",
    roleBengali: "কো-ক্যাপ্টেন",
    starMakerId: "@Reza_Unplugged",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=600",
    bio: "আনপ্লাগড মিউজিক সেশন পারফর্মার ও কো-অর্ডিনেটর।"
  },
  {
    id: "co-5",
    name: "কো-ক্যাপ্টেন ৫",
    role: "Co-Captain",
    roleBengali: "কো-ক্যাপ্টেন",
    starMakerId: "@GB_CoCapt5",
    image: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&q=80&w=600",
    bio: "ওয়েলফায়ার ও লজিস্টিকস ইনচার্জ।"
  },
  // 7-14 Sub-Admins (8 members)
  {
    id: "sub-1",
    name: "সাব এডমিন ১",
    role: "Sub-Admin",
    roleBengali: "সাব এডমিন",
    starMakerId: "@GB_SubAdmin1",
    image: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=600",
    bio: "সোশ্যাল মিডিয়া ও ডিজিটাল প্রমোশন।"
  },
  {
    id: "sub-2",
    name: "সাব এডমিন ২",
    role: "Sub-Admin",
    roleBengali: "সাব এডমিন",
    starMakerId: "@GB_SubAdmin2",
    image: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&q=80&w=600",
    bio: "টিকেট ভেরিফিকেশন ও এন্ট্রি পাস ম্যানেজমেন্ট।"
  },
  {
    id: "sub-3",
    name: "সাব এডমিন ৩",
    role: "Sub-Admin",
    roleBengali: "সাব এডমিন",
    starMakerId: "@GB_SubAdmin3",
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=600",
    bio: "ভেন্যু সজ্জা ও স্টেজ ডেকোরেশন।"
  },
  {
    id: "sub-4",
    name: "সাব এডমিন ৪",
    role: "Sub-Admin",
    roleBengali: "সাব এডমিন",
    starMakerId: "@GB_SubAdmin4",
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=600",
    bio: "হসপিটালিটি ও ফুড কর্নার দায়িত্বপ্রাপ্ত।"
  },
  {
    id: "sub-5",
    name: "সাব এডমিন ৫",
    role: "Sub-Admin",
    roleBengali: "সাব এডমিন",
    starMakerId: "@GB_SubAdmin5",
    image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=600",
    bio: "সাউন্ড ও অ্যাকোস্টিক সিস্টেম টেক্স।"
  },
  {
    id: "sub-6",
    name: "সাব এডমিন ৬",
    role: "Sub-Admin",
    roleBengali: "সাব এডমিন",
    starMakerId: "@GB_SubAdmin6",
    image: "https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?auto=format&fit=crop&q=80&w=600",
    bio: "ফটোগ্রাফি ও ভিডিও মেমোরিজ।"
  },
  {
    id: "sub-7",
    name: "সাব এডমিন ৭",
    role: "Sub-Admin",
    roleBengali: "সাব এডমিন",
    starMakerId: "@GB_SubAdmin7",
    image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=600",
    bio: "গিফট উইং ও অ্যাওয়ার্ডস কো-অর্ডিনেটর।"
  },
  {
    id: "sub-8",
    name: "সাব এডমিন ৮",
    role: "Sub-Admin",
    roleBengali: "সাব এডমিন",
    starMakerId: "@GB_SubAdmin8",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=600",
    bio: "সিকিউরিটি ও প্রোটোকল ম্যানেজার।"
  }
];

export const GALLERY_PHOTOS: GalleryPhoto[] = [
  {
    id: "gal-1",
    title: "Gaan Bristy Polo T-shirt Special Gathering",
    url: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&q=80&w=800",
    category: "Previous Events"
  },
  {
    id: "gal-2",
    title: "Gulshan Garden High-Tea Meeting",
    url: "https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&q=80&w=800",
    category: "Family Meeting"
  },
  {
    id: "gal-3",
    title: "StarMaker Singers Acoustic Rehearsal",
    url: "https://images.unsplash.com/photo-1465847899084-d164df4dedc6?auto=format&fit=crop&q=80&w=800",
    category: "Performance"
  },
  {
    id: "gal-4",
    title: "Grand Cake Cutting Ceremony",
    url: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&q=80&w=800",
    category: "Previous Events"
  },
  {
    id: "gal-5",
    title: "Family Dinner & Musical Evening",
    url: "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&q=80&w=800",
    category: "Previous Events"
  },
  {
    id: "gal-6",
    title: "Red Carpet Smiles & Memories",
    url: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&q=80&w=800",
    category: "Family Meeting"
  }
];
