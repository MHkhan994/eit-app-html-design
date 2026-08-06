/* auth.js — interaction for the auth/ screens (sign in, register, verify,
   forgot password, reset password).

   Standalone on purpose. shop.js owns the existing qs/toast helpers, but loading
   617 lines of catalog to read a query string would also drag its cart-badge
   painting and demo-order seeding onto pages that have neither a badge nor an
   order. Three small functions are duplicated instead.

   Nothing here authenticates: no credential is checked, no code is sent or
   verified, nothing is written to storage. Every handler either swaps a visible
   UI state or navigates. */
var Auth = (function(){

  /* The identifier and the flow mode travel between pages in the query string —
     no storage, works over file://, and each state stays directly openable for
     review (verify.html?flow=reset&id=farmer@example.com). */
  function qs(key){
    var m = new RegExp('[?&]' + key + '=([^&]*)').exec(window.location.search);
    return m ? decodeURIComponent(m[1].replace(/\+/g, ' ')) : '';
  }

  /* An identifier is whatever the farmer typed — a mobile number or an email.
     Nothing is validated or rejected; the '@' test only picks the wording and
     the keyboard hint. */
  function isEmail(id){ return String(id).indexOf('@') > -1; }
  function idLabel(id){ return isEmail(id) ? 'ইমেইলে' : 'মোবাইল নম্বরে'; }

  /* Sets the keyboard hint from what has been typed so far: an all-digit value
     gets the number pad, anything else the email keyboard. Never blocks input. */
  function initIdField(el){
    if(!el) return;
    el.addEventListener('input', function(){
      var v = el.value.trim();
      el.setAttribute('inputmode', v && /^[0-9+\-\s]+$/.test(v) ? 'numeric' : 'email');
    });
  }

  var BN_DIGITS = ['০','১','২','৩','৪','৫','৬','৭','৮','৯'];
  function bnNum(n){ return String(n).replace(/\d/g, function(d){ return BN_DIGITS[+d]; }); }
  function clock(s){
    var m = Math.floor(s / 60), r = s % 60;
    return bnNum(m + ':' + (r < 10 ? '0' : '') + r);
  }

  /* Same .toast markup and CSS as the rest of the app. Built with textContent
     rather than innerHTML because the message can carry a typed identifier. */
  var toastTimer = null;
  function toast(msg, icon){
    var el = document.getElementById('toast');
    if(!el) return;
    var ic = document.createElement('span');
    ic.className = 'toast-icon';
    ic.textContent = icon || '✓';
    var tx = document.createElement('span');
    tx.textContent = msg;
    el.innerHTML = '';
    el.appendChild(ic);
    el.appendChild(tx);
    el.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function(){ el.classList.remove('show'); }, 2200);
  }

  /* Reveal/mask a password field. The button sits inside .pw-field next to the
     input it controls. */
  function togglePw(btn){
    var input = btn.parentNode.querySelector('input');
    if(!input) return;
    var hidden = input.type === 'password';
    input.type = hidden ? 'text' : 'password';
    btn.textContent = hidden ? '🙈' : '👁';
    btn.setAttribute('aria-label', hidden ? 'পাসওয়ার্ড লুকান' : 'পাসওয়ার্ড দেখুন');
  }

  /* Six boxes that behave as one input: typing advances, backspace on an empty
     box retreats and clears, pasting a code fills the row left to right. Real
     <input> elements rather than a custom key-capture widget, so mobile
     keyboards stay predictable. */
  function initOtp(rowId){
    var row = document.getElementById(rowId || 'otp');
    if(!row) return;
    var boxes = [].slice.call(row.querySelectorAll('.otp-box'));

    function fill(digits){
      boxes.forEach(function(b, i){
        b.value = digits.charAt(i) || '';
        b.classList.toggle('filled', !!b.value);
      });
      boxes[Math.min(digits.length, boxes.length - 1)].focus();
    }

    boxes.forEach(function(box, i){
      box.addEventListener('input', function(){
        /* A box already holding a digit keeps the newest one typed into it. */
        box.value = box.value.replace(/\D/g, '').slice(-1);
        box.classList.toggle('filled', !!box.value);
        if(box.value && i < boxes.length - 1) boxes[i + 1].focus();
      });
      box.addEventListener('keydown', function(e){
        if(e.key !== 'Backspace' || box.value || i === 0) return;
        e.preventDefault();
        boxes[i - 1].value = '';
        boxes[i - 1].classList.remove('filled');
        boxes[i - 1].focus();
      });
      box.addEventListener('paste', function(e){
        var text = (e.clipboardData || window.clipboardData).getData('text') || '';
        var digits = text.replace(/\D/g, '').slice(0, boxes.length);
        if(!digits) return;
        e.preventDefault();
        fill(digits);
      });
    });
  }

  /* Resend countdown. The control stays unavailable until the clock reaches
     zero; pressing it restarts the clock and shows a toast — no code is sent. */
  function initResend(opts){
    opts = opts || {};
    var btn = document.getElementById(opts.button || 'resend-btn');
    var out = document.getElementById(opts.count || 'resend-count');
    if(!btn || !out) return;
    var seconds = opts.seconds || 60;
    var left = 0, timer = null;

    function tick(){
      left--;
      if(left > 0){ out.textContent = clock(left); return; }
      clearInterval(timer);
      timer = null;
      out.textContent = '';
      btn.disabled = false;
    }
    function start(){
      left = seconds;
      btn.disabled = true;
      out.textContent = clock(left);
      clearInterval(timer);
      timer = setInterval(tick, 1000);
    }

    btn.addEventListener('click', function(){
      if(btn.disabled) return;
      toast(opts.message || 'নতুন কোড পাঠানো হয়েছে', '📩');
      start();
    });
    start();
  }

  return {
    qs: qs, isEmail: isEmail, idLabel: idLabel, initIdField: initIdField,
    bnNum: bnNum, toast: toast, togglePw: togglePw,
    initOtp: initOtp, initResend: initResend
  };
})();
