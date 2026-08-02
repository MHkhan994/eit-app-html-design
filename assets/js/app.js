function showSub(name, el){
  document.querySelectorAll('.subpanel').forEach(p => p.classList.remove('active'));
  document.getElementById('sub-' + name).classList.add('active');
  document.querySelectorAll('.tabs .tab').forEach(t => t.classList.remove('active'));
  el.classList.add('active');
}

// Generic field-group switcher — used by tool screens with a radio toggle
// that swaps which input set is shown (e.g. Broiler vs Layer on the ROI calculator).
// Purely a visual state swap, no calculation involved.
function showFieldGroup(id){
  document.querySelectorAll('.field-group').forEach(g => g.classList.remove('active'));
  document.getElementById(id).classList.add('active');
}
