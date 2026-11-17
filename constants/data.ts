import { Dimensions } from 'react-native';
import { FamilyMember, AIRoadmapStep } from '../types';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export const FAMILY_MEMBERS: FamilyMember[] = [
  {
    id: 'baba',
    name: 'بابا',
    avatar: 'baba',
    avatarEmoji: '👨‍🦱',
    birthYear: 1990,
    quote: "I'm just a father.",
    color: '#74B9FF',
    gradient: ['#74B9FF', '#A29BFE', '#55EFC4'],
  },
  {
    id: 'maman',
    name: 'مامان',
    avatar: 'maman',
    avatarEmoji: '👩‍🦰',
    birthYear: 1992,
    quote: 'Soft, radiant, and full of life',
    color: '#FF6B9D',
    gradient: ['#FF6B9D', '#FD9644', '#FFEAA7'],
  },
  {
    id: 'daughter',
    name: 'دختر',
    avatar: 'daughter',
    avatarEmoji: '🌸',
    birthYear: 2019,
    quote: 'Inside you, a world is blooming.',
    color: '#A29BFE',
    gradient: ['#A29BFE', '#FF6B9D', '#74B9FF'],
  },
];

export const LANGUAGE_LEVELS = [
  { id: 'beginner', label: 'مقدماتی', order: 1 },
  { id: 'elementary', label: 'پایه', order: 2 },
  { id: 'pre-intermediate', label: 'پیش‌متوسط', order: 3 },
  { id: 'intermediate', label: 'متوسط', order: 4 },
  { id: 'upper-intermediate', label: 'بالای متوسط', order: 5 },
  { id: 'advanced', label: 'پیشرفته', order: 6 },
  { id: 'ielts-9', label: 'آیلتس ۹', order: 7 },
  { id: 'ielts-10', label: 'آیلتس ۱۰', order: 8 },
];

export const LANGUAGE_METHODS = [
  { id: 'samurai', label: 'گرامر سامورایی', icon: '⚔️', color: '#2D3436', description: 'دقیق، منظم، قدرتمند' },
  { id: 'nyc', label: 'ماجراجویی نیویورکی', icon: '🗽', color: '#FF6B9D', description: 'زینده، پرانرژی، واقعی' },
  { id: 'euro-lab', label: 'آزمایشگاه اروپایی', icon: '🧪', color: '#4ECDC4', description: 'علمی، ساختاری، پیشرفته' },
  { id: 'mom', label: 'یاد بگیر با مامان', icon: '💕', color: '#FF6B9D', description: 'عاشقانه، خانوادگی، لطیف' },
  { id: 'dad', label: 'یاد بگیر با بابا', icon: '🌟', color: '#74B9FF', description: 'روشن، راهبردی، الهام‌بخش' },
];

export const SPRING_COLORS = [
  '#FF6B9D', // Arghavan pink
  '#FFB3C6', // Light pink
  '#A8D8EA', // Mint blue
  '#55EFC4', // Mint green
  '#FFEAA7', // Warm yellow
  '#FD9644', // Soft orange
  '#A29BFE', // Lavender
  '#FFFFFF', // White
];

export const WONDER_CATEGORIES = {
  animal: { label: 'حیوانات شگفت‌انگیز', emoji: '🦋', color: '#FF6B9D' },
  constellation: { label: 'صورت‌های فلکی', emoji: '⭐', color: '#A29BFE' },
  iranian_heritage: { label: 'فرهنگ ایران کهن', emoji: '🏛️', color: '#FD9644' },
  iranian_pride: { label: 'مفاخر ایرانی', emoji: '🏆', color: '#4ECDC4' },
  iranian_astronomy: { label: 'علم فلکی ایرانیان', emoji: '🔭', color: '#74B9FF' },
};

export const NIGHT_WONDERS = [
  // Animals
  { id: 'axolotl', type: 'animal', name: 'Axolotl', nameFa: 'آکسولوتل', description: 'This cute creature never grows up — it stays young forever!', descriptionFa: 'این موجود شگفت‌انگیز هرگز بزرگ نمی‌شود — همیشه جوان می‌ماند!', image: 'axolotl', funFact: 'Axolotls can regenerate their heart, brain, and limbs!', funFactFa: 'آکسولوتل‌ها می‌توانند قلب، مغز و اعضای خود را بازسازی کنند!' },
  { id: 'flamingo', type: 'animal', name: 'Flamingo', nameFa: 'فلامینگو', description: 'Flamingos are pink because of their diet — they eat shrimp and algae!', descriptionFa: 'فلامینگو‌ها به خاطر غذایشان صورتی هستند — میگو و جلبک می‌خورند!', image: 'flamingo', funFact: 'A group of flamingos is called a "flamboyance"!', funFactFa: 'یک گروه فلامینگو "شگفتی" نام دارد!' },
  { id: 'koala', type: 'animal', name: 'Koala', nameFa: 'کوالا', description: 'Koalas sleep up to 20 hours a day and have fingerprints like humans!', descriptionFa: 'کوالاها تا ۲۰ ساعت در روز می‌خوابند و اثرانگشت شبیه انسان دارند!', image: 'koala', funFact: 'Koalas have two thumbs on each hand for better grip!', funFactFa: 'کوالاها در هر دست دو انگشت شست دارند!' },
  { id: 'octopus', type: 'animal', name: 'Octopus', nameFa: 'هشت‌پا', description: 'Octopuses have three hearts and blue blood!', descriptionFa: 'هشت‌پاها سه قلب و خون آبی دارند!', image: 'octopus', funFact: 'They can change color and texture instantly to camouflage!', funFactFa: 'می‌توانند بلافاصله رنگ و بافت خود را تغییر دهند!' },
  { id: 'hummingbird', type: 'animal', name: 'Hummingbird', nameFa: 'مرغ موری', description: 'Hummingbirds can fly backwards and hover like helicopters!', descriptionFa: 'مرغ‌موری‌ها می‌توانند به عقب پرواز کنند و مثل هلیکوپتر در هوا بمانند!', image: 'hummingbird', funFact: 'Their hearts beat up to 1,260 times per minute!', funFactFa: 'قلب آن‌ها تا ۱۲۶۰ بار در دقیقه می‌تپد!' },
  // Constellations
  { id: 'orion', type: 'constellation', name: 'Orion', nameFa: 'شکارچی (اویون)', description: 'A mighty hunter in the sky, easily spotted by three stars in a row — his belt.', descriptionFa: 'یک شکارچی قوی در آسمان، به راحتی با سه ستاره در یک ردیف — کمربندش — دیده می‌شود.', image: 'orion', funFact: 'Betelgeuse (left shoulder) is a red supergiant 1,000x larger than the Sun!', funFactFa: 'بت‌الجوز (شانه چپ) یک ابرسیاه سرخ ۱۰۰۰ برابر خورشید است!' },
  { id: 'cassiopeia', type: 'constellation', name: 'Cassiopeia', nameFa: 'کاسیوپه', description: 'The vain queen sitting on her throne, shaped like a W or M in the northern sky.', descriptionFa: 'ملکه غرورستیز بر تخت خود، به شکل W یا M در آسمان شمال.', image: 'cassiopeia', funFact: 'Cassiopeia circles the North Star and never sets for northern observers!', funFactFa: 'کاسیوپه دور ستاره شمال می‌چرخد و برای شمالیان هرگز غروب نمی‌کند!' },
  { id: 'pleiades', type: 'constellation', name: 'Pleiades', nameFa: 'پلیاد (پرهان)', description: 'The Seven Sisters — a sparkling cluster of young stars, visible to the naked eye.', descriptionFa: 'هفت خواهر — یک خوشه درخشان از ستاره‌های جوان، با چشم قابل دیدن.', image: 'pleiades', funFact: 'In Japan, Subaru car logo represents the Pleiades cluster!', funFactFa: 'در ژاپن، لوگوی سوبارو نشان‌دهنده خوشه پلیاد است!' },
  // Iranian Heritage
  { id: 'nowruz', type: 'iranian_heritage', name: 'Nowruz', nameFa: 'نوروز', description: 'The ancient Persian New Year celebrating spring equinox — 3,000+ years of tradition.', descriptionFa: 'سال نو باستانی ایرانیان که روزانوست بهار را جشن می‌گیرد — ۳۰۰۰+ سال سنت.', image: 'nowruz', funFact: 'Haft-Seen table has 7 items starting with "S" symbolizing rebirth, health, love...', funFactFa: 'ميز هفت‌سین ۷ شیء با «س» است که نماد تولد، سلامتی، عشق...' },
  { id: 'persepolis', type: 'iranian_heritage', name: 'Persepolis', nameFa: 'تخت‌جمشید', description: 'The ceremonial capital of the Achaemenid Empire — wonder of ancient engineering.', descriptionFa: 'پایتخت تشریفی امپراتوری هخامنشی — معجزه مهندسی کهن.', image: 'persepolis', funFact: 'Built without mortar — stones fit together with precision metal clamps!', funFactFa: 'بدون ملات ساخته شده — سنگ‌ها با دقت و تسمه‌های فلزی هم‌چسبیده‌اند!' },
  { id: 'qanat', type: 'iranian_heritage', name: 'Qanat', nameFa: 'قنات', description: 'Ancient underground water management system — UNESCO World Heritage.', descriptionFa: 'سیستم مدیریت آب زیرزمینی کهن — میراث جهانی یونسکو.', image: 'qanat', funFact: 'Some qanats are 3,000 years old and still functioning today!', funFactFa: 'برخی قنات‌ها ۳۰۰۰ ساله‌اند و هنوز کار می‌کنند!' },
  // Iranian Pride
  { id: 'mirzakhani', type: 'iranian_pride', name: 'Maryam Mirzakhani', nameFa: 'مریم میرزاخانی', description: 'First woman to win the Fields Medal — the Nobel Prize of mathematics.', descriptionFa: 'اولین زن برنده مدال فیلدز — نوبل ریاضیات.', image: 'mirzakhani', funFact: 'She loved drawing on large sheets of paper to visualize complex math problems!', funFactFa: 'او عاشق ترسیم روی کاغذهای بزرگ برای دیدن مسائل پیچیده ریاضی بود!' },
  { id: 'avicenna', type: 'iranian_pride', name: 'Avicenna (Ibn Sina)', nameFa: 'ابوعلی سینا', description: 'Father of early modern medicine — his Canon of Medicine used for 600+ years in Europe.', descriptionFa: 'پدر پزشکی نوین کهن — قانون پزشکی او ۶۰۰+ سال در اروپا تدریس می‌شد.', image: 'avicenna', funFact: 'He wrote 450 works, 240 survived — covering medicine, philosophy, astronomy, math!', funFactFa: '۴۵۰ اثر نوشته، ۲۴۰ باقی‌مانده — پزشکی، فلسفه، نجوم، ریاضی!' },
  { id: 'razi', type: 'iranian_pride', name: 'Al-Razi (Rhazes)', nameFa: 'رازی', description: 'Pioneer of pediatrics and ophthalmology — first to distinguish smallpox from measles.', descriptionFa: 'مبادر طب کودکان و چشمی — اولین تفکیک isomorphism از خارش.', image: 'razi', funFact: 'Wrote the first systematic book on children\'s diseases!', funFactFa: 'اولین کتاب سیستماتیک بیماری‌های کودکان را نگارش کرد!' },
  // Iranian Astronomy
  { id: 'khayyam', type: 'iranian_astronomy', name: 'Omar Khayyam', nameFa: 'عمر خیام', description: 'Reformed the Persian calendar — more accurate than Gregorian even today!', descriptionFa: 'تقویم ایرانی را اصلاح کرد — حتی امروز دقیق‌تر از تقویم گريغوری!', image: 'khayyam', funFact: 'His Jalali calendar has 1 sec error in 10,000 years vs Gregorian 26 sec!', funFactFa: 'تقویم جلالی او خطای ۱ ثانیه در ۱۰۰۰۰ سال دارد در برابر ۲۶ ثانیه گريغوری!' },
  { id: 'tusi', type: 'iranian_astronomy', name: 'Nasir al-Din al-Tusi', nameFa: 'خواجه نصیرالدین طوسی', description: 'Built Maragheh Observatory — invented the Tusi Couple for planetary motion.', descriptionFa: 'رصدخانه مراغه ساخت — جفط طوسی برای حرکت سیارات اختراع کرد.', image: 'tusi', funFact: 'His work influenced Copernicus 250 years later!', funFactFa: 'کار او ۲۵۰ سال بعد بر کوپرنیکوس اثر گذاشت!' },
  { id: 'biruni', type: 'iranian_astronomy', name: 'Al-Biruni', nameFa: 'البیرونی', description: 'Calculated Earth radius with 99.6% accuracy — 1,000 years ago!', descriptionFa: 'شعاع زمین را با دقت ۹۹.۶٪ محاسبه کرد — ۱۰۰۰ سال پیش!', image: 'biruni', funFact: 'Invented the astrolabe and wrote 146 books on astronomy/geography!', funFactFa: 'استرلاب اختراع کرد و ۱۴۶ کتاب نجوم/جغرافیا نوشت!' },
];

export const AI_ROADMAP: AIRoadmapStep[] = [
  { id: 'ai-1', title: 'شروع با ChatGPT برای زندگی', description: 'آموزش پرامپت‌نویسی پایه، مدیریت تقویم، برنامه‌ریزی روزانه، خلاصه‌سازی متن', category: 'basics', duration: '۱ هفته', completed: false, locked: false, resources: ['ChatGPT Official Guide', 'Prompt Engineering Basics'] },
  { id: 'ai-2', title: 'هوش مصنوعی برای والدین', description: 'قصه‌گویی برای کودک، کمک به تکالیف، برنامه تغذیه، مدیریت خواب', category: 'basics', duration: '۱ هفته', completed: false, locked: true, resources: ['AI Parenting Tools', 'Story Generation with AI'] },
  { id: 'ai-3', title: 'ابزارهای پیشرفته (Midjourney, Perplexity, Notion AI)', description: 'تولید تصویر، جستجوی عمیق، مدیریت دانش، اتوماسیون یادداشت', category: 'tools', duration: '۲ هفته', completed: false, locked: true, resources: ['Midjourney Guide', 'Perplexity AI', 'Notion AI'] },
  { id: 'ai-4', title: 'Prompt Engineering حرفه‌ای', description: 'Chain-of-thought, Few-shot, Role prompting, Temperature control', category: 'prompting', duration: '۲ هفته', completed: false, locked: true, resources: ['OpenAI Cookbook', 'Prompt Engineering Guide'] },
  { id: 'ai-5', title: 'ساخت اپلیکیشن با AI (No-Code/Low-Code)', description: 'Bolt.new, v0.dev, Cursor, Replit Agent — از ایده تا محصول', category: 'building', duration: '۳ هفته', completed: false, locked: true, resources: ['Bolt.new', 'v0.dev', 'Cursor IDE'] },
  { id: 'ai-6', title: 'AI Agents و اتوماسیون (n8n, Zapier AI, LangChain)', description: 'ساخت Agentهای خودکار، ربات تلگرام، پردازش ایمیل، تحلیل داده', category: 'advanced', duration: '۳ هفته', completed: false, locked: true, resources: ['n8n', 'LangChain', 'AutoGPT'] },
  { id: 'ai-7', title: 'Machine Learning پایه برای توسعه‌دهندگان', description: 'Python, PyTorch, Hugging Face, Fine-tuning, RAG, Vector DB', category: 'advanced', duration: '۴ هفته', completed: false, locked: true, resources: ['Fast.ai', 'Hugging Face Course', 'PyTorch Tutorials'] },
];

export const MIGRATION_COUNTRIES = [
  { country: 'کانادا', reason: 'اقتصاد قوی، مهاجرپذیر، هوش مصنوعی رو به رشد، آب فراوان', requirements: ['IELTS 7+', 'ECA', 'Express Entry Profile', 'Proof of Funds'], timeline: '۶-۱۸ ماه', cost: '۱۵-۳۰ هزار دلار', aiJobMarket: 'بسیار قوی (تورنتو، مونترال، ونکوور)', waterSecurity: 'عالی', qualityOfLife: 9, nostalgiaFactor: 6 },
  { country: 'استرالیا', reason: 'اب و هوای عالی، اقتصاد پایدار، تقاضای بالا برای متخصصان IT', requirements: ['IELTS 7+', 'Skill Assessment', 'EOI', 'State Nomination (اختیاری)'], timeline: '۸-۲۰ ماه', cost: '۲۰-۴۰ هزار دلار', aiJobMarket: 'قوی (سیدنی، ملبرن، بریسبن)', waterSecurity: 'خوب (با چالش در برخی مناطق)', qualityOfLife: 9, nostalgiaFactor: 5 },
  { country: 'نروژ', reason: 'ثروت نفتی، رفاه بالا، تعادل کار/زندگی، سرمایه‌گذاری در AI', requirements: ['IELTS 6.5+', 'Job Offer', 'University Degree'], timeline: '۳-۱۲ ماه', cost: '۱۰-۲۰ هزار دلار', aiJobMarket: 'رو به رشد (اسلو، برگن)', waterSecurity: 'عالی', qualityOfLife: 10, nostalgiaFactor: 4 },
  { country: 'سوئد', reason: 'نوآوری، استارتاپ‌های AI، والدین‌پسند، طبیعت زیبا', requirements: ['IELTS 6.5+', 'Job Seeker Visa', 'Degree Recognition'], timeline: '۴-۱۲ ماه', cost: '۸-۱۵ هزار دلار', aiJobMarket: 'بسیار قوی (استکهلم، یوتبرو)', waterSecurity: 'عالی', qualityOfLife: 9, nostalgiaFactor: 5 },
  { country: 'آلمان', reason: 'اقتصاد بزرگ اروپا، آموزش رایگان، بوم مهاجر، EU Blue Card', requirements: ['IELTS 6.5+ / TestDaF', 'Degree Recognition (ZAB)', 'Blocked Account'], timeline: '۶-۱۸ ماه', cost: '۱۰-۲۰ هزار دلار', aiJobMarket: 'بسیار قوی (برلین، مونیخ، همبورگ)', waterSecurity: 'خوب', qualityOfLife: 8, nostalgiaFactor: 6 },
  { country: 'هلند', reason: 'مرکز تکنولوژی اروپا، انگلیسی پرکاربرد،.Startup visa', requirements: ['IELTS 6.5+', 'Facilitated Startup Visa', 'Capital'], timeline: '۳-۹ ماه', cost: '۱۵-۲۵ هزار دلار', aiJobMarket: 'عالی (آمستردام، ایندهوون)', waterSecurity: 'خوب (مدیریت آب پیشرفته)', qualityOfLife: 9, nostalgiaFactor: 5 },
];

export const MOTIVATIONAL_QUOTES = [
  "هر روز فرصت جدیدی است برای شکوفا شدن",
  "شما قوی‌تر از آن‌چه فکر می‌کنید هستید",
  "کوچک‌ترین قدم، بزرگترین سفرها را آغاز می‌کند",
  "خورشید برای همه می‌درخشد، فقط باید پنجره را باز کنید",
  "شکوفه ارغوان در بهار صبر نمی‌کند، فقط می‌درخشد",
];

export const getRandomWonder = () => {
  const allWonders = NIGHT_WONDERS;
  return allWonders[Math.floor(Math.random() * allWonders.length)];
};

export const getWeeklyWonder = (weekNumber: number) => {
  const categories = ['animal', 'constellation', 'iranian_heritage', 'iranian_pride', 'iranian_astronomy'] as const;
  const category = categories[weekNumber % categories.length];
  const wonders = NIGHT_WONDERS.filter(w => w.type === category);
  return wonders[weekNumber % wonders.length];
};

export const LANGUAGE_LESSONS = [
  // Beginner - Samurai Grammar
  { id: 'samurai-1', level: 'beginner', method: 'samurai', title: 'الفبا و آواها', description: 'یادگیری ۲۶ حرف الفبای انگلیسی با تلفظ صحیح', xp: 50, completed: false, locked: false, content: { type: 'vocab', items: [] } },
  { id: 'samurai-2', level: 'beginner', method: 'samurai', title: 'افعال быть و have', description: 'قواعد ساده فعل to be و have در جملات مثبت و منفی', xp: 50, completed: false, locked: true, content: { type: 'grammar', items: [] } },
  
  // Beginner - NYC Adventure
  { id: 'nyc-1', level: 'beginner', method: 'nyc', title: 'سلام و احوالپرسی در نیویورک', description: 'مکالمه واقعی در کافه، مترو و پارک نیویورک', xp: 50, completed: false, locked: false, content: { type: 'conversation', items: [] } },
  { id: 'nyc-2', level: 'beginner', method: 'nyc', title: 'سفارش غذا در رستوران', description: 'لغات و جملات ضروری برای سفارش صبحانه و ناهار', xp: 50, completed: false, locked: true, content: { type: 'vocab', items: [] } },
  
  // Beginner - Euro Lab
  { id: 'euro-1', level: 'beginner', method: 'euro-lab', title: 'ساختار جمله ساده', description: 'Subject + Verb + Object در جملات روزمره', xp: 50, completed: false, locked: false, content: { type: 'grammar', items: [] } },
  { id: 'euro-2', level: 'beginner', method: 'euro-lab', title: 'ضمیرها و صفات', description: 'یادگیری ضمیرهای شخصی، ملکی و صفات رایج', xp: 50, completed: false, locked: true, content: { type: 'grammar', items: [] } },
  
  // Beginner - Mom/Dad
  { id: 'mom-1', level: 'beginner', method: 'mom', title: 'کلمات خانواده با مامان', description: 'Mom, Dad, Sister, Brother, Love, Home با قصه مامان', xp: 50, completed: false, locked: false, content: { type: 'vocab', items: [] } },
  { id: 'dad-1', level: 'beginner', method: 'dad', title: 'اعداد و شمارش با بابا', description: '۱ تا ۲۰ با بازی‌های Baba و یونیکورن', xp: 50, completed: false, locked: false, content: { type: 'vocab', items: [] } },
];

// ============ WELLNESS & REHABILITATION DATA ============
export const EMOTION_TYPES = [
  { id: 'happy', label: 'شادی', emoji: '😊', color: '#FFD93D', character: 'Joy (جوی)', source: 'Inside Out' },
  { id: 'sad', label: 'غم', emoji: '😢', color: '#74B9FF', character: 'Sadness (سدنِس)', source: 'Inside Out' },
  { id: 'angry', label: 'خشم', emoji: '😠', color: '#E17055', character: 'Anger (انگر)', source: 'Inside Out' },
  { id: 'fear', label: 'ترس', emoji: '😨', color: '#A29BFE', character: 'Fear (فیر)', source: 'Inside Out' },
  { id: 'disgust', label: 'انزجار', emoji: '🤢', color: '#55EFC4', character: 'Disgust (دیسگاست)', source: 'Inside Out' },
  { id: 'anxious', label: 'اضطراب', emoji: '😰', color: '#FD9644', character: 'Anxiety (اَنگزایتی)', source: 'Inside Out 2' },
  { id: 'envy', label: 'حسادت', emoji: '😒', color: '#00CEC9', character: 'Envy (اِنوی)', source: 'Inside Out 2' },
  { id: 'ennui', label: 'ملال', emoji: '😑', color: '#636E72', character: 'Ennui (اِنویی)', source: 'Inside Out 2' },
  { id: 'embarrassment', label: 'خجالت', emoji: '😳', color: '#FAB1A0', character: 'Embarrassment (اِمبَرِسمِنت)', source: 'Inside Out 2' },
  { id: 'nostalgia', label: 'نوستالژی', emoji: '🥹', color: '#D6A2E8', character: 'Nostalgia (نوستالژیا)', source: 'Inside Out 2' },
  { id: 'calm', label: 'آرامش', emoji: '😌', color: '#81ECEC', character: 'Paula (پائولا)', source: 'Dream Productions' },
  { id: 'excited', label: 'هیجان خلاق', emoji: '🤩', color: '#FF9FF3', character: 'Xeni (زِنی)', source: 'Dream Productions' },
  { id: 'peaceful', label: 'صلح درونی', emoji: '☮️', color: '#A8D8EA', character: 'Jean (ژان)', source: 'Dream Productions' },
  { id: 'proud', label: 'افتخار', emoji: '😎', color: '#FDCB6E', character: 'Joy (جوی)', source: 'Inside Out' },
  { id: 'grateful', label: 'قدردانی', emoji: '🙏', color: '#00B894', character: 'Sadness (سدنِس)', source: 'Inside Out' },
  { id: 'frustrated', label: 'ناامیدی', emoji: '😤', color: '#E17055', character: 'Anger (انگر)', source: 'Inside Out' },
  { id: 'lonely', label: 'تنهایی', emoji: '😔', color: '#636E72', character: 'Sadness (سدنِس)', source: 'Inside Out' },
  { id: 'overwhelmed', label: 'فشار/خستگی', emoji: '😫', color: '#B2BEC3', character: 'Anxiety (اَنگزایتی)', source: 'Inside Out 2' },
];

export const THERAPY_CATEGORIES = [
  { id: 'breathing', label: 'تمرینات تنفس', emoji: '🌬️', color: '#74B9FF', description: 'تنفس عمیق، ۴-۷-۸، تنفس جعبه‌ای' },
  { id: 'mindfulness', label: 'ذهن‌آگاهی', emoji: '🧘', color: '#A29BFE', description: 'مèdیتاشن، اسکن بدنی، توجه به لحظه' },
  { id: 'cognitive', label: 'شناختی', emoji: '🧠', color: '#4ECDC4', description: 'بازی‌های حافظه، تمرکز، حل مسئله' },
  { id: 'motor', label: 'حرکتی', emoji: '🤸', color: '#FD9644', description: 'همگام‌سازی، تعادل، مهارت‌های ریز' },
  { id: 'speech', label: 'گفتاری', emoji: '🗣️', color: '#FF6B9D', description: 'تلفظ، روانی گفتار، زبان اشاره' },
  { id: 'emotional-regulation', label: 'تنظیم احساسات', emoji: '❤️', color: '#FF6B9D', description: 'شناسایی احساسات، استراتژی‌های مقابله' },
  { id: 'social-skill', label: 'مهارت اجتماعی', emoji: '👥', color: '#55EFC4', description: 'ارتباط چشمی، نوبت‌دهی، همدلی' },
  { id: 'sensory-integration', label: 'یکپارچه‌سازی حسی', emoji: '🌈', color: '#A8D8EA', description: 'معالجه لمسی، شنیداری، بصری' },
];

export const THERAPY_EXERCISES = [
  // Breathing
  {
    id: 'breathing-1',
    category: 'breathing',
    title: 'تنفس ۴-۷-۸ با یونیکورن',
    description: 'نفس کشیدن ۴ ثانیه، نگه داشتن ۷ ثانیه، نفس دادن ۸ ثانیه با راهنمای تصویری',
    difficulty: 'easy',
    duration: 5,
    instructions: ['راحت بنشین', 'بینی نفس بکش (۴ ثانیه)', 'نفس را نگه دار (۷ ثانیه)', 'دهان نفس بده (۸ ثانیه)', '۴ بار تکرار کن'],
    imageUris: ['breathing-1-1', 'breathing-1-2', 'breathing-1-3'],
    subtitles: [
      { language: 'fa', text: 'با یونس بوی نفس عمیق بکش', startTime: 0, endTime: 4 },
      { language: 'fa', text: 'نفس را در سینه نگه دار', startTime: 4, endTime: 11 },
      { language: 'fa', text: 'آهسته از دهان نفس بده', startTime: 11, endTime: 19 },
    ],
  },
  {
    id: 'breathing-2',
    category: 'breathing',
    title: 'تنفس جعبه‌ای با اژدها',
    description: 'الگوی ۴-۴-۴-۴ برای تمرکز و آرامش',
    difficulty: 'easy',
    duration: 4,
    instructions: ['نفس بکش (۴ ثانیه)', 'نگه دار (۴ ثانیه)', 'نفس بده (۴ ثانیه)', 'نگه دار (۴ ثانیه)'],
    imageUris: ['breathing-2-1', 'breathing-2-2'],
    subtitles: [
      { language: 'fa', text: 'مثل اژدها نفس بکش', startTime: 0, endTime: 4 },
      { language: 'fa', text: 'قدرت را در سینه نگه دار', startTime: 4, endTime: 8 },
    ],
  },
  // Mindfulness
  {
    id: 'mindfulness-1',
    category: 'mindfulness',
    title: 'اسکن بدنی کودکانه',
    description: 'توجه به هر قسمت از بدن از پاها تا سر با یونس',
    difficulty: 'easy',
    duration: 10,
    instructions: ['دراز بکش', 'توجه را به پاها بیاور', 'به آرامی به بالا حرکت کن', 'هر حسی را بدون قضاوت بپذیر'],
    imageUris: ['mindfulness-1-1', 'mindfulness-1-2'],
    subtitles: [
      { language: 'fa', text: 'بدن تو مثل یک گل آرام است', startTime: 0, endTime: 5 },
      { language: 'fa', text: 'از پاینت تا سرت را حس کن', startTime: 5, endTime: 15 },
    ],
  },
  // Emotional Regulation
  {
    id: 'emotion-1',
    category: 'emotional-regulation',
    title: 'درخت احساسات',
    description: 'احساس خود را به یک برگ درختش بپیچید و رنگش را انتخاب کنید',
    difficulty: 'easy',
    duration: 5,
    instructions: ['احساس امروز را انتخاب کن', 'رنگ برگ را انتخاب کن', 'برگ را روی درختش بگذار', 'به درختش نگاه کن و نفس بکش'],
    imageUris: ['emotion-tree-1', 'emotion-tree-2'],
    subtitles: [
      { language: 'fa', text: 'هر احساسی 괜찮ه، به درختش اضافه کن', startTime: 0, endTime: 5 },
    ],
  },
  {
    id: 'emotion-2',
    category: 'emotional-regulation',
    title: 'بطری آرامش',
    description: 'تنش را در بطری محو کنید و ببینید چگونه آرام می‌شود',
    difficulty: 'easy',
    duration: 3,
    instructions: ['بطری را تکان ده', 'نگاه کن به حباب‌ها', 'تنفس عمیق بکش', 'آرام شدی را حس کن'],
    imageUris: ['calm-jar-1', 'calm-jar-2'],
    subtitles: [
      { language: 'fa', text: 'مثل حباب‌ها، نگرانی‌ها هم می‌روند', startTime: 0, endTime: 5 },
    ],
  },
  // Cognitive
  {
    id: 'cognitive-1',
    category: 'cognitive',
    title: 'بازی حافظه یونس',
    description: 'کارت‌های جفتی با تصاویر یونس و دوستان',
    difficulty: 'easy',
    duration: 5,
    instructions: ['کارت‌ها را باز کن', 'جفت‌ها را پیدا کن', 'با کمترین حرکت برنده شو'],
    imageUris: ['memory-game-1', 'memory-game-2'],
    subtitles: [
      { language: 'fa', text: 'هوش تو قوی است، تمرین کن', startTime: 0, endTime: 3 },
    ],
  },
  // Speech
  {
    id: 'speech-1',
    category: 'speech',
    title: 'تلفظ با ربات دوستانه',
    description: 'حروف الفبا را با ربات تکرار کن و ستاره بگیر',
    difficulty: 'easy',
    duration: 5,
    instructions: ['حرف را بشنو', 'تکرار کن', 'صدای خودت را ضبط کن', 'مقایسه کن'],
    imageUris: ['speech-1-1', 'speech-1-2'],
    subtitles: [
      { language: 'fa', text: 'صدای تو زیباترین آهنگ است', startTime: 0, endTime: 3 },
    ],
  },
  // Motor
  {
    id: 'motor-1',
    category: 'motor',
    title: 'رقص یونس و اژدها',
    description: 'حرکات ساده و شاد برای همگام‌سازی و شادی',
    difficulty: 'easy',
    duration: 5,
    instructions: ['موسیق را بشنو', 'با یونس حرکات را کپی کن', 'خودت هم حرکتی بساز', 'خنده کن و لذت ببر'],
    imageUris: ['dance-1-1', 'dance-1-2'],
    subtitles: [
      { language: 'fa', text: 'بدن تو برای رقص ساخته شده', startTime: 0, endTime: 3 },
    ],
  },
  // Social Skill
  {
    id: 'social-1',
    category: 'social-skill',
    title: 'بازی نوبت‌دهی با خانواده',
    description: 'یادگیری صبر و نوبت‌دهی با کارت‌های رنگی',
    difficulty: 'easy',
    duration: 10,
    instructions: ['کارت نوبت را انتخاب کن', 'منتظر بمان تا نوبتت شود', 'با احترام صحبت کن', 'به بقیه هم گوش بده'],
    imageUris: ['turn-taking-1', 'turn-taking-2'],
    subtitles: [
      { language: 'fa', text: 'صبر کردن نشانه بزرگ‌سالی است', startTime: 0, endTime: 3 },
    ],
  },
  // Social Skill
  {
    id: 'social-1',
    category: 'social-skill',
    title: 'بازی نوبت‌دهی با خانواده',
    description: 'یادگیری صبر و نوبت‌دهی با کارت‌های رنگی',
    difficulty: 'easy',
    duration: 10,
    instructions: ['کارت نوبت را انتخاب کن', 'منتظر بمان تا نوبتت شود', 'با احترام صحبت کن', 'به بقیه هم گوش بده'],
    imageUris: ['turn-taking-1', 'turn-taking-2'],
    subtitles: [
      { language: 'fa', text: 'صبر کردن نشانه بزرگ‌سالی است', startTime: 0, endTime: 3 },
    ],
  },
  // Sensory Integration
  {
    id: 'sensory-1',
    category: 'sensory-integration',
    title: 'جعبه حسی جادویی',
    description: 'کشف بافت‌ها، بوی‌ها، و صداها با یونس',
    difficulty: 'easy',
    duration: 10,
    instructions: ['جعبه را باز کن', 'هر آیتم را با دست لمس کن', 'بوی آن را بشناس', 'حس آن را توصیف کن'],
    imageUris: ['sensory-box-1', 'sensory-box-2'],
    subtitles: [
      { language: 'fa', text: 'دنیا پر از حسی‌های جادویی است', startTime: 0, endTime: 3 },
    ],
  },

  // ============ AUTISM-SPECIFIC EXERCISES ============
  {
    id: 'autism-1',
    category: 'cognitive',
    title: 'رutin بصری روزانه یونس',
    description: 'برنامه‌ریزی روزانه با تصاویر ساده و قابل پیش‌بینی',
    difficulty: 'easy',
    duration: 15,
    instructions: ['کارت‌های روتین را مرتب کن', 'هر فعالیت را انجام بده', 'کارت را به بخش "انجام شده" منتقل کن', 'با یونس جشن بگیر'],
    imageUris: ['routine-1', 'routine-2', 'routine-3'],
    subtitles: [
      { language: 'fa', text: 'روتین تو را می‌شناسم، همیشه با تو هستم', startTime: 0, endTime: 5 },
    ],
  },
  {
    id: 'autism-2',
    category: 'social-skill',
    title: 'کارت‌های احساس ساده',
    description: 'تشخیص احساسات پایه با تصاویر واضح و بدون مزاحمت حسی',
    difficulty: 'easy',
    duration: 10,
    instructions: ['چهره احساس را انتخاب کن', 'با یونس تمرین کن', 'در鏡 خودت هم امتحان کن'],
    imageUris: ['emotion-cards-1', 'emotion-cards-2'],
    subtitles: [
      { language: 'fa', text: 'چهره‌های ساده، احساسات واقعی', startTime: 0, endTime: 3 },
    ],
  },
  {
    id: 'autism-3',
    category: 'sensory-integration',
    title: 'کوته حسی آرامش',
    description: 'فضای امن با نور ملایم، صداهای طبیعت، و بافت‌های راحت',
    difficulty: 'easy',
    duration: 15,
    instructions: ['نور را کم کن', 'صدای باران/جنگل را پخش کن', 'بطانیه سنگین بگذار', 'با یونس در کوته بمان'],
    imageUris: ['sensory-corner-1', 'sensory-corner-2'],
    subtitles: [
      { language: 'fa', text: 'این جا فقط مال توست، امن و آرام', startTime: 0, endTime: 5 },
    ],
  },
  {
    id: 'autism-4',
    category: 'motor',
    title: 'تقلید حرکات یونس',
    description: 'تقلید حرکات ساده برای تقویت نورون‌های آینه',
    difficulty: 'easy',
    duration: 8,
    instructions: ['یونس حرکتی می‌کند', 'تو هم کپی کن', 'ستاره بگیر', 'خنده کن'],
    imageUris: ['mirror-1', 'mirror-2'],
    subtitles: [
      { language: 'fa', text: 'هر حرکت تو، یک پیروزی است', startTime: 0, endTime: 3 },
    ],
  },

  // ============ ADHD-SPECIFIC EXERCISES ============
  {
    id: 'adhd-1',
    category: 'cognitive',
    title: 'تعقیب ستاره‌ها با اژدها',
    description: 'تمرکز بصری با پیروی از ستاره‌های متحرک',
    difficulty: 'easy',
    duration: 5,
    instructions: ['ستاره را با چشم追', 'هنوز نگاه نکن، صبر کن', 'اژدها راهنمایی می‌کند', 'نقطه پایان را لمس کن'],
    imageUris: ['star-tracking-1', 'star-tracking-2'],
    subtitles: [
      { language: 'fa', text: 'چشم‌های تو تلسکوپ قدرتمند هستند', startTime: 0, endTime: 3 },
    ],
  },
  {
    id: 'adhd-2',
    category: 'motor',
    title: 'بازی نوبتی اژدها و یونس',
    description: 'کنترل імپولسیو با نوبت‌دهی و صبر',
    difficulty: 'medium',
    duration: 10,
    instructions: ['نوبت اژدها: پرش کن', 'نوبت یونس: بچرخ', 'نوبت تو: تصمیم بگیر', 'با كلک صبر کن'],
    imageUris: ['turn-game-1', 'turn-game-2'],
    subtitles: [
      { language: 'fa', text: 'صبر کردن، قدرت واقعی 슈پرها است', startTime: 0, endTime: 3 },
    ],
  },
  {
    id: 'adhd-3',
    category: 'emotional-regulation',
    title: 'تایمر دیداری کارها',
    description: 'تقسیم زمان به بلوک‌های کوچک با تایمر رنگی',
    difficulty: 'easy',
    duration: 20,
    instructions: ['کار را انتخاب کن', 'تایمر ۱۰ دقیقه ست کن', 'فقط روی همون کار متمرکز شو', 'استراحت ۵ دقیقه، بعد ادامه بده'],
    imageUris: ['timer-blocks-1', 'timer-blocks-2'],
    subtitles: [
      { language: 'fa', text: 'کوچک کردن کارها، بزرگ کردن موفقیت', startTime: 0, endTime: 3 },
    ],
  },

  // ============ PHYSICAL DISABILITY EXERCISES ============
  {
    id: 'physical-1',
    category: 'motor',
    title: 'تمرینات دست با یونس (صندلی چرخدار)',
    description: 'حرکات دست، شانه، و گردن برای حفظ انعطاف‌پذیری',
    difficulty: 'easy',
    duration: 15,
    instructions: ['دست‌ها را بالا بیاور', 'دایره بکش', 'موشت بند و باز کن', 'شانه‌ها را بچرخان'],
    imageUris: ['wheelchair-arms-1', 'wheelchair-arms-2'],
    subtitles: [
      { language: 'fa', text: 'دست‌های تو قدرت خلق دارند', startTime: 0, endTime: 3 },
    ],
  },
  {
    id: 'physical-2',
    category: 'speech',
    title: 'ارتباط با کنترل چشم/صدا',
    description: 'انتخاب کلمات و جملات با نظاره یا دستور صوتی',
    difficulty: 'easy',
    duration: 10,
    instructions: ['با چشم/صدا کلمه را انتخاب کن', 'جمله بساز', 'یونس می‌خواند', 'با خانواده به اشتراک بگذار'],
    imageUris: ['eye-control-1', 'voice-control-1'],
    subtitles: [
      { language: 'fa', text: 'صدای تو، حتی بی‌صدا، شنیده می‌شود', startTime: 0, endTime: 3 },
    ],
  },
  {
    id: 'physical-3',
    category: 'cognitive',
    title: 'بازی‌های ذهنی با سوئیچ',
    description: 'بازی‌های حافظه، توجه، و حل مسئله با یک سوئیچ',
    difficulty: 'easy',
    duration: 15,
    instructions: ['سوئیچ را فشار ده', 'گزینه را انتخاب کن', 'مرحله را تمام کن', 'مدال بگیر'],
    imageUris: ['switch-game-1', 'switch-game-2'],
    subtitles: [
      { language: 'fa', text: 'یک سوئیچ، هزار امکان', startTime: 0, endTime: 3 },
    ],
  },

  // ============ VISUAL IMPAIRMENT EXERCISES ============
  {
    id: 'visual-1',
    category: 'sensory-integration',
    title: 'نقشه لمسی خانه با یونس',
    description: 'شناسایی اتاق‌ها، مبل‌ها، و مسیرها با دست',
    difficulty: 'easy',
    duration: 20,
    instructions: ['با یونس راه برو', 'دیوارها را لمس کن', 'مکان‌ها را حفظ کن', 'مسیر خودت را بساز'],
    imageUris: ['tactile-map-1', 'tactile-map-2'],
    subtitles: [
      { language: 'fa', text: 'دست‌های تو چشمان جدیدت هستند', startTime: 0, endTime: 3 },
    ],
  },
  {
    id: 'visual-2',
    category: 'motor',
    title: 'راهنمایی صوتی برای حرکت',
    description: 'حرکت در خانه با دستورهای صوتی گام‌به‌گام',
    difficulty: 'easy',
    duration: 10,
    instructions: ['یونس راهنمایی می‌کند', 'گام بردار', 'مانع‌ها را اجتناب کن', 'مقصد با سلامتی رسیدن'],
    imageUris: ['audio-nav-1', 'audio-nav-2'],
    subtitles: [
      { language: 'fa', text: 'هر گام تو، با یونس امن است', startTime: 0, endTime: 3 },
    ],
  },

  // ============ HEARING IMPAIRMENT EXERCISES ============
  {
    id: 'hearing-1',
    category: 'speech',
    title: 'زبان اشاره با اژدها',
    description: 'یادگیری الفبای اشاره، کلمات روزمره، و احساسات',
    difficulty: 'easy',
    duration: 15,
    instructions: ['اژدها اشاره می‌کند', 'تو کپی کن', 'در آینه تمرین کن', 'با خانواده امتحان کن'],
    imageUris: ['sign-language-1', 'sign-language-2'],
    subtitles: [
      { language: 'fa', text: 'دست‌های تو زبان عشق را می‌گویند', startTime: 0, endTime: 3 },
    ],
  },
  {
    id: 'hearing-2',
    category: 'social-skill',
    title: 'بازی‌های بصری و ویبره',
    description: 'ارتباط بدون صدا با رنگ، نور، و ویبره',
    difficulty: 'easy',
    duration: 10,
    instructions: ['رنگ/نور را ببین', 'ویبره را حس کن', 'معنیش را حدس بزن', 'پاسخ بده'],
    imageUris: ['visual-vibe-1', 'visual-vibe-2'],
    subtitles: [
      { language: 'fa', text: 'ارتباط فراتر از صدا است', startTime: 0, endTime: 3 },
    ],
  },

  // ============ ANXIETY/DEPRESSION EXERCISES ============
  {
    id: 'anxiety-1',
    category: 'emotional-regulation',
    title: 'جزر و مد احساسات',
    description: 'پذیرش اینکه احساسات می‌آیند و می‌روند، مثل موج',
    difficulty: 'easy',
    duration: 10,
    instructions: ['موج را ببین', 'نفس بکش با موج', 'موج می‌شکند و می‌رود', 'تو ساحل، امن هستی'],
    imageUris: ['emotion-waves-1', 'emotion-waves-2'],
    subtitles: [
      { language: 'fa', text: 'تو اقیانوس نیستی، تو ساحلی هستی که موج‌ها به آن می‌زنند', startTime: 0, endTime: 5 },
    ],
  },
  {
    id: 'anxiety-2',
    category: 'mindfulness',
    title: 'لنگر ۵ حسی',
    description: 'بازگشت به حال با ۵ دید، ۴ لمس، ۳ شنیدن، ۲ بوییدن، ۱ چشیدن',
    difficulty: 'easy',
    duration: 5,
    instructions: ['۵ چیز ببین', '۴ چیز بلمس', '۳ چیز بشنو', '۲ چیز بویید', '۱ چیز چش'],
    imageUris: ['anchor-54321-1', 'anchor-54321-2'],
    subtitles: [
      { language: 'fa', text: 'این لحظه، تنها چیزی است که واقعیت دارد', startTime: 0, endTime: 3 },
    ],
  },
  {
    id: 'depression-1',
    category: 'emotional-regulation',
    title: 'دفتر چراغ‌های کوچک',
    description: 'ثبت روزانه ۳ چیز کوچک که نور آوردند',
    difficulty: 'easy',
    duration: 5,
    instructions: ['شب قبل از خواب بنشین', '۳ چراغ کوچک بنویس', 'یونس هر کدام را می‌خواند', 'به درخشششان نگاه کن'],
    imageUris: ['tiny-lights-1', 'tiny-lights-2'],
    subtitles: [
      { language: 'fa', text: ' حتی کوچک‌ترین چراغ، تاریکی را می‌شکند', startTime: 0, endTime: 3 },
    ],
  },
  {
    id: 'depression-2',
    category: 'motor',
    title: 'حرکت ملایم با یونس',
    description: 'طیوره کوتاه، کشیدن، یا رقص کوچک برای آزادسازی اندورفین',
    difficulty: 'easy',
    duration: 10,
    instructions: ['پاشنه‌پا را بالا بیاور', 'بازوهای را کش', 'با یونس یک قدم بردار', 'هر حرکت، یک پیروزی است'],
    imageUris: ['gentle-move-1', 'gentle-move-2'],
    subtitles: [
      { language: 'fa', text: 'بدن تو دوست دارد حرکت کند، حتی کمی', startTime: 0, endTime: 3 },
    ],
  },

  // ============ DREAM THERAPY ITEMS ============
  {
    id: 'dream-therapy-1',
    category: 'emotional-regulation',
    title: 'آغوش مادری نوری',
    description: 'تصور آغوشی گرم، نوری، و بی‌شर्त از مادر یا یونس',
    difficulty: 'easy',
    duration: 10,
    instructions: ['چشم‌هات را ببند', 'یونس/مادر را تصور کن', 'آغوشش را حس کن', 'درآرامش بمان'],
    imageUris: ['mother-light-hug-1', 'mother-light-hug-2'],
    subtitles: [
      { language: 'fa', text: 'تو همیشه در آغوش عشق هستی، حتی الان', startTime: 0, endTime: 5 },
    ],
  },
  {
    id: 'dream-therapy-2',
    category: 'mindfulness',
    title: 'درخت حرف دل',
    description: 'درختی که برگ‌هایش حرف‌های دلت را به باد می‌دهد',
    difficulty: 'easy',
    duration: 10,
    instructions: ['درخت را تصور کن', 'هر نگرانی را روی برگ بنویس', 'باد بگذراند', 'درخت سبز می‌ماند'],
    imageUris: ['worry-tree-1', 'worry-tree-2'],
    subtitles: [
      { language: 'fa', text: 'نگرانی‌ها مثل برگ‌هاست، می‌روند، ریشه‌ها می‌مانند', startTime: 0, endTime: 5 },
    ],
  },
  {
    id: 'dream-therapy-3',
    category: 'mindfulness',
    title: 'ماه خواب‌آور',
    description: 'ماهی که نور ملایمش خواب عمیق و آروم می‌آورد',
    difficulty: 'easy',
    duration: 15,
    instructions: ['در بازو ماه بگذار', 'نور ماه تو را بپوشاند', 'نفس‌های تو با ماه هم‌ریتم شود', 'در آرامش عمیق بمان'],
    imageUris: ['sleep-moon-1', 'sleep-moon-2'],
    subtitles: [
      { language: 'fa', text: 'ماه تو را می‌بیند، تو هم در آرامش به خواب برو', startTime: 0, endTime: 5 },
    ],
  },

  // ============ SUPPORTIVE AVATAR DAILY MESSAGES ============
  {
    id: 'avatar-support-1',
    category: 'emotional-regulation',
    title: 'پیام صبحگاهی یونس',
    description: 'یونس هر صبح با توست: "امروز هم اینجاست، با توست"',
    difficulty: 'easy',
    duration: 1,
    instructions: ['برنامه را باز کن', 'پیام یونس را بشنو/بخوان', 'روزت را با امید آغاز کن'],
    imageUris: ['morning-unicorn-1'],
    subtitles: [
      { language: 'fa', text: 'صبح بخیر ستاره‌ی من، امروز هم می‌درخشی', startTime: 0, endTime: 3 },
    ],
  },
  {
    id: 'avatar-support-2',
    category: 'emotional-regulation',
    title: 'همدلی شبانه اژدها',
    description: 'اژدها قبل از خواب: "امروز سخت بود، ولی تو قوی بودی"',
    difficulty: 'easy',
    duration: 1,
    instructions: ['پیام اژدها را بشنو', 'خودت را بغل کن', 'با آرامش بخواب'],
    imageUris: ['night-dragon-1'],
    subtitles: [
      { language: 'fa', text: 'شب بخیر قهرمان من، فردا روز تازه‌ای است', startTime: 0, endTime: 3 },
    ],
  },
  {
    id: 'avatar-support-3',
    category: 'emotional-regulation',
    title: 'تشویق لحظه‌ای ربات',
    description: 'ربات در لحظات سخت: "من اینجاست، قدم‌بهقدم پیش می‌رویم"',
    difficulty: 'easy',
    duration: 1,
    instructions: ['دکمه کمک را بزن', 'ربات می‌آید', 'قدم بعدی را با هم برمی‌داریم'],
    imageUris: ['robot-support-1'],
    subtitles: [
      { language: 'fa', text: 'خطا نیست، فقط گام بعدی است', startTime: 0, endTime: 3 },
    ],
  },

  // ============ PROGRESS MAP MILESTONES ============
  {
    id: 'progress-1',
    category: 'cognitive',
    title: 'نقشه پیشرفت: ایستگاه اول - خودشناسی',
    description: 'تشخیص احساسات، نقاط قوت، و نیازها',
    difficulty: 'easy',
    duration: 30,
    instructions: ['احساسات روزانه را ثبت کن', 'نقاط قوت را لیست کن', 'یونس مدال می‌دهد', 'به ایستگاه بعد برو'],
    imageUris: ['progress-station-1'],
    subtitles: [
      { language: 'fa', text: 'شناختن خود، اولین گام رشد است', startTime: 0, endTime: 3 },
    ],
  },
  {
    id: 'progress-2',
    category: 'emotional-regulation',
    title: 'نقشه پیشرفت: ایستگاه دوم - تنظیم احساسات',
    description: 'یادگیری تکنیک‌های آرام‌سازی و مقابله',
    difficulty: 'medium',
    duration: 60,
    instructions: ['تنفس را تمرین کن', 'بطری آرامش بساز', 'درخت احساسات پر کن', 'اژدها مدال می‌دهد'],
    imageUris: ['progress-station-2'],
    subtitles: [
      { language: 'fa', text: 'قدرت بر احساسات، قدرت بر زندگی است', startTime: 0, endTime: 3 },
    ],
  },
  {
    id: 'progress-3',
    category: 'social-skill',
    title: 'نقشه پیشرفت: ایستگاه سوم - ارتباط با دیگران',
    description: 'نوبت‌دهی، همدلی، و درخواست کمک',
    difficulty: 'medium',
    duration: 60,
    instructions: ['بازی نوبت‌دهی', 'کارت‌های احساس', 'با خانواده تمرین کن', 'ربات مدال می‌دهد'],
    imageUris: ['progress-station-3'],
    subtitles: [
      { language: 'fa', text: 'تنها نیستی، ما همه با تو هستیم', startTime: 0, endTime: 3 },
    ],
  },

  // ============ PARENTING GUIDANCE QUICK TIPS ============
  {
    id: 'parent-tip-1',
    category: 'emotional-regulation',
    title: 'راهنمای لحظه‌ای: قشقرق کودک',
    description: '۳ قدم: ۱. آرام بمان ۲. احساس را نام‌گذاری کن ۳. انتخاب بده',
    difficulty: 'easy',
    duration: 2,
    instructions: ['نفس عمیق بکش', "بگو: 'من می‌بینم تو عصبانی هستی'", 'دو انتخاب بده: "می‌خوای بغل شوی یا فضا داشته باشی؟"'],
    imageUris: ['tantrum-guide-1'],
    subtitles: [
      { language: 'fa', text: 'قشقرق فرصت ارتباط است، نه جنگ', startTime: 0, endTime: 3 },
    ],
  },
  {
    id: 'parent-tip-2',
    category: 'emotional-regulation',
    title: 'راهنمای لحظه‌ای: اضطراب کودک',
    description: 'تایید، تنفس، و امن‌سازی',
    difficulty: 'easy',
    duration: 3,
    instructions: ['بگو: "ترسیدن طبیعیه"', 'تنفس ۴-۷-۸ با هم', 'آغوش/بطانیه امن بده'],
    imageUris: ['anxiety-guide-1'],
    subtitles: [
      { language: 'fa', text: 'ترس تو واقعی است، ولی تو قوی‌تر از ترس‌هات', startTime: 0, endTime: 3 },
    ],
  },
  {
    id: 'parent-tip-3',
    category: 'emotional-regulation',
    title: 'راهنمای لحظه‌ای: افسردگی/کم‌انرژی',
    description: 'حرکت کوچک، نور، و حضور',
    difficulty: 'easy',
    duration: 5,
    instructions: ['پرد را باز کن', 'یک 걸음 با هم بردار', 'چیزی کوچک خوشایند بنوش', 'فقط امروز را فکر کن'],
    imageUris: ['depression-guide-1'],
    subtitles: [
      { language: 'fa', text: 'امروز فقط امروز است، فردا فرداست', startTime: 0, endTime: 3 },
    ],
  },
];

export const SPECIAL_NEEDS_PROFILES = [
  {
    id: 'autism',
    label: 'اوتیسم',
    emoji: '🧩',
    color: '#A29BFE',
    defaultSettings: {
      lowStimulation: true,
      colorScheme: 'soft',
      soundEnabled: false,
      reducedMotion: true,
      fontSize: 'large',
    },
    recommendedExercises: ['autism-1', 'autism-2', 'autism-3', 'autism-4', 'breathing-1', 'emotion-1'],
    avatarMessages: {
      morning: 'جوی: صبح بخیر! امروز با انرژی و شادی پیش می‌ریم 😊',
      evening: 'سدنِس: هر حسی داشتی مهم بود، من کنارت‌ام.',
      stress: 'اَنگزایتی: نفس عمیق… قدم‌به‌قدم با هم جلو می‌ریم.',
    },
  },
  {
    id: 'adhd',
    label: 'ADHD',
    emoji: '⚡',
    color: '#FD9644',
    defaultSettings: {
      lowStimulation: false,
      colorScheme: 'high-contrast',
      soundEnabled: true,
      reducedMotion: false,
      fontSize: 'medium',
    },
    recommendedExercises: ['adhd-1', 'adhd-2', 'adhd-3', 'breathing-2', 'motor-1', 'cognitive-1'],
    avatarMessages: {
      morning: 'جوی: انرژی فوق‌العاده‌ای داری! امروز چه ماجراجویی‌ای داریم؟',
      evening: 'جوی: تمرکزت عالی بود! حتی اگه سخت بود، تو از پسش برومدی.',
      stress: 'اَنگزایتی: تایمر ۵ دقیقه؛ فقط یک کار، بعد استراحت. من همراهتم.',
    },
  },
  {
    id: 'dyslexia',
    label: 'دیسلکسی',
    emoji: '📖',
    color: '#4ECDC4',
    defaultSettings: {
      lowStimulation: false,
      colorScheme: 'soft',
      soundEnabled: true,
      reducedMotion: true,
      fontSize: 'large',
      fontFamily: 'dyslexia',
      lineHeight: 1.8,
      letterSpacing: 2,
    },
    recommendedExercises: ['speech-1', 'cognitive-1', 'emotion-1', 'motor-1'],
    avatarMessages: {
      morning: 'سدنِس و جوی: کلماتت قوی‌ان، امروز با هم تمرین می‌کنیم.',
      evening: 'جوی: سخت بود ولی ادامه دادی، ستاره‌ای! ⭐',
      stress: 'اَنگزایتی: نفس بکش… یه کلمه یه کلمه جلو می‌ریم.',
    },
  },
  {
    id: 'physical',
    label: 'معلولیت فیزیکی',
    emoji: '♿',
    color: '#74B9FF',
    defaultSettings: {
      lowStimulation: false,
      colorScheme: 'high-contrast',
      soundEnabled: true,
      reducedMotion: true,
      touchAccommodations: { holdDuration: 500, ignoreRepeat: true, tapAssistance: true },
      switchControlEnabled: true,
      voiceControlEnabled: true,
    },
    recommendedExercises: ['physical-1', 'physical-2', 'physical-3', 'breathing-1', 'mindfulness-1', 'speech-1'],
    avatarMessages: {
      morning: 'جوی: اراده‌ات قوی‌ترین قدرتته، امروز هم می‌درخشی.',
      evening: 'سدنِس: هر تلاشت ارزشمنده، واقعاً قابل تحسینه.',
      stress: 'اَنگزایتی: یک قدم کوچک، یک نفس؛ قدم بعدی رو با هم برمی‌داریم.',
    },
  },
  {
    id: 'visual',
    label: 'نابینا/کم‌بینا',
    emoji: '👁️',
    color: '#FF6B9D',
    defaultSettings: {
      lowStimulation: false,
      colorScheme: 'high-contrast',
      soundEnabled: true,
      audioDescriptionEnabled: true,
      screenReaderOptimized: true,
      fontSize: 'xlarge',
    },
    recommendedExercises: ['visual-1', 'visual-2', 'breathing-1', 'mindfulness-1', 'speech-1', 'social-1'],
    avatarMessages: {
      morning: 'جوی: امروز همراهتیم و قدم‌به‌قدم با هم جلو می‌ریم.',
      evening: 'سدنِس: تجربیات امروزت ارزشمند بودن، آفرین.',
      stress: 'سدنِس: من اینجام کنار تو، امن و همراه.',
    },
  },
  {
    id: 'hearing',
    label: 'ناشنوا/کم‌شنوا',
    emoji: '👂',
    color: '#55EFC4',
    defaultSettings: {
      lowStimulation: false,
      colorScheme: 'soft',
      soundEnabled: false,
      subtitlesEnabled: true,
      signLanguageEnabled: true,
      hapticFeedback: true,
    },
    recommendedExercises: ['hearing-1', 'hearing-2', 'breathing-1', 'motor-1', 'emotion-1', 'sensory-1'],
    avatarMessages: {
      morning: 'جوی: صبح بخیر ستاره درخشان! 😊',
      evening: 'جوی: امروز عالی ابراز کردی، دیده و حس شدی.',
      stress: 'سدنِس: من اینجام، در کنار تو امنی.',
    },
  },
  {
    id: 'speech',
    label: 'اختلال گفتاری',
    emoji: '🗣️',
    color: '#A8D8EA',
    defaultSettings: {
      lowStimulation: false,
      colorScheme: 'soft',
      soundEnabled: true,
      reducedMotion: true,
    },
    recommendedExercises: ['speech-1', 'breathing-1', 'motor-1', 'social-1', 'cognitive-1'],
    avatarMessages: {
      morning: 'جوی: صدای تو خاصه، امروز هم بدرخش.',
      evening: 'جوی: هر تلاشی برای گفتن یک پیروزیه!',
      stress: 'اَنگزایتی: بدون عجله، نفس بکش… قدم‌به‌قدم پیش می‌ریم.',
    },
  },
  {
    id: 'anxiety',
    label: 'اضطراب',
    emoji: '😰',
    color: '#A29BFE',
    defaultSettings: {
      lowStimulation: true,
      colorScheme: 'soft',
      soundEnabled: true,
      reducedMotion: true,
    },
    recommendedExercises: ['anxiety-1', 'anxiety-2', 'breathing-1', 'breathing-2', 'mindfulness-1', 'emotion-1', 'emotion-2', 'dream-therapy-1', 'dream-therapy-2', 'dream-therapy-3'],
    avatarMessages: {
      morning: 'اَنگزایتی و جوی: امروز همراهتیم؛ امنی و می‌تونی.',
      evening: 'جوی: از پسش برومدی؛ تو قوی‌تر از نگرانی‌هایی.',
      stress: 'سدنِس: احساس‌ها مثل موج میان و می‌رن؛ ما کنارتیم.',
    },
  },
  {
    id: 'depression',
    label: 'افسردگی',
    emoji: '😔',
    color: '#636E72',
    defaultSettings: {
      lowStimulation: true,
      colorScheme: 'soft',
      soundEnabled: true,
      reducedMotion: true,
    },
    recommendedExercises: ['depression-1', 'depression-2', 'breathing-1', 'mindfulness-1', 'emotion-1', 'motor-1', 'social-1', 'dream-therapy-1', 'dream-therapy-3'],
    avatarMessages: {
      morning: 'جوی: امروز نور تازه‌ای برای تو می‌درخشه.',
      evening: 'سدنِس: حتی اگر سخت بود، همین که اینجایی کافیه.',
      stress: 'جوی: یک نور کوچک هم می‌تونه راه رو روشن کنه.',
    },
  },
];

// ============ TIME CAPSULE DATA ============
export const TIME_CAPSULE_TEMPLATES = [
  {
    id: 'birthday-18',
    title: 'کپسول تولد ۱۸ سالگی',
    description: 'پیام‌ها و خاطرات برای وقتی بزرگ شدی',
    unlockCondition: 'age',
    targetAge: 18,
    suggestedContent: [
      { type: 'letter', title: 'نامه از بابا', prompt: 'بابا، چه چیزی به دخترت می‌گویم وقتی ۱۸ ساله شود؟' },
      { type: 'letter', title: 'نامه از مامان', prompt: 'مامان، بهترین نصیحتش چیست؟' },
      { type: 'wish', title: 'آرزو برای آینده', prompt: 'چه آرزویی برای او داری؟' },
      { type: 'prediction', title: 'پیش‌بینی آینده', prompt: 'فکر می‌کنی ۱۸ ساله‌اش چه کار می‌کند؟' },
      { type: 'image', title: 'عکس امروز', prompt: 'یک عکس خانوادگی امروز اضافه کن' },
    ],
  },
  {
    id: 'wedding',
    title: 'کپسول عروسی',
    description: 'خاطرات برای روز عروسی',
    unlockCondition: 'event',
    targetEvent: 'wedding',
    suggestedContent: [
      { type: 'letter', title: 'نصیحت برای شوهری/زنِ آینده', prompt: 'چه چیزی می‌خواهی به همسرش بگویی؟' },
      { type: 'wish', title: 'دعای والدین', prompt: 'دعای خود را برایش بنویس' },
      { type: 'video', title: 'ویدیو مبارکت', prompt: 'یک ویدیو کوتاه ثبت کن' },
    ],
  },
  {
    id: 'migration',
    title: 'کپسول مهاجرت',
    description: 'یادگاری از خانه و ریشه‌ها برای مهاجر شدن',
    unlockCondition: 'date',
    targetDate: '2026-01-01',
    suggestedContent: [
      { type: 'letter', title: 'یادداشت از وطن', prompt: 'چه چیزی از ایران دلدار داری؟' },
      { type: 'image', title: 'عکس از محله/خانه', prompt: 'مکان‌های عاشقانه‌ات را عکس کن' },
      { type: 'audio', title: 'صدای خیابان/آذان', prompt: 'صداهای بومی را ضبط کن' },
      { type: 'wish', title: 'آرزو برای مهاجرتی', prompt: 'چه امیدی برای مهاجرتی داری؟' },
    ],
  },
  {
    id: 'custom',
    title: 'کپسول سفارشی',
    description: 'سازماندهی خودت برای هر مناسبت',
    unlockCondition: 'manual',
    suggestedContent: [],
  },
];

// ============ DREAM WORLD DATA ============
export const DREAM_SYMBOLS = [
  { symbol: '🦋 پروانه', category: 'animal', meaning: 'تحول، تغییر، آزادی روح', personalMeaning: '' },
  { symbol: '🌈 رنگین‌کمان', category: 'abstract', meaning: 'امید، وعده، زیبایی بعد از طوفان', personalMeaning: '' },
  { symbol: '🏰 قلعه', category: 'place', meaning: 'امنیت، حفظ، اهداف بزرگ', personalMeaning: '' },
  { symbol: '🌊 دریا', category: 'place', meaning: 'احساسات عمیق، ناخودآگاه، جریان زندگی', personalMeaning: '' },
  { symbol: '✈️ پرواز', category: 'action', meaning: 'آزادی، فرار، دیدگاه جدید', personalMeaning: '' },
  { symbol: '🗝️ کلید', category: 'object', meaning: 'راه‌حل، دسترسی، کشف راز', personalMeaning: '' },
  { symbol: '🌳 درخت', category: 'abstract', meaning: 'رشد، ریشه، اتصال به گذشته و آینده', personalMeaning: '' },
  { symbol: '☀️ خورشید', category: 'abstract', meaning: 'روشنایی، حیات، انرژی مثبت', personalMeaning: '' },
  { symbol: '🌙 ماه', category: 'abstract', meaning: 'شهود، ناخودآگاه، چرخه‌ها', personalMeaning: '' },
  { symbol: '🐉 اژدها', category: 'animal', meaning: 'قدرت درونی، محافظت، حکمت کهن', personalMeaning: '' },
  { symbol: '🦄 یونس', category: 'animal', meaning: 'جاده، پاکی، معجزه، امید', personalMeaning: '' },
  { symbol: '📚 کتاب', category: 'object', meaning: 'دانش، حکمت، داستان زندگی', personalMeaning: '' },
  { symbol: '💎 الماس', category: 'object', meaning: 'ارزش درونی، استحکام، درخشش', personalMeaning: '' },
  { symbol: '🕊️ کبوتر', category: 'animal', meaning: 'صلح، پیام، روح', personalMeaning: '' },
  { symbol: '🌟 ستاره', category: 'abstract', meaning: 'راهنمایی، آرزو، قدرتی از فراسو', personalMeaning: '' },
];

export const DREAM_INTERPRETATION_TEMPLATES = [
  {
    category: 'flying',
    jungian: 'پرواز نماد آزادی از قید و بندها و دسترسی به پتانسیل‌های ناخودآگاه است.',
    freudian: 'ارزوی فرار از واقعیت یا برآوردن آرزوهای ممنوعه.',
    modern: 'احساس توانمندی، دیدگاه وسیع، و آمادگی برای چالش‌های جدید.',
  },
  {
    category: 'water',
    jungian: 'دریا نماد ناخودآگاه جمعی و عمق احساسات است.',
    freudian: 'نماد رحم، تولد، یا آرزوهای جنسی کبته.',
    modern: 'وضعیت احساسی: آرام = sự bình yên, خروشان = استرس/اضطراب.',
  },
  {
    category: 'chase',
    jungian: 'دویده شدن نماد فرار از سایه (جنبه‌های ناپذیرفته‌شده خود) است.',
    freudian: 'ترس از مجازات یا آشکار شدن آرزوهای کبته.',
    modern: 'اجتناب از مقابله با یک مسئله، نیاز به مواجهه با ترس‌ها.',
  },
];

// ============ PARENTING RESOURCES ============
export const PARENTING_RESOURCES = [
  {
    id: 'pp-1',
    title: 'والدگری مثبت: ۵ اصل طلایی',
    category: 'positive-parenting',
    format: 'article',
    content: '۱. محبت بی‌شرط ۲. مرزهای شفاف ۳. تشویق تلاش ۴. مدل‌سازی ۵. گوش دادن فعال...',
    duration: 10,
    ageRange: '۰-۱۸ سال',
    tags: ['والدگری', 'مثبت', 'مرزها', 'تشویق'],
    language: 'fa',
    subtitles: [],
    rating: 4.9,
    savedBy: [],
  },
  {
    id: 'sn-1',
    title: 'درک اوتیسم: راهنمای والدین',
    category: 'special-needs',
    format: 'video',
    content: 'نشانه‌های اولیه، استراتژی‌های خانه، ارتباط موثر، مدیریت سان‌سوری...',
    videoUri: 'autism-guide-1',
    duration: 25,
    ageRange: '۲-۱۲ سال',
    tags: ['اوتیسم', 'والدین', 'راهنمایی', 'سان‌سوری'],
    language: 'fa',
    subtitles: [
      { language: 'fa', text: 'اوتیسم بیماری نیست، راه دیگر دیدن جهان است', startTime: 0, endTime: 5 },
    ],
    rating: 4.8,
    savedBy: [],
  },
  {
    id: 'comm-1',
    title: 'شنیدن فعال: کلید ارتباط با کودک',
    category: 'communication',
    format: 'interactive',
    content: 'تمرین‌های عملية برای شنیدن بدون قضاوت، تایید احساسات، و پاسخ‌دهی همدلانه',
    duration: 15,
    ageRange: '۳-۱۸ سال',
    tags: ['ارتباط', 'شنیدن', 'همدلی', 'تایید'],
    language: 'fa',
    subtitles: [],
    rating: 4.7,
    savedBy: [],
  },
  {
    id: 'crisis-1',
    title: 'مدیریت بحران عاطفی کودک',
    category: 'crisis',
    format: 'worksheet',
    content: 'مراحل: ۱. امن‌سازی ۲. تایید احساس ۳. تنفس ۳. انتخاب استراتژی ۴. بازبینی',
    duration: 10,
    ageRange: '۴-۱۸ سال',
    tags: ['بحران', 'عاطفی', 'مدیریت', 'اوراق‌کار'],
    language: 'fa',
    subtitles: [],
    rating: 4.6,
    savedBy: [],
  },
  {
    id: 'mig-1',
    title: 'مهاجرتی با کودکان: چالش‌ها و فرصت‌ها',
    category: 'migration',
    format: 'article',
    content: 'آمادگی عاطفی، حفظ هویت، مدرسه جدید، دوستان، زبان، شکاف نسلی...',
    duration: 20,
    ageRange: 'همه سنین',
    tags: ['مهاجرت', 'کودکان', 'هویت', 'چالش'],
    language: 'fa',
    subtitles: [],
    rating: 4.5,
    savedBy: [],
  },
];

// ============ SUPPORTIVE AVATAR SYSTEM (Inside Out 1, Inside Out 2, Dream Productions) ============
export const SUPPORTIVE_AVATARS = [
  {
    id: 'joy',
    name: 'جوی (Joy)',
    emoji: '😊',
    color: '#FFD93D',
    gradient: ['#FFD93D', '#FFB703', '#74B9FF'],
    personality: 'پرانرژی، امیدبخش، بازیگوش، نورانی',
    voiceStyle: 'شاد، پرانرژی و دلگرم‌کننده',
    specialties: ['morning-motivation', 'celebration', 'emotional-support', 'gratitude'],
    character: 'Joy',
    source: 'Inside Out',
    messages: {
      morning: 'جوی: صبح بخیر! امروز کلی خاطره طلایی می‌سازیم ✨',
      evening: 'جوی: امروز فوق‌العاده بودی! بیا بهترین لحظه‌ها رو نگه داریم 🌟',
      stress: 'جوی: نفس عمیق… من کنارت‌ام، با هم یه راه شادی پیدا می‌کنیم 💛',
      celebration: 'جوی: آفرین! این هم یه گوی خاطره درخشان 🎉',
      bedtime: 'جوی: فردا دوباره می‌درخشیم؛ الان وقت استراحت خوشگله 🌙',
      encouragement: 'جوی: قدم‌های کوچیک هم قهرمانانه‌ان، ادامه بده! 💪',
    },
  },
  {
    id: 'sadness',
    name: 'سدنِس (Sadness)',
    emoji: '😢',
    color: '#74B9FF',
    gradient: ['#74B9FF', '#A8D8EA', '#6C5CE7'],
    personality: 'مهربان، همدل، آرام، عمیق',
    voiceStyle: 'آرام، صادق و همراه',
    specialties: ['emotional-support', 'reflection', 'empathy', 'bedtime-stories'],
    character: 'Sadness',
    source: 'Inside Out',
    messages: {
      morning: 'سدنِس: صبح بخیر… هر حسی که داری مهمه، من گوش می‌دم 💙',
      evening: 'سدنِس: خوبه که درباره امروز حرف بزنیم؛ من اینجام.',
      stress: 'سدنِس: اشک و نفس عمیق کمک می‌کنه… تنهامون نمی‌ذاری 🌧️',
      celebration: 'سدنِس: حتی لحظه‌های کوچیک هم ارزشمندَن، ممنون که تلاش کردی.',
      bedtime: 'سدنِس: شب آروم… بذار ذهن کمی سبک‌تر بشه 🌙',
      encouragement: 'سدنِس: کند حرکت کردن اشکالی نداره؛ من همراهتم.',
    },
  },
  {
    id: 'anxiety',
    name: 'اَنگزایتی (Anxiety)',
    emoji: '😰',
    color: '#FD9644',
    gradient: ['#FD9644', '#FAB1A0', '#A29BFE'],
    personality: 'برنامه‌ریز، مراقب، آینده‌نگر، حساس',
    voiceStyle: 'سریع اما دلسوز و راهنما',
    specialties: ['planning', 'focus', 'step-by-step', 'problem-solving'],
    character: 'Anxiety',
    source: 'Inside Out 2',
    messages: {
      morning: 'اَنگزایتی: برنامه امروز آماده‌ست! قدم‌به‌قدم جلو می‌ریم 🧡',
      evening: 'اَنگزایتی: از پس امروز برومدی؛ بیا سریع مرور کنیم چی خوب پیش رفت.',
      stress: 'اَنگزایتی: اوکی، نفس… فقط یک کار کوچک الان انجام بدیم.',
      celebration: 'اَنگزایتی: دیدی؟ برنامه جواب داد! آفرین به خودت 🎯',
      bedtime: 'اَنگزایتی: فردا رو می‌چینیم، الان وقت خاموش کردن ذهنه 😴',
      encouragement: 'اَنگزایتی: لازم نیست کامل باشی؛ فقط قدم بعدی کافیه.',
    },
  },
  {
    id: 'dream',
    name: 'تیم استودیو رویا (Paula & Xeni)',
    emoji: '🎬',
    color: '#A29BFE',
    gradient: ['#A29BFE', '#FF9FF3', '#74B9FF'],
    personality: 'خلاق، خیال‌پرداز، کارگردان رویا، امیدوار',
    voiceStyle: 'سینمایی، الهام‌بخش و آرامش‌بخش',
    specialties: ['dream-therapy', 'creativity', 'bedtime-stories', 'imagination'],
    character: 'Paula, Xeni, Jean',
    source: 'Dream Productions',
    messages: {
      morning: 'پائولا: صحنه امروز آماده‌ست! بیا یه روز رویایی بسازیم 🎬',
      evening: 'زِنی: برداشت امروز عالی بود! وقت تدوین خاطرات خوبه ✨',
      stress: 'ژان: کات! نفس بکش… می‌تونیم صحنه رو آروم‌تر دوباره بگیریم.',
      celebration: 'تیم رویا: این صحنه جایزه می‌خواد! درخشان بودی 🌟',
      bedtime: 'پائولا: نورها کم… دوربین… حرکت! رویاهای شیرین در راهه 🌙',
      encouragement: 'زِنی: هر ایده کوچیک می‌تونه یه رویای بزرگ بشه، ادامه بده!',
    },
  },
];

// ============ PROGRESS MAP STATIONS ============
export const PROGRESS_MAP_STATIONS = [
  {
    id: 'station-1',
    name: 'ایستگاه خودشناسی',
    emoji: '🌱',
    color: '#FF6B9D',
    description: 'تشخیص احساسات، نقاط قوت، نیازها، و سبک یادگیری',
    requiredExercises: 10,
    reward: 'مدال یونس شادی',
    nextStation: 'station-2',
  },
  {
    id: 'station-2',
    name: 'ایستگاه تنظیم احساسات',
    emoji: '🌿',
    color: '#A29BFE',
    description: 'یادگیری تکنیک‌های تنفس، آرام‌سازی، و مقابله با استرس',
    requiredExercises: 15,
    reward: 'مدال اژدهای دانا',
    nextStation: 'station-3',
  },
  {
    id: 'station-3',
    name: 'ایستگاه ارتباط و همدلی',
    emoji: '🌸',
    color: '#4ECDC4',
    description: 'نوبت‌دهی، گوش دادن فعال، درخواست کمک، و مراقبت از دیگران',
    requiredExercises: 15,
    reward: 'مدال ربات دوستانه',
    nextStation: 'station-4',
  },
  {
    id: 'station-4',
    name: 'ایستگاه رویا و خلاقیت',
    emoji: '✨',
    color: '#FD9644',
    description: 'سازماندهی رویاها، طراحی دنیای خیالی، و выраز خود',
    requiredExercises: 10,
    reward: 'مدال موجود نورانی',
    nextStation: 'station-5',
  },
  {
    id: 'station-5',
    name: 'ایستگاه هدایت دیگران',
    emoji: '🌟',
    color: '#A29BFE',
    description: 'به اشتراک گذاری مهارت‌ها، کمک به هم‌سالن‌ها، و رهبری ملایم',
    requiredExercises: 20,
    reward: 'مدال رهبر مهربان',
    nextStation: null,
  },
];

// ============ DREAM THERAPY ENVIRONMENTS ============
export const DREAM_THERAPY_ENVIRONMENTS = [
  {
    id: 'dream-env-1',
    name: 'باغ مادری نوری',
    emoji: '🌿✨',
    description: 'فضایی پر از نور ملایم، درختان میوه‌ده، و حضور مادری/یونس',
    audio: 'ambient-garden-mother',
    visual: 'soft-golden-light',
    therapeuticGoal: 'امنیت، عشق بی‌شर्त، ریشه‌گذاری',
    duration: 15,
  },
  {
    id: 'dream-env-2',
    name: 'درخت حرف دل',
    emoji: '🌳💚',
    description: 'درختی که برگ‌هاش نگرانی‌ها رو می‌گیرن و به باد می‌دهن',
    audio: 'wind-through-leaves',
    visual: 'leaves-flying-away',
    therapeuticGoal: 'رها کردن نگرانی، accettazione، آرامش',
    duration: 10,
  },
  {
    id: 'dream-env-3',
    name: 'ماه خواب‌آور',
    emoji: '🌙💤',
    description: 'ماه بزرگ، نقره‌ای، که نورش کل دنیای رویا رو می‌پوشونه',
    audio: 'deep-sleep-hum',
    visual: 'moonlight-blanket',
    therapeuticGoal: 'خواب عمیق، ریلکس کامل، امنیت شبانه',
    duration: 20,
  },
  {
    id: 'dream-env-4',
    name: 'کوه قدرت درونی',
    emoji: '🏔️💪',
    description: 'کوهی که هر گام روش، یه достиجازه، با اژدها همراه',
    audio: 'mountain-wind',
    visual: 'summit-sunrise',
    therapeuticGoal: 'قدرت درونی، بازگشت به خود، پیروزی',
    duration: 15,
  },
  {
    id: 'dream-env-5',
    name: 'اقیانوس مهربانی',
    emoji: '🌊💙',
    description: 'دریای آرام که موج‌هاش بوی عشق و پذیرش میدن',
    audio: 'ocean-waves-gentle',
    visual: 'bioluminescent-waves',
    therapeuticGoal: 'جزر و مد احساسات، پذیرش، جریان',
    duration: 15,
  },
];

// ============ BACKUP & SECURITY CONFIG ============
export const BACKUP_CONFIG = {
  autoBackup: {
    enabled: true,
    frequency: 'daily',
    time: '03:00',
    encrypt: true,
    cloudProviders: ['google-drive', 'dropbox', 'onedrive', 'local-only'],
    includeMedia: true,
    include3DModels: true,
    maxVersions: 30,
  },
  manualBackup: {
    encrypt: true,
    formats: ['json', 'encrypted-zip', 'sqlite'],
    includeOptions: {
      memories: true,
      calendar: true,
      wellness: true,
      timeCapsules: true,
      dreams: true,
      progress: true,
      settings: true,
      media: true,
      models3D: true,
    },
  },
  security: {
    twoFactorAuth: true,
    biometricLock: false,
    pinFallback: true,
    privateMode: {
      childContent: true,
      healthData: true,
      dreamContent: true,
      therapistNotes: true,
    },
    alerts: {
      unauthorizedAccess: true,
      dataBreach: true,
      backupFailure: true,
      loginNewDevice: true,
    },
    encryption: {
      algorithm: 'AES-256-GCM',
      keyDerivation: 'PBKDF2',
      iterations: 100000,
    },
  },
  offlineMode: {
    enabled: true,
    syncOnReconnect: true,
    conflictResolution: 'manual',
    cacheSize: '500MB',
  },
};

// ============ ONLINE COUNSELOR INTEGRATION ============
export const COUNSELOR_INTEGRATION = {
  enabled: false,
  providers: [
    {
      id: 'iran-counseling',
      name: 'مشاوره آنلاین ایران',
      url: 'https://counseling.ir',
      specialties: ['child', 'family', 'autism', 'adhd', 'anxiety', 'depression'],
      languages: ['fa'],
      insurance: true,
    },
    {
      id: 'betterhelp',
      name: 'BetterHelp',
      url: 'https://betterhelp.com',
      specialties: ['all'],
      languages: ['en', 'es', 'fr', 'de'],
      insurance: false,
    },
  ],
  features: {
    inAppBooking: true,
    sessionNotes: true,
    sharedResources: true,
    progressSharing: 'parent-consent',
    emergencyContact: true,
  },
};

// ============ PARENTING QUICK GUIDES ============
export const PARENTING_QUICK_GUIDES = [
  {
    id: 'tantrum',
    trigger: 'قشقرق/خشم شدید',
    emoji: '🌪️',
    steps: [
      { step: 1, action: 'خودت آرام بمان', detail: 'نفس ۴-۷-۸، کودک احساس تو رو می‌گیره' },
      { step: 2, action: 'احساس رو نام‌گذاری کن', detail: '"من می‌بینم تو عصبانی/ناراحت/ناامیدی"' },
      { step: 3, action: 'انتخاب بده', detail: '"می‌خوای بغل شوی، فضا داشته باشی، یا یه کار دیگه؟"' },
      { step: 4, action: 'با هم باش', detail: 'نیازی به حل فوری نیست، فقط حضور تو کافیه' },
    ],
    prevention: ['روتین ثابت', 'اخطار قبل از تغییر', 'انتخاب‌های محدود', 'تشویق تلاش'],
    resources: ['parent-tip-1', 'emotion-1', 'breathing-1'],
  },
  {
    id: 'anxiety',
    trigger: 'اضطراب/ترس شدید',
    emoji: '😰',
    steps: [
      { step: 1, action: 'تایید کن', detail: '"ترسیدن طبیعیه، من اینجام"' },
      { step: 2, action: 'تنفس با هم', detail: 'تنفس ۴-۷-۸ یا تنفس جعبه‌ای با یونس/اژدها' },
      { step: 3, action: 'امن‌سازی حسی', detail: 'بغل، بطانیه سنگین، نور ملایم، موزیک آرام' },
      { step: 4, action: 'راهکار کوچیک', detail: '"چه کار کوچیکی می‌تونیم با هم بکنیم که بهتر بشی؟"' },
    ],
    prevention: ['روتين خواب', 'محدودیت اسکرین', 'وقت طبیعت', 'دفتر چراغ‌های کوچک'],
    resources: ['parent-tip-2', 'anxiety-1', 'anxiety-2', 'dream-therapy-1'],
  },
  {
    id: 'depression',
    trigger: 'افسردگی/کم‌انرژی/بی‌حوصله',
    emoji: '🌧️',
    steps: [
      { step: 1, action: 'بدون قضاوت باش', detail: '"سخت می‌دونم، من اینجام، فقط همین که اینجامی کافیه"' },
      { step: 2, action: 'حرکت mikro', detail: 'پرد باز کن، یک قدم، یه نوشیدنی گرم، فقط ۲ دقیقه' },
      { step: 3, action: 'نور و طبیعت', detail: 'پرد را باز کن، یا با یونس در خیالی طبیعت برو' },
      { step: 4, action: 'فقط امروز', detail: 'فردا فکر نکن، فقط همین الان، همین لحظه' },
    ],
    prevention: ['چراغ‌های کوچک شبانه', 'حرکت روزانه ۱۰ دقیقه', 'ارتباط روزانه با یونس', 'مانیتورینگ چک‌ان'],
    resources: ['parent-tip-3', 'depression-1', 'depression-2', 'dream-therapy-1', 'dream-therapy-3'],
  },
  {
    id: 'autism-meltdown',
    trigger: 'ملت‌داون/بازخورد حسی شدید (اوتیسم)',
    emoji: '🛡️',
    steps: [
      { step: 1, action: 'ایمنی اول', detail: 'محیط رو امن کن، اشیای خطرناک رو دور کن' },
      { step: 2, action: 'کم صحبت کن', detail: 'حداقل کلمه، صدای کم، یا فقط حضور' },
      { step: 3, action: 'راهکار حسی', detail: 'هدف: کاهش تحریک - نور کم، صدا کم، فشار عمیق (بغل/بطانیه)' },
      { step: 4, action: 'بازگشت تدریجی', detail: 'وقتی آرام شد، هیچ بحثی نکن، فقط روتین رو ادامه بده' },
    ],
    prevention: ['روتین بصری ثابت', 'کوته حسی', 'هشدار قبل از تغییر', 'کارت‌های احساس'],
    resources: ['autism-3', 'emotion-2', 'breathing-1'],
  },
];

// ============ ACCESSIBILITY DEFAULTS ============
export const DEFAULT_ACCESSIBILITY_SETTINGS = {
  subtitlesEnabled: true,
  subtitleLanguage: 'fa' as const,
  subtitleSize: 'medium' as const,
  subtitleColor: '#FFFFFF',
  subtitleBackground: 'rgba(0,0,0,0.8)',
  audioDescriptionEnabled: false,
  signLanguageEnabled: false,
  signLanguageAvatar: 'joy' as const,
  highContrast: false,
  reducedMotion: false,
  dyslexiaFont: false,
  fontSize: 16,
  lineHeight: 1.5,
  letterSpacing: 0,
  voiceControlEnabled: false,
  switchControlEnabled: false,
  touchAccommodations: {
    holdDuration: 0,
    ignoreRepeat: false,
    tapAssistance: false,
    gestureDelay: 0,
  },
};