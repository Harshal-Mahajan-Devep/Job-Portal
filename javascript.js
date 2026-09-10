document.addEventListener("DOMContentLoaded", () => {
  // =========================================
  // 0. POST LOADER SKELETON SIMULATION (INDEX PAGE)
  // =========================================
  const feedSkeleton = document.getElementById("job-feed-skeleton");
  const feedContent = document.getElementById("job-feed-content");

  if (feedSkeleton && feedContent) {
    setTimeout(() => {
      feedSkeleton.style.transition = "opacity 0.3s ease";
      feedSkeleton.style.opacity = "0";

      setTimeout(() => {
        feedSkeleton.style.display = "none";
        feedContent.style.display = "grid";
        feedContent.style.opacity = "0";
        feedContent.style.transition = "opacity 0.4s ease";

        requestAnimationFrame(() => {
          feedContent.style.opacity = "1";
        });
      }, 300);
    }, 800);
  }

  // =========================================
  // 1. THEME TOGGLE & SYNC
  // =========================================
  const themeBtn = document.getElementById("theme-btn");
  const themeIcon = document.getElementById("theme-icon");

  const savedTheme = localStorage.getItem("nexus_theme") || "dark";
  document.body.setAttribute("data-theme", savedTheme);
  syncIcon(savedTheme);

  if (themeBtn) {
    themeBtn.addEventListener("click", () => {
      const current = document.body.getAttribute("data-theme");
      const next = current === "dark" ? "light" : "dark";

      document.body.setAttribute("data-theme", next);
      localStorage.setItem("nexus_theme", next);
      syncIcon(next);
    });
  }

  function syncIcon(theme) {
    if (!themeIcon) return;
    themeIcon.className = theme === "dark" ? "ri-sun-line" : "ri-moon-line";
  }

  // =========================================
  // 2. SEARCH DROPDOWNS LOGIC
  // =========================================
  const searchWrappers = document.querySelectorAll(".search-field-wrapper");
  searchWrappers.forEach((wrapper) => {
    const input = wrapper.querySelector("input");
    const items = wrapper.querySelectorAll(".dropdown-item");

    if (input) {
      input.addEventListener("focus", () => {
        closeAllDropdowns();
        wrapper.classList.add("active");
      });
    }

    items.forEach((item) => {
      item.addEventListener("click", (e) => {
        e.stopPropagation();
        if (input) {
          input.value = item.getAttribute("data-val");
        }
        wrapper.classList.remove("active");
      });
    });
  });

  document.addEventListener("click", (e) => {
    if (!e.target.closest(".search-field-wrapper")) {
      closeAllDropdowns();
    }
  });

  function closeAllDropdowns() {
    searchWrappers.forEach((w) => w.classList.remove("active"));
  }

  // =========================================
  // 3. FILTER CHIP ACTIVATION
  // =========================================
  const chips = document.querySelectorAll(".chip");
  chips.forEach((chip) => {
    chip.addEventListener("click", () => {
      chips.forEach((c) => c.classList.remove("active"));
      chip.classList.add("active");
    });
  });

  // =========================================
  // 4. BOOKMARK TOGGLE
  // =========================================
  document.addEventListener("click", (e) => {
    const bookmarkBtn = e.target.closest(".bookmark-btn");
    if (!bookmarkBtn) return;

    const icon = bookmarkBtn.querySelector("i");
    if (icon) {
      icon.classList.toggle("ri-bookmark-line");
      icon.classList.toggle("ri-bookmark-fill");
      icon.style.color = icon.classList.contains("ri-bookmark-fill")
        ? "#6366f1"
        : "";
    }
  });

  // =========================================
  // 5. APPLICATION STATUS FILTER LOGIC
  // =========================================
  const appFilterChips = document.querySelectorAll(
    ".filter-strip .chip[data-filter]",
  );
  const applicationCards = document.querySelectorAll(".application-card");

  if (appFilterChips.length > 0) {
    appFilterChips.forEach((chip) => {
      chip.addEventListener("click", () => {
        const filter = chip.getAttribute("data-filter");

        applicationCards.forEach((card) => {
          const cardStatus = card.getAttribute("data-status");
          if (filter === "all" || cardStatus === filter) {
            card.style.display = "block";
          } else {
            card.style.display = "none";
          }
        });
      });
    });
  }

  // =========================================
  // 6. SAVED JOBS INTERACTIVE REMOVAL
  // =========================================
  const savedCardsContainer = document.getElementById("saved-cards-container");
  const savedCountHeader = document.getElementById("saved-count");

  if (savedCardsContainer) {
    const savedCards = savedCardsContainer.querySelectorAll(".saved-card");

    savedCards.forEach((card) => {
      const bookmarkBtn = card.querySelector(".bookmark-btn");
      if (bookmarkBtn) {
        bookmarkBtn.addEventListener("click", () => {
          card.style.opacity = "0";
          card.style.transform = "scale(0.95)";

          setTimeout(() => {
            card.remove();
            const remaining =
              savedCardsContainer.querySelectorAll(".saved-card").length;
            if (savedCountHeader) {
              savedCountHeader.innerText =
                remaining < 10 ? `0${remaining}` : remaining;
            }

            if (remaining === 0) {
              savedCardsContainer.innerHTML = `
                <div class="empty-saved-state">
                  <div class="empty-saved-icon"><i class="ri-bookmark-3-line"></i></div>
                  <h3>No Saved Jobs Found</h3>
                  <p>You haven't bookmarked any jobs yet. Start exploring and save roles you like.</p>
                  <a href="index.html" class="browse-jobs-btn">
                    Explore Openings <i class="ri-arrow-right-line"></i>
                  </a>
                </div>
              `;
            }
          }, 250);
        });
      }
    });
  }

  // =========================================
  // LOAD MORE POSTS INTERACTIVE LOGIC
  // =========================================
  const btnLoadMore = document.getElementById("btn-load-more");
  const jobFeedContent = document.getElementById("job-feed-content");
  const loadMoreSection = document.getElementById("load-more-section");

  if (btnLoadMore && jobFeedContent) {
    let loadCount = 0;

    btnLoadMore.addEventListener("click", () => {
      const btnText = btnLoadMore.querySelector(".btn-text");
      const btnIcon = btnLoadMore.querySelector("i");
      const spinner = btnLoadMore.querySelector(".loader-spinner");

      btnLoadMore.disabled = true;
      if (btnText) btnText.innerText = "Fetching Openings...";
      if (btnIcon) btnIcon.style.display = "none";
      if (spinner) spinner.style.display = "inline-block";

      setTimeout(() => {
        loadCount++;

        const newCardsHTML = `
        <article class="job-card" style="opacity: 0; transform: translateY(15px); transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);">
          <div class="card-top">
            <div class="company-logo bg-purple">
              <i class="ri-amazon-fill"></i>
            </div>
            <div class="meta-info">
              <h3>Distributed Backend Systems Lead</h3>
              <p>Amazon Web Services <span class="dot">•</span> Hyderabad / Hybrid</p>
            </div>
            <button class="bookmark-btn" aria-label="Bookmark">
              <i class="ri-bookmark-line"></i>
            </button>
          </div>

          <p class="job-desc">
            Design scalable event-driven microservices using Go, Rust, and high-throughput vector cache layers.
          </p>

          <div class="tags-row">
            <span class="tag">Go</span>
            <span class="tag">Rust</span>
            <span class="tag">AWS DynamoDB</span>
            <span class="tag tag-accent">₹45 - 65 LPA</span>
          </div>

          <div class="card-bottom">
            <span class="timestamp"><i class="ri-time-line"></i> Just now</span>
            <a href="job-details.html" class="apply-cta">
              Apply Direct <i class="ri-arrow-right-up-line"></i>
            </a>
          </div>
        </article>

        <article class="job-card" style="opacity: 0; transform: translateY(15px); transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);">
          <div class="card-top">
            <div class="company-logo bg-emerald">
              <i class="ri-apple-fill"></i>
            </div>
            <div class="meta-info">
              <h3>Senior AI Systems Engineer</h3>
              <p>Apple CoreML <span class="dot">•</span> Bengaluru (Remote)</p>
            </div>
            <button class="bookmark-btn" aria-label="Bookmark">
              <i class="ri-bookmark-line"></i>
            </button>
          </div>

          <p class="job-desc">
            Deploy on-device ML accelerators, LLM quantization workflows, and neural graphics pipelines.
          </p>

          <div class="tags-row">
            <span class="tag">PyTorch</span>
            <span class="tag">CoreML</span>
            <span class="tag">C++</span>
            <span class="tag tag-accent">$195k - $250k</span>
          </div>

          <div class="card-bottom">
            <span class="timestamp"><i class="ri-time-line"></i> Just now</span>
            <a href="job-details.html" class="apply-cta">
              Apply Direct <i class="ri-arrow-right-up-line"></i>
            </a>
          </div>
        </article>
      `;

        jobFeedContent.insertAdjacentHTML("beforeend", newCardsHTML);

        const allCards = jobFeedContent.querySelectorAll(".job-card");
        const latestCards = [
          allCards[allCards.length - 2],
          allCards[allCards.length - 1],
        ];

        requestAnimationFrame(() => {
          latestCards.forEach((c) => {
            if (c) {
              c.style.opacity = "1";
              c.style.transform = "translateY(0)";
            }
          });
        });

        btnLoadMore.disabled = false;
        if (btnIcon) btnIcon.style.display = "inline-block";
        if (spinner) spinner.style.display = "none";

        if (loadCount >= 2) {
          if (btnText) btnText.innerText = "All Openings Loaded";
          if (btnIcon) btnIcon.className = "ri-check-line";
          btnLoadMore.style.pointerEvents = "none";
          btnLoadMore.style.opacity = "0.7";
        } else {
          if (btnText) btnText.innerText = "Load More Openings";
        }
      }, 850);
    });
  }

  // =========================================
  // 7. GLOBAL MODAL CONTROLLERS
  // =========================================
  function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.add("active");
      document.body.style.overflow = "hidden";
    }
  }

  function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.remove("active");
      document.body.style.overflow = "";
    }
  }

  document.addEventListener("click", (e) => {
    const closeBtn = e.target.closest("[data-close]");
    if (closeBtn) {
      const modalId = closeBtn.getAttribute("data-close");
      closeModal(modalId);
    }
    if (e.target.classList.contains("modal-overlay")) {
      e.target.classList.remove("active");
      document.body.style.overflow = "";
    }
  });

  // =========================================
  // 8. PROFILE MODALS & INTERACTIVE STATE
  // =========================================
  const btnOpenEditProfile = document.getElementById("btn-open-edit-profile");
  const btnOpenEditProfileIcon = document.getElementById(
    "open-edit-profile-icon",
  );
  const formEditProfile = document.getElementById("form-edit-profile");

  if (btnOpenEditProfile) {
    btnOpenEditProfile.addEventListener("click", () =>
      openModal("modal-edit-profile"),
    );
  }
  if (btnOpenEditProfileIcon) {
    btnOpenEditProfileIcon.addEventListener("click", () =>
      openModal("modal-edit-profile"),
    );
  }

  if (formEditProfile) {
    formEditProfile.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = document.getElementById("input-fullname").value;
      const role = document.getElementById("input-role").value;
      const location = document.getElementById("input-location").value;

      const nameEl = document.getElementById("display-user-name");
      const roleEl = document.getElementById("display-user-role");
      const locEl = document.getElementById("display-user-location");

      if (nameEl) nameEl.innerText = name;
      if (roleEl) roleEl.innerText = role;
      if (locEl) locEl.innerText = location;

      closeModal("modal-edit-profile");
    });
  }

  const btnOpenSkillModal = document.getElementById("btn-open-skill-modal");
  const formAddSkill = document.getElementById("form-add-skill");
  const skillsContainer = document.getElementById("skills-container");

  if (btnOpenSkillModal) {
    btnOpenSkillModal.addEventListener("click", () =>
      openModal("modal-add-skill"),
    );
  }

  if (formAddSkill && skillsContainer) {
    formAddSkill.addEventListener("submit", (e) => {
      e.preventDefault();
      const skillInput = document.getElementById("input-skill-name");
      const skillName = skillInput.value.trim();
      const checkedLevel = document.querySelector(
        'input[name="skill-level"]:checked',
      );
      const isFeatured = checkedLevel && checkedLevel.value === "featured";

      if (skillName) {
        const tag = document.createElement("span");
        tag.className = `tag ${isFeatured ? "tag-accent" : ""}`;
        tag.innerHTML = `${skillName} <i class="ri-close-line remove-tag-icon"></i>`;
        skillsContainer.appendChild(tag);

        skillInput.value = "";
        closeModal("modal-add-skill");
      }
    });
  }

  if (skillsContainer) {
    skillsContainer.addEventListener("click", (e) => {
      if (e.target.classList.contains("remove-tag-icon")) {
        e.target.parentElement.remove();
      }
    });
  }

  const btnOpenExpModal = document.getElementById("btn-open-exp-modal");
  const formAddExp = document.getElementById("form-add-experience");
  const expContainer = document.getElementById("experience-container");

  if (btnOpenExpModal) {
    btnOpenExpModal.addEventListener("click", () =>
      openModal("modal-add-experience"),
    );
  }

  if (formAddExp && expContainer) {
    formAddExp.addEventListener("submit", (e) => {
      e.preventDefault();
      const role = document.getElementById("input-exp-role").value;
      const company = document.getElementById("input-exp-company").value;
      const duration = document.getElementById("input-exp-duration").value;
      const desc = document.getElementById("input-exp-desc").value;

      const timelineItem = document.createElement("div");
      timelineItem.className = "timeline-item";
      timelineItem.innerHTML = `
        <div class="timeline-marker"></div>
        <div class="timeline-content">
          <div class="exp-header">
            <div>
              <h3 class="exp-role-title">${role}</h3>
              <p class="exp-company">${company}</p>
            </div>
            <span class="exp-duration">${duration}</span>
          </div>
          <p class="exp-desc">${desc}</p>
        </div>
      `;

      expContainer.prepend(timelineItem);
      formAddExp.reset();
      closeModal("modal-add-experience");
    });
  }

  const btnOpenResumeModal = document.getElementById("btn-open-resume-modal");
  const btnQuickReplaceResume = document.getElementById(
    "btn-quick-replace-resume",
  );
  const resumeDropzone = document.getElementById("resume-dropzone");
  const resumeFileInput = document.getElementById("resume-file-input");
  const btnTriggerFileInput = document.getElementById("btn-trigger-file-input");

  if (btnOpenResumeModal) {
    btnOpenResumeModal.addEventListener("click", () =>
      openModal("modal-upload-resume"),
    );
  }
  if (btnQuickReplaceResume) {
    btnQuickReplaceResume.addEventListener("click", () =>
      openModal("modal-upload-resume"),
    );
  }
  if (btnTriggerFileInput && resumeFileInput) {
    btnTriggerFileInput.addEventListener("click", () =>
      resumeFileInput.click(),
    );
  }

  if (resumeFileInput) {
    resumeFileInput.addEventListener("change", function () {
      if (this.files && this.files[0]) {
        handleUploadedFile(this.files[0]);
      }
    });
  }

  if (resumeDropzone) {
    ["dragenter", "dragover"].forEach((eventName) => {
      resumeDropzone.addEventListener(eventName, (e) => {
        e.preventDefault();
        resumeDropzone.classList.add("dragover");
      });
    });

    ["dragleave", "drop"].forEach((eventName) => {
      resumeDropzone.addEventListener(eventName, (e) => {
        e.preventDefault();
        resumeDropzone.classList.remove("dragover");
      });
    });

    resumeDropzone.addEventListener("drop", (e) => {
      e.preventDefault();
      resumeDropzone.classList.remove("dragover");
      const files = e.dataTransfer.files;
      if (files && files.length > 0) {
        handleUploadedFile(files[0]);
      }
    });
  }

  function handleUploadedFile(file) {
    const fileNameDisplay = document.getElementById("resume-filename");
    const fileMetaDisplay = document.getElementById("resume-filemeta");

    if (fileNameDisplay && fileMetaDisplay) {
      const sizeInMB = (file.size / (1024 * 1024)).toFixed(1);
      fileNameDisplay.innerText = file.name;
      fileMetaDisplay.innerText = `PDF • ${
        sizeInMB > 0 ? sizeInMB : "0.5"
      } MB • Just now`;
    }
    closeModal("modal-upload-resume");
  }
});

// =========================================
// AUTH (TAB SWITCHER, FORGOT PWD, SHOW PWD)
// =========================================
const authTabBar = document.getElementById("auth-tab-bar");
const authTabs = document.querySelectorAll(".auth-tab-btn");
const authForms = document.querySelectorAll(".auth-form");
const btnGotoForgot = document.getElementById("btn-goto-forgot");
const btnBackToLogin = document.getElementById("btn-back-to-login");
const forgotForm = document.getElementById("forgot-form");
const resetSuccessAlert = document.getElementById("reset-success-alert");
const forgotInputGroup = document.getElementById("forgot-input-group");
const btnSubmitForgot = document.getElementById("btn-submit-forgot");

if (authTabs.length > 0) {
  authTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      authTabs.forEach((t) => t.classList.remove("active"));
      authForms.forEach((f) => f.classList.remove("active"));

      tab.classList.add("active");
      const targetFormId = tab.getAttribute("data-tab");
      const targetForm = document.getElementById(targetFormId);
      if (targetForm) {
        targetForm.classList.add("active");
      }
    });
  });
}

if (btnGotoForgot) {
  btnGotoForgot.addEventListener("click", () => {
    authForms.forEach((f) => f.classList.remove("active"));
    if (authTabBar) authTabBar.style.display = "none";
    if (forgotForm) forgotForm.classList.add("active");
  });
}

if (btnBackToLogin) {
  btnBackToLogin.addEventListener("click", () => {
    if (forgotForm) forgotForm.classList.remove("active");
    if (authTabBar) authTabBar.style.display = "flex";

    const loginTab = document.getElementById("tab-login");
    const loginForm = document.getElementById("login-form");

    authTabs.forEach((t) => t.classList.remove("active"));
    if (loginTab) loginTab.classList.add("active");
    if (loginForm) loginForm.classList.add("active");

    if (resetSuccessAlert) resetSuccessAlert.style.display = "none";
    if (forgotInputGroup) forgotInputGroup.style.display = "flex";
    if (btnSubmitForgot) btnSubmitForgot.style.display = "flex";
  });
}

if (forgotForm) {
  forgotForm.addEventListener("submit", (e) => {
    e.preventDefault();
    if (resetSuccessAlert) resetSuccessAlert.style.display = "flex";
    if (forgotInputGroup) forgotInputGroup.style.display = "none";
    if (btnSubmitForgot) btnSubmitForgot.style.display = "none";
  });
}

document.addEventListener("click", (e) => {
  const toggleBtn = e.target.closest(".toggle-pwd-btn");
  if (!toggleBtn) return;

  const input = toggleBtn.parentElement.querySelector("input");
  const icon = toggleBtn.querySelector("i");

  if (input && icon) {
    if (input.type === "password") {
      input.type = "text";
      icon.className = "ri-eye-line";
    } else {
      input.type = "password";
      icon.className = "ri-eye-off-line";
    }
  }
});

const loginForm = document.getElementById("login-form");
const registerForm = document.getElementById("register-form");

if (loginForm) {
  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    window.location.href = "index.html";
  });
}

if (registerForm) {
  registerForm.addEventListener("submit", (e) => {
    e.preventDefault();
    window.location.href = "profile.html";
  });
}

// =========================================
// NOTIFICATIONS (FILTER & MARK AS READ)
// =========================================
const notifCards = document.querySelectorAll(".notification-card");
const btnMarkAllRead = document.getElementById("btn-mark-all-read");
const unreadCountDisplay = document.getElementById("notif-count-unread");
const notifFilterChips = document.querySelectorAll(
  ".notifications-action-bar .chip",
);

if (btnMarkAllRead) {
  btnMarkAllRead.addEventListener("click", () => {
    notifCards.forEach((card) => {
      card.classList.remove("unread");
      const dot = card.querySelector(".unread-dot");
      if (dot) dot.remove();
    });

    if (unreadCountDisplay) unreadCountDisplay.innerText = "0";
    btnMarkAllRead.style.opacity = "0.5";
    btnMarkAllRead.style.pointerEvents = "none";
  });
}

if (notifFilterChips.length > 0) {
  notifFilterChips.forEach((chip) => {
    chip.addEventListener("click", () => {
      notifFilterChips.forEach((c) => c.classList.remove("active"));
      chip.classList.add("active");

      const filter = chip.getAttribute("data-filter");

      notifCards.forEach((card) => {
        const category = card.getAttribute("data-category");
        const isUnread = card.classList.contains("unread");

        if (filter === "all") {
          card.style.display = "block";
        } else if (filter === "unread") {
          card.style.display = isUnread ? "block" : "none";
        } else if (category === filter) {
          card.style.display = "block";
        } else {
          card.style.display = "none";
        }
      });
    });
  });
}

// =========================================
// JOB DETAILS PAGE LOGIC
// =========================================
const btnTriggerApplyModal = document.getElementById("btn-trigger-apply-modal");
const formQuickApply = document.getElementById("form-quick-apply");
const btnJobBookmark = document.getElementById("btn-job-bookmark");
const btnStickyBookmark = document.getElementById("btn-sticky-bookmark");
const btnShareJob = document.getElementById("btn-share-job");

if (btnTriggerApplyModal) {
  btnTriggerApplyModal.addEventListener("click", () => {
    const modal = document.getElementById("modal-quick-apply");
    if (modal) {
      modal.classList.add("active");
      document.body.style.overflow = "hidden";
    }
  });
}

if (formQuickApply) {
  formQuickApply.addEventListener("submit", (e) => {
    e.preventDefault();
    alert("Application submitted successfully to Synthetix AI!");
    window.location.href = "applied.html";
  });
}

function toggleJobBookmark(btn) {
  if (!btn) return;
  const icon = btn.querySelector("i");
  if (icon) {
    const isBookmarked = icon.classList.toggle("ri-bookmark-fill");
    icon.classList.toggle("ri-bookmark-line", !isBookmarked);
    icon.style.color = isBookmarked ? "#6366f1" : "";
  }
}

if (btnJobBookmark) {
  btnJobBookmark.addEventListener("click", () =>
    toggleJobBookmark(btnJobBookmark),
  );
}

if (btnStickyBookmark) {
  btnStickyBookmark.addEventListener("click", () =>
    toggleJobBookmark(btnStickyBookmark),
  );
}

if (btnShareJob) {
  btnShareJob.addEventListener("click", async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Senior Frontend Architect at Synthetix AI",
          text: "Check out this open role on NexusJobs!",
          url: window.location.href,
        });
      } catch (err) {}
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Job link copied to clipboard!");
    }
  });
}

// =========================================
// SETTINGS SLIDE DRAWER CONTROLLER
// =========================================
const openSettingsSidebarBtn = document.getElementById(
  "open-settings-sidebar-btn",
);
const closeSettingsDrawerBtn = document.getElementById(
  "close-settings-drawer-btn",
);
const settingsDrawer = document.getElementById("settings-drawer");
const settingsDrawerBackdrop = document.getElementById(
  "settings-drawer-backdrop",
);

function openSettingsDrawer() {
  if (settingsDrawer && settingsDrawerBackdrop) {
    settingsDrawerBackdrop.classList.add("active");
    settingsDrawer.classList.add("active");
    document.body.style.overflow = "hidden";
  }
}

function closeSettingsDrawer() {
  if (settingsDrawer && settingsDrawerBackdrop) {
    settingsDrawer.classList.remove("active");
    settingsDrawerBackdrop.classList.remove("active");
    document.body.style.overflow = "";
  }
}

if (openSettingsSidebarBtn) {
  openSettingsSidebarBtn.addEventListener("click", openSettingsDrawer);
}

if (closeSettingsDrawerBtn) {
  closeSettingsDrawerBtn.addEventListener("click", closeSettingsDrawer);
}

if (settingsDrawerBackdrop) {
  settingsDrawerBackdrop.addEventListener("click", closeSettingsDrawer);
}

// Open modals directly from Drawer
const drawerBtnEditProfile = document.getElementById("drawer-btn-edit-profile");
const drawerBtnUploadResume = document.getElementById(
  "drawer-btn-upload-resume",
);

if (drawerBtnEditProfile) {
  drawerBtnEditProfile.addEventListener("click", () => {
    closeSettingsDrawer();
    setTimeout(() => openModal("modal-edit-profile"), 200);
  });
}

if (drawerBtnUploadResume) {
  drawerBtnUploadResume.addEventListener("click", () => {
    closeSettingsDrawer();
    setTimeout(() => openModal("modal-upload-resume"), 200);
  });
}

// =========================================
// PRIVACY & TERMS TAB SWITCHER
// =========================================
const legalTabBtns = document.querySelectorAll(".legal-tabs-wrapper .chip");
const legalSections = document.querySelectorAll(".legal-section");

if (legalTabBtns.length > 0) {
  legalTabBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      legalTabBtns.forEach((b) => b.classList.remove("active"));
      legalSections.forEach((sec) => sec.classList.remove("active"));

      btn.classList.add("active");
      const targetId = btn.getAttribute("data-legal");
      const targetSection = document.getElementById(targetId);
      if (targetSection) {
        targetSection.classList.add("active");
      }
    });
  });
}

// =========================================
// COMPANIES PAGE (LIVE SEARCH & FILTERING)
// =========================================
const companySearchInput = document.getElementById("company-search-input");
const companyCards = document.querySelectorAll(".company-showcase-card");
const companyFilterChips = document.querySelectorAll("[data-company-filter]");

// 1. Category Filter Chips
if (companyFilterChips.length > 0) {
  companyFilterChips.forEach((chip) => {
    chip.addEventListener("click", () => {
      companyFilterChips.forEach((c) => c.classList.remove("active"));
      chip.classList.add("active");

      const filterValue = chip.getAttribute("data-company-filter");

      companyCards.forEach((card) => {
        const categories = card.getAttribute("data-category") || "";
        if (filterValue === "all" || categories.includes(filterValue)) {
          card.style.display = "flex";
        } else {
          card.style.display = "none";
        }
      });
    });
  });
}

// 2. Live Instant Search Bar
if (companySearchInput) {
  companySearchInput.addEventListener("input", (e) => {
    const query = e.target.value.toLowerCase().trim();

    companyCards.forEach((card) => {
      const cardText = card.textContent.toLowerCase();
      if (cardText.includes(query)) {
        card.style.display = "flex";
      } else {
        card.style.display = "none";
      }
    });
  });
}

/* =========================================================
   PREMIUM MICRO-INTERACTIONS
   ========================================================= */
document.addEventListener("DOMContentLoaded", () => {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduceMotion) return;

  document.querySelectorAll(".job-card,.company-card,.bento-card,.stat-card,.auth-glass-card,.panel").forEach((el) => {
    el.addEventListener("pointermove", (e) => {
      const r = el.getBoundingClientRect();
      const x = ((e.clientX - r.left) / r.width) * 100;
      const y = ((e.clientY - r.top) / r.height) * 100;
      el.style.setProperty("--mx", `${x}%`);
      el.style.setProperty("--my", `${y}%`);
    });
  });

  const reveal = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("premium-visible");
        reveal.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08 });

  document.querySelectorAll(".job-card,.company-card,.bento-card,.stat-card").forEach((el) => {
    el.classList.add("premium-reveal");
    reveal.observe(el);
  });
});
