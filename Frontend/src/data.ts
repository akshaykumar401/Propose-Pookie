// Journy and our best Memories
import moment1 from './assets/moments/1.mp4';
import moment2 from './assets/moments/2.mp4';
import moment3 from './assets/moments/3.mp4';
import moment4 from './assets/moments/4.mp4';
import moment5 from './assets/moments/5.mp4';
import moment6 from './assets/moments/6.mp4';
import moment7 from './assets/moments/7.mp4';
import moment8 from './assets/moments/8.mp4';
import moment9 from './assets/moments/9.mp4';
import moment10 from './assets/moments/10.mp4';

// Chapter 3: Polaroid Scrapbook Photos (10 Photos)
import photo1 from './assets/best galery/1.png';
import photo2 from './assets/best galery/2.png';
import photo3 from './assets/best galery/3.png';
import photo4 from './assets/best galery/4.png';
import photo5 from './assets/best galery/5.png';
import photo6 from './assets/best galery/6.png';
import photo7 from './assets/best galery/7.png';
import photo8 from './assets/best galery/8.png';
import photo9 from './assets/best galery/9.png';
import photo10 from './assets/best galery/10.png';

// Chapter 5: Scratch Card Divine Life Partner Photo
import wifePhoto from './assets/scratch/wife.png';

// Chapter 5: Pookie's Cute Voice Album (Ayushi)
import audioAngery from './assets/Best Audio/Angery.mp3';
import audioBlaBla from './assets/Best Audio/Bla Bla.mp3';
import audioCutestMorning from './assets/Best Audio/Cutest Morning.mp3';
import audioGandu from './assets/Best Audio/Gandu.mp3';
import audioHawasi from './assets/Best Audio/Hawasi.mp3';
import audioHiiiAkshay from './assets/Best Audio/Hiii Akshay.mp3';
import audioILoveYou from './assets/Best Audio/I love You.mp3';
import audioIDK from './assets/Best Audio/IDK.mp3';
import audioNaughty from './assets/Best Audio/Naughty.mp3';
import audioOnlyMine from './assets/Best Audio/Only Mine.mp3';
import audioSona from './assets/Best Audio/Sona.mp3';

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

  // ── 4. CHAPTERS II - VI: PRIVATE MEMORY VAULT PROTECTION 🔒 ─────────────
  vaultProtection: {
    passcode: "16052005", // 8-digit password to unlock Chapters 2-6
    title: "Protected Memory Vault",
    subtitle: "Chapters II to VI contain our private journey, photos, videos, voice album & divine life partner reveal.",
    warning: "⚠️ Warning: Protected for Pookie Only!",
    prompt: "Enter the 8-digit secret key to unlock our private memories (Chapters II – VI), or skip directly to Chapter VII:",
    skipButtonText: "Skip to Chapter VII (100 Reasons) 🍃",
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
        locationName: "Girls' Hostel Water Tank • SBU Ranchi",
        date: "April 03, 2026",
        coords: { x: 30, y: 24 },
        image: moment1,
        story: "We sat together and talked openly about Buggu's weaknesses. In that moment, you made me realize that you truly are my entire world 🌎, and that you care for me with the same unconditional love as my mom and dad.",
        secretWhisper: "Malum hai, us din mujhe aapke andar meri Nani, Mummy aur Papa jaisa pyara aur caring nature dikha tha. Aapne bina kisi shart ke sab kuch future par chhod diya aur bola ki agar kuch bhi problem hui na, toh hum dono milkar sath mein fix karenge 🥰.",
        icon: "☕",
      },
      {
        id: 1,
        title: "Sending a Surprise Love Letter 💌",
        locationName: "My Home",
        date: "April 27, 2026",
        coords: { x: 16, y: 38 },
        image: moment2,
        story: "I sent a surprise love letter to my sweetest Pookie 😘 via Gmail—taking my very first nervous yet magical step into your heart.",
        secretWhisper: "27 April 2026 ko mujhe aapki email ID mili thi jab Dean Sir ne sabko IEEE format mein research paper banane diya tha. Tab maine socha ki direct toh bol nahi paunga, isliye email ka sahara leta hoon! Darr lag raha tha ki pata nahi aap dekhogi ya nahi... par jab aapne dekha aur padha, toh dil garden-garden ho gaya tha ❤️.",
        icon: "🌙",
      },
      {
        id: 2,
        title: "Birthday Celebration 🎂",
        locationName: "G.D. Birla Auditorium • SBU Ranchi",
        date: "December 24, 2023",
        coords: { x: 15, y: 62 },
        image: moment3,
        story: "All our friends gathered together with so much joy to celebrate the birthday of my sweetest baby 🐥🍼 at G.D. Birla Auditorium.",
        secretWhisper: "Aap janti ho, jo gift maine diya tha, wo bohot saare gifts ko dekh-dekh kar badi mushkil se alag karke liya tha. Isliye aapke birthday par aane mein thoda late ho gaya tha. Aur cake bhi har jagah dhoonda par mila nahi, aur queen 👑 crown bhi nahi mil paya tha... uske liye really sorry 😟, par mere dil ki queen toh hamesha aap hi ho.",
        icon: "🌧️",
      },
      {
        id: 3,
        title: "Our First Rain Kiss 😘",
        locationName: "Pathway between Girls' Hostel & Campus Building",
        date: "August 24, 2026",
        coords: { x: 28, y: 79 },
        image: moment4,
        story: "I kissed my little heartbeat 💕 for the very first time in the pouring rain ☔ along the quiet pathway between the girls' hostel and the campus building 🏢.",
        secretWhisper: "Aap soch bhi nahi sakti meri jaanu, us din main kitna excited ho gaya tha! Ghar aane ke baad mere dimag 🧠 mein bas wahi kiss chal raha tha non-stop 🥰. Pure din wahi khayal tha, aur raat ko mere dreams mein bhi bas aap hi aayi thi!",
        icon: "🚗",
      },
      {
        id: 4,
        title: "Surprise Kiss from Pookie 💋",
        locationName: "College Mess • Die Mensa, SBU Ranchi",
        date: "September 01, 2026",
        coords: { x: 50, y: 91 },
        image: moment5,
        story: "We were just sitting and studying in the mess when suddenly, my sweet wife 😘 leaned in and kissed me. I completely melted on the spot 🫠 and we totally forgot all about studying.",
        secretWhisper: "Is din aapne mujhe pehli baar surprise kiss kiya tha! Main toh poora hairaan aur melt ho gaya tha 🫠 meri pyari wife ne mujhe back-to-back kiss kiya 😘! Main bas aapko hi dekhta reh gaya jaise koi khwaab dekh raha hoon. Aur us din achanak neend mein bol diya tha 😆 hahahaha! kuch kuch bhaiya bola tha",
        icon: "🌅",
      },
      {
        id: 5,
        title: "Gifts & Handmade Love from Pookie 🐥🎁",
        locationName: "College Mess • Die Mensa, SBU Ranchi",
        date: "September 02, 2026",
        coords: { x: 72, y: 79 },
        image: moment6,
        story: "My cute baby 🥰 made an adorable handmade floral card 🌹 and gifted me a teddy bear, a bag ring 💍, a couple's hand chain, and a Shinchan toy. It was truly the best day of my life 😇😇.",
        secretWhisper: "Malum hai, jo teddy aapne diya tha, uska naam maine 'Muffin' 🧁 rakha hai! Aur ab toh aisa lagta hai ki usne aapki jagah le li hai—daily raat ko wo aapki jagah mujhe hug karke soti hai 🥰.",
        icon: "🍝",
      },
      {
        id: 6,
        title: "Handmade Spicy Cheese Maggi 🧀🍜",
        locationName: "College Mess • Die Mensa, SBU Ranchi",
        date: "September 03, 2026",
        coords: { x: 85, y: 62 },
        image: moment7,
        story: "Haiyyyy, that cheese Maggi 🧀 was so delicious 🤤! The first time was super spicy 🥵, but the second time... ufff, it was absolute heavenly perfection 🤤🤤.",
        secretWhisper: "Sorry baby ji 🐥🍼! Sach bataoon toh pehli baar jab aapne Maggi banayi thi, toh taste wise duniya ki best Maggi thi, par itni spicy 🥵 thi ki main zyaada kha nahi pa raha tha. Lekin second time... uffff! Itna tasty aur kam spicy tha ki agar aapki friend nahi aati na, toh main unki lunch bhi chat kar jata 🤤❤️!",
        icon: "🌊",
      },
      {
        id: 7,
        title: "Scooty Ride with My Cutie 🥰🛵",
        locationName: "Ring Road near SBU Ranchi",
        date: "September 12, 2026",
        coords: { x: 84, y: 38 },
        image: moment8,
        story: "Baby ji 🐥🍼, that was my very first time riding a scooty with a girl—and sharing our very first romantic lip kiss 👄.",
        secretWhisper: "Ufff baby ji 🐥🍼, aapko pata hai wo meri life ki pehli scooty ride thi kisi ladki ke sath, aur wo ladki meri pyari wife hai! Maine kitna kuch plan kiya tha—Lotus 🪷 lana tha par late ho gaya, toh white grass dena pada... uske liye sorry 😟. Par wo lip kiss 👄 haiyyyy! Wo meri life ka sabse khoobsurat moment tha—meri wife mujhe peeche se tight hug karke baithi thi aur main scooty chala raha tha 🥰. I miss that moment so much 🥹❤️.",
        icon: "🏡",
      },
      {
        id: 8,
        title: "Cute Anger in the Mess 😤🥰",
        locationName: "College Mess • Die Mensa, SBU Ranchi",
        date: "September 21, 2026",
        coords: { x: 70, y: 24 },
        image: moment9,
        story: "Oofff, what an unforgettable day! My baby got angry at someone in the mess, and I just kept staring in awe at my wife because she looked so adorably fierce and cute 🥰.",
        secretWhisper: "Oofff baby ji 🐥🍼! Us din jab aap Die Mensa mein gusse mein kisi ko daant aur gaali de rahi thi na, sach bataoon toh aap itni zyada cute lag rahi thi! Agar hum college ke bahar hote, toh main pakka aapko kiss karke chup kara deta 😘. Sach mein, gusse mein bhi aap duniya ki sabse pyaari lagti ho!",
        icon: "✨",
      },
      {
        id: 9,
        title: "Rose & Sweet Surprises 🌹🍬",
        locationName: "College Mess • Die Mensa, SBU Ranchi",
        date: "October 06, 2026",
        coords: { x: 50, y: 46 },
        image: moment10,
        story: "Oh my sweet baby ji 🐥🍼, you surprised me completely that day! You told me you had a surprise after the exam, and during the entire paper I was daydreaming about what it could be 🫢. Our journey was leading here all along!",
        secretWhisper: "Finally aapne ise padh hi liya! Maine ise aakhri stop par isliye rakha taaki aap bilkul miss na karo. Us din poore exam mein main bas yahi soch raha tha ki aakhir surprise kya hoga 🤔. Exam ke baad jab hum Die Mensa gaye aur aapne mujhe rose 🌹 diya—wo mera second rose tha (first wale ki date bhool gaya, sorry!). Wo cookies bohot yummy 🤤 the, aur chocolate toh ek maine Pathak ke birthday par hi kha liya tha... control hi nahi hua tha 🥰!",
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
        title: "First Photo🏞️",
        date: "Fairwell Party 2026 • SBU Ranchi",
        imgUrl: photo1,
        caption: "Ye meri life ka pehla photo hai jisme mai aapko pakad ke khada hu, pookie!",
        sticker: "🫣😳 Getting shy",
        rotation: "-rotate-2",
      },
      {
        id: 2,
        title: "Happy Birthday to My Sweet Baby 🐥",
        date: "Birthday Surprises 2026",
        imgUrl: photo2,
        caption: "Aap janti nahi pookie, wo din kitna khoobsurat tha! but mai fuddu nikal gya aur aapka uthaya hi nahi 😟😟",
        sticker: "🎉🎂 Happy Birthday My Pookie 🐥",
        rotation: "rotate-2",
      },
      {
        id: 3,
        title: "My Cute Pookie 🐥",
        date: "A Random Day cute Photo 📸",
        imgUrl: photo3,
        caption: "Ye waqt lagta hai pura duniya ki sabse khoobsurat cheez ho aap! 🐥",
        sticker: "🥰 Cutie Pookie",
        rotation: "-rotate-1",
      },
      {
        id: 4,
        title: "Cute Pookie 🐥",
        date: "A Random Day cute Photo 📸",
        imgUrl: photo4,
        caption: "Ye photo dekh ke mujhe lagta hai ki aap mujhe dekh ke muskurahoe ho! 🐥",
        sticker: "🐥 Sweet Baby",
        rotation: "rotate-3",
      },
      {
        id: 5,
        title: "Cute Angel 👼",
        date: "Date not known 😟",
        imgUrl: photo5,
        caption: "Ufff pookie! aap kitni cute lag rhi ho is photo me 👼🐥",
        sticker: "☔ Pure Love",
        rotation: "-rotate-3",
      },
      {
        id: 6,
        title: "Random Sexy Photo 📸",
        date: "A Random Day Photo 📸",
        imgUrl: photo6,
        caption: "Ufff pookie! aapko yaad hai is photo mai dakha tha to kiya bola tha🫢",
        sticker: "😘 Hotty Pookie",
        rotation: "rotate-1",
      },
      {
        id: 7,
        title: "Video Call Romance 📞💕",
        date: "Video Call ",
        imgUrl: photo7,
        caption: "Ufffff pookie! aapko yaad hai is video call aaisa kiya tha or mai screen Shoot ka jagah photo manga tha 🤭 dakho kitna cute lag rahi ho 🐥🍼",
        sticker: "🛵 Free & In Love",
        rotation: "-rotate-2",
      },
      {
        id: 8,
        title: "Baby Cute hair cut 🐥",
        date: "Cute hair cut baby 🐥",
        imgUrl: photo8,
        caption: "Ufff pookie! aap kitni cute lag rhi ho is photo me 🐥. maan toh kar rha hai isko kiss kar lu 🫣🫣",
        sticker: "🫣😳 cute baby🐥",
        rotation: "rotate-2",
      },
      {
        id: 9,
        title: "First Date🌼",
        date: "Our First date 🐥 outfit",
        imgUrl: photo9,
        caption: "Ufff pookie! aapko yaad hai is outfit mai aap kitni cute or sexy lag rhi ho 🐥🐥.🫣 or ye pose kitna hot lag rha hai 🤭🤫",
        sticker: "🌷 My Queen",
        rotation: "-rotate-1",
      },
      {
        id: 10,
        title: "Chatori Malikin ji🐥",
        date: "Malikin ji 🐥 Birthday",
        imgUrl: photo10,
        caption: "Meri malkin ji. Jo thodi chatori hai or thori masoom hai. 🐥🐥 and the main USP is Care and Cute hai meri malkin ji",
        sticker: "Meri Malkin ji",
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
        videoUrl: moment1,
      },
      {
        id: 2,
        title: "Laughing Together",
        duration: "0:35",
        subtitle: "When you laughed so hard your eyes crinkled with pure joy.",
        poster: "/hogwarts_castle.jpg",
        videoUrl: moment2,
      },
      {
        id: 3,
        title: "The Golden Catch",
        duration: "0:18",
        subtitle: "The luckiest catch in the entire universe was finding you.",
        poster: "/golden_snitch.jpg",
        videoUrl: moment1,
      },
    ],
  },

  // ── 7. CHAPTER V: POOKIE'S CUTE VOICE ALBUM 🎙️ ──────────────────────────
  voiceAlbum: {
    badge: "Chapter V • Melody of Her Heart 🎙️",
    title: "Pookie's Sweet Voice Album 🌸",
    subtitle: '"Her voice is my favorite song, my calmest lullaby, and my eternal sanctuary."',
    author: "Ayushi",
    authorSubtitle: "The Voice That Owns My Entire Heart ❤️",
    coverPhoto: photo9,
    vinylTitle: "POOKIE SWEET MELODIES • VOL 1",
    tracks: [
      {
        id: 1,
        title: "Hiii Akshay 🥰",
        tag: "Sweet Greeting",
        subtitle: "The sweetest greeting that instantly melts my heart every single time",
        src: audioHiiiAkshay,
        icon: "🥰",
        duration: "0:07",
      },
      {
        id: 2,
        title: "I Love You So Much ❤️",
        tag: "Pure Romance",
        subtitle: "Three magical words spoken in her softest, sweetest tone",
        src: audioILoveYou,
        icon: "❤️",
        duration: "0:10",
      },
      {
        id: 3,
        title: "Cutest Morning ☀️",
        tag: "Morning Whisper",
        subtitle: "Waking up to this sweet sleepy whisper is pure heaven on earth",
        src: audioCutestMorning,
        icon: "☀️",
        duration: "0:06",
      },
      {
        id: 4,
        title: "Only Mine 🔒",
        tag: "Possessive Cutie",
        subtitle: "Her possessive, adorable claim on her Buggu for all lifetimes",
        src: audioOnlyMine,
        icon: "🔒",
        duration: "0:06",
      },
      {
        id: 5,
        title: "Sona Re Sona 🌙",
        tag: "Sweet Lullaby",
        subtitle: "Her gentle voice calling me Sona that soothes every worry away",
        src: audioSona,
        icon: "🌙",
        duration: "0:11",
      },
      {
        id: 6,
        title: "Cute Angery Pookie 😤",
        tag: "Adorable Rage",
        subtitle: "Anger has never looked or sounded this unimaginably adorable",
        src: audioAngery,
        icon: "😤",
        duration: "0:07",
      },
      {
        id: 7,
        title: "Naughty Cutie Pookie 😈",
        tag: "Playful Tease",
        subtitle: "Her mischievous laugh and playful tone that makes me blush",
        src: audioNaughty,
        icon: "😈",
        duration: "0:05",
      },
      {
        id: 8,
        title: "Hawasi Baby Vibes 🫣",
        tag: "Cheeky Romance",
        subtitle: "Our secret cheeky jokes, blushing moments and playful flirting",
        src: audioHawasi,
        icon: "🫣",
        duration: "0:11",
      },
      {
        id: 9,
        title: "Pyaar Se Gandu 🤭",
        tag: "Signature Scold",
        subtitle: "Her signature affectionate scolding that only Buggu gets to hear",
        src: audioGandu,
        icon: "🤭",
        duration: "0:08",
      },
      {
        id: 10,
        title: "Bla Bla Pookie Talks 🗣️",
        tag: "Sweet Chatter",
        subtitle: "I could listen to her non-stop sweet chatter and stories for hours",
        src: audioBlaBla,
        icon: "🗣️",
        duration: "0:05",
      },
      {
        id: 11,
        title: "Pookie's IDK 🤷‍♀️",
        tag: "Confused Cutie",
        subtitle: "Her signature 'I don't know' tone packed with infinite cuteness",
        src: audioIDK,
        icon: "🤷‍♀️",
        duration: "0:20",
      },
    ],
  },

  // ── 8. CHAPTER VI: THE DIVINE SCRATCH CARD 🪄 ────────────────────────────
  scratchCard: {
    badge: "Chapter VI • Divine Revelation",
    question: "Do you want to see my life partner that God has made?",
    subtitle: '"Out of eight billion souls, God crafted the most pure, caring, and gorgeous angel specifically for me."',
    image: wifePhoto,
    coverHeadline: "🪄 Scratch To Reveal",
    coverSubtext: "Swipe or scratch gently across the foil to unveil my world...",
    revealedTitle: "Meet My Forever Life Partner 🐥🍼❤️",
    revealedSubtitle: "Rab Ne Bana Di Jodi — My Sweetest Pookie!",
    revealedLoveNote: "Ye wahi chehra hai jise dekh kar mera har din khil uthta hai. Har janam mein bas aap hi chahiye meri pyari wife! You are God's most precious and sweetest masterpiece in my life 🥰💍",
    stickers: ["💍 God's Masterpiece", "👑 Meri Malkin Ji", "🐥 Cutest Baby", "❤️ Forever Yours"],
  },

  // ── 9. CHAPTER VII: 100 REASONS WHY IT'S YOU 🍃 ───────────────────────────
  reasonsWhy: {
    badge: "Chapter VII • The Jar of 100 Reasons",
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

  // ── 10. CHAPTER VIII: OUR SECRET WORLD & QUIRKS 🧸 ────────────────────────
  secretWorld: {
    badge: "Chapter VIII • Our Secret World",
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

  // ── 11. CHAPTER IX: FUTURE DREAMS & VISION 🏡 ─────────────────────────
  futureVision: {
    badge: "Chapter IX • The Future We Are Building",
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

  // ── 12. CHAPTER X: HEARTBEAT & SENSES 💓 ──────────────────────────────
  senses: {
    badge: "Chapter X • Heartbeat & Senses",
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

  // ── 13. CHAPTER XI: SACRED VOWS OF MY SOUL 📜 ────────────────────────────
  sacredVows: {
    badge: "Chapter XI • The Sacred Vows of My Soul",
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

  // ── 14. CHAPTER XII: THE FOREVER QUESTION 💍 ─────────────────────────────
  proposal: {
    badge: "Chapter XII • The Sacred Question",
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
