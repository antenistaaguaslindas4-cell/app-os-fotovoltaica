const $=id=>document.getElementById(id);
$("data").value=new Date().toISOString().slice(0,10);
let materials=[], photos=[];

$("addMaterial").onclick=()=>{
  const name=$("material").value, qty=Number($("qtd").value)||1;
  materials.push({name,qty}); renderMaterials();
};
function renderMaterials(){
  $("materials").innerHTML=materials.map((m,i)=>`<li class="material-item"><span>${m.qty} × ${m.name}</span><button class="remove" onclick="removeMaterial(${i})">X</button></li>`).join("");
}
window.removeMaterial=i=>{materials.splice(i,1);renderMaterials()};

$("photos").onchange=e=>{
  [...e.target.files].forEach(file=>{
    const r=new FileReader(); r.onload=ev=>{photos.push(ev.target.result);renderPhotos()}; r.readAsDataURL(file);
  });
  e.target.value="";
};
function renderPhotos(){
  $("gallery").innerHTML=photos.map((p,i)=>`<div class="photo"><img src="${p}"><button onclick="removePhoto(${i})">X</button></div>`).join("");
}
window.removePhoto=i=>{photos.splice(i,1);renderPhotos()};

const canvas=$("signature"),ctx=canvas.getContext("2d");let drawing=false;
function pos(e){const r=canvas.getBoundingClientRect(), t=e.touches?.[0]||e;return{x:(t.clientX-r.left)*canvas.width/r.width,y:(t.clientY-r.top)*canvas.height/r.height}}
function start(e){drawing=true;const p=pos(e);ctx.beginPath();ctx.moveTo(p.x,p.y);e.preventDefault()}
function move(e){if(!drawing)return;const p=pos(e);ctx.lineTo(p.x,p.y);ctx.stroke();e.preventDefault()}
function end(){drawing=false}
canvas.addEventListener("mousedown",start);canvas.addEventListener("mousemove",move);canvas.addEventListener("mouseup",end);
canvas.addEventListener("touchstart",start,{passive:false});canvas.addEventListener("touchmove",move,{passive:false});canvas.addEventListener("touchend",end);
ctx.lineWidth=3;ctx.lineCap="round";ctx.strokeStyle="#111827";
$("clearSig").onclick=()=>ctx.clearRect(0,0,canvas.width,canvas.height);

function data(){
 const checks={};document.querySelectorAll("[data-check]").forEach(x=>checks[x.dataset.check]=x.checked);
 return {os:$("os").value,cliente:$("cliente").value,endereco:$("endereco").value,data:$("data").value,tecnico:$("tecnico").value,servico:$("servico").value,checks,materials,obs:$("obs").value,signature:canvas.toDataURL()};
}
$("save").onclick=()=>{localStorage.setItem("os-fotovoltaica",JSON.stringify(data()));$("status").textContent="Salva ✓";alert("OS salva neste aparelho.")};
const old=localStorage.getItem("os-fotovoltaica");
if(old){try{const d=JSON.parse(old);["os","cliente","endereco","data","tecnico","servico","obs"].forEach(k=>$(k).value=d[k]||"");materials=d.materials||[];renderMaterials();Object.entries(d.checks||{}).forEach(([k,v])=>{const el=document.querySelector(`[data-check="${k}"]`);if(el)el.checked=v});if(d.signature){const im=new Image();im.onload=()=>ctx.drawImage(im,0,0,canvas.width,canvas.height);im.src=d.signature}}catch{}}

$("share").onclick=()=>{
 const d=data(), lines=[
 `ORDEM DE SERVIÇO - OS FOTOVOLTAICA`,`OS: ${d.os||"-"}`,`Cliente: ${d.cliente||"-"}`,`Endereço: ${d.endereco||"-"}`,`Data: ${d.data||"-"}`,`Técnico: ${d.tecnico||"-"}`,
 `Serviço: ${d.servico||"-"}`,"","CHECKLIST:",...Object.entries(d.checks).map(([k,v])=>`${v?"☑":"☐"} ${k}`),
 "","MATERIAIS:",...d.materials.map(m=>`${m.qty} × ${m.name}`),"",`Observações: ${d.obs||"-"}`].join("\n");
 window.open("https://wa.me/?text="+encodeURIComponent(lines),"_blank");
};
$("print").onclick=()=>window.print();
if("serviceWorker" in navigator) navigator.serviceWorker.register("sw.js");
