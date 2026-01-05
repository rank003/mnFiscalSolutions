/* =========================
   MAIN SCRIPT (combined)
   - Scroll-trigger reveal
   - Year
   - Mobile menu
   - FAQ (supports BOTH .faq-q and #faq .faq-row)
   - Modal (#modal)
   - Service buttons (.link-btn)
   - Forms (lead + contact)
   - Hero video click-to-play (no duplicate binding)
   - Intl phone input (#phone)
   - Instagram modal (images + videos)
========================= */

document.addEventListener("DOMContentLoaded", () => {
  // ---------- Helpers ----------
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  // =========================================================
  // ✅ Scroll-trigger reveal
  // =========================================================
  (function () {
    const elements = document.querySelectorAll("section, footer");

    // add the class to all sections + footer
    elements.forEach((el) => el.classList.add("reveal"));

    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            obs.unobserve(entry.target); // animate once
          }
        });
      },
      {
        threshold: 0.15, // show when 15% is visible
        rootMargin: "0px 0px -80px 0px", // triggers slightly earlier
      }
    );

    elements.forEach((el) => observer.observe(el));
  })();

  // ---------- Year ----------
  const yearEl = $("#year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  // ---------- Mobile menu ----------
  const menuBtn = $("#menuBtn");
  const mobileMenu = $("#mobileMenu");

  const setMenu = (open) => {
    if (!mobileMenu || !menuBtn) return;
    mobileMenu.classList.toggle("open", open);
    mobileMenu.setAttribute("aria-hidden", String(!open));
    menuBtn.setAttribute("aria-expanded", String(open));
  };

  if (menuBtn && mobileMenu) {
    menuBtn.addEventListener("click", () => {
      const isOpen = mobileMenu.classList.contains("open");
      setMenu(!isOpen);
    });

    // Close mobile menu when clicking a link
    $$(".m-link").forEach((a) => a.addEventListener("click", () => setMenu(false)));
  }

  // ---------- FAQ Accordion (supports BOTH markup types) ----------
  // Type A: .faq-q (old FAQ)
  const faqQ = $$(".faq-q");
  if (faqQ.length) {
    faqQ.forEach((btn) => {
      btn.addEventListener("click", () => {
        const isOpen = btn.getAttribute("aria-expanded") === "true";
        faqQ.forEach((b) => b.setAttribute("aria-expanded", "false"));
        btn.setAttribute("aria-expanded", String(!isOpen));
      });
    });
  }

  // Type B: #faq .faq-row (new FAQ list)
  const faqRows = $$("#faq .faq-row");
  if (faqRows.length) {
    faqRows.forEach((btn) => {
      btn.addEventListener("click", () => {
        const isOpen = btn.getAttribute("aria-expanded") === "true";
        faqRows.forEach((b) => b.setAttribute("aria-expanded", "false"));
        btn.setAttribute("aria-expanded", String(!isOpen));
      });
    });
  }

  // ---------- Modal (#modal) ----------
  const modal = $("#modal");
  const modalOverlay = $("#modalOverlay");
  const openModalBtn = $("#openModalBtn");
  const closeModalBtn = $("#closeModalBtn");
  const modalOk = $("#modalOk");
  const modalTitle = $("#modalTitle");
  const modalText = $("#modalText");

  const openSiteModal = (title, text) => {
    if (!modal || !modalTitle || !modalText) return;
    modalTitle.textContent = title;
    modalText.textContent = text;
    modal.classList.add("show");
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  };

  const closeSiteModal = () => {
    if (!modal) return;
    modal.classList.remove("show");
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  };

  if (openModalBtn) {
    openModalBtn.addEventListener("click", () => {
      openSiteModal(
        "Serviços",
        "Veja os serviços e selecione o que você precisa para iniciar o atendimento."
      );
    });
  }
  if (closeModalBtn) closeModalBtn.addEventListener("click", closeSiteModal);
  if (modalOverlay) modalOverlay.addEventListener("click", closeSiteModal);
  if (modalOk) modalOk.addEventListener("click", closeSiteModal);

  // Service buttons that open modal
  $$(".link-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const service = btn.dataset.service || "Serviço";
      openSiteModal(
        service,
        "Clique em “Solicitar atendimento” e envie os detalhes do seu caso para receber orientação inicial."
      );
    });
  });

  // ---------- Forms (demo behavior) ----------
  const leadForm = $("#leadForm");
  if (leadForm) {
    leadForm.addEventListener("submit", (e) => {
      e.preventDefault();
      openSiteModal(
        "Recebido ✅",
        "Seu pedido foi enviado (demo). Conecte isso ao seu backend/WhatsApp API quando quiser."
      );
      leadForm.reset();
    });
  }

  const contactForm = $("#contactForm");
  const formMsg = $("#formMsg");
  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();
      if (formMsg) {
        formMsg.textContent =
          "Mensagem enviada (demo). Você pode integrar com Formspree, EmailJS ou backend.";
      }
      contactForm.reset();
    });
  }

  // ---------- Hero video: click to play (NO duplicate binding) ----------
  const heroVideoCard = $("#heroVideoCard");
  const heroPlayBtn = $("#heroPlayBtn");
  const heroVideo = $("#heroVideo");

  if (heroVideoCard && heroPlayBtn && heroVideo) {
    // prevent double-binding across reloads / multiple scripts
    if (heroPlayBtn.dataset.bound !== "true") {
      heroPlayBtn.dataset.bound = "true";

      heroPlayBtn.addEventListener("click", () => {
        heroVideoCard.classList.add("is-playing");
        heroVideo.currentTime = 0;

        heroVideo.play().catch((err) => {
          // autoplay may be blocked; user can press play on controls
          console.warn("Playback blocked:", err);
        });
      });
    }
  }

  // ---------- Intl phone input (#phone) ----------
  const phoneInput = $("#phone");
  if (phoneInput && window.intlTelInput) {
    window.intlTelInput(phoneInput, {
      initialCountry: "auto",
      preferredCountries: ["br", "pt", "us", "gb"],
      separateDialCode: true,
      utilsScript:
        "https://cdn.jsdelivr.net/npm/intl-tel-input@18.2.1/build/js/utils.js",
    });
  }

  // =========================================================
  // ✅ Instagram modal (images + videos)
  // =========================================================
  const igModal = $("#igModal");
  const igModalImg = $("#igModalImage");
  const igModalVideo = $("#igModalVideo");
  const igPosts = $$("#instagram .ig-post");

  // if modal markup isn't on the page, skip safely
  if (igModal && igModalImg && igModalVideo && igPosts.length) {
    const openIgModal = ({ type, src, poster, alt }) => {
      igModal.classList.add("open");
      igModal.setAttribute("aria-hidden", "false");

      // lock scroll
      document.body.classList.add("ig-modal-open");

      // reset media
      igModalImg.style.display = "none";
      igModalVideo.style.display = "none";

      igModalVideo.pause();
      igModalVideo.removeAttribute("src");
      igModalVideo.removeAttribute("poster");
      igModalVideo.load();

      if (type === "image") {
        igModalImg.src = src;
        igModalImg.alt = alt || "Image preview";
        igModalImg.style.display = "block";
      } else {
        igModalVideo.src = src;
        if (poster) igModalVideo.setAttribute("poster", poster);
        igModalVideo.style.display = "block";
        igModalVideo.play().catch(() => {});
      }
    };

    const closeIgModal = () => {
      igModal.classList.remove("open");
      igModal.setAttribute("aria-hidden", "true");
      document.body.classList.remove("ig-modal-open");

      // stop video
      igModalVideo.pause();
      igModalVideo.removeAttribute("src");
      igModalVideo.removeAttribute("poster");
      igModalVideo.load();

      // hide media
      igModalImg.style.display = "none";
      igModalVideo.style.display = "none";
    };

    igPosts.forEach((post) => {
      post.addEventListener("click", (e) => {
        e.preventDefault();

        const type = post.dataset.type;
        const src = post.dataset.src;
        const poster = post.dataset.poster || "";
        const img = post.querySelector("img");
        const alt = img ? img.alt : "";

        if (!type || !src) return;

        openIgModal({ type, src, poster, alt });
      });
    });

    // close by overlay / X
    igModal.addEventListener("click", (e) => {
      const close = e.target.closest("[data-close='true']");
      if (close) closeIgModal();
    });

    // close on ESC
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && igModal.classList.contains("open")) {
        closeIgModal();
      }
    });
  }
});
