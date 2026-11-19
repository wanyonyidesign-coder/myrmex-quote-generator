/* Myrmex: client picker. Suggests saved clients in each module's client-name field
   and fills empty phone/email/location fields when a saved client is chosen. */
(function(){
'use strict';
var CK='myrmex_clients_v1',busy=false;
var SETS=[
 {name:'#q-client',phone:'#q-phone',email:'#q-email',place:'#q-location'},
 {name:'input[data-k="client"]',phone:'input[data-k="phone"]',place:'input[data-k="site"]'},
 {name:'input[data-field="clientName"]',contact:'input[data-field="clientContact"]'}
];
function nk(s){return String(s||'').trim().toLowerCase().replace(/\s+/g,' ')}
function clients(){try{var v=JSON.parse(localStorage.getItem(CK)||'[]');return Array.isArray(v)?v.filter(function(c){return c&&c.name}):[]}catch(e){return[]}}
function dl(){var d=document.getElementById('mx-clients');if(!d){d=document.createElement('datalist');d.id='mx-clients';document.body.appendChild(d)}return d}
function setsFor(el){for(var i=0;i<SETS.length;i++)if(el.matches&&el.matches(SETS[i].name))return SETS[i];return null}
function put(sel,val){if(!sel||!val)return;var el=document.querySelector(sel);if(!el||String(el.value||'').trim())return;
 el.value=val;el.dispatchEvent(new Event('input',{bubbles:true}))}
function apply(el,set){if(busy)return;var q=nk(el.value);if(!q)return;
 var c=clients().filter(function(x){return nk(x.name)===q})[0];if(!c)return;
 busy=true;
 try{if(el.value!==c.name){el.value=c.name;el.dispatchEvent(new Event('input',{bubbles:true}))}
  put(set.phone,c.phone);put(set.email,c.email);put(set.place,c.location);
  put(set.contact,c.phone||c.email)}
 finally{busy=false}}
document.addEventListener('focusin',function(e){var set=setsFor(e.target);if(!set)return;
 var d=dl();d.innerHTML='';clients().sort(function(a,b){return a.name.localeCompare(b.name)}).forEach(function(c){var o=document.createElement('option');o.value=c.name;if(c.phone||c.location)o.label=[c.phone,c.location].filter(Boolean).join(' · ');d.appendChild(o)});
 e.target.setAttribute('list','mx-clients');e.target.setAttribute('autocomplete','off')});
/* A chosen suggestion arrives as insertReplacementText (or no inputType); typing is ignored so
   a client named "Jane" does not fire while "Jane Wanjiru" is still being typed. */
document.addEventListener('input',function(e){var set=setsFor(e.target);if(!set)return;
 var t=e.inputType;if(t===undefined||t==='insertReplacementText')apply(e.target,set)});
document.addEventListener('change',function(e){var set=setsFor(e.target);if(set)apply(e.target,set)});
})();
