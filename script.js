document.addEventListener("DOMContentLoaded", () => {
    // Set current year in footer
    document.getElementById("year").textContent = new Date().getFullYear();

    // GSAP ScrollTrigger Setup
    gsap.registerPlugin(ScrollTrigger);

    // Initial Hero Animation
    gsap.to(".fade-up", {
        y: 0,
        opacity: 1,
        duration: 1,
        stagger: 0.2,
        ease: "power3.out",
        delay: 0.5
    });

    // Scroll Animations for Text
    const sections = document.querySelectorAll('.story-section:not(.hero-section)');
    
    sections.forEach(section => {
        const elements = section.querySelectorAll('.reveal-text');
        
        gsap.to(elements, {
            scrollTrigger: {
                trigger: section,
                start: "top 70%",
                toggleActions: "play none none reverse"
            },
            y: 0,
            opacity: 1,
            duration: 0.8,
            stagger: 0.1,
            ease: "power2.out"
        });
    });

    // Canvas Image Sequence Logic
    const canvas = document.getElementById("hero-lightpass");
    const context = canvas.getContext("2d");

    // Set canvas dimensions
    const resizeCanvas = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        // Re-draw current frame to handle resize properly
        if (images[imageSeq.frame]) {
            drawFrame(images[imageSeq.frame]);
        }
    };
    window.addEventListener("resize", resizeCanvas);
    
    // There are 3 folders (1, 2, 3), but they are all mapped sequentially.
    // Let's create an array of all file paths.
    // Sequence 1: 1 (1).jpg to 1 (210).jpg
    // Sequence 2: 2 (1).jpg to 2 (300).jpg
    // Sequence 3: 3 (1).jpg to 3 (300).jpg
    const framePaths = [];
    
    for (let i = 1; i <= 210; i++) framePaths.push(`Scroll Telling/1 (${i}).jpg`);
    for (let i = 1; i <= 300; i++) framePaths.push(`Scroll Telling/2 (${i}).jpg`);
    for (let i = 1; i <= 300; i++) framePaths.push(`Scroll Telling/3 (${i}).jpg`);
    
    const frameCount = framePaths.length;
    const images = [];
    const imageSeq = { frame: 0 };
    
    // Draw frame centered and covering
    const drawFrame = (img) => {
        const canvasRatio = canvas.width / canvas.height;
        const imgRatio = img.width / img.height;
        
        let drawWidth, drawHeight, offsetX, offsetY;
        
        if (canvasRatio > imgRatio) {
            drawWidth = canvas.width;
            drawHeight = canvas.width / imgRatio;
            offsetX = 0;
            offsetY = (canvas.height - drawHeight) / 2;
        } else {
            drawHeight = canvas.height;
            drawWidth = canvas.height * imgRatio;
            offsetY = 0;
            offsetX = (canvas.width - drawWidth) / 2;
        }
        
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
    };

    // Preload first frame immediately to show something
    const firstImg = new Image();
    firstImg.src = framePaths[0];
    firstImg.onload = () => {
        resizeCanvas(); // Set dimensions and draw
        
        // Then start preloading everything else silently
        preloadImages();
    };
    
    images[0] = firstImg;

    function preloadImages() {
        // Preload sequentially so that early frames are ready sooner
        for (let i = 1; i < frameCount; i++) {
            const img = new Image();
            img.src = framePaths[i];
            images[i] = img;
        }
    }

    // Link GSAP to Scroll
    gsap.to(imageSeq, {
        frame: frameCount - 1,
        snap: "frame",
        ease: "none",
        scrollTrigger: {
            scrub: 0.5,
            start: "top top",
            end: "bottom bottom",
            trigger: "body",
        },
        onUpdate: () => {
            const currentFrame = images[imageSeq.frame];
            if (currentFrame && currentFrame.complete) {
                drawFrame(currentFrame);
            }
        }
    });

});
