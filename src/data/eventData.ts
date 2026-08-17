import { TeamMember, ScheduleItem, GalleryPhoto } from '../types';

export const LOGO_URL = "/assets/gaan-bristy-icon.png";
export const FALLING_UMBRELLA_URL = "/assets/umbrella-falling.png";
export const FALLING_GB_URL = "/assets/gb-badge-falling.png";
export const AGENCY_LOGO_URL = "https://i.postimg.cc/j2DKJTbM/Financial-Solution-In-BD-Logo-png-202608061833.jpg";

export const EVENT_DETAILS = {
  title: "Get Together 2026",
  subtitle: "গান গাও প্রাণ খুলে",
  fullTitle: "Gaan Bristy Get Together 2026",
  tagline: "গান গাও প্রাণ খুলে",
  taglineEnglish: "Sing a Song, Open the Soul",
  dateBengali: "১৯ সেপ্টেম্বর, ২০২৬",
  timeBengali: "সন্ধ্যা ৬.০০ টা",
  dateISO: "2026-09-19T18:00:00",
  registrationDeadlineISO: "2026-09-15T23:59:59",
  registrationDeadlineBengali: "১৫ সেপ্টেম্বর, ২০২৬",
  venueNameBengali: "গুলশান ক্লাব, ঢাকা",
  venueNameEnglish: "Gulshan Club, Dhaka",
  venueAddress: "Block NW(J), Plot 2, Road 53, Gulshan-1, Dhaka-1212",
  totalSeats: 150,
  reservedSeatsCount: 122,
  feeAdult: 2000,
  feeKid: 0,
  feeTextBengali: "রেজিস্ট্রেশন ফি — ২,০০০/- টাকা (জনপ্রতি)",
  feeTextEnglish: "Registration Fee — BDT 2,000/- (Two Thousand Taka Only)",
  currency: "টাকা",
  urgencyText: "ONLY 150 SEATS RESERVED",
  urgencyTextBengali: "মাত্র ১৫০ জন অতিথির জন্য আসন সংরক্ষিত",
  organizerName: "Gaan Bristy Family",
  organizerNameBengali: "গান বৃষ্টি ফ্যামিলি",
  designerName: "Social Media Care",
  agencyName: "Social Media Care",
  agencyUrl: "https://www.socialmediacareing.com",
  agencyPhone: "01761870650",
  bkashNumber: "01761870650",
  nagadNumber: "01761870650",
  rocketNumber: "01761870650",
  dressCodeTitle: "Dress Code",
  dressCodeMale: "Formal (Shirt, Pant, Shoe)",
  dressCodeFemale: "Casual",
};

export const SCHEDULE_DATA: ScheduleItem[] = [
  {
    time: "০৬:০০ PM – ০৬:৩০ PM",
    title: "Red Carpet Welcome",
    titleBengali: "লাল গালিচায় অভ্যর্থনা ও নেটওয়ার্কিং",
    description: "অতিথিদের শুভ আগমন, ওয়েলকাম ড্রিংকস গ্রহণ এবং স্টারমেকার ফ্যামিলি মেম্বারদের সাথে কুশল বিনিময়।",
    iconName: "Sparkles"
  },
  {
    time: "০৬:৩০ PM – ০৭:০০ PM",
    title: "Opening Ceremony & Welcome Speech",
    titleBengali: "উদ্বোধনী সুর ও শুভেচ্ছা বক্তব্য",
    description: "ফ্যামিলি ক্যাপ্টেন ও বিশিষ্ট গুণী অতিথিদের স্বাগত বক্তব্য এবং জাকজমকপূর্ণ কেক কাটার উৎসব।",
    iconName: "Mic"
  },
  {
    time: "০৭:০০ PM – ০৮:১৫ PM",
    title: "StarMaker Unplugged Session",
    titleBengali: "লাইভ আনপ্লাগড মেলোডি",
    description: "স্টারমেকারের সেরা কণ্ঠশিল্পীদের মোহময় লাইভ পারফরম্যান্স এবং অ্যাকোস্টিক মিউজিক এনভায়রনমেন্ট।",
    iconName: "Music"
  },
  {
    time: "০৮:১৫ PM – ০৯:১৫ PM",
    title: "Royal Buffet Dinner",
    titleBengali: "রয়্যাল বুফে ডিনার",
    description: "গুলশান ক্লাবের ঐতিহ্যবাহী ও সুস্বাদু খাবারের সাথে ব্যাকগ্রাউন্ডে মনমুগ্ধকর আবহ সঙ্গীত।",
    iconName: "Utensils"
  },
  {
    time: "০৯:১৫ PM – ০৯:৪৫ PM",
    title: "Awards & Recognition",
    titleBengali: "গুণীজন সম্মাননা ও উপহার বিতরণ",
    description: "স্টারমেকার ফ্যামিলির সক্রিয় সদস্য ও বিশিষ্ট অতিথিদের বিশেষ ক্রেস্ট ও সম্মাননা প্রদান।",
    iconName: "Award"
  },
  {
    time: "০৯:৪৫ PM – ১০:০০ PM",
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
    name: "Mahmudul Hossain",
    role: "Captain",
    roleBengali: "ক্যাপ্টেন",
    starMakerId: "13374391997",
    phone: "01761870650",
    image: "https://i.postimg.cc/jqNyrcR8/Captain-OF-GB.jpg",
    imageClass: "scale-[1.3] object-top",
    bio: ""
  },
  // Co-Captains (6 members)
  {
    id: "co-1",
    name: "Dr. Tasin Chowdhury",
    role: "Co-Captain",
    roleBengali: "কো-ক্যাপ্টেন",
    starMakerId: "13316847052",
    image: "https://i.postimg.cc/4y23cnt9/Brand-person-using-logo-2K-202608061732.jpg",
    imageClass: "scale-[1.55] object-top",
    bio: "কো-ক্যাপ্টেন ১ — গান বৃষ্টি ইভেন্ট ম্যানেজমেন্ট টিম।"
  },
  {
    id: "co-2",
    name: "Manabendra",
    role: "Co-Captain",
    roleBengali: "কো-ক্যাপ্টেন",
    starMakerId: "62008412358",
    image: "https://i.postimg.cc/jjyC1x0C/Adding-logo-to-image-2K-202608061733.jpg",
    imageClass: "scale-[1.55] object-top",
    bio: "কো-ক্যাপ্টেন ২ — কালচারাল ও মিউজিক্যাল অ্যাক্টিভিটি।"
  },
  {
    id: "co-3",
    name: "Shahidul Islam",
    role: "Co-Captain",
    roleBengali: "কো-ক্যাপ্টেন",
    starMakerId: "13386969727",
    image: "https://i.postimg.cc/pXf3drWt/Enhancing-and-combining-photos-f-202608081312.jpg",
    imageClass: "object-cover object-center",
    bio: "কো-ক্যাপ্টেন ৩ — মেম্বারশিপ ও নেটওয়ার্কিং।"
  },
  {
    id: "co-4",
    name: "Shoma Rahman",
    role: "Co-Captain",
    roleBengali: "কো-ক্যাপ্টেন",
    starMakerId: "62014887474",
    image: "https://i.postimg.cc/sxhYHFcs/Adding-logo-to-image-2K-202608061717.jpg",
    imageClass: "scale-[1.3] object-top",
    bio: "কো-ক্যাপ্টেন ৪ — হসপিটালিটি ও গ্যাদারিং।"
  },
  {
    id: "co-5",
    name: "Dolly Iqbal",
    role: "Co-Captain",
    roleBengali: "কো-ক্যাপ্টেন",
    starMakerId: "62011290458",
    image: "https://i.postimg.cc/VLq2NvYh/Enhancing-and-combining-photos-f-202608081311.jpg",
    imageClass: "object-cover object-center",
    bio: "কো-ক্যাপ্টেন ৫ — ওয়েলকাম ও স্টেজ কো-অর্ডিনেশন।"
  },
  {
    id: "co-6",
    name: "Munira Sheemu",
    role: "Co-Captain",
    roleBengali: "কো-ক্যাপ্টেন",
    starMakerId: "62031392121",
    image: "https://i.postimg.cc/N0RLnsqj/Blend-image-with-logo-2K-202608061733.jpg",
    imageClass: "scale-[1.55] object-top",
    bio: "কো-ক্যাপ্টেন ৬ — ইভেন্ট কো-অর্ডিনেশন উইং।"
  },
  // Admins (10 members)
  {
    id: "admin-1",
    name: "Eng Harun",
    role: "Admin",
    roleBengali: "এডমিন ০১",
    starMakerId: "13367267542",
    image: "https://i.postimg.cc/j50mNQn7/Brand-person-using-logo-2K-202608071020.jpg",
    imageClass: "scale-[1.5] object-top",
    bio: "এডমিন — আইটি ও ডিজিটাল স্ট্র্যাটেজি।"
  },
  {
    id: "admin-2",
    name: "Zahid",
    role: "Admin",
    roleBengali: "এডমিন ০২",
    starMakerId: "62002961019",
    image: "https://i.postimg.cc/Hsd2MvSv/Adding-brand-logo-to-image-202608071041.jpg",
    imageClass: "scale-[1.5] object-top",
    bio: "এডমিন — ইভেন্ট ভেরিফিকেশন ও এন্ট্রি সাপোর্ট।"
  },
  {
    id: "admin-3",
    name: "Zarin Moon",
    role: "Admin",
    roleBengali: "এডমিন ০৩",
    starMakerId: "13312878819",
    image: "https://i.postimg.cc/28ctTfBR/Brand-person-using-logo-2K-202608061801-(1).jpg",
    imageClass: "scale-[1.5] object-top",
    bio: "এডমিন — সোশ্যাল মিডিয়া ও পিআর কো-অর্ডিনেটর।"
  },
  {
    id: "admin-4",
    name: "Sazid",
    role: "Admin",
    roleBengali: "এডমিন ০৪",
    starMakerId: "13373962946",
    image: "https://i.postimg.cc/DyjN5Kbw/Brand-person-using-logo-2K-202608061801.jpg",
    imageClass: "scale-[1.5] object-top",
    bio: "এডমিন — লজিস্টিকস ও টেকনিক্যাল ম্যানেজমেন্ট।"
  },
  {
    id: "admin-5",
    name: "Juhan",
    role: "Admin",
    roleBengali: "এডমিন ০৫",
    starMakerId: "62065764957",
    image: "https://i.postimg.cc/yYm2Nx1C/Combining-photos-for-branding-image-202608081254.jpg",
    imageClass: "object-cover object-center",
    bio: "এডমিন — গেস্ট রিলেশনশিপ ও হেল্পডেস্ক।"
  },
  {
    id: "admin-6",
    name: "Dr. Kaniz",
    role: "Admin",
    roleBengali: "এডমিন ০৬",
    starMakerId: "13304381270",
    image: "https://i.postimg.cc/RCcdNxTk/Adding-logo-to-brand-image-202608071041-(2).jpg",
    imageClass: "scale-[1.5] object-top",
    bio: "এডমিন — মেডিকেল সাপোর্ট ও ওয়েলফেয়ার।"
  },
  {
    id: "admin-7",
    name: "Rifat",
    role: "Admin",
    roleBengali: "এডমিন ০৭",
    starMakerId: "13374766242",
    image: "https://i.postimg.cc/MZy5vJD2/Adding-logo-to-brand-image-202608071041.jpg",
    imageClass: "scale-[1.5] object-top",
    bio: "এডমিন — সাউন্ড ও কালচারাল লজিস্টিকস।"
  },
  {
    id: "admin-8",
    name: "Nafees",
    role: "Admin",
    roleBengali: "এডমিন ০৮",
    starMakerId: "13383761434",
    image: "https://i.postimg.cc/VLq2NvfQ/Enhance-and-combine-photos-2K-202608081254.jpg",
    imageClass: "object-cover object-center",
    bio: "এডমিন — সিকিউরিটি ও ভেন্যু প্রোটোকল।"
  },
  {
    id: "admin-9",
    name: "Sumona",
    role: "Admin",
    roleBengali: "এডমিন ০৯",
    starMakerId: "62102366781",
    image: "https://i.postimg.cc/bNC5LjSM/Brand-person-using-logo-2K-202608061801-(3).jpg",
    imageClass: "scale-[1.5] object-top",
    bio: "এডমিন — হসপিটালিটি ও ক্যাটারিং উইং।"
  },
  {
    id: "admin-10",
    name: "Mujahid",
    role: "Admin",
    roleBengali: "এডমিন ১০",
    starMakerId: "62101992190",
    image: "https://i.postimg.cc/gkS74PL7/Brand-person-using-logo-2K-202608061801-(2).jpg",
    imageClass: "scale-[1.5] object-top",
    bio: "এডমিন — ফটোগ্রাফি ও গেট কন্ট্রোল।"
  },
  {
    id: "admin-11",
    name: "Riad",
    role: "Admin",
    roleBengali: "এডমিন ১১",
    starMakerId: "62070958960",
    image: "https://i.postimg.cc/kGYKkC8B/Adding-logo-to-brand-image-202608071104.jpg",
    imageClass: "scale-[1.5] object-top",
    bio: "এডমিন — ব্র্যান্ডিং ও কো-অর্ডিনেশন।"
  },
  // Super Active Members
  {
    id: "super-1",
    name: "Chobi",
    role: "Super Active Member",
    roleBengali: "সুপার অ্যাক্টিভ মেম্বার",
    starMakerId: "62082749219",
    image: "https://i.postimg.cc/vm3PVxj1/Enhancing-and-combining-photos-f-202608082004.jpg",
    imageClass: "object-cover object-center",
    bio: "গান বৃষ্টি ফ্যামিলির সম্মানিত ও পরম সক্রিয় সদস্য।"
  },
  {
    id: "super-2",
    name: "Faiza Naz",
    role: "Super Active Member",
    roleBengali: "সুপার অ্যাক্টিভ মেম্বার",
    starMakerId: "100104176037",
    image: "https://i.postimg.cc/nLHRrGdv/Enhancing-photo-for-branding-image-202608082039.jpg",
    imageClass: "object-cover object-center",
    bio: "গান বৃষ্টি ফ্যামিলির নিবেদিতপ্রাণ ও নিয়মিত সদস্য।"
  },
  {
    id: "super-3",
    name: "Shahnaz",
    role: "Super Active Member",
    roleBengali: "সুপার অ্যাক্টিভ মেম্বার",
    starMakerId: "13385444884",
    image: "https://i.postimg.cc/jjsg248P/Whats-App-Image-2026-08-08-at-20-03-51.jpg",
    imageClass: "object-cover object-center",
    bio: "গান বৃষ্টি ফ্যামিলির পরম অনুরাগী সদস্য।"
  },
  {
    id: "super-4",
    name: "Ashraful Kamal",
    role: "Super Active Member",
    roleBengali: "সুপার অ্যাক্টিভ মেম্বার",
    starMakerId: "13285765432",
    image: "https://i.postimg.cc/NMLF9HSX/Adding-logo-to-brand-image-202608071215-(2).jpg",
    imageClass: "scale-[1.3] object-center",
    bio: "গান বৃষ্টি ফ্যামিলির সক্রিয় সংগীতসঙ্গী।"
  },
  {
    id: "super-5",
    name: "Shayla",
    role: "Super Active Member",
    roleBengali: "সুপার অ্যাক্টিভ মেম্বার",
    starMakerId: "62037165034",
    image: "https://i.postimg.cc/YSbXWLVh/Enhancing-and-combining-branding-2K-202608082001-(1).jpg",
    imageClass: "object-cover object-center",
    bio: "গান বৃষ্টি ফ্যামিলির প্রিয় সুরপাখি ও সদস্য।"
  },
  {
    id: "super-6",
    name: "MD. Shamim",
    role: "Super Active Member",
    roleBengali: "সুপার অ্যাক্টিভ মেম্বার",
    starMakerId: "62018746750",
    image: "https://i.postimg.cc/SsjR2M3n/Adding-logo-to-brand-image-202608071215-(1).jpg",
    imageClass: "scale-[1.3] object-center",
    bio: "গান বৃষ্টি ফ্যামিলির আন্তরিক সদস্য।"
  },
  {
    id: "super-7",
    name: "BulBul Baari",
    role: "Super Active Member",
    roleBengali: "সুপার অ্যাক্টিভ মেম্বার",
    starMakerId: "13373501944",
    image: "https://i.postimg.cc/xCq8Jzhc/Adding-logo-to-brand-image-202608071215-(3).jpg",
    imageClass: "scale-[1.3] object-center",
    bio: "গান বৃষ্টি ফ্যামিলির সুহৃদ ও পরম সক্রিয় সদস্য।"
  },
  {
    id: "super-8",
    name: "Rumana Ruma",
    role: "Super Active Member",
    roleBengali: "সুপার অ্যাক্টিভ মেম্বার",
    starMakerId: "13358709961",
    image: "https://i.postimg.cc/d1D3kypt/Adding-logo-to-brand-image-202608071221.jpg",
    imageClass: "scale-[1.3] object-center",
    bio: "গান বৃষ্টি ফ্যামিলির আনন্দদায়ক সংগী ও সদস্য।"
  },
  {
    id: "super-9",
    name: "Abdul Hannan",
    role: "Super Active Member",
    roleBengali: "সুপার অ্যাক্টিভ মেম্বার",
    starMakerId: "62090671190",
    image: "https://i.postimg.cc/Bv4m2xTg/Adding-logo-to-brand-image-202608071231.jpg",
    imageClass: "scale-[1.3] object-center",
    bio: "গান বৃষ্টি ফ্যামিলির শ্রদ্ধাভাজন ও সক্রিয় সদস্য।"
  },
  {
    id: "super-10",
    name: "Mifta",
    role: "Super Active Member",
    roleBengali: "সুপার অ্যাক্টিভ মেম্বার",
    starMakerId: "62163305709",
    image: "https://i.postimg.cc/FzLKGQ9z/Adding-logo-to-brand-image-202608071215.jpg",
    imageClass: "scale-[1.3] object-center",
    bio: "গান বৃষ্টি ফ্যামিলির সহমর্মী ও পরম প্রিয় সদস্য।"
  },
  {
    id: "super-11",
    name: "Tutul Kumar",
    role: "Super Active Member",
    roleBengali: "সুপার অ্যাক্টিভ মেম্বার",
    starMakerId: "13388767627",
    image: "https://i.postimg.cc/bYKNHjg9/Adding-logo-to-brand-image-202608071542-(1).jpg",
    imageClass: "scale-[1.3] object-center",
    bio: "গান বৃষ্টি ফ্যামিলির নিবেদিতপ্রাণ ও সক্রিয় সদস্য।"
  },
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
