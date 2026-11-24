const WHATSAPP_NUMBER = "5592992845912";
const products = [
 {id:1,name:"Pijama Pink Elegance",desc:"Conjunto curto rosa com listras pretas.",category:"curto",tag:"Queridinho",image:"assets/pink-elegance.jpeg"},
 {id:2,name:"Pijama Vaquinha Candy",desc:"Conjunto longo com estampa divertida de vaquinhas.",category:"longo",tag:"Estampa divertida",image:"assets/vaquinha-candy.jpeg"},
 {id:3,name:"Pijama Pink Glamour",desc:"Conjunto de alças rosa com shorts estampado.",category:"curto",tag:"Toque delicado",image:"assets/pink-glamour.jpeg"},
 {id:4,name:"Pijama Blue Dreams",desc:"Conjunto azul de manga longa com estampa alegre.",category:"longo",tag:"Colorido",image:"assets/blue-dreams.jpeg"},
 {id:5,name:"Kit Pink Dreams",desc:"Conjunto rosa acompanhado de máscara de dormir.",category:"kit",tag:"Kit especial",image:"assets/kit-pink-dreams.jpeg"},
 {id:6,name:"Pijama Kitty Love",desc:"Conjunto delicado rosa e branco com estampa de gatinha.",category:"curto",tag:"Estampa fofa",image:"assets/kitty-love.jpeg"},
 {id:7,name:"Pijama Fun Dreams",desc:"Conjunto com estampa divertida em preto, branco e azul.",category:"curto",tag:"Estilo divertido",image:"assets/fun-dreams.jpeg"},
 {id:8,name:"Pijama Sweet Kitty",desc:"Conjunto pink de manga longa com estampa colorida.",category:"longo",tag:"Pink especial",image:"assets/sweet-kitty.jpeg"}
];
let cart = [];
let activeFilter = "todos";
const $ = id => document.getElementById(id);
function renderProducts(){
 const term = ($("searchInput")?.value || "").toLowerCase().trim();
 const shown = products.filter(p => (activeFilter==="todos" || p.category===activeFilter) && (p.name+" "+p.desc).toLowerCase().includes(term));
 $("productGrid").innerHTML = shown.map(p=>`<article class="product-card">
  <div class="product-image"><img src="${p.image}" alt="${p.name}" loading="lazy"><span class="product-tag">${p.tag}</span><button class="quick-add" data-add="${p.id}">＋ Adicionar à sacola</button></div>
  <div class="product-info"><h3>${p.name}</h3><p>${p.desc}</p><span class="product-price">Consulte o valor pelo WhatsApp</span></div>
 </article>`).join("") || '<p>Não encontramos produtos com esse nome.</p>';
 document.querySelectorAll("[data-add]").forEach(b=>b.addEventListener("click",()=>addToCart(Number(b.dataset.add))));
}
function addToCart(id){const found=cart.find(i=>i.id===id);if(found)found.qty++;else cart.push({id,qty:1});renderCart();openCart();}
function renderCart(){
 const count=cart.reduce((n,i)=>n+i.qty,0);$("cartCount").textContent=count;$("drawerCount").textContent=`(${count})`;
 if(!cart.length){$("cartItems").innerHTML='<div class="empty-cart"><span>♡</span><b>Sua sacola está esperando por você</b><p>Adicione seus favoritos para montar seu pedido.</p></div>';return;}
 $("cartItems").innerHTML=cart.map(i=>{const p=products.find(x=>x.id===i.id);return `<div class="cart-row"><img src="${p.image}" alt=""><div><h4>${p.name}</h4><small>${p.desc}</small><div class="qty"><button data-minus="${p.id}">−</button><span>${i.qty}</span><button data-plus="${p.id}">＋</button></div></div><button class="remove-item" data-remove="${p.id}" aria-label="Remover">✕</button></div>`}).join("");
 document.querySelectorAll("[data-minus]").forEach(b=>b.onclick=()=>changeQty(+b.dataset.minus,-1));
 document.querySelectorAll("[data-plus]").forEach(b=>b.onclick=()=>changeQty(+b.dataset.plus,1));
 document.querySelectorAll("[data-remove]").forEach(b=>b.onclick=()=>{cart=cart.filter(i=>i.id!==+b.dataset.remove);renderCart()});
}
function changeQty(id,delta){const item=cart.find(i=>i.id===id);if(!item)return;item.qty+=delta;if(item.qty<1)cart=cart.filter(i=>i.id!==id);renderCart();}
function openCart(){$("cartDrawer").classList.add("open");$("overlay").classList.add("show");}
function closeCart(){$("cartDrawer").classList.remove("open");$("overlay").classList.remove("show");}
function openCheckout(){if(!cart.length){alert("Adicione pelo menos um produto à sacola.");return;}closeCart();$("checkoutModal").classList.add("show");}
function sendOrder(){
 const name=$("customerName").value.trim(),city=$("customerCity").value.trim();
 if(!name){alert("Por favor, informe seu nome.");$("customerName").focus();return;}
 const lines=cart.map(i=>{const p=products.find(x=>x.id===i.id);return `• ${p.name} — quantidade: ${i.qty}`;}).join("\n");
 const message=`Olá, Sonho de Menina! 💗 Gostaria de fazer um pedido:\n\n${lines}\n\nNome: ${name}\nCidade/Estado: ${city||"A confirmar"}\nEntrega: ${$("deliveryType").value}\nObservações: ${$("customerNotes").value.trim()||"Nenhuma"}\n\nPoderiam confirmar valores, tamanhos disponíveis e frete, por favor?`;
 window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`,"_blank","noopener");
}
document.querySelectorAll(".filter").forEach(b=>b.addEventListener("click",()=>{document.querySelectorAll(".filter").forEach(x=>x.classList.remove("active"));b.classList.add("active");activeFilter=b.dataset.filter;renderProducts()}));
$("openCart").onclick=openCart;$("closeCart").onclick=closeCart;$("overlay").onclick=closeCart;
$("checkoutBtn").onclick=openCheckout;$("closeCheckout").onclick=()=>$("checkoutModal").classList.remove("show");$("sendWhatsApp").onclick=sendOrder;
$("searchToggle").onclick=()=>{$("searchBar").classList.toggle("hidden");$("searchInput").focus()};
$("closeSearch").onclick=()=>{$("searchBar").classList.add("hidden");$("searchInput").value="";renderProducts()};
$("searchInput").addEventListener("input",renderProducts);
$("menuToggle").onclick=()=>document.querySelector(".desktop-nav").classList.toggle("menu-open");
document.querySelectorAll(".desktop-nav a").forEach(a=>a.addEventListener("click",()=>document.querySelector(".desktop-nav").classList.remove("menu-open")));
$("year").textContent=new Date().getFullYear();
renderProducts();renderCart();