// =============================================
// AMW TECH — MAIN SCRIPT
// =============================================

// Set current year in footer
document.getElementById('year').textContent = new Date().getFullYear();

// =============================================
// NAVBAR — Scroll behavior
// =============================================
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
    if (window.scrollY > 60) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// =============================================
// SCROLL ANIMATIONS — Fade in on scroll
// =============================================
const fadeElements = document.querySelectorAll(
    '.about-text, .about-image, .country-card, .service-card, .contact-info, .contact-form-box, .team-card, .stat, .section-header, .map-container'
);

fadeElements.forEach(el => {
    el.classList.add('fade-in');
});

const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            setTimeout(() => {
                entry.target.classList.add('visible');
            }, index * 60);
            observer.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.08,
    rootMargin: '0px 0px -40px 0px'
});

fadeElements.forEach(el => observer.observe(el));

// =============================================
// SMOOTH SCROLL — Navbar links
// =============================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

// =============================================
// HERO VIDEO — Fallback if video fails
// =============================================
const heroVideo = document.querySelector('.hero-video');
if (heroVideo) {
    heroVideo.addEventListener('error', () => {
        heroVideo.style.display = 'none';
        document.querySelector('.hero').style.background = 'linear-gradient(135deg, #0a0a0a 0%, #1a0505 50%, #0a0a0a 100%)';
    });
}

// =============================================
// COUNTRY CARDS — Stagger animation
// =============================================
const countryCards = document.querySelectorAll('.country-card');
const countryObserver = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
        countryCards.forEach((card, i) => {
            setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, i * 80);
        });
        countryObserver.disconnect();
    }
}, { threshold: 0.2 });

countryCards.forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
});

if (countryCards.length > 0) {
    countryObserver.observe(countryCards[0].parentElement);
}

// =============================================
// CONTACT FORM
// =============================================
function handleFormSubmit(event) {
    event.preventDefault();
    const btn = document.getElementById('submitBtn');
    const text = btn.querySelector('.btn-text');
    const loader = btn.querySelector('.btn-loader');
    const successMsg = document.getElementById('formSuccess');
    
    // Get form data
    const name = document.getElementById('cf-name').value;
    const phone = document.getElementById('cf-phone').value;
    const email = document.getElementById('cf-email').value;
    const subjectEl = document.getElementById('cf-subject');
    const subject = subjectEl.options[subjectEl.selectedIndex].text;
    const message = document.getElementById('cf-message').value;

    // Show loading
    text.style.display = 'none';
    loader.style.display = 'inline-block';
    btn.disabled = true;
    
    // Construct WhatsApp message
    let waMessage = `*New Website Inquiry*%0A%0A`;
    waMessage += `*Name:* ${name}%0A`;
    waMessage += `*Phone:* ${phone}%0A`;
    if(email) waMessage += `*Email:* ${email}%0A`;
    if(subject && subject !== 'Select a topic...') waMessage += `*Subject:* ${subject}%0A`;
    if(message) waMessage += `*Message:* ${message}%0A`;
    
    // Ahsan's WhatsApp Number
    const waUrl = `https://wa.me/971507206726?text=${waMessage}`;

    // Simulate short delay then open WhatsApp
    setTimeout(() => {
        text.style.display = 'inline-block';
        loader.style.display = 'none';
        btn.disabled = false;
        
        // Open WhatsApp chat in new tab
        window.open(waUrl, '_blank');
        
        // Reset form
        document.getElementById('contactForm').reset();
        
        // Show success message briefly
        successMsg.style.display = 'block';
        setTimeout(() => {
            successMsg.style.display = 'none';
        }, 5000);
    }, 800);
}
