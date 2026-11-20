// =========================================================================
// 0. FIREBASE INITIALIZATION (Google Auth + Cloud Firestore Sync)
// =========================================================================
const firebaseConfig = {
    apiKey: "AIzaSyDDSX3yVtdJwpHA9f8OKToL82k18wDhx_g",
    authDomain: "sourabh-portfolio-f9b84.firebaseapp.com",
    projectId: "sourabh-portfolio-f9b84",
    storageBucket: "sourabh-portfolio-f9b84.firebasestorage.app",
    messagingSenderId: "19985433499",
    appId: "1:19985433499:web:45316d9155d7abcf42573e",
    measurementId: "G-QHWM7HFXRD"
};

const ADMIN_EMAIL = "paruisourabh4622@gmail.com";

let auth = null;
let googleProvider = null;
let cloudDocRef = null;

if (window.firebase) {
    if (!firebase.apps.length) {
        firebase.initializeApp(firebaseConfig);
    }
    auth = firebase.auth();
    googleProvider = new firebase.auth.GoogleAuthProvider();
    cloudDocRef = firebase.firestore().collection("portfolio").doc("main");
}

// =========================================================================
// 1. DEFAULT PORTFOLIO DATA (Synced with Sourabh Parui's Latest CV & Badges)
// =========================================================================
const DEFAULT_PORTFOLIO_DATA = {
    pin: '2026',
    profile: {
        name: 'Sourabh Parui',
        rolePill: 'Analyst Trainee (CIS) @ Cognizant',
        subtitle: 'Full-Stack Web Developer & AI/ML Engineer.',
        currentOrg: 'Cognizant • Kolkata, India',
        bio: 'I build production MERN applications, deep-learning diagnostic pipelines, and agentic AI workflows—combining enterprise IT reliability at Cognizant with hands-on software engineering.',
        email: 'paruisourabh4622@gmail.com',
        phone: '+91-9548046977',
        github: 'https://github.com/saurav4622',
        linkedin: 'https://www.linkedin.com/in/sourabh-parui',
        photoDataUrl: '',
        photoGrayscale: true
    },
    projects: [
        {
            id: 'neurovision',
            title: 'NeuroVision',
            year: '2025',
            subtitle: 'Full-Stack AI-Driven MRI Diagnostics SaaS Platform',
            tags: ['React.js', 'Node.js', 'MongoDB', 'Docker', 'TensorFlow', 'JWT'],
            github: 'https://github.com/saurav4622',
            live: '',
            bullets: [
                'Developed a full-stack AI-driven SaaS platform enabling secure MRI uploads, automated diagnostics, and real-time clinical explanations.',
                'Built a responsive React UI integrated with a Node.js/Express REST API and MongoDB for secure user and medical report storage.',
                'Integrated a CNN-based deep learning classifier trained on 34K images, reducing manual image review time by 40–55%.',
                'Implemented role-based access control using JWT tokens and Dockerized the application for seamless cloud deployment.'
            ],
            flow: [
                'MRI Upload via React UI',
                'JWT Auth & Express API',
                'CNN Inference (TensorFlow)',
                'Report Generation',
                'MongoDB Storage & Dashboard'
            ],
            impact: [
                { label: '34K Images Trained', color: 'emerald' },
                { label: '40–55% Faster Review', color: 'sky' },
                { label: 'Dockerized Deploy', color: 'violet' }
            ]
        },
        {
            id: 'alzheimers-cnn',
            title: "Alzheimer's Disease Detection",
            year: '2024',
            subtitle: 'Convolutional Neural Network for Early-Stage MRI Classification',
            tags: ['Python', 'TensorFlow', 'Keras', 'CNN', 'Data Augmentation'],
            github: 'https://github.com/saurav4622',
            live: '',
            bullets: [
                "Engineered a TensorFlow/Keras Convolutional Neural Network (CNN) to detect early signs of Alzheimer's disease from MRI scans.",
                'Optimized model training via image preprocessing, data augmentation, and regularization, achieving up to 92% stage-detection accuracy.',
                'Built automated Python batch-processing scripts for MRI datasets, increasing diagnostic throughput efficiency by 4x.'
            ],
            flow: [
                'MRI Dataset Ingestion',
                'Preprocessing & Augmentation',
                'CNN Training (Keras)',
                'Stage Classification',
                'Batch Reporting'
            ],
            impact: [
                { label: '92% Accuracy', color: 'emerald' },
                { label: '4x Throughput', color: 'sky' },
                { label: '4-Class Detection', color: 'amber' }
            ]
        }
    ],
    journey: [
        {
            period: '2019',
            title: 'Secondary (Class 10)',
            org: "Colonel's Brightland Public School (CBSE)",
            active: false,
            footerLabel: 'Score:',
            footerValue: '68.6%',
            bullets: []
        },
        {
            period: '2021 – 2022',
            title: 'Senior Secondary (Class 12)',
            org: 'John Milton Public School (CBSE) • Science',
            active: false,
            footerLabel: 'Score:',
            footerValue: '64.8%',
            bullets: []
        },
        {
            period: '2022 – 2025',
            title: 'Bachelor of Computer Applications',
            org: 'Techno India Hooghly (MAKAUT)',
            active: false,
            footerLabel: 'CGPA:',
            footerValue: '7.27 (65.20%)',
            bullets: []
        },
        {
            period: 'Aug 2025 – May 2026',
            title: 'STEM Instructor (Full-time)',
            org: 'East Point School, Icchapur (REPL)',
            active: false,
            bullets: [
                'Instructed Python & JavaScript fundamentals.',
                'Guided logic & web mini-projects with code reviews.'
            ]
        },
        {
            period: 'July 2026 – Present',
            title: 'Analyst Trainee (Service Desk / CIS)',
            org: 'Cognizant • Kolkata, India',
            active: true,
            bullets: [
                'First-level troubleshooting across enterprise hardware, software & network.',
                'SLA-driven incident tracking & infrastructure escalation.'
            ]
        }
    ],
    certifications: [
        {
            title: 'Build with Gemini (Intermediate)',
            issuer: 'Google Cloud',
            date: 'Sep 25, 2026',
            desc: 'Verified Intermediate Skill Badge in Generative AI & Gemini application development.',
            link: 'https://www.credly.com/go/sc1csZrb',
            featured: true
        },
        {
            title: 'AWS Partner: Agentic AI Essentials',
            issuer: 'AWS Training & Certification',
            date: 'Oct 29, 2026',
            desc: 'Foundational architecture and design patterns for autonomous agentic AI workflows on AWS.',
            link: '',
            featured: false
        },
        {
            title: 'AWS AI Practitioner: Basic AI Concepts',
            issuer: 'Cognizant / AWS',
            date: 'Nov 16, 2026',
            desc: 'Core AI/ML concepts and terminologies. Certificate ID: 2569323.',
            link: '',
            featured: false
        },
        {
            title: 'SAP S/4HANA Development',
            issuer: 'SAP University Alliances • Techno India Univ.',
            date: 'Jan – May 2025',
            desc: '5-month intensive program in enterprise SAP S/4HANA development practices.',
            link: '',
            featured: false
        },
        {
            title: 'Cognizant AI & Agentic AI Specialization',
            issuer: 'Cognizant Skillspring',
            date: 'Jul – Aug 2026',
            desc: "Includes: Cognizant's AI Strategy (Three Vectors), Introduction to Agentic AI, and Responsible AI at Cognizant.",
            link: '',
            featured: false
        }
    ]
};

const STORAGE_KEY = 'sourabh_portfolio_state_v2';
let portfolioState = loadPortfolioState();
let toastTimer = null;
let wavePathLength = 0;

function loadPortfolioState() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return structuredClone(DEFAULT_PORTFOLIO_DATA);
        const parsed = JSON.parse(raw);
        if (parsed && Array.isArray(parsed.projects)) {
            parsed.projects.forEach(p => {
                if (p.id === 'neurovision' && p.live === 'https://github.com/saurav4622') {
                    p.live = '';
                }
            });
        }
        return {
            ...structuredClone(DEFAULT_PORTFOLIO_DATA),
            ...parsed,
            profile: { ...DEFAULT_PORTFOLIO_DATA.profile, ...(parsed.profile || {}) }
        };
    } catch (err) {
        return structuredClone(DEFAULT_PORTFOLIO_DATA);
    }
}

async function persistPortfolioState() {
    const { pin, ...cleanData } = portfolioState;
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(cleanData));
    } catch (err) {
        showToast('Local storage limit reached');
    }

    if (cloudDocRef && auth && auth.currentUser && auth.currentUser.email === ADMIN_EMAIL) {
        try {
            await cloudDocRef.set(cleanData);
            showToast('Synced live to cloud!');
        } catch (err) {
            console.error('Firestore sync error:', err);
            showToast('Cloud sync failed: ' + err.message);
        }
    }
}

async function loadCloudPortfolioState() {
    if (!cloudDocRef) return;
    try {
        const snap = await cloudDocRef.get();
        if (snap.exists && snap.data()) {
            const cloudData = snap.data();
            portfolioState = {
                ...structuredClone(DEFAULT_PORTFOLIO_DATA),
                ...cloudData,
                profile: { ...DEFAULT_PORTFOLIO_DATA.profile, ...(cloudData.profile || {}) }
            };
            try {
                localStorage.setItem(STORAGE_KEY, JSON.stringify(portfolioState));
            } catch (e) {}
            renderAll();
        }
    } catch (err) {
        console.warn('Cloud fetch skipped or unavailable:', err);
    }
}

function escapeHTML(str) {
    return String(str ?? '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

function showToast(message) {
    const toast = document.getElementById('toast');
    const msgEl = document.getElementById('toast-message');
    if (!toast || !msgEl) return;
    msgEl.textContent = message;
    toast.classList.remove('opacity-0', 'translate-y-3');
    toast.classList.add('opacity-100', 'translate-y-0');
    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
        toast.classList.remove('opacity-100', 'translate-y-0');
        toast.classList.add('opacity-0', 'translate-y-3');
    }, 2600);
}

function copyText(text, label) {
    try {
        const temp = document.createElement('textarea');
        temp.value = text;
        temp.setAttribute('readonly', '');
        temp.style.position = 'fixed';
        temp.style.left = '-9999px';
        document.body.appendChild(temp);
        temp.select();
        document.execCommand('copy');
        document.body.removeChild(temp);
        showToast(`${label} copied to clipboard`);
    } catch (err) {
        showToast(`Copy failed: ${text}`);
    }
}

// =========================================================================
// 2. RENDER ALL DYNAMIC SECTIONS
// =========================================================================
function renderProfile() {
    const p = portfolioState.profile;
    const firstName = (p.name || 'Sourabh').split(' ')[0];
    document.getElementById('nav-brand-name').textContent = `${firstName}.`;
    document.getElementById('hero-name').textContent = `${p.name}.`;
    document.getElementById('hero-role-pill').textContent = p.rolePill;
    document.getElementById('hero-subtitle').textContent = p.subtitle;
    document.getElementById('hero-current-org').textContent = p.currentOrg;
    document.getElementById('hero-bio-text').textContent = p.bio;
    document.getElementById('portrait-card-name').textContent = p.name;
    document.getElementById('footer-email-text').textContent = p.email;
    document.getElementById('footer-phone-text').textContent = p.phone;

    const gh = document.getElementById('hero-github-link');
    const li = document.getElementById('hero-linkedin-link');
    if (gh && p.github) gh.href = p.github;
    if (li && p.linkedin) li.href = p.linkedin;

    const imgEl = document.getElementById('custom-portrait-img');
    const svgEl = document.getElementById('default-portrait-svg');
    const fileLabel = document.getElementById('portrait-filename');
    if (p.photoDataUrl) {
        imgEl.src = p.photoDataUrl;
        imgEl.classList.remove('hidden');
        imgEl.classList.toggle('grayscale', !!p.photoGrayscale);
        svgEl.classList.add('hidden');
        fileLabel.textContent = 'portrait_custom.jpg';
    } else {
        imgEl.src = '';
        imgEl.classList.add('hidden');
        svgEl.classList.remove('hidden');
        fileLabel.textContent = 'sourabh_portrait.svg';
    }
}

function renderProjects() {
    const grid = document.getElementById('projects-grid');
    if (!grid) return;

    grid.innerHTML = portfolioState.projects.map((proj, idx) => {
        const tagsHtml = (proj.tags || []).slice(0, 4).map(t =>
            `<span class="px-2.5 py-1 rounded-md bg-zinc-900 border border-zinc-800 font-mono text-[10px] text-zinc-300">${escapeHTML(t)}</span>`
        ).join('');

        return `
            <article onclick="openProjectModal(${idx})" class="folder-wrapper pt-6 select-none">
                <div class="w-36 h-7 rounded-t-2xl bg-zinc-900 border-t border-x border-zinc-800 ml-4 flex items-center px-3 font-mono text-[10px] text-zinc-400">
                    0${idx + 1} // ${escapeHTML(proj.year)}
                </div>

                <div class="relative">
                    <div class="folder-paper folder-paper-1 absolute inset-x-5 -top-3 h-24 rounded-2xl bg-zinc-900 border border-zinc-700/80 p-3 pointer-events-none">
                        <div class="w-16 h-1.5 rounded bg-zinc-700 mb-2"></div>
                        <div class="w-2/3 h-1.5 rounded bg-zinc-800"></div>
                    </div>
                    <div class="folder-paper folder-paper-2 absolute inset-x-8 -top-5 h-24 rounded-2xl bg-zinc-800/90 border border-zinc-600/70 p-3 pointer-events-none">
                        <div class="flex items-center justify-between">
                            <span class="font-mono text-[9px] text-zinc-300">CASE STUDY</span>
                            <span class="w-1.5 h-1.5 rounded-full bg-white"></span>
                        </div>
                    </div>

                    <div class="folder-front relative z-10 rounded-3xl bg-[#111113] border border-zinc-800 p-6 sm:p-7 flex flex-col justify-between min-h-[235px]">
                        <div>
                            <div class="flex items-start justify-between gap-3 mb-3">
                                <h3 class="text-xl sm:text-2xl font-bold text-white tracking-tight">${escapeHTML(proj.title)}</h3>
                                <span class="shrink-0 w-9 h-9 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center font-mono text-xs text-zinc-300">↗</span>
                            </div>
                            <p class="text-sm text-zinc-400 leading-relaxed mb-5">${escapeHTML(proj.subtitle)}</p>
                        </div>

                        <div class="space-y-4">
                            <div class="flex flex-wrap gap-1.5">${tagsHtml}</div>
                            <div class="pt-3 border-t border-zinc-800/80 flex items-center justify-between font-mono text-[11px] text-zinc-400">
                                <span>Inspect Architecture</span>
                                <span class="text-white">Open Folder →</span>
                            </div>
                        </div>
                    </div>
                </div>
            </article>
        `;
    }).join('');
}

function renderJourney() {
    const items = portfolioState.journey;
    const desktopGrid = document.getElementById('journey-desktop-grid');
    const waveNodes = document.getElementById('desktop-wave-nodes');
    const waveGhost = document.getElementById('desktop-wave-ghost');
    const waveActive = document.getElementById('desktop-wave-path');
    const mobileStack = document.getElementById('journey-mobile-stack');
    if (!desktopGrid || !waveNodes || !mobileStack) return;

    const count = Math.max(1, items.length);
    desktopGrid.style.gridTemplateColumns = `repeat(${count}, minmax(0, 1fr))`;

    const points = items.map((_, idx) => {
        const xPct = ((idx + 0.5) / count) * 100;
        const xSvg = xPct * 10;
        const isCrest = idx % 2 === 1;
        const ySvg = isCrest ? 34 : 104;
        const yPct = (ySvg / 140) * 100;
        return { xPct, xSvg, ySvg, yPct };
    });

    let pathD = '';
    if (points.length === 1) {
        pathD = `M 100 ${points[0].ySvg} L 900 ${points[0].ySvg}`;
    } else if (points.length > 1) {
        pathD = `M ${points[0].xSvg.toFixed(1)} ${points[0].ySvg.toFixed(1)}`;
        for (let i = 0; i < points.length - 1; i++) {
            const p1 = points[i];
            const p2 = points[i + 1];
            const midX = ((p1.xSvg + p2.xSvg) / 2).toFixed(1);
            pathD += ` C ${midX} ${p1.ySvg.toFixed(1)}, ${midX} ${p2.ySvg.toFixed(1)}, ${p2.xSvg.toFixed(1)} ${p2.ySvg.toFixed(1)}`;
        }
    }

    if (waveGhost && waveActive) {
        waveGhost.setAttribute('d', pathD);
        waveActive.setAttribute('d', pathD);
        wavePathLength = waveActive.getTotalLength();
        waveActive.style.strokeDasharray = wavePathLength;
        waveActive.style.strokeDashoffset = wavePathLength;
    }

    waveNodes.innerHTML = items.map((item, idx) => {
        const pt = points[idx];
        const dotClass = item.active
            ? 'w-4 h-4 bg-white border-2 border-white wave-node-pulse'
            : 'w-3.5 h-3.5 bg-zinc-950 border-2 border-zinc-400';

        return `
            <div class="absolute -translate-x-1/2 flex flex-col items-center" style="left:${pt.xPct.toFixed(2)}%; top:${pt.yPct.toFixed(2)}%; bottom:0;">
                <div class="-translate-y-1/2 rounded-full shrink-0 ${dotClass}"></div>
                <div class="w-[1px] flex-1 border-l border-dashed border-zinc-700/80"></div>
            </div>
        `;
    }).join('');

    const buildCardHTML = (item) => {
        const cardStyle = item.active
            ? 'bg-gradient-to-b from-zinc-900 to-[#111113] border-zinc-500 shadow-lg'
            : 'bg-[#111113] border-zinc-800/90 hover:border-zinc-700';
        const badgeStyle = item.active
            ? 'bg-white text-black font-bold'
            : 'bg-zinc-900 text-zinc-300';

        const bulletsHtml = item.bullets && item.bullets.length
            ? `<ul class="space-y-1.5 text-[11px] text-zinc-300 leading-relaxed pt-2.5 border-t border-zinc-800/80">${item.bullets.map(b => `<li>• ${escapeHTML(b)}</li>`).join('')}</ul>`
            : (item.footerValue ? `<div class="pt-3 border-t border-zinc-800/80 font-mono text-xs text-zinc-400">${escapeHTML(item.footerLabel || 'Result:')} <span class="text-white font-semibold">${escapeHTML(item.footerValue)}</span></div>` : '');

        return `
            <div class="rounded-2xl border p-5 h-full transition-all flex flex-col justify-between ${cardStyle}">
                <div>
                    <span class="inline-block px-2.5 py-1 rounded-md font-mono text-[10px] mb-3 ${badgeStyle}">${escapeHTML(item.period)}</span>
                    <h3 class="text-sm font-bold text-white mb-1">${escapeHTML(item.title)}</h3>
                    <p class="text-xs text-zinc-400 mb-3">${escapeHTML(item.org)}</p>
                </div>
                ${bulletsHtml}
            </div>
        `;
    };

    desktopGrid.innerHTML = items.map(item =>
        `<div class="h-full transition-transform duration-300 hover:-translate-y-1">${buildCardHTML(item)}</div>`
    ).join('');

    const mobileItems = [...items].reverse();
    mobileStack.innerHTML = mobileItems.map((item, idx) => {
        const nodeOffset = idx % 2 === 0 ? '-left-[29px]' : '-left-[22px]';
        const dotClass = item.active
            ? 'w-3.5 h-3.5 bg-white wave-node-pulse'
            : 'w-3 h-3 bg-zinc-950 border-2 border-zinc-400';
        return `
            <div class="relative">
                <div class="absolute ${nodeOffset} top-6 rounded-full ${dotClass}"></div>
                ${buildCardHTML(item)}
            </div>
        `;
    }).join('');
}

function renderCertifications() {
    const grid = document.getElementById('certifications-grid');
    if (!grid) return;

    grid.innerHTML = portfolioState.certifications.map((cert) => {
        const highlightClass = cert.featured
            ? 'border-zinc-500 bg-gradient-to-br from-zinc-900 via-[#111113] to-[#111113]'
            : 'border-zinc-800/90 bg-[#111113] hover:border-zinc-700';

        const linkHtml = cert.link
            ? `<a href="${escapeHTML(cert.link)}" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-1 font-mono text-xs text-white hover:underline">Verify Credential ↗</a>`
            : `<span class="font-mono text-[11px] text-zinc-500">Verified Completion</span>`;

        return `
            <div class="rounded-3xl border p-6 flex flex-col justify-between transition-all ${highlightClass}">
                <div>
                    <div class="flex items-center justify-between gap-2 mb-4 font-mono text-[10px]">
                        <span class="px-2.5 py-1 rounded-md bg-zinc-900 border border-zinc-800 text-zinc-300">${escapeHTML(cert.issuer)}</span>
                        <span class="text-zinc-500">${escapeHTML(cert.date)}</span>
                    </div>
                    <h3 class="text-lg font-bold text-white mb-2 leading-snug">${escapeHTML(cert.title)}</h3>
                    <p class="text-xs text-zinc-400 leading-relaxed mb-5">${escapeHTML(cert.desc)}</p>
                </div>
                <div class="pt-3 border-t border-zinc-800/80 flex items-center justify-between">
                    ${linkHtml}
                    ${cert.featured ? '<span class="px-2 py-0.5 rounded bg-white text-black font-mono text-[10px] font-bold">CREDLY</span>' : ''}
                </div>
            </div>
        `;
    }).join('');
}

function renderAll() {
    renderProfile();
    renderProjects();
    renderJourney();
    renderCertifications();
    updateScrollAnimations();
}

// =========================================================================
// 3. VIEWPORT-ACCURATE SCROLL ANIMATIONS (Hero Portrait + Wavy Timeline)
// =========================================================================
const heroTrack = document.getElementById('hero-scroll-track');
const heroEditorial = document.getElementById('hero-editorial-banner');
const heroPortrait = document.getElementById('hero-portrait-card');
const heroLeftBio = document.getElementById('hero-left-bio');
const heroRightBio = document.getElementById('hero-right-bio');
const heroScrollHint = document.getElementById('hero-scroll-hint');

function updateScrollAnimations() {
    const isDesktop = window.innerWidth >= 1024;
    const headerOffset = 64;

    if (heroTrack && heroPortrait) {
        const rect = heroTrack.getBoundingClientRect();
        const viewportH = window.innerHeight - headerOffset;
        const scrollable = Math.max(1, heroTrack.offsetHeight - viewportH);
        const progress = Math.min(1, Math.max(0, (headerOffset - rect.top) / scrollable));

        if (isDesktop) {
            const editorialOpacity = Math.max(0, 1 - progress * 2.1);
            const editorialY = -progress * 44;
            heroEditorial.style.opacity = editorialOpacity.toFixed(3);
            heroEditorial.style.transform = `translateY(${editorialY.toFixed(1)}px) scale(${(1 - progress * 0.05).toFixed(3)})`;

            const portraitScale = 1.02 - progress * 0.02;
            const portraitY = -progress * 42;
            const portraitRotateY = Math.sin(progress * Math.PI) * -6;
            const portraitRotateX = (1 - progress) * 3.5;
            heroPortrait.style.transform = `translateY(${portraitY.toFixed(1)}px) scale(${portraitScale.toFixed(3)}) rotateY(${portraitRotateY.toFixed(2)}deg) rotateX(${portraitRotateX.toFixed(2)}deg)`;

            const bioProgress = Math.min(1, Math.max(0, (progress - 0.12) / 0.55));
            const bioY = -progress * 42;
            heroLeftBio.style.opacity = bioProgress.toFixed(3);
            heroLeftBio.style.transform = `translate(${((1 - bioProgress) * -22).toFixed(1)}px, ${bioY.toFixed(1)}px)`;
            heroLeftBio.style.pointerEvents = bioProgress > 0.25 ? 'auto' : 'none';

            heroRightBio.style.opacity = bioProgress.toFixed(3);
            heroRightBio.style.transform = `translate(${((1 - bioProgress) * 22).toFixed(1)}px, ${bioY.toFixed(1)}px)`;
            heroRightBio.style.pointerEvents = bioProgress > 0.25 ? 'auto' : 'none';

            if (heroScrollHint) {
                heroScrollHint.style.opacity = Math.max(0, 1 - progress * 4).toFixed(2);
            }
        } else {
            heroEditorial.style.opacity = '1';
            heroEditorial.style.transform = 'none';
            heroLeftBio.style.opacity = '1';
            heroLeftBio.style.transform = 'none';
            heroLeftBio.style.pointerEvents = 'auto';
            heroRightBio.style.opacity = '1';
            heroRightBio.style.transform = 'none';
            heroRightBio.style.pointerEvents = 'auto';

            const cardRect = heroPortrait.getBoundingClientRect();
            const centerOffset = (cardRect.top + cardRect.height / 2 - window.innerHeight / 2) / window.innerHeight;
            const mobileTilt = Math.min(6, Math.max(-6, centerOffset * 12));
            heroPortrait.style.transform = `perspective(900px) rotateX(${mobileTilt.toFixed(2)}deg)`;
        }
    }

    const desktopWavePath = document.getElementById('desktop-wave-path');
    if (desktopWavePath && wavePathLength > 0) {
        const journeyEl = document.getElementById('journey');
        if (journeyEl) {
            const jRect = journeyEl.getBoundingClientRect();
            const startY = window.innerHeight * 0.92;
            const endY = window.innerHeight * 0.25;
            const viewProgress = Math.min(1, Math.max(0, (startY - jRect.top) / (startY - endY)));
            desktopWavePath.style.strokeDashoffset = (wavePathLength * (1 - viewProgress)).toFixed(1);
        }
    }
}

let scrollTicking = false;
window.addEventListener('scroll', () => {
    if (!scrollTicking) {
        window.requestAnimationFrame(() => {
            updateScrollAnimations();
            scrollTicking = false;
        });
        scrollTicking = true;
    }
}, { passive: true });
window.addEventListener('resize', updateScrollAnimations);

// =========================================================================
// 4. TECH STACK FILTER TABS & MOBILE MENU & CLIPBOARD
// =========================================================================
document.querySelectorAll('.stack-filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const filter = btn.dataset.filter;
        document.querySelectorAll('.stack-filter-btn').forEach(b => {
            const active = b === btn;
            b.className = active
                ? 'stack-filter-btn shrink-0 min-h-[40px] px-4 py-2 rounded-xl font-mono text-xs font-semibold bg-white text-black transition-all'
                : 'stack-filter-btn shrink-0 min-h-[40px] px-4 py-2 rounded-xl font-mono text-xs font-medium bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white transition-all';
        });
        document.querySelectorAll('.stack-card').forEach(card => {
            const match = filter === 'all' || card.dataset.stackGroup === filter;
            card.classList.toggle('hidden', !match);
        });
    });
});

const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const mobileMenu = document.getElementById('mobile-menu');
const iconOpen = document.getElementById('menu-icon-open');
const iconClose = document.getElementById('menu-icon-close');

function setMobileMenu(open) {
    mobileMenu.classList.toggle('hidden', !open);
    iconOpen.classList.toggle('hidden', open);
    iconClose.classList.toggle('hidden', !open);
}
mobileMenuBtn.addEventListener('click', () => setMobileMenu(mobileMenu.classList.contains('hidden')));
document.querySelectorAll('.mobile-nav-link').forEach(link => {
    link.addEventListener('click', () => setMobileMenu(false));
});

document.getElementById('copy-email-btn').addEventListener('click', () => copyText(portfolioState.profile.email, 'Email'));
document.getElementById('copy-phone-btn').addEventListener('click', () => copyText(portfolioState.profile.phone, 'Phone number'));

// =========================================================================
// 5. PROJECT CASE STUDY MODAL
// =========================================================================
function openProjectModal(idx) {
    const proj = portfolioState.projects[idx];
    if (!proj) return;
    document.getElementById('modal-year').textContent = proj.year;
    document.getElementById('modal-title').textContent = proj.title;
    document.getElementById('modal-subtitle').textContent = proj.subtitle;
    document.getElementById('modal-bullets').innerHTML = (proj.bullets || []).map(b =>
        `<li class="flex gap-2.5"><span class="text-zinc-500">▸</span><span>${escapeHTML(b)}</span></li>`
    ).join('');
    document.getElementById('modal-tags').innerHTML = (proj.tags || []).map(t =>
        `<span class="px-3 py-1 rounded-lg bg-zinc-900 border border-zinc-800 font-mono text-xs text-zinc-200">${escapeHTML(t)}</span>`
    ).join('');

    // Render architecture flow pipeline
    const flowContainer = document.getElementById('modal-flow');
    if (flowContainer) {
        if (proj.flow && proj.flow.length) {
            flowContainer.innerHTML = proj.flow.map((step, i) => {
                const arrow = i < proj.flow.length - 1
                    ? '<span class="shrink-0 text-zinc-600 text-xs">→</span>'
                    : '';
                return `<span class="shrink-0 px-2.5 py-1 rounded-md bg-zinc-900 border border-zinc-800 font-mono text-[11px] text-zinc-200">${escapeHTML(step)}</span>${arrow}`;
            }).join('');
            flowContainer.parentElement.classList.remove('hidden');
        } else {
            flowContainer.parentElement.classList.add('hidden');
        }
    }

    // Render impact metric pills
    const impactContainer = document.getElementById('modal-impact');
    if (impactContainer) {
        if (proj.impact && proj.impact.length) {
            const colorMap = {
                emerald: 'bg-emerald-950/60 border-emerald-800 text-emerald-300',
                sky: 'bg-sky-950/60 border-sky-800 text-sky-300',
                violet: 'bg-violet-950/60 border-violet-800 text-violet-300',
                amber: 'bg-amber-950/60 border-amber-800 text-amber-300',
                rose: 'bg-rose-950/60 border-rose-800 text-rose-300'
            };
            const fallback = 'bg-zinc-900 border-zinc-700 text-zinc-200';
            impactContainer.innerHTML = proj.impact.map(m => {
                const cls = colorMap[m.color] || fallback;
                return `<span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border font-mono text-[11px] font-medium ${cls}"><span class="w-1.5 h-1.5 rounded-full bg-current opacity-70"></span>${escapeHTML(m.label)}</span>`;
            }).join('');
            impactContainer.parentElement.classList.remove('hidden');
        } else {
            impactContainer.parentElement.classList.add('hidden');
        }
    }

    const ghBtn = document.getElementById('modal-github');
    const liveBtn = document.getElementById('modal-live');
    const ghUrl = (proj.github || portfolioState.profile.github || '').trim();
    const liveUrl = (proj.live || '').trim();

    ghBtn.href = ghUrl;
    if (liveUrl && liveUrl !== ghUrl) {
        liveBtn.href = liveUrl;
        liveBtn.classList.remove('hidden');
    } else {
        liveBtn.classList.add('hidden');
    }

    document.getElementById('project-modal').classList.remove('hidden');
    document.body.style.overflow = 'hidden';
}

function closeProjectModal() {
    document.getElementById('project-modal').classList.add('hidden');
    document.body.style.overflow = '';
}

document.getElementById('project-modal').addEventListener('click', (e) => {
    if (e.target.id === 'project-modal') closeProjectModal();
});

// =========================================================================
// 6. OWNER-ONLY ADMIN CONSOLE (Firebase Google Sign-In + PIN Fallback)
// =========================================================================
let isAdminUnlocked = false;
let editingProjectIndex = null;

async function signInAdminWithGoogle() {
    if (!auth || !googleProvider) {
        showToast('Firebase SDK not loaded in index.html');
        return;
    }
    try {
        const result = await auth.signInWithPopup(googleProvider);
        if (result.user && result.user.email === ADMIN_EMAIL) {
            isAdminUnlocked = true;
            showAdminDashboard();
            showToast('Signed in as ' + result.user.email);
        } else {
            await auth.signOut();
            showToast('Access denied: unauthorized Google account');
        }
    } catch (err) {
        console.error('Google Sign-In error:', err);
        showToast('Google Sign-In failed: ' + err.message);
    }
}

function openAdminModal() {
    document.getElementById('admin-modal').classList.remove('hidden');
    document.body.style.overflow = 'hidden';

    const alreadyAuthed = auth && auth.currentUser && auth.currentUser.email === ADMIN_EMAIL;
    if (isAdminUnlocked || alreadyAuthed) {
        isAdminUnlocked = true;
        showAdminDashboard();
    } else {
        document.getElementById('admin-lock-screen').classList.remove('hidden');
        document.getElementById('admin-dashboard').classList.add('hidden');
        document.getElementById('admin-pin-input').value = '';
        document.getElementById('admin-pin-error').classList.add('hidden');
        // Automatically trigger Google Sign-In popup for quick admin unlock
        signInAdminWithGoogle();
    }
}

function closeAdminModal() {
    document.getElementById('admin-modal').classList.add('hidden');
    document.body.style.overflow = '';
}

document.getElementById('open-admin-btn').addEventListener('click', openAdminModal);
document.getElementById('admin-modal').addEventListener('click', (e) => {
    if (e.target.id === 'admin-modal') closeAdminModal();
});

// Keyboard shortcut Ctrl+Shift+A
window.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'a') {
        e.preventDefault();
        openAdminModal();
    }
    if (e.key === 'Escape') {
        closeProjectModal();
        closeAdminModal();
    }
});

// Submitting the lock form triggers Google Sign-In (with local-only PIN fallback)
document.getElementById('admin-pin-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const entered = document.getElementById('admin-pin-input').value.trim();
    if (!entered) {
        signInAdminWithGoogle();
        return;
    }
    if (entered === String(portfolioState.pin)) {
        isAdminUnlocked = true;
        showAdminDashboard();
        showToast('Unlocked locally (sign in with Google to sync cloud)');
        signInAdminWithGoogle();
    } else {
        document.getElementById('admin-pin-error').classList.remove('hidden');
    }
});

function showAdminDashboard() {
    document.getElementById('admin-lock-screen').classList.add('hidden');
    document.getElementById('admin-dashboard').classList.remove('hidden');
    populateAdminFields();
}

document.querySelectorAll('.admin-tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const target = btn.dataset.adminTab;
        document.querySelectorAll('.admin-tab-btn').forEach(b => {
            const active = b === btn;
            b.className = active
                ? 'admin-tab-btn shrink-0 px-3.5 py-2.5 rounded-t-xl bg-zinc-900 text-white border-t border-x border-zinc-800'
                : 'admin-tab-btn shrink-0 px-3.5 py-2.5 rounded-t-xl text-zinc-400 hover:text-white';
        });
        document.querySelectorAll('.admin-panel').forEach(p => {
            p.classList.toggle('hidden', p.id !== `admin-panel-${target}`);
        });
    });
});

function populateAdminFields() {
    const p = portfolioState.profile;
    document.getElementById('edit-name').value = p.name;
    document.getElementById('edit-role-pill').value = p.rolePill;
    document.getElementById('edit-current-org').value = p.currentOrg;
    document.getElementById('edit-email').value = p.email;
    document.getElementById('edit-bio').value = p.bio;
    document.getElementById('edit-photo-bw').checked = !!p.photoGrayscale;

    document.getElementById('admin-projects-list').innerHTML = portfolioState.projects.map((pr, i) => `
        <div class="flex items-center justify-between gap-3 p-3 rounded-xl bg-zinc-950 border border-zinc-800">
            <div>
                <p class="text-xs font-semibold text-white">${escapeHTML(pr.title)} <span class="text-zinc-500 font-mono">(${escapeHTML(pr.year)})</span></p>
                <p class="text-[11px] text-zinc-400">${escapeHTML(pr.subtitle)}</p>
            </div>
            <div class="flex items-center gap-2">
                <button type="button" onclick="editProject(${i})" class="px-3 py-1.5 rounded-lg bg-zinc-800 text-zinc-200 font-mono text-[10px] hover:bg-zinc-700">Edit</button>
                <button type="button" onclick="deleteProject(${i})" class="px-3 py-1.5 rounded-lg bg-red-950/60 text-red-300 font-mono text-[10px] hover:bg-red-900/60">Delete</button>
            </div>
        </div>
    `).join('');

    document.getElementById('admin-journey-list').innerHTML = portfolioState.journey.map((j, i) => `
        <div class="flex items-center justify-between gap-3 p-3 rounded-xl bg-zinc-950 border border-zinc-800">
            <div>
                <p class="text-xs font-semibold text-white">${escapeHTML(j.title)} <span class="text-zinc-500 font-mono">(${escapeHTML(j.period)})</span></p>
                <p class="text-[11px] text-zinc-400">${escapeHTML(j.org)}</p>
            </div>
            <button type="button" onclick="deleteJourney(${i})" class="px-3 py-1.5 rounded-lg bg-red-950/60 text-red-300 font-mono text-[10px] hover:bg-red-900/60">Delete</button>
        </div>
    `).join('');

    document.getElementById('admin-certs-list').innerHTML = portfolioState.certifications.map((c, i) => `
        <div class="flex items-center justify-between gap-3 p-3 rounded-xl bg-zinc-950 border border-zinc-800">
            <div>
                <p class="text-xs font-semibold text-white">${escapeHTML(c.title)}</p>
                <p class="text-[11px] text-zinc-400">${escapeHTML(c.issuer)} • ${escapeHTML(c.date)}</p>
            </div>
            <button type="button" onclick="deleteCert(${i})" class="px-3 py-1.5 rounded-lg bg-red-950/60 text-red-300 font-mono text-[10px] hover:bg-red-900/60">Delete</button>
        </div>
    `).join('');
}

// Compress portrait photo via Canvas so it always fits cleanly inside Firestore (< 1MB)
function compressPortraitImage(file, maxDim = 480, quality = 0.8) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onerror = reject;
        reader.onload = () => {
            const img = new Image();
            img.onerror = reject;
            img.onload = () => {
                let { width, height } = img;
                if (width > maxDim || height > maxDim) {
                    if (width > height) {
                        height = Math.round((height * maxDim) / width);
                        width = maxDim;
                    } else {
                        width = Math.round((width * maxDim) / height);
                        height = maxDim;
                    }
                }
                const canvas = document.createElement('canvas');
                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, width, height);
                resolve(canvas.toDataURL('image/jpeg', quality));
            };
            img.src = reader.result;
        };
        reader.readAsDataURL(file);
    });
}

document.getElementById('edit-photo-file').addEventListener('change', async (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    try {
        const compressedDataUrl = await compressPortraitImage(file, 480, 0.8);
        portfolioState.profile.photoDataUrl = compressedDataUrl;
        renderProfile();
        await persistPortfolioState();
    } catch (err) {
        console.error(err);
        showToast('Image processing failed');
    }
});

async function clearPortraitPhoto() {
    portfolioState.profile.photoDataUrl = '';
    renderProfile();
    await persistPortfolioState();
    showToast('Restored default SVG portrait');
}

async function saveProfileEdits() {
    portfolioState.profile.name = document.getElementById('edit-name').value.trim() || portfolioState.profile.name;
    portfolioState.profile.rolePill = document.getElementById('edit-role-pill').value.trim();
    portfolioState.profile.currentOrg = document.getElementById('edit-current-org').value.trim();
    portfolioState.profile.email = document.getElementById('edit-email').value.trim();
    portfolioState.profile.bio = document.getElementById('edit-bio').value.trim();
    portfolioState.profile.photoGrayscale = document.getElementById('edit-photo-bw').checked;
    renderProfile();
    await persistPortfolioState();
}

function editProject(idx) {
    const proj = portfolioState.projects[idx];
    if (!proj) return;
    editingProjectIndex = idx;
    document.getElementById('new-proj-title').value = proj.title || '';
    document.getElementById('new-proj-year').value = proj.year || '';
    document.getElementById('new-proj-subtitle').value = proj.subtitle || '';
    document.getElementById('new-proj-tags').value = (proj.tags || []).join(', ');
    document.getElementById('new-proj-github').value = proj.github || '';
    document.getElementById('new-proj-live').value = proj.live || '';
    document.getElementById('new-proj-bullets').value = (proj.bullets || []).join('\n');

    const submitBtn = document.querySelector('#add-project-form button[type="submit"]');
    if (submitBtn) submitBtn.textContent = 'Update Project';

    const form = document.getElementById('add-project-form');
    if (form) {
        form.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
    const titleInput = document.getElementById('new-proj-title');
    if (titleInput) titleInput.focus();
}

document.getElementById('add-project-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const title = document.getElementById('new-proj-title').value.trim();
    const year = document.getElementById('new-proj-year').value.trim();
    const subtitle = document.getElementById('new-proj-subtitle').value.trim();
    const tags = document.getElementById('new-proj-tags').value.split(',').map(s => s.trim()).filter(Boolean);
    const github = document.getElementById('new-proj-github').value.trim() || portfolioState.profile.github;
    const live = document.getElementById('new-proj-live').value.trim();
    const bullets = document.getElementById('new-proj-bullets').value.split('\n').map(s => s.trim()).filter(Boolean);

    if (editingProjectIndex !== null && portfolioState.projects[editingProjectIndex]) {
        const existing = portfolioState.projects[editingProjectIndex];
        portfolioState.projects[editingProjectIndex] = {
            ...existing,
            title,
            year,
            subtitle,
            tags,
            github,
            live,
            bullets
        };
        editingProjectIndex = null;
        const submitBtn = document.querySelector('#add-project-form button[type="submit"]');
        if (submitBtn) submitBtn.textContent = 'Add Project';
        showToast('Project updated successfully');
    } else {
        portfolioState.projects.unshift({
            id: 'proj-' + Date.now(),
            title,
            year,
            subtitle,
            tags,
            github,
            live,
            bullets
        });
        showToast('Project added successfully');
    }

    if (e.target && e.target.reset) {
        e.target.reset();
    } else {
        const formEl = document.getElementById('add-project-form');
        if (formEl && formEl.reset) formEl.reset();
    }
    renderProjects();
    populateAdminFields();
    await persistPortfolioState();
});

async function deleteProject(idx) {
    if (editingProjectIndex === idx) {
        editingProjectIndex = null;
        const form = document.getElementById('add-project-form');
        if (form) form.reset();
        const submitBtn = document.querySelector('#add-project-form button[type="submit"]');
        if (submitBtn) submitBtn.textContent = 'Add Project';
    } else if (editingProjectIndex !== null && idx < editingProjectIndex) {
        editingProjectIndex--;
    }
    portfolioState.projects.splice(idx, 1);
    renderProjects();
    populateAdminFields();
    await persistPortfolioState();
}

document.getElementById('add-journey-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    portfolioState.journey.push({
        period: document.getElementById('new-j-period').value.trim(),
        title: document.getElementById('new-j-title').value.trim(),
        org: document.getElementById('new-j-org').value.trim(),
        active: document.getElementById('new-j-active').checked,
        bullets: document.getElementById('new-j-bullets').value.split('\n').map(s => s.trim()).filter(Boolean)
    });
    e.target.reset();
    renderJourney();
    updateScrollAnimations();
    populateAdminFields();
    await persistPortfolioState();
});

async function deleteJourney(idx) {
    portfolioState.journey.splice(idx, 1);
    renderJourney();
    updateScrollAnimations();
    populateAdminFields();
    await persistPortfolioState();
}

document.getElementById('add-cert-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    portfolioState.certifications.unshift({
        title: document.getElementById('new-cert-title').value.trim(),
        issuer: document.getElementById('new-cert-issuer').value.trim(),
        date: document.getElementById('new-cert-date').value.trim(),
        desc: document.getElementById('new-cert-desc').value.trim(),
        link: document.getElementById('new-cert-link').value.trim(),
        featured: false
    });
    e.target.reset();
    renderCertifications();
    populateAdminFields();
    await persistPortfolioState();
});

async function deleteCert(idx) {
    portfolioState.certifications.splice(idx, 1);
    renderCertifications();
    populateAdminFields();
    await persistPortfolioState();
}

function updateAdminPin() {
    const val = document.getElementById('new-pin-input').value.trim();
    if (val.length < 4) {
        showToast('PIN must be at least 4 characters');
        return;
    }
    portfolioState.pin = val;
    document.getElementById('new-pin-input').value = '';
    showToast('Local fallback PIN updated');
}

async function resetPortfolioData() {
    try { localStorage.removeItem(STORAGE_KEY); } catch (e) {}
    editingProjectIndex = null;
    const form = document.getElementById('add-project-form');
    if (form) form.reset();
    const submitBtn = document.querySelector('#add-project-form button[type="submit"]');
    if (submitBtn) submitBtn.textContent = 'Add Project';
    portfolioState = structuredClone(DEFAULT_PORTFOLIO_DATA);
    renderAll();
    populateAdminFields();
    await persistPortfolioState();
    showToast('Restored default portfolio');
}

function downloadUpdatedHTML() {
    try {
        const clone = document.documentElement.cloneNode(true);
        const scripts = clone.querySelectorAll('script');
        scripts.forEach(s => {
            if (s.textContent && s.textContent.includes('const DEFAULT_PORTFOLIO_DATA =')) {
                const serialized = JSON.stringify(portfolioState, null, 4);
                s.textContent = s.textContent.replace(
                    /const DEFAULT_PORTFOLIO_DATA = [\s\S]*?;\s*\n\s*const STORAGE_KEY/,
                    `const DEFAULT_PORTFOLIO_DATA = ${serialized};\n\n        const STORAGE_KEY`
                );
            }
        });
        const html = '<!DOCTYPE html>\n' + clone.outerHTML;
        const blob = new Blob([html], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'index.html';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        showToast('Downloaded updated index.html');
    } catch (err) {
        showToast('Export failed in this browser');
    }
}

// =========================================================================
// 7. BUILT-IN AI ASSISTANT WIDGET (XSS-Safe)
// =========================================================================
function toggleChat(forceState) {
    const win = document.getElementById('chat-window');
    const isHidden = win.classList.contains('hidden');
    const nextOpen = typeof forceState === 'boolean' ? forceState : isHidden;
    win.classList.toggle('hidden', !nextOpen);
    if (nextOpen) {
        setTimeout(() => document.getElementById('chat-input').focus(), 120);
    }
}

function appendChatMessage(role, text) {
    const container = document.getElementById('chat-messages');
    const bubble = document.createElement('div');
    if (role === 'user') {
        bubble.className = 'ml-auto max-w-[85%] p-3 rounded-2xl rounded-tr-sm bg-white text-black font-medium';
        bubble.textContent = text;
    } else {
        bubble.className = 'max-w-[90%] p-3 rounded-2xl rounded-tl-sm bg-zinc-900 border border-zinc-800 text-zinc-200';
        bubble.textContent = text;
    }
    container.appendChild(bubble);
    container.scrollTop = container.scrollHeight;
}

function generateAssistantReply(query) {
    const q = query.toLowerCase();
    const p = portfolioState.profile;

    if (q.includes('cognizant') || q.includes('experience') || q.includes('work') || q.includes('job') || q.includes('stem')) {
        return `Sourabh is currently an Analyst Trainee (Service Desk / CIS) at Cognizant in Kolkata (July 2026 – Present), handling enterprise troubleshooting, SLA tracking, and infrastructure escalations. Previously, he worked full-time as a STEM Instructor at East Point School (Aug 2025 – May 2026) teaching Python and JavaScript.`;
    }
    if (q.includes('neuro') || q.includes('project') || q.includes('alzheimer') || q.includes('mri') || q.includes('cnn')) {
        return `His flagship project is NeuroVision (2025), a Dockerized MERN + TensorFlow AI SaaS platform for MRI diagnostics trained on 34K images (cutting manual review time by 40–55%). He also built an Alzheimer's Disease Detection CNN (2024) achieving up to 92% accuracy with 4x batch-processing throughput.`;
    }
    if (q.includes('cert') || q.includes('badge') || q.includes('aws') || q.includes('gemini') || q.includes('sap') || q.includes('credly')) {
        return `Sourabh holds the Google Cloud "Build with Gemini" Intermediate Skill Badge (verified on Credly), AWS Partner: Agentic AI Essentials, AWS AI Practitioner (Cert #2569323), a 5-month SAP S/4HANA Development certificate, and Cognizant's AI & Agentic AI Skillspring certifications.`;
    }
    if (q.includes('skill') || q.includes('stack') || q.includes('tech') || q.includes('mern')) {
        return `Core stack: JavaScript (ES6+), React.js, Node.js, Express.js, MongoDB, Tailwind CSS, Python, Java, C, TensorFlow, Keras, Scikit-Learn, Docker, JWT, REST APIs, Gemini API, and SAP S/4HANA.`;
    }
    if (q.includes('education') || q.includes('bca') || q.includes('college') || q.includes('degree')) {
        return `Sourabh earned his Bachelor of Computer Applications (BCA) from Techno India Hooghly (MAKAUT) in 2025 with a 7.27 CGPA (65.20%).`;
    }
    if (q.includes('contact') || q.includes('email') || q.includes('phone') || q.includes('hire') || q.includes('reach')) {
        return `You can email Sourabh at ${p.email}, call ${p.phone}, or connect on GitHub (saurav4622) and LinkedIn (sourabh-parui).`;
    }
    return `I can tell you about Sourabh's current role at Cognizant, his NeuroVision & Alzheimer's AI projects, his MERN + AI/ML tech stack, his Google Cloud / AWS / SAP certifications, or his contact details. What would you like to know?`;
}

function sendQuickPrompt(text) {
    appendChatMessage('user', text);
    setTimeout(() => appendChatMessage('assistant', generateAssistantReply(text)), 220);
}

document.getElementById('chat-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const input = document.getElementById('chat-input');
    const text = input.value.trim();
    if (!text) return;
    input.value = '';
    appendChatMessage('user', text);
    setTimeout(() => appendChatMessage('assistant', generateAssistantReply(text)), 240);
});

// Initial Render + Cloud Fetch
window.addEventListener('DOMContentLoaded', () => {
    renderAll();
    loadCloudPortfolioState();
});
renderAll();
loadCloudPortfolioState();