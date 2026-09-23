

(function(html) {

    "use strict";

    html.className = html.className.replace(/\bno-js\b/g, '') + ' js ';



   
    const tl = anime.timeline( {
        easing: 'easeInOutCubic',
        duration: 800,
        autoplay: false
    })
    .add({
        targets: '#loader',
        opacity: 0,
        duration: 1000,
        begin: function(anim) {
            window.scrollTo(0, 0);
        }
    })
    .add({
        targets: '#preloader',
        opacity: 0,
        complete: function(anim) {
            document.querySelector("#preloader").style.visibility = "hidden";
            document.querySelector("#preloader").style.display = "none";
        }
    })
    .add({
        targets: '.s-header',
        translateY: [-100, 0],
        opacity: [0, 1]
    }, '-=200')
    .add({
        targets: [ '.s-intro .text-pretitle', '.s-intro .text-huge-title'],
        translateX: [100, 0],
        opacity: [0, 1],
        delay: anime.stagger(400)
    })
    .add({
        targets: '.circles span',
        keyframes: [
            {opacity: [0, .3]},
            {opacity: [.3, .1], delay: anime.stagger(100, {direction: 'reverse'})}
        ],
        delay: anime.stagger(100, {direction: 'reverse'})
    })
    .add({
        targets: '.intro-social li',
        translateX: [-50, 0],
        opacity: [0, 1],
        delay: anime.stagger(100, {direction: 'reverse'})
    })
    .add({
        targets: '.intro-scrolldown',
        translateY: [100, 0],
        opacity: [0, 1]
    }, '-=800');



   
    const ssPreloader = function() {

        const preloader = document.querySelector('#preloader');
        if (!preloader) return;
        
        window.addEventListener('load', function() {
            document.querySelector('html').classList.remove('ss-preload');
            document.querySelector('html').classList.add('ss-loaded');

            document.querySelectorAll('.ss-animated').forEach(function(item){
                item.classList.remove('ss-animated');
            });

            tl.play();
        });
    }; // end ssPreloader


    
    const ssMobileMenu = function() {

        const toggleButton = document.querySelector('.mobile-menu-toggle');
        const mainNavWrap = document.querySelector('.main-nav-wrap');
        const siteBody = document.querySelector("body");

        if (!(toggleButton && mainNavWrap)) return;

        toggleButton.addEventListener('click', function(event) {
            event.preventDefault();
            toggleButton.classList.toggle('is-clicked');
            siteBody.classList.toggle('menu-is-open');
        });

        mainNavWrap.querySelectorAll('.main-nav a').forEach(function(link) {
            link.addEventListener("click", function(event) {                if (window.matchMedia('(max-width: 800px)').matches) {
                    toggleButton.classList.toggle('is-clicked');
                    siteBody.classList.toggle('menu-is-open');
                }
            });
        });

        window.addEventListener('resize', function() {            if (window.matchMedia('(min-width: 801px)').matches) {
                if (siteBody.classList.contains('menu-is-open')) siteBody.classList.remove('menu-is-open');
                if (toggleButton.classList.contains("is-clicked")) toggleButton.classList.remove("is-clicked");
            }
        });

    }; // end ssMobileMenu


   
    const ssScrollSpy = function() {

        const sections = document.querySelectorAll(".target-section");        window.addEventListener("scroll", navHighlight);

        function navHighlight() {            let scrollY = window.pageYOffset;            sections.forEach(function(current) {
                const sectionHeight = current.offsetHeight;
                const sectionTop = current.offsetTop - 50;
                const sectionId = current.getAttribute("id");
            
               
                if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                    document.querySelector(".main-nav a[href*=" + sectionId + "]").parentNode.classList.add("current");
                } else {
                    document.querySelector(".main-nav a[href*=" + sectionId + "]").parentNode.classList.remove("current");
                }
            });
        }

    }; // end ssScrollSpy


   
    const ssViewAnimate = function() {

        const blocks = document.querySelectorAll("[data-animate-block]");

        window.addEventListener("scroll", viewportAnimation);

        function viewportAnimation() {

            let scrollY = window.pageYOffset;

            blocks.forEach(function(current) {

                const viewportHeight = window.innerHeight;
                const triggerTop = (current.offsetTop + (viewportHeight * .2)) - viewportHeight;
                const blockHeight = current.offsetHeight;
                const blockSpace = triggerTop + blockHeight;
                const inView = scrollY > triggerTop && scrollY <= blockSpace;
                const isAnimated = current.classList.contains("ss-animated");

                if (inView && (!isAnimated)) {
                    anime({
                        targets: current.querySelectorAll("[data-animate-el]"),
                        opacity: [0, 1],
                        translateY: [100, 0],
                        delay: anime.stagger(400, {start: 200}),
                        duration: 800,
                        easing: 'easeInOutCubic',
                        begin: function(anim) {
                            current.classList.add("ss-animated");
                        }
                    });
                }
            });
        }

    }; // end ssViewAnimate

   
    const ssLightbox = function() {

        const folioLinks = document.querySelectorAll('.folio-list__item-link');
        const modals = [];

        folioLinks.forEach(function(link) {
            let modalbox = link.getAttribute('href');
            let instance = basicLightbox.create(
                document.querySelector(modalbox),
                {
                    onShow: function(instance) {                        document.addEventListener("keydown", function(event) {
                            event = event || window.event;
                            if (event.keyCode === 27) {
                                instance.close();
                            }
                        });
                    }
                }
            )
            modals.push(instance);
        });

        folioLinks.forEach(function(link, index) {
            link.addEventListener("click", function(event) {
                event.preventDefault();
                modals[index].show();
            });
        });

    };  // end ssLightbox


   /**
    * Builds the portfolio from projects.json. Add, edit, or remove an object
    * in that file and the cards and detail modals update automatically.
    */
    const ssProjects = async function() {

        const list = document.querySelector('#projects-list');
        const modalsContainer = document.querySelector('#projects-modals');

        if (!(list && modalsContainer)) return;

        try {
            const response = await fetch('projects.json');
            if (!response.ok) throw new Error('Unable to load projects.json');

            const projects = await response.json();
            const arrowIcon = `<svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8.14645 3.14645C8.34171 2.95118 8.65829 2.95118 8.85355 3.14645L12.8536 7.14645C13.0488 7.34171 13.0488 7.65829 12.8536 7.85355L8.85355 11.8536C8.65829 12.0488 8.34171 12.0488 8.14645 11.8536C7.95118 11.6583 7.95118 11.3417 8.14645 11.1464L11.2929 8H2.5C2.22386 8 2 7.77614 2 7.5C2 7.22386 2.22386 7 2.5 7H11.2929L8.14645 3.85355C7.95118 3.65829 7.95118 3.34171 8.14645 3.14645Z" fill="currentColor" fill-rule="evenodd" clip-rule="evenodd"></path></svg>`;
            const escapeHtml = function(value) {
                return String(value).replace(/[&<>'"]/g, function(character) {
                    return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' })[character];
                });
            };

            list.innerHTML = projects.map(function(project, index) {
                const title = escapeHtml(project.title);
                const category = escapeHtml(project.category);
                const image = escapeHtml(project.image);
                const url = escapeHtml(project.url);

                return `<li class="folio-list__item column" data-animate-el>
                    <a class="folio-list__item-link" href="#project-modal-${index}">
                        <div class="folio-list__item-pic"><img src="${image}" alt="${title} project"></div>
                        <div class="folio-list__item-text"><div class="folio-list__item-cat">${category}</div><div class="folio-list__item-title">${title}</div></div>
                    </a>
                    <a class="folio-list__proj-link" href="${url}" target="_blank" rel="noopener noreferrer" title="Open ${title}">${arrowIcon}</a>
                </li>`;
            }).join('');

            modalsContainer.innerHTML = projects.map(function(project, index) {
                const tags = (project.tags || []).map(function(tag) {
                    return `<li>${escapeHtml(tag)}</li>`;
                }).join('');

                return `<div id="project-modal-${index}" hidden>
                    <div class="modal-popup">
                        <div class="modal-popup__desc">
                            <h5>${escapeHtml(project.title)}</h5>
                            <p>${escapeHtml(project.description)}</p>
                            <ul class="modal-popup__cat">${tags}</ul>
                        </div>
                        <a href="${escapeHtml(project.url)}" target="_blank" rel="noopener noreferrer" class="modal-popup__details">Project link</a>
                    </div>
                </div>`;
            }).join('');

            ssLightbox();
        } catch (error) {
            list.innerHTML = '<li class="column">Projects could not be loaded. Please serve this site through a local web server.</li>';
            console.error(error);
        }

    }; // end ssProjects


   /**
    * Builds Education and Certifications & Awards from resume.json.
    */
    const ssResume = async function() {

        const educationTimeline = document.querySelector('#education-timeline');
        const certificationsTimeline = document.querySelector('#certifications-timeline');

        if (!(educationTimeline && certificationsTimeline)) return;

        const escapeHtml = function(value) {
            return String(value).replace(/[&<>'"]/g, function(character) {
                return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' })[character];
            });
        };
        const timelineBlock = function(item, details) {
            return `<div class="timeline__block">
                <div class="timeline__bullet"></div>
                <div class="timeline__header">
                    <h4 class="timeline__title">${escapeHtml(item.title)}</h4>
                    <h5 class="timeline__meta">${escapeHtml(item.subtitle || item.issuer)}</h5>
                    <p class="timeline__timeframe">${escapeHtml(item.date)}</p>
                </div>
                ${details}
            </div>`;
        };

        try {
            const response = await fetch('resume.json');
            if (!response.ok) throw new Error('Unable to load resume.json');

            const resume = await response.json();
            educationTimeline.innerHTML = resume.education.map(function(item) {
                return timelineBlock(item, `<div class="timeline__desc"><p>${escapeHtml(item.description)}</p></div>`);
            }).join('');
            certificationsTimeline.innerHTML = resume.certifications.map(function(item) {
                const url = escapeHtml(item.credentialUrl);
                return timelineBlock(item, `<div class="timeline__desc"><p><a href="${url}" target="_blank" rel="noopener noreferrer">View credential</a></p></div>`);
            }).join('');
        } catch (error) {
            const message = '<p>Timeline entries could not be loaded. Please serve this site through a local web server.</p>';
            educationTimeline.innerHTML = message;
            certificationsTimeline.innerHTML = message;
            console.error(error);
        }

    }; // end ssResume


   
    const ssAlertBoxes = function() {

        const boxes = document.querySelectorAll('.alert-box');
  
        boxes.forEach(function(box){

            box.addEventListener('click', function(event) {
                if (event.target.matches(".alert-box__close")) {
                    event.stopPropagation();
                    event.target.parentElement.classList.add("hideit");

                    setTimeout(function(){
                        box.style.display = "none";
                    }, 500)
                }    
            });

        })

    }; // end ssAlertBoxes


   
    const ssMoveTo = function(){

        const easeFunctions = {
            easeInQuad: function (t, b, c, d) {
                t /= d;
                return c * t * t + b;
            },
            easeOutQuad: function (t, b, c, d) {
                t /= d;
                return -c * t* (t - 2) + b;
            },
            easeInOutQuad: function (t, b, c, d) {
                t /= d/2;
                if (t < 1) return c/2*t*t + b;
                t--;
                return -c/2 * (t*(t-2) - 1) + b;
            },
            easeInOutCubic: function (t, b, c, d) {
                t /= d/2;
                if (t < 1) return c/2*t*t*t + b;
                t -= 2;
                return c/2*(t*t*t + 2) + b;
            }
        }

        const triggers = document.querySelectorAll('.smoothscroll');
        
        const moveTo = new MoveTo({
            tolerance: 0,
            duration: 1200,
            easing: 'easeInOutCubic',
            container: window
        }, easeFunctions);

        triggers.forEach(function(trigger) {
            moveTo.registerTrigger(trigger);
        });

    }; // end ssMoveTo


   
    (function ssInit() {

        ssPreloader();
        ssMobileMenu();
        ssScrollSpy();
        ssViewAnimate();
        ssProjects();
        ssResume();
        ssAlertBoxes();
        ssMoveTo();

    })();

})(document.documentElement);
