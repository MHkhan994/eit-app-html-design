/* ── Buy (কিনুন) marketplace ──────────────────────────────────────────────────
   Catalog data + cart/order state for the seven pages under buy/.

   The catalog lives here rather than being written into each page's HTML so the
   grid, the detail page, the cart and the order screens all read one source. It
   is the only place in this project where JS computes a number: the client asked
   for a working cart, and a basket whose total never moves is unusable as a demo.
   That exemption is for cart arithmetic only — the agronomy calculators under
   accounting/ and production-cost/ stay static, per CLAUDE.md.
*/

var Shop = (function(){

  /* Emoji stand-ins until real product photography arrives, tinted gold → rust →
     moss down the list like every other card family in the app. */
  var PRODUCTS = [
    /* ── সরঞ্জাম / equipment ── */
    { id:'feeder-pan', name:'অটো ফিডার প্যান', group:'equipment', cat:'feeder',
      price:420, old:490, unit:'পিস', emoji:'🍽️', tint:'gold',
      brand:'Poultry Tech', rating:4.5, reviews:38, stock:120,
      desc:'ব্রয়লার ও লেয়ার উভয় শেডের জন্য উপযোগী অটোমেটিক ফিডার প্যান। ফিড ছড়িয়ে পড়া কমায়, ফলে অপচয় কমে এবং FCR ভালো থাকে।',
      specs:[['ধারণক্ষমতা','১.৫ কেজি'],['ব্যাস','৩৩ সেমি'],['উপাদান','ফুড-গ্রেড প্লাস্টিক'],['উপযোগী','১০০–১২০টি পাখি']],
      seller:{ name:'ETI এগ্রো সাপ্লাই', initials:'EA', tint:'moss', verified:true, loc:'সাভার, ঢাকা' } },

    { id:'chain-feeder', name:'চেইন ফিডার লাইন', group:'equipment', cat:'feeder',
      price:8500, old:9600, unit:'সেট', emoji:'🔗', tint:'rust',
      brand:'AgroLine', rating:4.3, reviews:12, stock:9,
      desc:'বড় শেডে সমান হারে ফিড বিতরণের জন্য চেইন ফিডার লাইন। মোটরসহ সম্পূর্ণ সেট, ১০০ ফুট পর্যন্ত বিস্তার করা যায়।',
      specs:[['দৈর্ঘ্য','১০০ ফুট'],['মোটর','০.৫ এইচপি'],['উপাদান','গ্যালভানাইজড স্টিল'],['ওয়ারেন্টি','১ বছর']],
      seller:{ name:'AgroLine বাংলাদেশ', initials:'AL', tint:'rust', verified:true, loc:'গাজীপুর' } },

    { id:'nipple-line', name:'নিপল ড্রিংকার লাইন ১০ ফুট', group:'equipment', cat:'drinker',
      price:1250, old:1400, unit:'সেট', emoji:'💧', tint:'moss',
      brand:'HydroFarm', rating:4.7, reviews:64, stock:48,
      desc:'লিক-প্রুফ নিপল ড্রিংকার লাইন। লিটার শুকনো রাখে, ফলে অ্যামোনিয়া ও পায়ের সমস্যা কমে।',
      specs:[['দৈর্ঘ্য','১০ ফুট'],['নিপল সংখ্যা','১২টি'],['প্রবাহ','৭০ মিলি/মিনিট'],['উপযোগী','১২০–১৪০টি পাখি']],
      seller:{ name:'ETI এগ্রো সাপ্লাই', initials:'EA', tint:'moss', verified:true, loc:'সাভার, ঢাকা' } },

    { id:'bell-drinker', name:'বেল ড্রিংকার', group:'equipment', cat:'drinker',
      price:340, old:0, unit:'পিস', emoji:'🪣', tint:'gold',
      brand:'Poultry Tech', rating:4.2, reviews:27, stock:200,
      desc:'ঝুলন্ত বেল ড্রিংকার, উচ্চতা সমন্বয়যোগ্য। বাচ্চা থেকে বড় পাখি — সব বয়সে ব্যবহার করা যায়।',
      specs:[['ধারণক্ষমতা','৪ লিটার'],['উপাদান','প্লাস্টিক'],['উপযোগী','৮০টি পাখি'],['রঙ','লাল']],
      seller:{ name:'নর্থ পোলট্রি স্টোর', initials:'NP', tint:'gold', verified:false, loc:'বগুড়া' } },

    { id:'gas-brooder', name:'গ্যাস ব্রুডার', group:'equipment', cat:'brooder',
      price:4200, old:4800, unit:'পিস', emoji:'🔥', tint:'rust',
      brand:'WarmNest', rating:4.6, reviews:41, stock:16,
      desc:'এলপি গ্যাস চালিত ইনফ্রারেড ব্রুডার। বাচ্চার প্রথম সপ্তাহে সমান তাপ দেয়, বিদ্যুৎ বিভ্রাটেও কাজ করে।',
      specs:[['তাপ ক্ষমতা','৪ কিলোওয়াট'],['কভারেজ','৭০০–১০০০ বাচ্চা'],['জ্বালানি','এলপি গ্যাস'],['ইগনিশন','পিজো']],
      seller:{ name:'WarmNest ট্রেডার্স', initials:'WN', tint:'rust', verified:true, loc:'নারায়ণগঞ্জ' } },

    { id:'heat-lamp', name:'ইনফ্রারেড হিট ল্যাম্প', group:'equipment', cat:'brooder',
      price:650, old:750, unit:'পিস', emoji:'💡', tint:'moss',
      brand:'WarmNest', rating:4.1, reviews:53, stock:85,
      desc:'২৫০ ওয়াট ইনফ্রারেড হিট ল্যাম্প, সিরামিক হোল্ডারসহ। ছোট ব্রুডিং রিং-এর জন্য সাশ্রয়ী সমাধান।',
      specs:[['ক্ষমতা','২৫০ ওয়াট'],['ভোল্টেজ','২২০ ভোল্ট'],['কভারেজ','১০০–১৫০ বাচ্চা'],['আয়ু','~৫০০০ ঘণ্টা']],
      seller:{ name:'নর্থ পোলট্রি স্টোর', initials:'NP', tint:'gold', verified:false, loc:'বগুড়া' } },

    { id:'mini-incubator', name:'মিনি ইনকিউবেটর ৫৬ ডিম', group:'equipment', cat:'incubator',
      price:9800, old:11500, unit:'পিস', emoji:'🥚', tint:'gold',
      brand:'HatchPro', rating:4.4, reviews:19, stock:7,
      desc:'সম্পূর্ণ অটোমেটিক মিনি ইনকিউবেটর — অটো টার্নিং, ডিজিটাল তাপ ও আর্দ্রতা নিয়ন্ত্রণ। ছোট খামার ও হ্যাচারি ট্রায়ালের জন্য।',
      specs:[['ধারণক্ষমতা','৫৬টি ডিম'],['টার্নিং','অটোমেটিক, ২ ঘণ্টা অন্তর'],['তাপ নিয়ন্ত্রণ','±০.১°সে'],['ওয়ারেন্টি','১ বছর']],
      seller:{ name:'HatchPro বিডি', initials:'HP', tint:'moss', verified:true, loc:'ঢাকা' } },

    { id:'setter-tray', name:'সেটার ট্রে (৩০ ডিম)', group:'equipment', cat:'incubator',
      price:180, old:0, unit:'পিস', emoji:'🧺', tint:'rust',
      brand:'HatchPro', rating:4.0, reviews:31, stock:240,
      desc:'ইনকিউবেটরের জন্য প্লাস্টিক সেটার ট্রে। ডিম স্থির রাখে, টার্নিং-এর সময় ভাঙার ঝুঁকি কমায়।',
      specs:[['ধারণক্ষমতা','৩০টি ডিম'],['উপাদান','পিপি প্লাস্টিক'],['মাপ','৩০×৩০ সেমি'],['ধোয়াযোগ্য','হ্যাঁ']],
      seller:{ name:'HatchPro বিডি', initials:'HP', tint:'moss', verified:true, loc:'ঢাকা' } },

    { id:'layer-cage', name:'লেয়ার খাঁচা (৩ তলা)', group:'equipment', cat:'cage',
      price:12500, old:14000, unit:'সেট', emoji:'🏗️', tint:'moss',
      brand:'AgroLine', rating:4.5, reviews:23, stock:5,
      desc:'তিন তলা ব্যাটারি কেজ, ৯০টি লেয়ার ধারণক্ষমতা। ডিম গড়িয়ে সামনে আসার ঢালু ফ্লোর ও ম্যানিওর ট্রেসহ।',
      specs:[['ধারণক্ষমতা','৯০টি লেয়ার'],['তলা','৩টি'],['উপাদান','গ্যালভানাইজড তার'],['মাপ','১৯৫×৭০×১৭০ সেমি']],
      seller:{ name:'AgroLine বাংলাদেশ', initials:'AL', tint:'rust', verified:true, loc:'গাজীপুর' } },

    { id:'brood-guard', name:'ব্রুডিং গার্ড রিং', group:'equipment', cat:'cage',
      price:900, old:1050, unit:'রোল', emoji:'🛡️', tint:'gold',
      brand:'Poultry Tech', rating:4.3, reviews:17, stock:60,
      desc:'বাচ্চাকে ব্রুডারের কাছাকাছি রাখতে গার্ড রিং। প্রথম ৭ দিনে ড্রাফট ঠেকায় ও পিলিং কমায়।',
      specs:[['দৈর্ঘ্য','১৫ ফুট'],['উচ্চতা','৪৫ সেমি'],['উপাদান','করোগেটেড প্লাস্টিক'],['পুনর্ব্যবহার','হ্যাঁ']],
      seller:{ name:'ETI এগ্রো সাপ্লাই', initials:'EA', tint:'moss', verified:true, loc:'সাভার, ঢাকা' } },

    { id:'egg-tray', name:'এগ ট্রে (প্লাস্টিক)', group:'equipment', cat:'tools',
      price:55, old:0, unit:'পিস', emoji:'🗃️', tint:'rust',
      brand:'—', rating:4.6, reviews:96, stock:1000,
      desc:'৩০ ডিমের প্লাস্টিক ট্রে, পরিবহন ও সংরক্ষণের জন্য। কাগজের ট্রের চেয়ে টেকসই ও ধোয়া যায়।',
      specs:[['ধারণক্ষমতা','৩০টি ডিম'],['উপাদান','পিপি প্লাস্টিক'],['স্ট্যাকেবল','হ্যাঁ'],['রঙ','ধূসর']],
      seller:{ name:'নর্থ পোলট্রি স্টোর', initials:'NP', tint:'gold', verified:false, loc:'বগুড়া' } },

    { id:'fogger-set', name:'ফগার নজল সেট', group:'equipment', cat:'tools',
      price:1150, old:1300, unit:'সেট', emoji:'🌫️', tint:'moss',
      brand:'HydroFarm', rating:4.2, reviews:22, stock:34,
      desc:'গরমে শেড ঠান্ডা রাখতে ফগিং নজল সেট। ১০টি নজল, টিউব ও কানেক্টরসহ সম্পূর্ণ কিট।',
      specs:[['নজল সংখ্যা','১০টি'],['প্রবাহ','৫ লিটার/ঘণ্টা'],['টিউব','২০ মিটার'],['চাপ','৪–৭ বার']],
      seller:{ name:'HydroFarm বিডি', initials:'HF', tint:'indigo', verified:true, loc:'ময়মনসিংহ' } },

    { id:'thermo-hygro', name:'ডিজিটাল থার্মো-হাইগ্রোমিটার', group:'equipment', cat:'tools',
      price:780, old:900, unit:'পিস', emoji:'🌡️', tint:'gold',
      brand:'AccuFarm', rating:4.8, reviews:74, stock:150,
      desc:'শেডের তাপমাত্রা ও আর্দ্রতা একসাথে দেখায়। সর্বোচ্চ/সর্বনিম্ন মেমোরিসহ, ব্রুডিং পিরিয়ডে অপরিহার্য।',
      specs:[['তাপমাত্রা রেঞ্জ','-১০ থেকে ৬০°সে'],['আর্দ্রতা রেঞ্জ','১০–৯৯%'],['নির্ভুলতা','±১°সে'],['ব্যাটারি','AAA ×১']],
      seller:{ name:'ETI এগ্রো সাপ্লাই', initials:'EA', tint:'moss', verified:true, loc:'সাভার, ঢাকা' } },

    { id:'spray-machine', name:'স্প্রে মেশিন ১৬ লিটার', group:'equipment', cat:'tools',
      price:2300, old:2650, unit:'পিস', emoji:'🧴', tint:'rust',
      brand:'BioGuard', rating:4.4, reviews:35, stock:28,
      desc:'ব্যাটারিচালিত ন্যাপস্যাক স্প্রেয়ার — জীবাণুনাশক ছিটানো ও শেড স্যানিটাইজেশনের জন্য। বায়োসিকিউরিটি রুটিনে ব্যবহার করুন।',
      specs:[['ধারণক্ষমতা','১৬ লিটার'],['ব্যাটারি','১২V ৮Ah'],['চলার সময়','৪–৫ ঘণ্টা'],['নজল','৪ ধরনের']],
      seller:{ name:'BioGuard এগ্রো', initials:'BG', tint:'rust', verified:true, loc:'চট্টগ্রাম' } },

    /* ── ফিড ও সাপ্লিমেন্ট / feed & supplement ── */
    { id:'broiler-starter', name:'ব্রয়লার স্টার্টার ফিড ৫০ কেজি', group:'feed', cat:'feed',
      price:2750, old:2900, unit:'বস্তা', emoji:'🌾', tint:'gold',
      brand:'Nourish Feed', rating:4.6, reviews:118, stock:400,
      desc:'০–১৪ দিন বয়সী ব্রয়লারের জন্য ক্রাম্বল স্টার্টার। উচ্চ প্রোটিন, দ্রুত প্রাথমিক বৃদ্ধি নিশ্চিত করে।',
      specs:[['প্রোটিন','২২%'],['এনার্জি','৩০৫০ কিলোক্যালরি/কেজি'],['ফর্ম','ক্রাম্বল'],['ওজন','৫০ কেজি']],
      seller:{ name:'Nourish ফিড মিলস', initials:'NF', tint:'gold', verified:true, loc:'কিশোরগঞ্জ' } },

    { id:'broiler-grower', name:'ব্রয়লার গ্রোয়ার ফিড ৫০ কেজি', group:'feed', cat:'feed',
      price:2690, old:0, unit:'বস্তা', emoji:'🌾', tint:'rust',
      brand:'Nourish Feed', rating:4.5, reviews:96, stock:380,
      desc:'১৫–২৮ দিন বয়সী ব্রয়লারের জন্য পেলেট গ্রোয়ার ফিড। ভালো FCR ও সমান ওজন বৃদ্ধির জন্য ব্যালান্সড।',
      specs:[['প্রোটিন','২০%'],['এনার্জি','৩১৫০ কিলোক্যালরি/কেজি'],['ফর্ম','পেলেট'],['ওজন','৫০ কেজি']],
      seller:{ name:'Nourish ফিড মিলস', initials:'NF', tint:'gold', verified:true, loc:'কিশোরগঞ্জ' } },

    { id:'layer-feed', name:'লেয়ার লেয়িং ফিড ৫০ কেজি', group:'feed', cat:'feed',
      price:2480, old:2600, unit:'বস্তা', emoji:'🌽', tint:'moss',
      brand:'Nourish Feed', rating:4.7, reviews:132, stock:520,
      desc:'উৎপাদনরত লেয়ারের জন্য মেশ ফিড। বাড়তি ক্যালসিয়াম শক্ত খোসা ও টানা ডিম উৎপাদন ধরে রাখে।',
      specs:[['প্রোটিন','১৭%'],['ক্যালসিয়াম','৩.৮%'],['ফর্ম','মেশ'],['ওজন','৫০ কেজি']],
      seller:{ name:'Nourish ফিড মিলস', initials:'NF', tint:'gold', verified:true, loc:'কিশোরগঞ্জ' } },

    { id:'soybean-meal', name:'সয়াবিন মিল ৫০ কেজি', group:'feed', cat:'feed',
      price:3400, old:0, unit:'বস্তা', emoji:'🫘', tint:'gold',
      brand:'—', rating:4.3, reviews:58, stock:190,
      desc:'নিজে ফিড ফর্মুলেশন করলে প্রধান প্রোটিন উৎস। ডাটা ব্যাংকের ফিড ফর্মুলেশন টুলে ইনগ্রেডিয়েন্ট হিসেবে ব্যবহার করুন।',
      specs:[['প্রোটিন','৪৬%'],['এনার্জি','২২৩০ কিলোক্যালরি/কেজি'],['আর্দ্রতা','১২% সর্বোচ্চ'],['ওজন','৫০ কেজি']],
      seller:{ name:'ডেল্টা ফিড ট্রেডার্স', initials:'DF', tint:'rust', verified:false, loc:'খুলনা' } },

    { id:'vitamin-premix', name:'ভিটামিন প্রিমিক্স ১ কেজি', group:'feed', cat:'supplement',
      price:620, old:700, unit:'প্যাক', emoji:'💊', tint:'rust',
      brand:'VitaPoultry', rating:4.5, reviews:81, stock:140,
      desc:'ভিটামিন A, D3, E, K ও B-কমপ্লেক্স সমৃদ্ধ প্রিমিক্স। ফিডে মিশিয়ে দিন — ধকল ও ঘাটতি দুই-ই কমে।',
      specs:[['মাত্রা','১ কেজি / টন ফিড'],['ফর্ম','পাউডার'],['প্যাক','১ কেজি'],['সংরক্ষণ','ঠান্ডা ও শুকনো']],
      seller:{ name:'VitaPoultry লিমিটেড', initials:'VP', tint:'indigo', verified:true, loc:'ঢাকা' } },

    { id:'calcium-d3', name:'ক্যালসিয়াম-D3 লিকুইড ১ লিটার', group:'feed', cat:'supplement',
      price:480, old:0, unit:'বোতল', emoji:'🧪', tint:'moss',
      brand:'VitaPoultry', rating:4.4, reviews:67, stock:210,
      desc:'লেয়ারের খোসার মান ও পায়ের দৃঢ়তার জন্য তরল ক্যালসিয়াম-D3। পানির সাথে মিশিয়ে দিন।',
      specs:[['মাত্রা','১ মিলি / লিটার পানি'],['ফর্ম','তরল'],['প্যাক','১ লিটার'],['কোর্স','৫–৭ দিন']],
      seller:{ name:'VitaPoultry লিমিটেড', initials:'VP', tint:'indigo', verified:true, loc:'ঢাকা' } },

    { id:'electrolyte', name:'ইলেক্ট্রোলাইট পাউডার ৫০০ গ্রাম', group:'feed', cat:'supplement',
      price:350, old:400, unit:'প্যাক', emoji:'⚡', tint:'gold',
      brand:'VitaPoultry', rating:4.6, reviews:104, stock:320,
      desc:'হিট স্ট্রেস, পরিবহন ও ভ্যাকসিনেশনের ধকল সামলাতে ইলেক্ট্রোলাইট। গরমের মাসে হাতের কাছে রাখুন।',
      specs:[['মাত্রা','১ গ্রাম / লিটার পানি'],['ফর্ম','পাউডার'],['প্যাক','৫০০ গ্রাম'],['ব্যবহার','ধকলের সময়']],
      seller:{ name:'VitaPoultry লিমিটেড', initials:'VP', tint:'indigo', verified:true, loc:'ঢাকা' } },

    { id:'probiotic', name:'প্রোবায়োটিক ১ কেজি', group:'feed', cat:'supplement',
      price:890, old:990, unit:'প্যাক', emoji:'🦠', tint:'rust',
      brand:'BioGuard', rating:4.7, reviews:49, stock:95,
      desc:'অন্ত্রের উপকারী ব্যাকটেরিয়া বাড়ায়, ফলে হজম ভালো হয় ও অ্যান্টিবায়োটিকের প্রয়োজন কমে।',
      specs:[['মাত্রা','৫০০ গ্রাম / টন ফিড'],['ফর্ম','পাউডার'],['প্যাক','১ কেজি'],['মেয়াদ','১৮ মাস']],
      seller:{ name:'BioGuard এগ্রো', initials:'BG', tint:'rust', verified:true, loc:'চট্টগ্রাম' } },

    /* ── বাচ্চা / day-old chicks ──
       Breeds are the ones this app already names elsewhere (Cobb 500 and Ross
       308 on the broiler standard-data screens, Hy-Line Brown on layer, Color
       SA51A on Sonali, Muscovy on duck) rather than new ones, and the prices
       track Home's market row: IR ৩৪৳ / Color ৬০৳ / Layer ৩০৳. Sold per bird
       with a minimum order, the way a hatchery actually books them. */
    { id:'chick-broiler-cobb', minQty:500, step:100, name:'ব্রয়লার ডে-ওল্ড বাচ্চা (Cobb 500)', group:'livestock', cat:'chick',
      price:34, old:38, unit:'বাচ্চা', emoji:'🐣', tint:'gold',
      brand:'Cobb 500', rating:4.6, reviews:212, stock:12000,
      desc:'হ্যাচারি থেকে সরাসরি সরবরাহ করা ব্রয়লার ডে-ওল্ড বাচ্চা। হ্যাচারিতেই Marek\'s ভ্যাকসিন দেওয়া থাকে। ন্যূনতম 500টি বাচ্চার অর্ডার নেওয়া হয়।',
      specs:[['জাত','Cobb 500'],['বয়স','১ দিন'],['গড় ওজন','৪০–৪৫ গ্রাম'],['ন্যূনতম অর্ডার','500 বাচ্চা']],
      seller:{ name:'ETI হ্যাচারি', initials:'EH', tint:'moss', verified:true, loc:'গাজীপুর' } },

    { id:'chick-broiler-ross', minQty:500, step:100, name:'ব্রয়লার ডে-ওল্ড বাচ্চা (Ross 308)', group:'livestock', cat:'chick',
      price:36, old:0, unit:'বাচ্চা', emoji:'🐣', tint:'rust',
      brand:'Ross 308', rating:4.5, reviews:167, stock:9000,
      desc:'Ross 308 লাইনের ডে-ওল্ড ব্রয়লার বাচ্চা। সমান ওজনের ব্যাচ, হ্যাচারিতে Marek\'s ভ্যাকসিন করা। ন্যূনতম 500টি বাচ্চার অর্ডার নেওয়া হয়।',
      specs:[['জাত','Ross 308'],['বয়স','১ দিন'],['গড় ওজন','৪০–৪৪ গ্রাম'],['ন্যূনতম অর্ডার','500 বাচ্চা']],
      seller:{ name:'ETI হ্যাচারি', initials:'EH', tint:'moss', verified:true, loc:'গাজীপুর' } },

    { id:'chick-sonali', minQty:300, step:100, name:'সোনালী / কালার ডে-ওল্ড বাচ্চা (SA51A)', group:'livestock', cat:'chick',
      price:60, old:66, unit:'বাচ্চা', emoji:'🐤', tint:'moss',
      brand:'Color SA51A', rating:4.7, reviews:189, stock:7500,
      desc:'সোনালী (কালার) ডে-ওল্ড বাচ্চা। দেশি বাজারে চাহিদা বেশি, রোগ প্রতিরোধ ক্ষমতা তুলনামূলক ভালো। ন্যূনতম 300টি বাচ্চার অর্ডার নেওয়া হয়।',
      specs:[['জাত','Color (SA51A)'],['বয়স','১ দিন'],['গড় ওজন','৩৪–৩৮ গ্রাম'],['ন্যূনতম অর্ডার','300 বাচ্চা']],
      seller:{ name:'ETI হ্যাচারি', initials:'EH', tint:'moss', verified:true, loc:'গাজীপুর' } },

    { id:'chick-layer', minQty:500, step:100, name:'লেয়ার ডে-ওল্ড বাচ্চা (Hy-Line Brown)', group:'livestock', cat:'chick',
      price:30, old:35, unit:'বাচ্চা', emoji:'🐥', tint:'gold',
      brand:'Hy-Line Brown', rating:4.6, reviews:143, stock:8200,
      desc:'Hy-Line Brown লেয়ার ডে-ওল্ড বাচ্চা, সেক্সড ফিমেল। হ্যাচারিতে Marek\'s ভ্যাকসিন করা। ন্যূনতম 500টি বাচ্চার অর্ডার নেওয়া হয়।',
      specs:[['জাত','Hy-Line Brown'],['বয়স','১ দিন'],['সেক্সিং','ফিমেল'],['ন্যূনতম অর্ডার','500 বাচ্চা']],
      seller:{ name:'ETI হ্যাচারি', initials:'EH', tint:'moss', verified:true, loc:'গাজীপুর' } },

    { id:'chick-duck', minQty:100, step:50, name:'হাঁসের বাচ্চা (Muscovy Duck)', group:'livestock', cat:'chick',
      price:55, old:0, unit:'বাচ্চা', emoji:'🦆', tint:'rust',
      brand:'Muscovy Duck', rating:4.3, reviews:58, stock:2400,
      desc:'Muscovy জাতের হাঁসের বাচ্চা। মাংস ও ডিম দুই উদ্দেশ্যেই পালন করা যায়। ন্যূনতম 100টি বাচ্চার অর্ডার নেওয়া হয়।',
      specs:[['জাত','Muscovy Duck'],['বয়স','১ দিন'],['গড় ওজন','৪৫–৫০ গ্রাম'],['ন্যূনতম অর্ডার','100 বাচ্চা']],
      seller:{ name:'ETI হ্যাচারি', initials:'EH', tint:'moss', verified:true, loc:'গাজীপুর' } },

    /* ── লেয়ার পুলেট / grown pullets ── priced per bird, vaccinated to age */
    { id:'pullet-layer-16', minQty:50, step:10, name:'লেয়ার পুলেট ১৬ সপ্তাহ (রেডি-টু-লে)', group:'livestock', cat:'pullet',
      price:420, old:465, unit:'পাখি', emoji:'🐔', tint:'moss',
      brand:'Hy-Line Brown', rating:4.7, reviews:74, stock:1800,
      desc:'১৬ সপ্তাহ বয়সী রেডি-টু-লে লেয়ার পুলেট — বয়স অনুযায়ী পূর্ণ ভ্যাকসিন সিডিউল সম্পন্ন। শেডে তুলেই ২–৩ সপ্তাহের মধ্যে উৎপাদন শুরু হয়।',
      specs:[['জাত','Hy-Line Brown'],['বয়স','১৬ সপ্তাহ'],['গড় ওজন','১.৩৫–১.৪৫ কেজি'],['ভ্যাকসিন','সিডিউল সম্পন্ন']],
      seller:{ name:'সবুজ পোলট্রি ফার্ম', initials:'SP', tint:'gold', verified:true, loc:'ময়মনসিংহ' } },

    { id:'pullet-layer-12', minQty:50, step:10, name:'লেয়ার পুলেট ১২ সপ্তাহ', group:'livestock', cat:'pullet',
      price:310, old:0, unit:'পাখি', emoji:'🐔', tint:'gold',
      brand:'Hy-Line Brown', rating:4.5, reviews:46, stock:2200,
      desc:'১২ সপ্তাহ বয়সী গ্রোয়িং পুলেট। নিজের শেডে বাকি রিয়ারিং করে নিলে রেডি-টু-লে কেনার চেয়ে খরচ কম পড়ে।',
      specs:[['জাত','Hy-Line Brown'],['বয়স','১২ সপ্তাহ'],['গড় ওজন','১.০৫–১.১৫ কেজি'],['ভ্যাকসিন','বয়স পর্যন্ত সম্পন্ন']],
      seller:{ name:'সবুজ পোলট্রি ফার্ম', initials:'SP', tint:'gold', verified:true, loc:'ময়মনসিংহ' } },

    { id:'pullet-sonali-8', minQty:50, step:10, name:'সোনালী পুলেট ৮ সপ্তাহ', group:'livestock', cat:'pullet',
      price:185, old:210, unit:'পাখি', emoji:'🐓', tint:'rust',
      brand:'Color SA51A', rating:4.4, reviews:39, stock:1500,
      desc:'৮ সপ্তাহ বয়সী সোনালী পুলেট। ব্রুডিং পর্ব শেষ, ফলে মর্টালিটির ঝুঁকি অনেক কম।',
      specs:[['জাত','Color (SA51A)'],['বয়স','৮ সপ্তাহ'],['গড় ওজন','৬৫০–৭৫০ গ্রাম'],['ভ্যাকসিন','বয়স পর্যন্ত সম্পন্ন']],
      seller:{ name:'সবুজ পোলট্রি ফার্ম', initials:'SP', tint:'gold', verified:true, loc:'ময়মনসিংহ' } },

    /* ── ভ্যাকসিন ──
       Only the vaccines this app's own Vaccination Schedule module already
       names (ND Live, ND Killed, IBD Live, IB Live, Marek's, Fowl Pox), with
       the routes it records where it records them. Every description defers
       the actual dosing to the vial insert — a mockup should not be the thing
       a farmer doses from. */
    { id:'vac-nd-live', name:'ND Live ভ্যাকসিন (রানীক্ষেত)', group:'vaccine', cat:'vaccine',
      price:180, old:210, unit:'ভায়াল', emoji:'💉', tint:'gold',
      brand:'BioVet', rating:4.7, reviews:126, stock:340,
      desc:'রানীক্ষেত (Newcastle) রোগ প্রতিরোধে লাইভ ভ্যাকসিন। সাধারণত চোখে ড্রপ হিসেবে দেওয়া হয়। প্রয়োগের আগে ভায়ালের নির্দেশিকা দেখে নিন।',
      specs:[['ডোজ','১০০০ ডোজ / ভায়াল'],['প্রয়োগ','চোখে ড্রপ'],['সংরক্ষণ','২–৮°সে'],['ধরন','লাইভ']],
      seller:{ name:'বায়োভেট ফার্মা', initials:'BV', tint:'indigo', verified:true, loc:'ঢাকা' } },

    { id:'vac-nd-killed', name:'ND Killed ভ্যাকসিন (রানীক্ষেত)', group:'vaccine', cat:'vaccine',
      price:650, old:0, unit:'ভায়াল', emoji:'💉', tint:'rust',
      brand:'BioVet', rating:4.6, reviews:71, stock:180,
      desc:'দীর্ঘমেয়াদি সুরক্ষার জন্য রানীক্ষেতের কিল্ড (ইনঅ্যাক্টিভেটেড) ভ্যাকসিন। ইনজেকশনের মাধ্যমে দেওয়া হয়। প্রয়োগের আগে ভায়ালের নির্দেশিকা দেখে নিন।',
      specs:[['ডোজ','৫০০ ডোজ / ভায়াল'],['প্রয়োগ','ইনজেকশন'],['সংরক্ষণ','২–৮°সে, জমাবেন না'],['ধরন','কিল্ড']],
      seller:{ name:'বায়োভেট ফার্মা', initials:'BV', tint:'indigo', verified:true, loc:'ঢাকা' } },

    { id:'vac-ibd-live', name:'IBD Live ভ্যাকসিন (গামবোরো)', group:'vaccine', cat:'vaccine',
      price:320, old:360, unit:'ভায়াল', emoji:'🧫', tint:'moss',
      brand:'BioVet', rating:4.6, reviews:98, stock:265,
      desc:'গামবোরো (Infectious Bursal Disease) প্রতিরোধে লাইভ ভ্যাকসিন। মেটারনাল অ্যান্টিবডি অনুযায়ী সঠিক দিনে দেওয়াটাই মূল বিষয়। প্রয়োগের আগে ভায়ালের নির্দেশিকা দেখে নিন।',
      specs:[['ডোজ','১০০০ ডোজ / ভায়াল'],['প্রয়োগ','খাবার পানি / চোখে ড্রপ'],['সংরক্ষণ','২–৮°সে'],['ধরন','লাইভ']],
      seller:{ name:'বায়োভেট ফার্মা', initials:'BV', tint:'indigo', verified:true, loc:'ঢাকা' } },

    { id:'vac-ib-live', name:'IB Live ভ্যাকসিন (ব্রংকাইটিস)', group:'vaccine', cat:'vaccine',
      price:260, old:0, unit:'ভায়াল', emoji:'💉', tint:'gold',
      brand:'BioVet', rating:4.5, reviews:64, stock:210,
      desc:'ইনফেকশাস ব্রংকাইটিস (IB) প্রতিরোধে লাইভ ভ্যাকসিন। সাধারণত চোখে ড্রপ হিসেবে দেওয়া হয়। প্রয়োগের আগে ভায়ালের নির্দেশিকা দেখে নিন।',
      specs:[['ডোজ','১০০০ ডোজ / ভায়াল'],['প্রয়োগ','চোখে ড্রপ'],['সংরক্ষণ','২–৮°সে'],['ধরন','লাইভ']],
      seller:{ name:'বায়োভেট ফার্মা', initials:'BV', tint:'indigo', verified:true, loc:'ঢাকা' } },

    { id:'vac-marek', name:"Marek's ভ্যাকসিন", group:'vaccine', cat:'vaccine',
      price:850, old:940, unit:'ভায়াল', emoji:'🧫', tint:'rust',
      brand:'BioVet', rating:4.8, reviews:52, stock:90,
      desc:'মারেক্স ডিজিজ প্রতিরোধে ভ্যাকসিন — হ্যাচারিতে একদিন বয়সে সাবকিউটেনিয়াস ইনজেকশনে দেওয়া হয়। প্রয়োগের আগে ভায়ালের নির্দেশিকা দেখে নিন।',
      specs:[['ডোজ','১০০০ ডোজ / ভায়াল'],['প্রয়োগ','SC ইনজেকশন'],['সংরক্ষণ','লিকুইড নাইট্রোজেন / ২–৮°সে'],['বয়স','১ দিন']],
      seller:{ name:'বায়োভেট ফার্মা', initials:'BV', tint:'indigo', verified:true, loc:'ঢাকা' } },

    { id:'vac-fowl-pox', name:'Fowl Pox ভ্যাকসিন (বসন্ত)', group:'vaccine', cat:'vaccine',
      price:240, old:275, unit:'ভায়াল', emoji:'💉', tint:'moss',
      brand:'BioVet', rating:4.4, reviews:43, stock:155,
      desc:'ফাউল পক্স (বসন্ত) প্রতিরোধে লাইভ ভ্যাকসিন। উইং ওয়েব পদ্ধতিতে দেওয়া হয়। প্রয়োগের আগে ভায়ালের নির্দেশিকা দেখে নিন।',
      specs:[['ডোজ','১০০০ ডোজ / ভায়াল'],['প্রয়োগ','উইং ওয়েব'],['সংরক্ষণ','২–৮°সে'],['ধরন','লাইভ']],
      seller:{ name:'বায়োভেট ফার্মা', initials:'BV', tint:'indigo', verified:true, loc:'ঢাকা' } }
  ];

  /* Live birds and consumables lead — those are the repeat purchases. Hardware
     is bought once a cycle, so it sits after them. */
  var CATEGORIES = [
    { key:'all',        label:'সব' },
    { key:'chick',      label:'বাচ্চা' },
    { key:'pullet',     label:'লেয়ার পুলেট' },
    { key:'feed',       label:'ফিড' },
    { key:'supplement', label:'সাপ্লিমেন্ট' },
    { key:'vaccine',    label:'ভ্যাকসিন' },
    { key:'feeder',     label:'ফিডার' },
    { key:'drinker',    label:'ড্রিংকার' },
    { key:'brooder',    label:'ব্রুডার' },
    { key:'incubator',  label:'ইনকিউবেটর' },
    { key:'cage',       label:'খাঁচা' },
    { key:'tools',      label:'যন্ত্রপাতি' }
  ];

  /* Delivery. Regular is waived once the basket clears the free-shipping floor. */
  var FREE_DELIVERY_OVER = 5000;
  var SHIPPING = {
    regular: { key:'regular', label:'রেগুলার ডেলিভারি', sub:'৩–৫ কর্মদিবস', fee:120, ico:'🚚' },
    express: { key:'express', label:'এক্সপ্রেস ডেলিভারি', sub:'১–২ কর্মদিবস', fee:250, ico:'⚡' }
  };

  var PAYMENTS = [
    { key:'cod',    label:'ক্যাশ অন ডেলিভারি', sub:'পণ্য হাতে পেয়ে টাকা দিন', ico:'💵' },
    { key:'bkash',  label:'বিকাশ',              sub:'০১৭XXXXXXXX',              ico:'📱' },
    { key:'nagad',  label:'নগদ',                sub:'০১৮XXXXXXXX',              ico:'📲' },
    { key:'rocket', label:'রকেট',               sub:'০১৯XXXXXXXXX',             ico:'🚀' },
    { key:'card',   label:'কার্ড',              sub:'ভিসা / মাস্টারকার্ড',       ico:'💳' }
  ];

  /* localStorage throws a SecurityError on file:// in Safari, so every read and
     write falls back to an in-memory map. Cart then works within a page but not
     across navigations — serve over http:// to see the real behaviour. */
  var memory = {};
  function readRaw(key){
    try { var v = window.localStorage.getItem(key); return v === null ? memory[key] : v; }
    catch(e){ return memory[key]; }
  }
  function writeRaw(key, value){
    memory[key] = value;
    try { window.localStorage.setItem(key, value); } catch(e){ /* memory-only */ }
  }
  function readJSON(key, fallback){
    var raw = readRaw(key);
    if(!raw) return fallback;
    try { return JSON.parse(raw); } catch(e){ return fallback; }
  }
  function writeJSON(key, value){ writeRaw(key, JSON.stringify(value)); }

  function byId(id){
    for(var i = 0; i < PRODUCTS.length; i++){ if(PRODUCTS[i].id === id) return PRODUCTS[i]; }
    return null;
  }

  /* ৳1,250 — ASCII digits with lakh-style grouping (1,25,000 not 125,000). */
  function money(n){
    var v = Math.round(Number(n) || 0);
    var sign = v < 0 ? '-' : '';
    var s = String(Math.abs(v));
    if(s.length > 3){
      var last3 = s.slice(-3), rest = s.slice(0, -3);
      s = rest.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + ',' + last3;
    }
    return sign + '৳' + s;
  }

  function qs(key){
    var m = new RegExp('[?&]' + key + '=([^&]*)').exec(window.location.search);
    return m ? decodeURIComponent(m[1].replace(/\+/g, ' ')) : '';
  }

  /* Dates stay in Bengali numerals (prices don't — the client asked for ASCII
     there so amounts stay quick to scan). */
  var BN_DIGITS = ['০','১','২','৩','৪','৫','৬','৭','৮','৯'];
  var BN_MONTHS = ['জানুয়ারি','ফেব্রুয়ারি','মার্চ','এপ্রিল','মে','জুন',
                   'জুলাই','আগস্ট','সেপ্টেম্বর','অক্টোবর','নভেম্বর','ডিসেম্বর'];
  function bnNum(n){
    return String(n).replace(/\d/g, function(d){ return BN_DIGITS[+d]; });
  }
  function dateLabel(d){
    d = d || new Date();
    return bnNum(String(d.getDate()).padStart(2, '0')) + ' ' +
           BN_MONTHS[d.getMonth()] + ' ' + bnNum(d.getFullYear());
  }
  /* "৭ আগস্ট ২০২৬" — n days from today, for delivery estimates. */
  function dateInDays(n){
    var d = new Date();
    d.setDate(d.getDate() + n);
    return dateLabel(d);
  }

  /* Filled stars floor the rating and the remainder is left hollow — there is no
     half-star glyph that renders reliably, and painting 4.6 as five solid stars
     would read as a perfect score. The numeric value sits beside it. */
  function stars(rating){
    var full = Math.floor(rating), out = '';
    for(var i = 0; i < 5; i++){ out += i < full ? '★' : '☆'; }
    return out;
  }

  /* Reuses the .toast markup pattern from community/index.html. */
  var toastTimer = null;
  function toast(msg, icon){
    var el = document.getElementById('toast');
    if(!el) return;
    el.innerHTML = '<span class="toast-icon">' + (icon || '✓') + '</span><span>' + msg + '</span>';
    el.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function(){ el.classList.remove('show'); }, 2200);
  }

  /* The badge counts distinct lines, not units — a 500-chick order would put
     "500" inside a 17px bubble. */
  function paintBadge(){
    var n = Cart.lineCount();
    document.querySelectorAll('.cart-count').forEach(function(el){
      el.textContent = n > 99 ? '99+' : n;
      el.style.display = n > 0 ? 'flex' : 'none';
    });
  }

  /* Emoji stand-in tile, used by every screen that shows a product thumbnail. */
  function thumb(p, cls){
    return '<div class="' + (cls || 'prod-thumb') + ' tint-' + p.tint + '">' + p.emoji + '</div>';
  }

  /* Live birds are booked by the batch, not one at a time — a chick line that
     says "ন্যূনতম ৫০০ বাচ্চা" has to be orderable at 500, stepping by 100.
     Hardware and consumables fall back to the plain 1-at-a-time default. */
  var MAX_QTY = 20000;
  function minQty(p){ return (p && p.minQty) || 1; }
  function stepQty(p){ return (p && p.step) || 1; }
  function clampQty(p, n){
    var lo = minQty(p);
    n = parseInt(n, 10) || lo;
    return Math.min(MAX_QTY, Math.max(lo, n));
  }

  return {
    PRODUCTS: PRODUCTS, CATEGORIES: CATEGORIES,
    SHIPPING: SHIPPING, PAYMENTS: PAYMENTS, FREE_DELIVERY_OVER: FREE_DELIVERY_OVER,
    byId: byId, money: money, qs: qs, stars: stars,
    bnNum: bnNum, dateLabel: dateLabel, dateInDays: dateInDays,
    toast: toast, paintBadge: paintBadge, thumb: thumb,
    minQty: minQty, stepQty: stepQty, clampQty: clampQty, MAX_QTY: MAX_QTY,
    readJSON: readJSON, writeJSON: writeJSON
  };
})();


/* ── Cart ─────────────────────────────────────────────────────────────────────
   Stored as [{id, qty}] under eti_cart. Lines whose product no longer exists in
   the catalog are dropped on read so a stale basket can't break a page. */
var Cart = (function(){
  var KEY = 'eti_cart';

  function read(){
    var raw = Shop.readJSON(KEY, []);
    if(!Array.isArray(raw)) return [];
    return raw.filter(function(l){ return l && Shop.byId(l.id) && l.qty > 0; })
              .map(function(l){ return { id:l.id, qty:Shop.clampQty(Shop.byId(l.id), l.qty) }; });
  }

  function write(items){ Shop.writeJSON(KEY, items); }

  function add(id, qty){
    var p = Shop.byId(id);
    if(!p) return;
    var n = Shop.clampQty(p, qty);
    var items = read(), found = false;
    for(var i = 0; i < items.length; i++){
      if(items[i].id === id){
        items[i].qty = Math.min(Shop.MAX_QTY, items[i].qty + n); found = true; break;
      }
    }
    if(!found) items.push({ id:id, qty:n });
    write(items);
  }

  /* Below the product's minimum there is no valid quantity, so the caller is
     told to drop the line rather than being silently snapped back up to it. */
  function setQty(id, qty){
    var p = Shop.byId(id);
    if(!p) return;
    if((parseInt(qty, 10) || 0) < Shop.minQty(p)) return remove(id);
    var items = read();
    for(var i = 0; i < items.length; i++){
      if(items[i].id === id){ items[i].qty = Shop.clampQty(p, qty); break; }
    }
    write(items);
  }

  function remove(id){
    write(read().filter(function(l){ return l.id !== id; }));
  }

  function count(){
    return read().reduce(function(sum, l){ return sum + l.qty; }, 0);
  }

  function lineCount(){ return read().length; }

  function subtotal(){
    return read().reduce(function(sum, l){
      var p = Shop.byId(l.id);
      return sum + (p ? p.price * l.qty : 0);
    }, 0);
  }

  /* Expanded lines — what every cart/checkout/order screen actually renders. */
  function lines(){
    return read().map(function(l){
      var p = Shop.byId(l.id);
      return { id:p.id, name:p.name, emoji:p.emoji, tint:p.tint, unit:p.unit,
               price:p.price, qty:l.qty, total:p.price * l.qty,
               minQty:Shop.minQty(p), step:Shop.stepQty(p) };
    });
  }

  function shippingFee(key, sub){
    var opt = Shop.SHIPPING[key] || Shop.SHIPPING.regular;
    if(opt.key === 'regular' && sub >= Shop.FREE_DELIVERY_OVER) return 0;
    return opt.fee;
  }

  function clear(){ write([]); }

  return { read:read, write:write, add:add, setQty:setQty, remove:remove,
           count:count, lineCount:lineCount, subtotal:subtotal, lines:lines,
           shippingFee:shippingFee, clear:clear };
})();


/* ── Orders ───────────────────────────────────────────────────────────────────
   Stored under eti_orders, newest first. seed() drops three example orders in on
   first visit so the My Orders screen is never blank — same rule the calculator
   result sections follow. */
var Orders = (function(){
  var KEY = 'eti_orders';

  var STAGES = ['অর্ডার প্লেসড', 'নিশ্চিত হয়েছে', 'প্যাকিং চলছে', 'পাঠানো হয়েছে', 'ডেলিভার্ড'];

  /* stage index -> which tab the order shows under, and its .tag-pill class */
  function statusOf(order){
    if(order.cancelled) return { label:'বাতিল', pill:'status-pending', tab:'cancelled' };
    if(order.stage >= 4) return { label:'ডেলিভার্ড', pill:'status-completed', tab:'done' };
    return { label:STAGES[order.stage], pill:'status-progress', tab:'active' };
  }

  function all(){
    var raw = Shop.readJSON(KEY, []);
    return Array.isArray(raw) ? raw : [];
  }

  function write(list){ Shop.writeJSON(KEY, list); }

  function byId(id){
    var list = all();
    for(var i = 0; i < list.length; i++){ if(list[i].id === id) return list[i]; }
    return null;
  }

  function newId(){
    return 'ORD-' + String(Date.now()).slice(-6);
  }

  function place(order){
    order.id = order.id || newId();
    order.stage = 0;
    order.cancelled = false;
    var list = all();
    list.unshift(order);
    write(list);
    return order.id;
  }

  function cancel(id){
    var list = all();
    for(var i = 0; i < list.length; i++){
      if(list[i].id === id){ list[i].cancelled = true; break; }
    }
    write(list);
  }

  var DEMO = [
    { id:'ORD-482170', date:'০৩ আগস্ট ২০২৬', stage:3, cancelled:false,
      items:[{ id:'nipple-line', name:'নিপল ড্রিংকার লাইন ১০ ফুট', emoji:'💧', tint:'moss', unit:'সেট', price:1250, qty:2, total:2500 },
             { id:'thermo-hygro', name:'ডিজিটাল থার্মো-হাইগ্রোমিটার', emoji:'🌡️', tint:'gold', unit:'পিস', price:780, qty:1, total:780 }],
      subtotal:3280, shipping:'regular', shippingFee:120, total:3400,
      payment:'bkash', address:{ name:'মোঃ রফিকুল ইসলাম', phone:'০১৭১২ ৩৪৫৬৭৮',
        district:'ঢাকা', upazila:'সাভার', detail:'ব্লক-বি, রোড-৭, বাড়ি-১২, হেমায়েতপুর' } },

    { id:'ORD-479035', date:'২৮ জুলাই ২০২৬', stage:4, cancelled:false,
      items:[{ id:'broiler-starter', name:'ব্রয়লার স্টার্টার ফিড ৫০ কেজি', emoji:'🌾', tint:'gold', unit:'বস্তা', price:2750, qty:4, total:11000 }],
      subtotal:11000, shipping:'regular', shippingFee:0, total:11000,
      payment:'cod', address:{ name:'মোঃ রফিকুল ইসলাম', phone:'০১৭১২ ৩৪৫৬৭৮',
        district:'ঢাকা', upazila:'সাভার', detail:'ব্লক-বি, রোড-৭, বাড়ি-১২, হেমায়েতপুর' } },

    { id:'ORD-471884', date:'১৯ জুলাই ২০২৬', stage:1, cancelled:true,
      items:[{ id:'gas-brooder', name:'গ্যাস ব্রুডার', emoji:'🔥', tint:'rust', unit:'পিস', price:4200, qty:1, total:4200 }],
      subtotal:4200, shipping:'express', shippingFee:250, total:4450,
      payment:'nagad', address:{ name:'মোঃ রফিকুল ইসলাম', phone:'০১৭১২ ৩৪৫৬৭৮',
        district:'ঢাকা', upazila:'সাভার', detail:'ব্লক-বি, রোড-৭, বাড়ি-১২, হেমায়েতপুর' } }
  ];

  function seed(){
    if(Shop.readJSON(KEY, null) === null) write(DEMO.slice());
  }

  return { STAGES:STAGES, all:all, byId:byId, place:place, cancel:cancel,
           statusOf:statusOf, seed:seed, newId:newId };
})();


/* The one saved address every checkout/order screen shows. Displayed data, so it
   carries realistic values; the "add new address" form's inputs stay empty. */
var SAVED_ADDRESS = {
  name:'মোঃ রফিকুল ইসলাম', phone:'০১৭১২ ৩৪৫৬৭৮',
  district:'ঢাকা', upazila:'সাভার', detail:'ব্লক-বি, রোড-৭, বাড়ি-১২, হেমায়েতপুর'
};

function addressLine(a){
  return a.detail + ', ' + a.upazila + ', ' + a.district;
}

function paymentLabel(key){
  for(var i = 0; i < Shop.PAYMENTS.length; i++){
    if(Shop.PAYMENTS[i].key === key) return Shop.PAYMENTS[i].label;
  }
  return key;
}
