/* ========== NOMOR WA BARU ========== */
const WA_NUMBER = "6285933800533";

const PRODUCTS = {
  joki: {
    name: "Jasa Joki Akun Mobile Legends",
    image: "assets/JOKI.jpeg",
    description: "Push bintang dengan pilihan rank. Khusus order 10 bintang mendapatkan bonus +2 bintang.",
    options: [
      {id:"glory", name:"Rank Glory", price:12000, note:"Rp12.000 per bintang"},
      {id:"immortal", name:"Rank Immortal", price:15000, note:"Rp15.000 per bintang"},
      {id:"10glory", name:"Paket 10 Bintang • Glory", price:120000, note:"Bonus +2 bintang"},
      {id:"10immortal", name:"Paket 10 Bintang • Immortal", price:150000, note:"Bonus +2 bintang"}
    ]
  },
  akun: {
    name: "Jual Akun Mobile Legends & Free Fire",
    image: "assets/JB.jpeg",
    description: "Pilihan akun game siap pakai. Harga dibuat bertingkat sesuai kualitas akun.",
    options: [
      {id:"ml400", name:"Akun MLBB • Paket 100K", price:100000, note:"Contoh akun MLBB"},
      {id:"ml500", name:"Akun MLBB • Paket 500K", price:500000, note:"Contoh akun MLBB"},
      {id:"ff400", name:"Akun Free Fire • Paket 100K", price:100000, note:"Contoh akun Free Fire"},
      {id:"ff500", name:"Akun Free Fire • Paket 300K", price:300000, note:"Contoh akun Free Fire"}
    ]
  },
  pulsa: {
    name: "Jasa Pulsa",
    image: "assets/PAKET.jpeg",
    description: "Pulsa semua operator. Pilih nominal yang kamu butuhkan.",
    options: [
      {id:"p15", name:"Pulsa Rp15.000", price:15000, note:"Semua operator"},
      {id:"p20", name:"Pulsa Rp20.000", price:20000, note:"Semua operator"},
      {id:"p25", name:"Pulsa Rp25.000", price:25000, note:"Semua operator"},
      {id:"p50", name:"Pulsa Rp50.000", price:50000, note:"Semua operator"},
      {id:"p100", name:"Pulsa Rp100.000", price:100000, note:"Semua operator"}
    ]
  },
  desain: {
    name: "Jasa Desain",
    image: "assets/DESAIN.jpeg",
    description: "Desain untuk kebutuhan personal, bisnis, komunitas, dan brand.",
    options: [
      {id:"d15", name:"Desain Basic", price:15000, note:"Mulai Rp15.000"},
      {id:"d25", name:"Desain Standard", price:25000, note:"Mulai Rp25.000"},
      {id:"d35", name:"Desain Premium", price:35000, note:"Mulai Rp35.000"},
      {id:"d50", name:"Desain Pro", price:50000, note:"Mulai Rp50.000"},
      {id:"d75", name:"Desain Custom", price:75000, note:"Mulai Rp75.000"}
    ]
  }
};

const rupiah = n => new Intl.NumberFormat("id-ID",{style:"currency",currency:"IDR",maximumFractionDigits:0}).format(n);

function getCart(){ return JSON.parse(localStorage.getItem("tdr_cart") || "[]"); }
function saveCart(cart){ localStorage.setItem("tdr_cart", JSON.stringify(cart)); updateCartCount(); }
function updateCartCount(){
  const el=document.getElementById("cartCount");
  if(el) el.textContent=getCart().reduce((sum,x)=>sum+x.qty,0);
}

function toast(message){
  const el=document.getElementById("toast");
  if(!el)return;
  el.textContent=message; el.classList.add("show");
  setTimeout(()=>el.classList.remove("show"),1800);
}

function renderProduct(){
  const root=document.getElementById("productDetail");
  if(!root)return;
  const id=new URLSearchParams(location.search).get("id") || "joki";
  const p=PRODUCTS[id] || PRODUCTS.joki;
  root.innerHTML=`
    <div class="product-visual"><img src="${p.image}" alt="${p.name}"></div>
    <div class="product-info">
      <span class="eyebrow">DETAIL PRODUK</span>
      <h1>${p.name}</h1>
      <p>${p.description}</p>
      <h3>Pilih Varian</h3>
      <div class="option-list">
        ${p.options.map((o,i)=>`
          <label class="option">
            <span><b>${o.name}</b><small>${o.note}</small></span>
            <span><b>${rupiah(o.price)}</b><input type="radio" name="variant" value="${o.id}" ${i===0?"checked":""}></span>
          </label>`).join("")}
      </div>
      <div class="qty-row"><b>Jumlah</b><div class="qty"><button type="button" id="minus">−</button><input id="qty" type="number" min="1" value="1"><button type="button" id="plus">+</button></div></div>
      <div id="detailPrice" class="detail-price">${rupiah(p.options[0].price)}</div>
      <button id="addCart" class="primary-btn full">🛍️ Tambah ke Keranjang</button>
      <button id="buyNow" class="secondary-btn full">Pesan Sekarang</button>
    </div>`;
  const qty=document.getElementById("qty");
  const selected=()=>p.options.find(o=>o.id===document.querySelector('input[name="variant"]:checked').value);
  const refresh=()=>document.getElementById("detailPrice").textContent=rupiah(selected().price*Number(qty.value||1));
  document.querySelectorAll('input[name="variant"]').forEach(x=>x.addEventListener("change",refresh));
  document.getElementById("minus").onclick=()=>{qty.value=Math.max(1,Number(qty.value)-1);refresh()};
  document.getElementById("plus").onclick=()=>{qty.value=Number(qty.value)+1;refresh()};
  function add(goCheckout=false){
    const o=selected(), q=Math.max(1,Number(qty.value)||1), cart=getCart();
    const key=id+"_"+o.id;
    const existing=cart.find(x=>x.key===key);
    if(existing) existing.qty+=q;
    else cart.push({key,productId:id,product:p.name,variant:o.name,price:o.price,qty:q,image:p.image});
    saveCart(cart); toast("Produk masuk ke keranjang.");
    if(goCheckout) location.href="checkout.html";
  }
  document.getElementById("addCart").onclick=()=>add(false);
  document.getElementById("buyNow").onclick=()=>add(true);
}

function renderCheckout(){
  const list=document.getElementById("cartItems");
  if(!list)return;
  let cart=getCart();
  if(!cart.length){
    list.innerHTML=`<div class="empty">Keranjang masih kosong.<br><br><a class="primary-btn" href="index.html#layanan">Pilih Produk</a></div>`;
  }else{
    list.innerHTML=cart.map((x,i)=>`
      <div class="cart-item">
        <img src="${x.image}" alt="">
        <div><h3>${x.product}</h3><p>${x.variant} • Qty ${x.qty}</p><strong>${rupiah(x.price*x.qty)}</strong></div>
        <button class="remove-btn" data-index="${i}">Hapus</button>
      </div>`).join("");
    document.querySelectorAll(".remove-btn").forEach(btn=>btn.onclick=()=>{
      cart.splice(Number(btn.dataset.index),1); saveCart(cart); renderCheckout();
    });
  }
  const subtotal=cart.reduce((s,x)=>s+x.price*x.qty,0);
  const fee=cart.length?2000:0;
  document.getElementById("subtotal").textContent=rupiah(subtotal);
  document.getElementById("fee").textContent=rupiah(fee);
  document.getElementById("grandTotal").textContent=rupiah(subtotal+fee);
}

function setupCheckout(){
  const payBtn=document.getElementById("payBtn");
  if(!payBtn)return;
  document.querySelectorAll('input[name="payment"]').forEach(r=>r.onchange=()=>{
    document.getElementById("qrisBox").classList.toggle("hidden",r.value!=="qris" || !r.checked);
  });
  document.getElementById("clearCart").onclick=()=>{saveCart([]);renderCheckout()};
  payBtn.onclick=()=>{
    const cart=getCart();
    if(!cart.length){alert("Keranjang masih kosong.");return;}
    const method=document.querySelector('input[name="payment"]:checked').value;
    const note=document.getElementById("note").value.trim() || "-";
    const subtotal=cart.reduce((s,x)=>s+x.price*x.qty,0), total=subtotal+2000;
    let msg=`Halo TDR Store, saya ingin melakukan pemesanan.%0A%0A`;
    cart.forEach((x,i)=>msg+=`${i+1}. ${x.product} - ${x.variant} - Qty ${x.qty} - ${rupiah(x.price*x.qty)}%0A`);
    msg+=`%0ASubtotal: ${rupiah(subtotal)}%0ABiaya layanan: ${rupiah(2000)}%0ATOTAL: ${rupiah(total)}%0AMetode: ${method==="qris"?"QRIS":"Cash"}%0ACatatan: ${encodeURIComponent(note)}`;
    window.open(`https://wa.me/${WA_NUMBER}?text=${msg}`,"_blank");
  };
}

/* ========== CHATBOT ========== */
const BOT_REPLIES = {
  harga: `Berikut harga layanan TDR Store:<br><br>
• <b>Joki Glory</b> — Rp12.000/bintang<br>
• <b>Joki Immortal</b> — Rp15.000/bintang<br>
• <b>Paket 10 bintang</b> — bonus +2 bintang<br>
• <b>Akun MLBB/FF</b> — mulai Rp100.000<br>
• <b>Pulsa</b> — mulai Rp15.000<br>
• <b>Desain</b> — mulai Rp15.000<br><br>
Mau order? Klik "Chat Admin" ya!`,

  cara: `Cara order mudah:<br><br>
1️⃣ Pilih produk di halaman layanan<br>
2️⃣ Pilih varian + jumlah<br>
3️⃣ Tambah ke keranjang / Pesan Sekarang<br>
4️⃣ Checkout → pilih Cash atau QRIS<br>
5️⃣ Konfirmasi via WhatsApp<br><br>
Ada yang mau ditanyakan lagi?`,

  joki: `Untuk <b>Jasa Joki Mobile Legends</b>:<br><br>
• Rank Glory → Rp12.000 / bintang<br>
• Rank Immortal → Rp15.000 / bintang<br>
• Order 10 bintang dapat <b>bonus +2 bintang</b><br><br>
Proses cepat & aman. Mau langsung order?`,

  wa: null, // akan buka WhatsApp
  default: `Terima kasih sudah menghubungi TDR Store! 😊<br><br>
Untuk pertanyaan lebih detail atau order, silakan chat admin langsung ya.`
};

function addBotMsg(html) {
  const box = document.getElementById("chatbot-messages");
  if (!box) return;
  const div = document.createElement("div");
  div.className = "bot-msg";
  div.innerHTML = html;
  box.appendChild(div);
  box.scrollTop = box.scrollHeight;
}

function addUserMsg(text) {
  const box = document.getElementById("chatbot-messages");
  if (!box) return;
  const div = document.createElement("div");
  div.className = "user-msg";
  div.textContent = text;
  box.appendChild(div);
  box.scrollTop = box.scrollHeight;
}

function handleBotQuery(key, customText) {
  if (key === "wa") {
    addUserMsg("Chat Admin");
    addBotMsg("Menghubungkan ke WhatsApp admin... 🚀");
    setTimeout(() => {
      window.open(`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent("Halo TDR Store, saya ingin bertanya.")}`, "_blank");
    }, 600);
    return;
  }

  if (customText) {
    addUserMsg(customText);
    const lower = customText.toLowerCase();
    let reply = BOT_REPLIES.default;
    if (lower.includes("harga") || lower.includes("berapa") || lower.includes("price")) reply = BOT_REPLIES.harga;
    else if (lower.includes("cara") || lower.includes("order") || lower.includes("pesan")) reply = BOT_REPLIES.cara;
    else if (lower.includes("joki") || lower.includes("rank") || lower.includes("bintang")) reply = BOT_REPLIES.joki;
    else if (lower.includes("wa") || lower.includes("admin") || lower.includes("chat")) {
      handleBotQuery("wa");
      return;
    }
    setTimeout(() => addBotMsg(reply), 400);
  } else {
    const labels = { harga: "Cek Harga", cara: "Cara Order", joki: "Joki ML" };
    addUserMsg(labels[key] || key);
    setTimeout(() => addBotMsg(BOT_REPLIES[key] || BOT_REPLIES.default), 400);
  }
}

function initChatbot() {
  const toggle = document.getElementById("chatbot-toggle");
  const box = document.getElementById("chatbot-box");
  const closeBtn = document.getElementById("chatbot-close");
  const sendBtn = document.getElementById("chatbot-send");
  const input = document.getElementById("chatbot-input");

  if (!toggle || !box) return;

  toggle.onclick = () => box.classList.toggle("hidden");
  closeBtn.onclick = () => box.classList.add("hidden");

  document.querySelectorAll(".chatbot-quick button").forEach(btn => {
    btn.onclick = () => handleBotQuery(btn.dataset.q);
  });

  function send() {
    const text = input.value.trim();
    if (!text) return;
    input.value = "";
    handleBotQuery(null, text);
  }

  sendBtn.onclick = send;
  input.onkeydown = e => { if (e.key === "Enter") send(); };
}

document.addEventListener("DOMContentLoaded",()=>{
  updateCartCount();
  renderProduct();
  renderCheckout();
  setupCheckout();
  initChatbot();
});