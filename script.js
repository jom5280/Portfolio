document.addEventListener('DOMContentLoaded', () => {

    // Header Scroll Effect - Hide on Scroll Down, Show on Scroll Up
    const header = document.querySelector('.header');
    let lastScrollTop = 0;

    window.addEventListener('scroll', () => {
        let scrollTop = window.pageYOffset || document.documentElement.scrollTop;

        // Toggle 'scrolled' class for background style
        if (scrollTop > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        // Toggle 'hide-header' class for visibility
        if (scrollTop > lastScrollTop && scrollTop > 100) {
            // Scrolling DOWN
            header.classList.add('hide-header');
        } else {
            // Scrolling UP
            header.classList.remove('hide-header');
        }

        lastScrollTop = scrollTop <= 0 ? 0 : scrollTop; // For Mobile or negative scrolling
    });

    // Mobile Menu Toggle (Basic)
    // Mobile Menu Toggle
    const toggle = document.querySelector('.mobile-toggle');
    const mobileMenu = document.querySelector('.mobile-menu-overlay');
    const closeMenu = document.querySelector('.close-menu');
    const mobileLinks = document.querySelectorAll('.mobile-nav-links a');

    function toggleMenu() {
        mobileMenu.classList.toggle('active');
        document.body.classList.toggle('no-scroll'); // Prevent body scroll
    }

    if (toggle) {
        toggle.addEventListener('click', toggleMenu);
    }

    if (closeMenu) {
        closeMenu.addEventListener('click', toggleMenu);
    }

    // Close menu when a link is clicked
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (mobileMenu.classList.contains('active')) {
                toggleMenu();
            }
        });
    });

    // Contact Form Handling
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const formData = new FormData(contactForm);
            const object = Object.fromEntries(formData);
            const json = JSON.stringify(object);

            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.textContent;
            submitBtn.textContent = "Sending...";
            submitBtn.disabled = true;

            fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: json
            })
                .then(async (response) => {
                    let json = await response.json();
                    if (response.status == 200) {
                        window.location.href = 'thank-you.html';
                    } else {
                        console.log(response);
                        alert(json.message);
                        submitBtn.textContent = originalBtnText;
                        submitBtn.disabled = false;
                    }
                })
                .catch(error => {
                    console.log(error);
                    alert("Something went wrong!");
                    submitBtn.textContent = originalBtnText;
                    submitBtn.disabled = false;
                });
        });
    }

    // Scroll Animation Observer
    const observerOptions = {
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('show');
            }
        });
    }, observerOptions);

    const hiddenElements = document.querySelectorAll('.hidden');
    hiddenElements.forEach((el) => observer.observe(el));


    // jQuery Logo Carousel Logic
    // We clone the logo track content and append it to create the seamless loop effect
    const $track = $('.logo-track');
    const $logos = $track.html();

    // Duplicate logos to ensure we have enough width for seamless scrolling
    $track.append($logos);

    // Check if we need more duplicates for wide screens
    if ($track.width() < $(window).width() * 2) {
        $track.append($logos);
    }
    // Portfolio Filtering Logic
    const filterButtons = document.querySelectorAll('.filter-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-item');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons and add to the clicked one
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            const filterValue = button.getAttribute('data-filter');

            portfolioItems.forEach(item => {
                if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
                    item.style.display = 'block';
                    // Optional: Add an animation or transition
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'scale(1)';
                    }, 10);
                } else {
                    item.style.opacity = '0';
                    item.style.transform = 'scale(0.8)';
                    setTimeout(() => {
                        item.style.display = 'none';
                    }, 300); // Match this with a transition in CSS if needed
                }
            });
        });
    });

    // Lightbox Logic
    const lightbox = document.getElementById('lightbox');
    if (lightbox) {
        const lightboxImg = document.getElementById('lightboxImg');
        const lightboxTitle = document.getElementById('lightboxTitle');
        const lightboxCat = document.getElementById('lightboxCat');
        const closeBtn = document.querySelector('.lightbox-close');
        const prevBtn = document.querySelector('.lightbox-prev');
        const nextBtn = document.querySelector('.lightbox-next');

        let currentIndex = 0;
        let visibleItems = [];

        function updateLightbox(index) {
            if (!visibleItems[index]) return;

            const item = visibleItems[index];
            const img = item.querySelector('.portfolio-img');
            const title = item.querySelector('h3');
            const cat = item.querySelector('.work-cat');

            if (img && lightboxImg) lightboxImg.src = img.src;
            if (title && lightboxTitle) lightboxTitle.textContent = title.textContent;
            if (cat && lightboxCat) lightboxCat.textContent = cat.textContent;

            currentIndex = index;
        }

        function openLightbox(clickedItem) {
            // Update visible items based on current display state
            visibleItems = Array.from(portfolioItems).filter(item => {
                return window.getComputedStyle(item).display !== 'none';
            });

            const newIndex = visibleItems.indexOf(clickedItem);
            if (newIndex !== -1) {
                updateLightbox(newIndex);
                lightbox.classList.add('active');
                document.body.classList.add('no-scroll');
            }
        }

        // Use event delegation or ensure items exist
        portfolioItems.forEach(item => {
            item.addEventListener('click', (e) => {
                // Prevent default just in case it's a link
                e.preventDefault();
                openLightbox(item);
            });
        });

        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                lightbox.classList.remove('active');
                document.body.classList.remove('no-scroll');
            });
        }

        // Close on background click
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                lightbox.classList.remove('active');
                document.body.classList.remove('no-scroll');
            }
        });

        if (prevBtn) {
            prevBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                if (visibleItems.length > 0) {
                    currentIndex = (currentIndex - 1 + visibleItems.length) % visibleItems.length;
                    updateLightbox(currentIndex);
                }
            });
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                if (visibleItems.length > 0) {
                    currentIndex = (currentIndex + 1) % visibleItems.length;
                    updateLightbox(currentIndex);
                }
            });
        }

        // Keyboard controls
        document.addEventListener('keydown', (e) => {
            if (!lightbox.classList.contains('active')) return;

            if (e.key === 'Escape') {
                lightbox.classList.remove('active');
                document.body.classList.remove('no-scroll');
            } else if (e.key === 'ArrowLeft' && visibleItems.length > 0) {
                currentIndex = (currentIndex - 1 + visibleItems.length) % visibleItems.length;
                updateLightbox(currentIndex);
            } else if (e.key === 'ArrowRight' && visibleItems.length > 0) {
                currentIndex = (currentIndex + 1) % visibleItems.length;
                updateLightbox(currentIndex);
            }
        });
    }

    // =========================================
    // SECURITY DETERRENTS (Deterrence only)
    // =========================================

    // 1. Disable Right-Click
    document.addEventListener('contextmenu', (e) => e.preventDefault());

    // 2. Disable Keyboard Shortcuts (F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+U)
    document.addEventListener('keydown', (e) => {
        // F12
        if (e.keyCode === 123) {
            e.preventDefault();
            return false;
        }

        // Ctrl+Shift+I (Inspect), Ctrl+Shift+J (Console), Ctrl+Shift+C (Element Select)
        if (e.ctrlKey && e.shiftKey && (e.keyCode === 73 || e.keyCode === 74 || e.keyCode === 67)) {
            e.preventDefault();
            return false;
        }

        // Ctrl+U (View Source)
        if (e.ctrlKey && e.keyCode === 85) {
            e.preventDefault();
            return false;
        }

        // Meta (Cmd) variants for Mac
        if (e.metaKey && e.altKey && e.keyCode === 73) {
            e.preventDefault();
            return false;
        }
    });
});
