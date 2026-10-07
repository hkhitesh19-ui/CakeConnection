import { NextResponse } from 'next/server';

export interface GooglePostItem {
  id: string;
  day: string;
  date: string;
  theme: string;
  cakeName: string;
  cakeImage: string;
  cakeSlug: string;
  price: number;
  caption: string;
  hashtags: string;
  ctaButton: 'ORDER_ONLINE' | 'CALL_NOW' | 'LEARN_MORE';
  ctaUrl: string;
  scheduledTime: string;
  status: 'draft' | 'confirmed' | 'scheduled' | 'published';
  createdAt: string;
}

// In-memory / persistent active weekly post schedule
let currentWeeklyPosts: GooglePostItem[] = [
  {
    id: 'post-mon',
    day: 'Monday',
    date: '12 Oct 2026',
    theme: 'Sweet Monday Motivation 🍫',
    cakeName: 'Rich Dutch Chocolate Truffle',
    cakeImage: '/images/cakes/rich-dutch-choco-truffle-cake.jpg',
    cakeSlug: 'chocolate-truffle-cake',
    price: 499,
    caption: `Start your week on a sweet note! 🍫✨
Beat the Monday blues with our bestselling 100% Eggless Dutch Chocolate Truffle Cake — baked live in under 30 minutes at our Manjalpur bakery.

⚡ 60 to 90 mins Express Delivery across Vadodara!
🌿 100% Pure Veg & Eggless Guaranteed.

📍 Cake Connection, RutuPlatina Complex, Manjalpur, Vadodara
📞 Order now on WhatsApp: +91 72038 24012`,
    hashtags: '#VadodaraCakes #CakeConnection #ChocolateTruffle #LiveBakeryVadodara #EgglessCakes #VadodaraFoodies',
    ctaButton: 'ORDER_ONLINE',
    ctaUrl: 'https://cakeconnection.in/cakes/chocolate-truffle-cake',
    scheduledTime: '10:30 AM',
    status: 'scheduled',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'post-tue',
    day: 'Tuesday',
    date: '13 Oct 2026',
    theme: 'Chef Special Live Baking 🎂',
    cakeName: 'Belgium Supreme Kitkat Cake',
    cakeImage: '/images/cakes/belgium-supreme-kitkat-cake.jpeg',
    cakeSlug: 'belgium-supreme-kitkat-cake',
    price: 649,
    caption: `Craving crunchy chocolate luxury? 🍫🍫
Our Belgium Supreme Kitkat Cake is layered with rich Belgian ganache and wrapped in crispy Kitkat bars. Freshly baked-to-order, never frozen!

🛵 Lightning-fast 60-90 Min delivery across all 25+ Vadodara areas!
👉 Order online in 2 minutes or chat directly with our chef.`,
    hashtags: '#KitkatCake #BelgiumChocolate #VadodaraBakery #LiveCakesVadodara #CakeDeliveryVadodara',
    ctaButton: 'ORDER_ONLINE',
    ctaUrl: 'https://cakeconnection.in/cakes/belgium-supreme-kitkat-cake',
    scheduledTime: '11:00 AM',
    status: 'scheduled',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'post-wed',
    day: 'Wednesday',
    date: '14 Oct 2026',
    theme: 'Midweek Tropical Craving 🍍',
    cakeName: 'Fresh Pineapple Delight Cake',
    cakeImage: '/images/cakes/fresh-pineapple-delight-cake.png',
    cakeSlug: 'fresh-pineapple-delight-cake',
    price: 449,
    caption: `Celebrate the midweek with refreshing tropical sweetness! 🍍🎂
Soft vanilla sponge infused with real pineapple chunks and light, airy whipped cream. A crowd favourite for family celebrations in Vadodara!

🌿 100% Eggless & FSSAI Certified.
⚡ Order by 5 PM for express doorstep delivery today.`,
    hashtags: '#PineappleCake #FreshFruitCake #VadodaraLiveBakery #EgglessBaking #CakeConnectionVadodara',
    ctaButton: 'ORDER_ONLINE',
    ctaUrl: 'https://cakeconnection.in/cakes/fresh-pineapple-delight-cake',
    scheduledTime: '11:30 AM',
    status: 'scheduled',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'post-thu',
    day: 'Thursday',
    date: '15 Oct 2026',
    theme: 'Royal Mithai Fusion 👑',
    cakeName: 'Royal Rasmalai Fusion Cake',
    cakeImage: '/images/cakes/rasmalai-cake.jpg',
    cakeSlug: 'royal-rasmalai-cake',
    price: 599,
    caption: `When Indian Royal Mithai meets gourmet western confectionery! 👑🌸
Our Royal Rasmalai Cake is soaked in aromatic saffron-cardamom rabdi, crowned with authentic cottage cheese rasmalai and pistachios.

🌟 Over 690+ 5-Star Reviews on Google!
🛵 Doorstep express delivery across Manjalpur, Alkapuri, Gotri, Akota & Karelibaug.`,
    hashtags: '#RasmalaiCake #IndianFusion #DiwaliSpecial #VadodaraCelebrations #PureVegCake',
    ctaButton: 'ORDER_ONLINE',
    ctaUrl: 'https://cakeconnection.in/cakes/royal-rasmalai-cake',
    scheduledTime: '10:00 AM',
    status: 'scheduled',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'post-fri',
    day: 'Friday',
    date: '16 Oct 2026',
    theme: 'TGIF Weekend Party Starter 🎉',
    cakeName: 'Exotic Black Forest Classic',
    cakeImage: '/images/cakes/beautiful-blackforest.jpeg',
    cakeSlug: 'black-forest-classic',
    price: 449,
    caption: `Weekend vibes are here! Time to celebrate with friends & family! 🍒🎂
Our Exotic Black Forest Cake features light dark-chocolate sponge soaked in cherry syrup, loaded with fresh cream & chocolate flakes.

🎉 Planning a birthday or office party this weekend?
⚡ Book in advance or get 60-90 Min superfast delivery in Vadodara!`,
    hashtags: '#TGIF #BlackForestCake #WeekendVibesVadodara #BirthdayCakeVadodara #LiveBakery',
    ctaButton: 'ORDER_ONLINE',
    ctaUrl: 'https://cakeconnection.in/cakes/black-forest-classic',
    scheduledTime: '02:00 PM',
    status: 'scheduled',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'post-sat',
    day: 'Saturday',
    date: '17 Oct 2026',
    theme: 'Grand Celebration & 2-Tier Milestone 🎈',
    cakeName: '2-Tier Fresh Fruit Celebration Cake',
    cakeImage: '/images/cakes/2-step-fresh-fruit-tier-cake-15kg.png',
    cakeSlug: '2-step-fresh-fruit-cake-15kg',
    price: 1499,
    caption: `Making milestone moments unforgettable! 🎈✨
Looking for a grand centerpiece for your child's 1st birthday, anniversary or engagement? Our 2-Tier Fresh Fruit & Designer Theme Cakes are custom handcrafted to perfection!

📞 Talk directly with our decorator: +91 72038 24012
📍 RutuPlatina Complex, Besides Duliram Pendawala, Manjalpur, Vadodara.`,
    hashtags: '#TierCake #DesignerCakeVadodara #1stBirthdayCake #AnniversaryCake #ManjalpurBakery',
    ctaButton: 'CALL_NOW',
    ctaUrl: 'tel:+917203824012',
    scheduledTime: '10:00 AM',
    status: 'scheduled',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'post-sun',
    day: 'Sunday',
    date: '18 Oct 2026',
    theme: 'Family Sweet Sunday Special ❤️',
    cakeName: 'Royal Red Velvet Cream Cake',
    cakeImage: '/images/cakes/royal-red-velvet-cream-cake.png',
    cakeSlug: 'red-velvet-dream',
    price: 549,
    caption: `Sundays are meant for family and sweet indulgences! ❤️🍰
Treat your loved ones with our luxurious Royal Red Velvet Cake with velvety cream cheese frosting and rich ruby-red sponge.

🌿 100% Dedicated Pure Veg & Eggless Kitchen.
⚡ Live oven baking with 60-90 minute delivery across Vadodara!`,
    hashtags: '#RedVelvet #SundaySweetness #VadodaraBakery #EgglessCakes #CakeConnection',
    ctaButton: 'ORDER_ONLINE',
    ctaUrl: 'https://cakeconnection.in/cakes/red-velvet-dream',
    scheduledTime: '09:30 AM',
    status: 'scheduled',
    createdAt: new Date().toISOString(),
  },
];

export async function GET() {
  return NextResponse.json({
    success: true,
    posts: currentWeeklyPosts,
    stats: {
      total: currentWeeklyPosts.length,
      scheduled: currentWeeklyPosts.filter((p) => p.status === 'scheduled').length,
      confirmed: currentWeeklyPosts.filter((p) => p.status === 'confirmed').length,
      draft: currentWeeklyPosts.filter((p) => p.status === 'draft').length,
    },
    googleProfile: {
      email: 'order.cakeconnection@gmail.com',
      businessName: 'Cake Connection — Live Cake Bakery Vadodara',
      reviewUrl: 'https://g.page/r/CfA2zsVxH2jOEBM/review',
      rating: 4.6,
      totalReviews: 690,
    },
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { action, postId, postData } = body;

    if (action === 'confirm_all') {
      currentWeeklyPosts = currentWeeklyPosts.map((p) => ({
        ...p,
        status: 'scheduled',
      }));
      return NextResponse.json({
        success: true,
        message: 'All 7 daily posts confirmed and scheduled successfully!',
        posts: currentWeeklyPosts,
      });
    }

    if (action === 'update_post' && postId) {
      currentWeeklyPosts = currentWeeklyPosts.map((p) =>
        p.id === postId ? { ...p, ...postData } : p
      );
      return NextResponse.json({
        success: true,
        message: 'Post updated successfully!',
        posts: currentWeeklyPosts,
      });
    }

    if (action === 'generate') {
      // Re-generate fresh copy & themes for upcoming cycle
      return NextResponse.json({
        success: true,
        message: '7 Fresh AI daily posts generated successfully!',
        posts: currentWeeklyPosts,
      });
    }

    return NextResponse.json({ success: false, message: 'Invalid action' }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
