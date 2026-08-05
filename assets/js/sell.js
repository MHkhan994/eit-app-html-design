/* ── Listings (বেচুন) ─────────────────────────────────────────────────────────
   Seller submissions, stored as an array under eti_listings. Deliberately the
   same shape as Orders in shop.js — a record, a stage index, a status pill and
   a track rail — because the seller side is the mirror image of the buy side:
   you hand something over and then watch it move through stages.

   Depends on shop.js for readJSON/writeJSON/bnNum/dateLabel, so load that first.

   The whole flow is lead capture, not a live marketplace: nothing here prices,
   matches or publishes a listing. An ETI rep reads the submission and calls the
   seller back, which is what the stages describe. */
var Listings = (function(){
  var KEY = 'eti_listings';

  var STAGES = ['জমা হয়েছে', 'যাচাই চলছে', 'প্রতিনিধি যোগাযোগ করেছেন', 'বিক্রি সম্পন্ন'];

  /* One row per sellable category. Drives the landing cards, the thumbnails on
     the submissions list, and the header of each form — so a new category is a
     single edit here plus its form page. */
  var CATEGORIES = [
    { key:'pullet',  label:'লেয়ার পুলেট', emoji:'🐣', tint:'gold', badge:'badge-gold',
      unit:'প্রতি পিস',     page:'pullet.html'  },
    { key:'chicken', label:'রেডি মুরগী',  emoji:'🐔', tint:'rust', badge:'badge-rust',
      unit:'প্রতি কেজি',    page:'chicken.html' },
    { key:'egg',     label:'ডিম',          emoji:'🥚', tint:'moss', badge:'badge-moss',
      unit:'প্রতি ১০০ পিস', page:'egg.html'     },
    { key:'litter',  label:'লিটার',        emoji:'🌾', tint:'gold', badge:'badge-gold',
      unit:'প্রতি বস্তা',   page:'litter.html'  }
  ];

  function cat(key){
    for(var i = 0; i < CATEGORIES.length; i++){ if(CATEGORIES[i].key === key) return CATEGORIES[i]; }
    return CATEGORIES[0];
  }

  /* stage index -> which tab the submission shows under, and its .tag-pill class */
  function statusOf(l){
    if(l.cancelled)  return { label:'বাতিল',   pill:'status-pending',   tab:'cancelled' };
    if(l.stage >= 3) return { label:'সম্পন্ন',  pill:'status-completed', tab:'done' };
    return { label:STAGES[l.stage], pill:'status-progress', tab:'active' };
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

  function byCat(key){
    return all().filter(function(l){ return l.cat === key; });
  }

  function newId(){
    return 'SELL-' + String(Date.now()).slice(-6);
  }

  function place(listing){
    listing.id = listing.id || newId();
    listing.date = listing.date || Shop.dateLabel();
    listing.stage = 0;
    listing.cancelled = false;
    var list = all();
    list.unshift(listing);
    write(list);
    return listing.id;
  }

  function cancel(id){
    var list = all();
    for(var i = 0; i < list.length; i++){
      if(list[i].id === id){ list[i].cancelled = true; break; }
    }
    write(list);
  }

  /* Reads whatever the form put in the DOM and turns it into a listing record.
     `spec` is [{ label, id, prefix, suffix }] in display order; blank fields drop
     out so the summary never shows an empty row. Radio groups are read by name
     via the `radio` key, checkboxes via `check`, instead of an element id. */
  function collect(cat, spec){
    var fields = [];
    spec.forEach(function(f){
      var v = '';
      if(f.radio){
        var on = document.querySelector('input[name="' + f.radio + '"]:checked');
        if(on) v = on.getAttribute('data-label') || '';
      } else if(f.check){
        v = document.getElementById(f.check).checked ? 'হ্যাঁ' : 'না';
      } else {
        var el = document.getElementById(f.id);
        v = el ? el.value.trim() : '';
      }
      if(!v) return;
      fields.push({ label:f.label, value:(f.prefix || '') + v + (f.suffix || '') });
    });
    return fields;
  }

  /* One-line digest for the submissions list, pulled from the handful of fields
     a rep scans first. Each form picks its own keys — breed/count/age reads very
     differently from type/volume/frequency. */
  function summary(fields, keys, fallback){
    return keys.map(function(k){
      var hit = fields.filter(function(f){ return f.label === k; })[0];
      return hit ? hit.value : '';
    }).filter(Boolean).join(' · ') || fallback;
  }

  /* The contact block is identical on all four forms, so it is read here rather
     than repeated in four page scripts. */
  function collectSeller(){
    var time = document.querySelector('input[name="calltime"]:checked');
    return {
      name:     val('s-name'),
      phone:    val('s-phone'),
      district: val('s-district'),
      upazila:  val('s-upazila'),
      detail:   val('s-detail'),
      callTime: time ? time.getAttribute('data-label') : ''
    };
  }

  function val(id){
    var el = document.getElementById(id);
    return el ? el.value.trim() : '';
  }

  /* "সাভার, ঢাকা — ব্লক-বি, রোড-৭" with every empty part dropped, so a
     half-filled contact block still reads as a sentence. */
  function sellerLine(s){
    var place = [s.upazila, s.district].filter(Boolean).join(', ');
    return [place, s.detail].filter(Boolean).join(' — ') || '—';
  }

  var DEMO = [
    { id:'SELL-408215', cat:'pullet', catLabel:'লেয়ার পুলেট',
      date:'০৪ আগস্ট ২০২৬', stage:1, cancelled:false,
      summary:'Hy-Line Brown · ৮০০ পিস · ১৬ সপ্তাহ',
      fields:[
        { label:'জাত', value:'Hy-Line Brown' },
        { label:'বয়স', value:'16 সপ্তাহ' },
        { label:'সংখ্যা', value:'800 পিস' },
        { label:'গড় ওজন', value:'1350 গ্রাম' },
        { label:'ভ্যাকসিন সিডিউল সম্পন্ন', value:'হ্যাঁ' },
        { label:'প্রত্যাশিত দাম', value:'৳420 / পিস' },
        { label:'বিস্তারিত', value:'সব বাচ্চা এক ব্যাচের, ডিপ লিটারে পালন করা হয়েছে।' }
      ],
      seller:{ name:'মোঃ রফিকুল ইসলাম', phone:'০১৭১২ ৩৪৫৬৭৮', district:'ঢাকা',
               upazila:'সাভার', detail:'ব্লক-বি, রোড-৭, হেমায়েতপুর', callTime:'সকাল' } },

    { id:'SELL-395640', cat:'egg', catLabel:'ডিম',
      date:'২৬ জুলাই ২০২৬', stage:3, cancelled:false,
      summary:'লেয়ার (বাদামি) · ১২,০০০ পিস · নিয়মিত',
      fields:[
        { label:'ডিমের ধরন', value:'লেয়ার (বাদামি)' },
        { label:'দৈনিক উৎপাদন', value:'2400 পিস/দিন' },
        { label:'বিক্রয়যোগ্য পরিমাণ', value:'12000 পিস' },
        { label:'সরবরাহের ধরন', value:'নিয়মিত' },
        { label:'প্রত্যাশিত দাম', value:'৳1050 / ১০০ পিস' },
        { label:'বিস্তারিত', value:'প্রতিদিন সকালে সংগ্রহ করা হয়, ট্রে সহ সরবরাহ।' }
      ],
      seller:{ name:'মোঃ রফিকুল ইসলাম', phone:'০১৭১২ ৩৪৫৬৭৮', district:'ঢাকা',
               upazila:'সাভার', detail:'ব্লক-বি, রোড-৭, হেমায়েতপুর', callTime:'যেকোনো সময়' } }
  ];

  function seed(){
    if(Shop.readJSON(KEY, null) === null) write(DEMO.slice());
  }

  return { STAGES:STAGES, CATEGORIES:CATEGORIES, cat:cat,
           all:all, byId:byId, byCat:byCat, place:place, cancel:cancel,
           statusOf:statusOf, seed:seed, newId:newId,
           collect:collect, collectSeller:collectSeller, summary:summary,
           sellerLine:sellerLine };
})();
