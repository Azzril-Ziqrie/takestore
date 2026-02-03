// ===== Sidebar mobile =====
const sidebar = document.getElementById("sidebar");
const overlay = document.getElementById("overlay");
const openBtn = document.getElementById("menuOpen");
const closeBtn = document.getElementById("menuClose");

function openSidebar() {
  sidebar.classList.add("open");
  overlay.hidden = false;
  document.body.style.overflow = "hidden";
  document.body.classList.add("sidebar-active");

}

function closeSidebar() {
  sidebar.classList.remove("open");
  overlay.hidden = true;
  document.body.style.overflow = "";
  document.body.classList.remove("sidebar-active");

}

openBtn?.addEventListener("click", openSidebar);
closeBtn?.addEventListener("click", closeSidebar);
overlay?.addEventListener("click", closeSidebar);

window.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeSidebar();
});


// ===== Reveal on scroll (Product) =====
document.querySelectorAll(".productCard").forEach((card, i) => {
  card.classList.add("reveal");
  card.style.setProperty("--d", `${Math.min(i, 12) * 60}ms`);
});

const revealEls = document.querySelectorAll(".reveal");
const io = new IntersectionObserver(
  (entries, obs) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      obs.unobserve(entry.target);
    });
  },
  { threshold: 0.12, rootMargin: "0px 0px -10% 0px" }
);
revealEls.forEach((el) => io.observe(el));

// ===== Filter (kategori) + Search =====
let activeFilter = "all";

const searchInput = document.getElementById("productSearch");
const filterLinks = document.querySelectorAll(".filterLink");
const cards = document.querySelectorAll(".productCard");

function applyFilters() {
  const q = (searchInput?.value || "").trim().toLowerCase();

  cards.forEach((card) => {
    const title = card.querySelector(".productTitle")?.textContent?.trim().toLowerCase() || "";
    const cat = (card.dataset.category || "").toLowerCase();

    const matchCategory = (activeFilter === "all") || (cat === activeFilter);
    const matchSearch = !q || title.includes(q);

    card.style.display = (matchCategory && matchSearch) ? "" : "none";
  });
}

filterLinks.forEach((link) => {
  link.addEventListener("click", (e) => {
    e.preventDefault();

    activeFilter = (link.dataset.filter || "all").toLowerCase();

    filterLinks.forEach((l) => l.classList.remove("active"));
    link.classList.add("active");

    applyFilters();

    // optional: kalau mobile sidebar kebuka, tutup + topbar balik (kalau kamu pakai hide topbar)
    if (sidebar?.classList.contains("open")) closeSidebar();
  });
});

searchInput?.addEventListener("input", applyFilters);

// initial render
applyFilters();



// ===== WhatsApp template (Buy / Stock) =====

// ===== WhatsApp template (Buy / Stock) =====
const WHATSAPP_NUMBER = "62895324360400"; // tanpa +, tanpa spasi/dash

document.addEventListener("click", (e) => {
  const btn = e.target.closest(".buyBtn");
  if (!btn) return;

  const card = btn.closest(".productCard");
  const productName = card?.querySelector(".productTitle")?.textContent?.trim() || "Produk";
  const price = (btn.dataset.price || card?.querySelector(".productMeta")?.textContent || "").trim();

  // size optional: hanya kalau ada select
  const sizeEl = card?.querySelector(".sizeSelect");
  const size = (sizeEl?.value || "").trim();

  // kalau ada sizeSelect (T-shirts), tetap wajib pilih
  if (sizeEl && !size) {
    alert("Pilih size dulu ya.");
    sizeEl.focus();
    return;
  }

  const message =
`Hi, I'd like to check stock.

Product: ${productName}
${size ? `Size: ${size}\n` : ""}Price: ${price}

Is it ready? If so, I'd like to order.`;

  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  window.open(url, "_blank");
});

// ===== Slider dots (untuk elemen [data-slider]) =====
document.querySelectorAll("[data-slider]").forEach((slider) => {
  const slidesEl = slider.querySelector("[data-slides]");
  const dotsEl = slider.querySelector("[data-dots]");
  if (!slidesEl || !dotsEl) return;

  const slides = Array.from(slidesEl.querySelectorAll(".slide"));
  if (slides.length < 2) return;

  dotsEl.innerHTML = "";
  const dots = slides.map((_, i) => {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "dot" + (i === 0 ? " active" : "");
    b.addEventListener("click", () => {
      slides[i].scrollIntoView({ behavior: "smooth", inline: "start", block: "nearest" });
    });
    dotsEl.appendChild(b);
    return b;
  });

  const update = () => {
    const w = slidesEl.clientWidth || 1;
    const idx = Math.round(slidesEl.scrollLeft / w);
    dots.forEach((d, i) => d.classList.toggle("active", i === idx));
  };

  slidesEl.addEventListener("scroll", update, { passive: true });
  window.addEventListener("resize", update);
  update();
});


