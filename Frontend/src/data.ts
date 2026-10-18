/**
 * ===============================================================================
 * 💖 PROPOSE-POOKIE: QUICK-EDIT CONFIGURATION FILE (data.ts) 💖
 * ===============================================================================
 * 
 * ✨ HOW TO CUSTOMIZE QUICKLY:
 * 1. Change names, nicknames, and your special anniversary date below.
 * 2. Edit any love messages, scrapbook photos, video clips, or map stops.
 * 3. Save this file, and your romantic website updates IMMEDIATELY in real-time!
 * 
 * 📸 TIPS FOR IMAGES & VIDEOS:
 * - You can place your own images or videos inside the `Frontend/public/` folder,
 *   e.g. `/my_photo.jpg` or `/my_video.mp4`
 * - Or paste any direct online image/video URL!
 */

export const PROPOSAL_DATA = {
  // ── 1. COUPLE NAMES & ANNIVERSARY ──────────────────────────────────────────
  partnerNickname: "Pookie",
  proposerNickname: "Buggu",
  partnerFullName: "My Sweetest Pookie",
  proposerFullName: "AkSHI",

  // Anniversary or First Met Date (Format: YYYY-MM-DDTHH:mm:ss for the live counter)
  relationshipStartDate: "2026-04-03T00:00:00",

  // ── 2. INTRO LOADER / LOCK SCREEN ──────────────────────────────────────────
  intro: {
    badge: "Strictly For Pookie's Eyes Only",
    title: "Sanctuary of Us",
    buttonText: "Unlock My Heart, Pookie",
    whispers: [
      "In an endless garden of souls, my heart bloomed only for you...",
      "Every love story is special, but ours is my favorite fairy tale.",
      "You brought eternal spring and peace into my world.",
      "To my sweetest Pookie: this sanctuary was grown only for you.",
    ],
  },

  // ── 3. CHAPTER I: SEALED LOVE LETTER 💌 ──────────────────────────────────
  loveLetter: {
    badge: "Chapter I • A Sealed Promise",
    title: "To My Sweetest Pookie ❤️",
    subtitle: '"Out of eight billion souls, my heart bloomed only for you."',
    passcode: "16052005", // 8-digit romantic passcode to unlock the letter
    passcodeWarning: "⚠️ Warning: This letter is strictly protected for Pookie only!",
    passcodeSuccessText: "Identity verified! Unsealing our love letter, Pookie... 💖",
    passcodeErrorText: "Access Denied! This letter is strictly for Pookie's eyes only 🍃",
    salutation: "Dearest Pookie,",
    paragraphs: [
      "From the very first moment our worlds touched, everything in my life shifted into vibrant color and peace. You aren't just someone I fell in love with — you became my calm in every storm, my loudest laugh, and my absolute favourite safe space.",
      "I adore everything about you: the way your eyes crinkle when you laugh, your sweet morning voice, the little quirks that belong only to you, and how easily your hand fits into mine.",
      "I built this botanical sanctuary just for you, to walk you through our moments, our journey map, and a question that has been growing in my heart since the day I met you.",
    ],
    signOff: "Forever yours, Buggu ❤️",
    postScript: "P.S. Walk with me through the trail of our journey...",
  },

  // ── 4. CHAPTERS II - IV: PRIVATE MEMORY VAULT PROTECTION 🔒 ─────────────
  vaultProtection: {
    passcode: "16052005", // 8-digit password to unlock Chapters 2-4
    title: "Protected Memory Vault",
    subtitle: "Chapters II to IV contain our private journey, photos & videos.",
    warning: "⚠️ Warning: Protected for Pookie Only!",
    prompt: "Enter the 8-digit secret key to unlock our private memories (Chapters II – IV), or skip directly to Chapter V:",
    skipButtonText: "Skip to Chapter V (100 Reasons) 🍃",
    unlockButtonText: "Unlock All Chapters ✨",
    errorText: "Access Denied! Incorrect key for Pookie's private vault 🚫🍃",
  },

  // ── 5. CHAPTER II: THE MAP OF OUR JOURNEY 🗺️ ─────────────────────────────
  journeyMap: {
    badge: "Chapter II • The Map of Our Journey",
    title: "The Trail That Led to You",
    subtitle: '"Every step, every street, every turn was gently guiding my heart to yours."',
    stops: [
      {
        id: 0,
        title: "Where It All Began",
        locationName: "Cafe St. Amour • The First Glance",
        date: "September 14, 2023",
        coords: { x: 12, y: 72 },
        image: "/patronus_romance.jpg",
        story: "The moment our eyes met across the room, the noise of the whole world faded away. Your smile carried so much warmth that I knew right then, my life was about to change forever.",
        secretWhisper: "I rehearsed my opening line five times in my head and still got tongue-tied looking at you.",
        icon: "☕",
      },
      {
        id: 1,
        title: "Midnight River Whispers",
        locationName: "The Moonlight Promenade",
        date: "November 03, 2023",
        coords: { x: 28, y: 36 },
        image: "/hogwarts_castle.jpg",
        story: "Walking side-by-side along the water under the cool night breeze. We lost track of time talking about childhood dreams, silly fears, and music, laughing until our stomachs ached.",
        secretWhisper: "I walked you back as slowly as possible just so the night wouldn't end.",
        icon: "🌙",
      },
      {
        id: 2,
        title: "One Umbrella & Warm Hands",
        locationName: "The Rain-Soaked Street",
        date: "December 24, 2023",
        coords: { x: 48, y: 64 },
        image: "/patronus_romance.jpg",
        story: "Rain pouring from the sky, sharing one small umbrella, and bumping shoulders with every step. When you reached out and gently held my hand, my heart skipped a thousand beats.",
        secretWhisper: "My hand was cold, but holding yours made my entire soul feel warm and home.",
        icon: "🌧️",
      },
      {
        id: 3,
        title: "The Moment I Knew",
        locationName: "Sunset Overlook & Golden Hour",
        date: "February 14, 2024",
        coords: { x: 66, y: 28 },
        image: "/golden_snitch.jpg",
        story: "Watching the golden sun dip below the horizon while you leaned your head on my shoulder. In that peaceful silence, I realized I never wanted to watch another sunset without you.",
        secretWhisper: "I silently made a promise to the sky that I would protect your smile forever.",
        icon: "🌅",
      },
      {
        id: 4,
        title: "Our Safe Sanctuary",
        locationName: "The Starry Rooftop",
        date: "August 18, 2024",
        coords: { x: 82, y: 60 },
        image: "/hogwarts_castle.jpg",
        story: "Wrapped together in a cozy blanket under a canopy of stars. We talked about building our future home, our dreams, and road trips we have yet to take. You became my absolute safe place.",
        secretWhisper: "You make ordinary days feel like a dream I never have to wake up from.",
        icon: "🏡",
      },
      {
        id: 5,
        title: "The Destination of Forever",
        locationName: "The Proposal Pavilion of Stars",
        date: "Today & Forever",
        coords: { x: 92, y: 22 },
        image: "/patronus_romance.jpg",
        story: "All paths, all turns, every shared laugh and every gentle glance have brought us to this sacred moment. The map was leading here all along — to forever.",
        secretWhisper: "My heart has only ever belonged to you, Pookie.",
        icon: "💍",
      },
    ],
  },

  // ── 5. CHAPTER III: THE POLAROID SCRAPBOOK 📸 ───────────────────────────
  scrapbook: {
    badge: "Chapter III • The Polaroid Scrapbook",
    title: "Framed in My Heart Forever",
    subtitle: '"We take photos as a return ticket to moments otherwise gone."',
    photos: [
      {
        id: 1,
        title: "Uncontrollable Giggles 😂",
        date: "A Sunny Afternoon",
        imgUrl: "/patronus_romance.jpg",
        caption: "The day you laughed so hard that you couldn't even breathe, and then I started laughing just watching you laugh.",
        sticker: "🍃 Forever",
        rotation: "-rotate-2",
      },
      {
        id: 2,
        title: "Holding Hands in the Cold ❄️",
        date: "Winter Magic",
        imgUrl: "/hogwarts_castle.jpg",
        caption: "Shoving our joined hands right into my warm coat pocket because you forgot your gloves again.",
        sticker: "💖 My Safe Place",
        rotation: "rotate-3",
      },
      {
        id: 3,
        title: "The Golden Catch 🌟",
        date: "Golden Sunset",
        imgUrl: "/golden_snitch.jpg",
        caption: "Everyone looks for treasure in jewels or money. My whole entire universe is sitting right across the table from me.",
        sticker: "🥰 Cutie Pookie",
        rotation: "-rotate-1",
      },
      {
        id: 4,
        title: "Late Night Drive Talks 🎶",
        date: "2:00 AM Memories",
        imgUrl: "/patronus_romance.jpg",
        caption: "Windows rolled down, cold wind in our faces, singing terribly to old nostalgic songs and feeling infinitely alive.",
        sticker: "🚗 Our Song",
        rotation: "rotate-2",
      },
    ],
    stickyNoteText: "Every single photograph with you is my favourite picture in the world, Pookie.",
  },

  // ── 6. CHAPTER IV: CINEMA OF LOVE 🎬 ────────────────────────────────────
  cinema: {
    badge: "Chapter IV • Moments in Motion",
    title: "Our Private Cinema of Love",
    subtitle: '"Every second with you is a scene from the sweetest movie ever made."',
    clips: [
      {
        id: 1,
        title: "Our Sunset Stroll",
        duration: "0:24",
        subtitle: "Golden hour moments where everything felt like a dream...",
        poster: "/patronus_romance.jpg",
        videoUrl: "", // leave empty to use romantic dream canvas player or put '/video1.mp4'
      },
      {
        id: 2,
        title: "Laughing Together",
        duration: "0:35",
        subtitle: "When you laughed so hard your eyes crinkled with pure joy.",
        poster: "/hogwarts_castle.jpg",
        videoUrl: "",
      },
      {
        id: 3,
        title: "The Golden Catch",
        duration: "0:18",
        subtitle: "The luckiest catch in the entire universe was finding you.",
        poster: "/golden_snitch.jpg",
        videoUrl: "",
      },
    ],
  },

  // ── 7. CHAPTER V: 100 REASONS WHY IT'S YOU 🍃 ───────────────────────────
  reasonsWhy: {
    badge: "Chapter V • The Jar of 100 Reasons",
    title: "Why I Fall For You Every Day",
    subtitle: '"If I had a leaf for every reason I adore you, we would walk through our own private forest."',
    categories: ['All', 'Your Little Habits', 'The Way You Love Me', 'Our Secret World', 'Our Future Dreams'],
    reasons: [
      {
        id: 1,
        category: "Your Little Habits",
        emoji: "🥹",
        note: "The adorable way you scrunch your nose whenever you laugh uncontrollably at my silly jokes.",
      },
      {
        id: 2,
        category: "The Way You Love Me",
        emoji: "🧸",
        note: "How your head fits so perfectly in the crook of my neck when you hug me after a long day.",
      },
      {
        id: 3,
        category: "Our Secret World",
        emoji: "🍜",
        note: "The little happy dance you do the exact second our favorite food gets delivered.",
      },
      {
        id: 4,
        category: "The Way You Love Me",
        emoji: "✨",
        note: "Because with you, I never have to put on a mask. You love the real, goofy, clumsy me.",
      },
      {
        id: 5,
        category: "Your Little Habits",
        emoji: "☕",
        note: "Your warm, sleepy morning voice that makes me want to pause the clock and stay right there forever.",
      },
      {
        id: 6,
        category: "The Way You Love Me",
        emoji: "🛡️",
        note: "How you believe in me and lift my spirits even when the rest of the world feels heavy.",
      },
      {
        id: 7,
        category: "Our Secret World",
        emoji: "🚗",
        note: "Singing horribly off-key together during night drives and laughing until our cheeks hurt.",
      },
      {
        id: 8,
        category: "Our Future Dreams",
        emoji: "🌅",
        note: "Growing old together, drinking morning coffee on a balcony, and still giving you butterflies at 80.",
      },
      {
        id: 9,
        category: "The Way You Love Me",
        emoji: "🤝",
        note: "The gentle way you slip your hand into mine in crowded places, reminding me I am never alone.",
      },
      {
        id: 10,
        category: "Our Secret World",
        emoji: "💖",
        note: "Because out of all the beauty in this world, nothing shines brighter than your pure, golden heart.",
      },
    ],
  },

  // ── 8. CHAPTER VI: OUR SECRET WORLD & QUIRKS 🧸 ─────────────────────────
  secretWorld: {
    badge: "Chapter VI • Our Secret World",
    title: "The Things Only We Know",
    subtitle: '"We have our own language, our own jokes, and our own little universe."',
    quirks: [
      {
        id: 1,
        emoji: "🧸",
        title: "Our Secret Nicknames",
        description: "Calling each other 'Pookie' and 'Buggu' in private voices that no one else in the world will ever hear.",
        sweetRemark: "It makes my heart melt every single time you say it.",
      },
      {
        id: 2,
        emoji: "🍕",
        title: "The 2:00 AM Hunger Signals",
        description: "The telepathic look when one of us whispers 'Are you hungry too?' and five minutes later we're ordering snacks.",
        sweetRemark: "Food dates with you are 100x better than five-star restaurants.",
      },
      {
        id: 3,
        emoji: "🥺",
        title: "The Subtle Pout",
        description: "When you want attention or pretend to be mad, you do that cute little pout that instantly renders me helpless.",
        sweetRemark: "I surrender every single argument when you look at me like that.",
      },
      {
        id: 4,
        emoji: "🫂",
        title: "The Silent Hug Remedy",
        description: "When the day is tough, we don't even need words — just a tight 30-second hug where all problems vanish.",
        sweetRemark: "Your arms are the safest place in the entire world.",
      },
    ],
  },

  // ── 9. CHAPTER VII: FUTURE DREAMS & VISION 🏡 ───────────────────────────
  futureVision: {
    badge: "Chapter VII • The Future We Are Building",
    title: "Our Tomorrow Starts With You",
    subtitle: '"The best thing to hold onto in life is each other."',
    visions: [
      {
        id: 1,
        icon: "🏡",
        title: "Our Sunlit Green Sanctuary",
        timeframe: "The Near Future",
        story: "A cozy home filled with leafy potted plants, a warm kitchen with the aroma of morning coffee, and a big comfy couch where we binge-watch our favourite shows under one blanket.",
        sweetPromise: "I promise to water all your plants and bring you breakfast in bed on lazy Sundays.",
        badge: "Home Sweet Home",
      },
      {
        id: 2,
        icon: "✈️",
        title: "Traveling Across the World",
        timeframe: "Our Endless Adventures",
        story: "Walking hand-in-hand through lantern-lit alleys in Kyoto, sharing pasta in Rome, getting lost in cozy bookstores in London, and watching sunsets on tropical beaches.",
        sweetPromise: "Every stamp in our passport will be a story of how much deeper I fell for you.",
        badge: "Wanderlust With You",
      },
      {
        id: 3,
        icon: "🍳",
        title: "Dancing in the Kitchen",
        timeframe: "Every Weekend Ritual",
        story: "Music playing on the speaker, flour accidentally on your nose, spinning you around while pancakes sizzle on the stove, laughing until our coffee gets cold.",
        sweetPromise: "I promise life with me will always have silly dances and warm laughter.",
        badge: "Little Moments",
      },
      {
        id: 4,
        icon: "👵👴",
        title: "Growing Old & Wise Together",
        timeframe: "All Our Lifetimes",
        story: "Sitting on a porch swing with wrinkles around our eyes from smiling so much, still holding hands, looking back at a life filled with courage, deep love, and unforgettable memories.",
        sweetPromise: "Even with gray hair and shaking hands, you will still give me butterflies.",
        badge: "Till 99 & Beyond",
      },
    ],
  },

  // ── 10. CHAPTER VIII: HEARTBEAT & SENSES 💓 ─────────────────────────────
  senses: {
    badge: "Chapter VIII • Heartbeat & Senses",
    title: "The Symphony of Us",
    subtitle: '"Two souls with but a single thought, two hearts that beat as one."',
    sensesList: [
      {
        title: "Your Sweet Fragrance",
        icon: "🌸",
        desc: "The delicate scent you wear that lingers on my favorite hoodie long after our dates.",
        sweetDetail: "I catch myself smiling like an idiot whenever I smell it.",
      },
      {
        title: "The Sound of Your Voice",
        icon: "🎶",
        desc: "Your soft laugh, sleepy morning hums, and the way you enthusiastically tell stories.",
        sweetDetail: "It is the only soundtrack my heart ever wants on repeat.",
      },
      {
        title: "The Warmth of Your Touch",
        icon: "🧣",
        desc: "Holding your hand, gently playing with your hair, and pulling you into the warmest hug.",
        sweetDetail: "In your arms, every anxiety in the universe immediately evaporates.",
      },
      {
        title: "The Starlight in Your Eyes",
        icon: "✨",
        desc: "The way your eyes sparkle when you are excited or look at me with tender love.",
        sweetDetail: "I see my entire future reflected right there in your gaze.",
      },
    ],
  },

  // ── 11. CHAPTER IX: SACRED VOWS OF MY SOUL 📜 ───────────────────────────
  sacredVows: {
    badge: "Chapter IX • The Sacred Vows of My Soul",
    title: "My Unconditional Promises to You",
    subtitle: '"Before I ask for your forever, here is what I promise to give you with mine."',
    vowsList: [
      {
        id: 1,
        text: "I promise to listen to your heart.",
        subtext: "Even when you're rambling about the smallest detail of your day, your voice is my favourite sound.",
        icon: "👂",
      },
      {
        id: 2,
        text: "I promise to be your safe harbor in every storm.",
        subtext: "Whenever life gets heavy or noisy, my arms will always be your softest place to land.",
        icon: "⚓",
      },
      {
        id: 3,
        text: "I promise to bring you warmth, laughter, and snacks.",
        subtext: "To kiss your forehead goodnight, make you warm drinks, and make you giggle when you're stressed.",
        icon: "🍵",
      },
      {
        id: 4,
        text: "I promise to champion every single one of your dreams.",
        subtext: "I will be your loudest cheerleader in the front row of everything you set your mind to.",
        icon: "🌟",
      },
      {
        id: 5,
        text: "I promise to choose you every single day.",
        subtext: "Not just on the easy days, but especially on the hard ones. You are my only choice in every lifetime.",
        icon: "💍",
      },
    ],
  },

  // ── 12. CHAPTER X: THE FOREVER QUESTION 💍 ──────────────────────────────
  proposal: {
    badge: "Chapter X • The Sacred Question",
    quote: '"In a universe of billions, my heart will always bloom for you..."',
    question: "Will You Marry Me, Pookie? 💍",
    subQuestion: "Will you hold my hand through all of life's adventures, share morning coffees, and make me the happiest person in every lifetime?",
    yesButtonText: "YES! A MILLION TIMES YES! 💖",
    noButtonText: "Let me think... 😉",
    playfulExcuses: [
      "Cupid's leaf deflected that option! 🍃",
      "Error 404: 'No' not found in my heart! 😉",
      "Destiny has disabled this button! ✨",
      "My heart whispered: 'Pookie loves you too much!' 💖",
      "Button slipped! Try the sparkly YES instead! 💍",
      "The stars & trees strictly forbid this choice! 🌟",
      "No way, Pookie! You are stuck with me forever! 🥰",
    ],
    certificate: {
      header: "Botanical Sanctuary of Eternal Love • Certificate of Forever",
      title: "She Said Yes! 💖",
      heading: '"Our Forever Begins Right Now."',
      vowBody: "From this day forward, I promise to hold your hand through every season, to be your biggest cheerleader, to dance with you in the kitchen, and to love you more each passing dawn.",
      coupleSignOff: "Buggu & Pookie — Together for all our lifetimes.",
      statusText: "Status: Eternally Engaged",
      bondText: "Bond: Unbreakable",
    },
  },
};

export type ProposalData = typeof PROPOSAL_DATA;
export default PROPOSAL_DATA;
