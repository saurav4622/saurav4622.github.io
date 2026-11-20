(function () {
    'use strict';

    const scene = document.getElementById('crowd-scene');
    const rearCanvas = document.getElementById('crowd-canvas-rear');
    const frontCanvas = document.getElementById('crowd-canvas-front');
    const characterCanvas = document.getElementById('footer-character');
    const backToTopButton = document.getElementById('footer-back-top');

    if (!scene || !rearCanvas || !frontCanvas || !characterCanvas || !backToTopButton) {
        console.error('Footer crowd animation could not start: required footer elements are missing.');
        return;
    }

    const rearContext = rearCanvas.getContext('2d', { alpha: true });
    const frontContext = frontCanvas.getContext('2d', { alpha: true });
    const characterContext = characterCanvas.getContext('2d', { alpha: true, willReadFrequently: true });
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

    if (!rearContext || !frontContext) {
        console.error('Footer crowd animation is unavailable: a crowd canvas context could not be created.');
    }
    if (!characterContext) {
        console.error('Footer character artwork is unavailable: its canvas context could not be created.');
    }

    let sprites = [];
    let rearWalkers = [];
    let frontWalkers = [];
    let rearOverlayWalkers = [];
    let sceneWidth = 0;
    let sceneHeight = 0;
    let elapsed = 0;
    let lastTimestamp = null;
    let frameId = null;
    let pixelRatio = 1;
    let paused = false;
    let inView = false;
    let pageHidden = document.hidden;
    let reducedMotion = motionQuery.matches;
    let destroyed = false;

    function nearWhiteAt(data, pixel) {
        const offset = pixel * 4;
        return data[offset + 3] !== 0 &&
            data[offset] > 235 &&
            data[offset + 1] > 235 &&
            data[offset + 2] > 235;
    }

    function clearExteriorWhite(imageData) {
        const width = imageData.width;
        const height = imageData.height;
        const data = imageData.data;
        const queue = new Int32Array(width * height);
        let queueStart = 0;
        let queueEnd = 0;

        function addIfExteriorWhite(pixel) {
            if (nearWhiteAt(data, pixel)) {
                data[pixel * 4 + 3] = 0;
                queue[queueEnd] = pixel;
                queueEnd += 1;
            }
        }

        for (let x = 0; x < width; x += 1) {
            addIfExteriorWhite(x);
            addIfExteriorWhite((height - 1) * width + x);
        }
        for (let y = 1; y < height - 1; y += 1) {
            addIfExteriorWhite(y * width);
            addIfExteriorWhite(y * width + width - 1);
        }

        while (queueStart < queueEnd) {
            const pixel = queue[queueStart];
            queueStart += 1;
            const x = pixel % width;
            const y = Math.floor(pixel / width);

            if (x > 0) addIfExteriorWhite(pixel - 1);
            if (x + 1 < width) addIfExteriorWhite(pixel + 1);
            if (y > 0) addIfExteriorWhite(pixel - width);
            if (y + 1 < height) addIfExteriorWhite(pixel + width);
        }
    }

    function findArtworkBounds(imageData) {
        const data = imageData.data;
        let minX = imageData.width;
        let minY = imageData.height;
        let maxX = -1;
        let maxY = -1;

        for (let y = 0; y < imageData.height; y += 1) {
            for (let x = 0; x < imageData.width; x += 1) {
                if (data[(y * imageData.width + x) * 4 + 3] > 0) {
                    if (x < minX) minX = x;
                    if (x > maxX) maxX = x;
                    if (y < minY) minY = y;
                    if (y > maxY) maxY = y;
                }
            }
        }

        if (maxX < minX || maxY < minY) return null;
        return { x: minX, y: minY, width: maxX - minX + 1, height: maxY - minY + 1 };
    }

    function trimCanvas(canvas, context) {
        const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
        clearExteriorWhite(imageData);
        context.putImageData(imageData, 0, 0);

        const bounds = findArtworkBounds(imageData);
        if (!bounds) return null;

        const trimmedCanvas = document.createElement('canvas');
        trimmedCanvas.width = bounds.width;
        trimmedCanvas.height = bounds.height;
        const trimmedContext = trimmedCanvas.getContext('2d', { alpha: true });
        if (!trimmedContext) {
            throw new Error('Unable to create a canvas for a trimmed sprite.');
        }
        trimmedContext.drawImage(
            canvas,
            bounds.x,
            bounds.y,
            bounds.width,
            bounds.height,
            0,
            0,
            bounds.width,
            bounds.height
        );
        return trimmedCanvas;
    }

    function processCharacter(image) {
        if (!characterContext) {
            throw new Error('Unable to access the character canvas context.');
        }
        const source = document.createElement('canvas');
        source.width = image.naturalWidth;
        source.height = image.naturalHeight;
        const sourceContext = source.getContext('2d', { alpha: true, willReadFrequently: true });
        if (!sourceContext) {
            throw new Error('Unable to create a canvas for the character artwork.');
        }
        sourceContext.drawImage(image, 0, 0);
        const trimmed = trimCanvas(source, sourceContext);
        if (!trimmed) {
            throw new Error('The character artwork contains no visible pixels.');
        }

        characterCanvas.width = trimmed.width;
        characterCanvas.height = trimmed.height;
        characterContext.clearRect(0, 0, trimmed.width, trimmed.height);
        characterContext.drawImage(trimmed, 0, 0);
    }

    function processCrowdSheet(image) {
        const cellWidth = image.naturalWidth / 5;
        const cellHeight = image.naturalHeight / 3;
        const processed = [];

        for (let row = 0; row < 3; row += 1) {
            for (let column = 0; column < 5; column += 1) {
                const left = Math.floor(column * cellWidth);
                const top = Math.floor(row * cellHeight);
                const right = Math.floor((column + 1) * cellWidth);
                const bottom = Math.floor((row + 1) * cellHeight);
                const cell = document.createElement('canvas');
                cell.width = right - left;
                cell.height = bottom - top;
                const cellContext = cell.getContext('2d', { alpha: true, willReadFrequently: true });
                if (!cellContext) {
                    throw new Error('Unable to create a canvas for a crowd sprite.');
                }
                cellContext.drawImage(
                    image,
                    left,
                    top,
                    cell.width,
                    cell.height,
                    0,
                    0,
                    cell.width,
                    cell.height
                );

                const trimmed = trimCanvas(cell, cellContext);
                if (trimmed) {
                    processed.push({
                        index: row * 5 + column,
                        canvas: trimmed,
                        width: trimmed.width,
                        height: trimmed.height
                    });
                }
            }
        }

        if (!processed.length) {
            throw new Error('The crowd artwork contains no visible sprites.');
        }
        return processed;
    }

    function loadImage(path, onLoad) {
        const image = new Image();
        image.onload = function () {
            try {
                onLoad(image);
            } catch (error) {
                console.error('Footer crowd artwork could not be processed:', error);
            }
        };
        image.onerror = function () {
            console.error('Footer crowd artwork could not be loaded:', path);
        };
        image.src = path;
    }

    function shuffledSpriteSequence(count) {
        const sequence = [];
        let previousIndex = -1;

        while (sequence.length < count) {
            const deck = sprites.slice();
            for (let i = deck.length - 1; i > 0; i -= 1) {
                const swapIndex = Math.floor(Math.random() * (i + 1));
                const current = deck[i];
                deck[i] = deck[swapIndex];
                deck[swapIndex] = current;
            }

            if (deck.length > 1 && deck[0].index === previousIndex) {
                const alternateIndex = deck.findIndex(function (sprite) {
                    return sprite.index !== previousIndex;
                });
                const first = deck[0];
                deck[0] = deck[alternateIndex];
                deck[alternateIndex] = first;
            }

            for (let i = 0; i < deck.length && sequence.length < count; i += 1) {
                sequence.push(deck[i]);
                previousIndex = deck[i].index;
            }
        }

        return sequence;
    }

    function createWalkers(count, direction, row) {
        if (!sprites.length || !sceneWidth) return [];
        const sequence = shuffledSpriteSequence(count);
        const walkers = [];
        const mobile = window.innerWidth < 600;
        const maxSpriteWidth = Math.max.apply(null, sequence.map(function (sprite) {
            return sprite.width;
        }));

        for (let i = 0; i < count; i += 1) {
            const sprite = sequence[i];
            const minimumHeight = row === 'rear'
                ? (mobile ? 94 : 120)
                : (mobile ? 160 : 205);
            const maximumHeight = row === 'rear'
                ? (mobile ? 142 : 188)
                : (mobile ? 226 : 292);
            const height = minimumHeight + Math.random() * (maximumHeight - minimumHeight);
            const width = height * sprite.width / sprite.height;
            const slot = ((i + 0.5) / count) * (sceneWidth + maxSpriteWidth);
            const x = direction > 0 ? slot - width : sceneWidth - slot;

            walkers.push({
                sprite: sprite,
                width: width,
                height: height,
                x: x,
                direction: direction,
                duration: 10 + Math.random() * 6,
                phase: Math.random() * Math.PI * 2,
                row: row,
                speed: 0
            });
        }

        updateWalkerSpeeds(walkers);
        return walkers;
    }

    function updateWalkerSpeeds(walkers) {
        for (let i = 0; i < walkers.length; i += 1) {
            walkers[i].speed = (sceneWidth + walkers[i].width) / walkers[i].duration;
        }
    }

    function configureCanvases() {
        const rect = scene.getBoundingClientRect();
        sceneWidth = rect.width;
        sceneHeight = rect.height;
        pixelRatio = Math.min(window.devicePixelRatio || 1, 2);

        [rearCanvas, frontCanvas].forEach(function (canvas, index) {
            canvas.width = Math.max(1, Math.round(sceneWidth * pixelRatio));
            canvas.height = Math.max(1, Math.round(sceneHeight * pixelRatio));
            const context = index === 0 ? rearContext : frontContext;
            if (context) context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
        });

        if (sprites.length) {
            const isMobile = window.innerWidth < 600;
            rearWalkers = createWalkers(isMobile ? 7 : 25, 1, 'rear');
            frontWalkers = createWalkers(isMobile ? 3 : 16, -1, 'front');
            rearOverlayWalkers = rearWalkers.filter(function (_walker, index) {
                return index % 5 === 0;
            });
        }
    }

    function drawWalkers(context, walkers) {
        for (let i = 0; i < walkers.length; i += 1) {
            const walker = walkers[i];
            const bob = (Math.sin(elapsed * Math.PI * 4 + walker.phase) + 1) * 5;
            const bottom = walker.row === 'rear' ? sceneHeight - 22 : sceneHeight + 6;
            context.drawImage(
                walker.sprite.canvas,
                walker.x,
                bottom - walker.height + bob,
                walker.width,
                walker.height
            );
        }
    }

    function renderFrame() {
        if (rearContext) {
            rearContext.clearRect(0, 0, sceneWidth, sceneHeight);
            drawWalkers(rearContext, rearWalkers);
        }
        if (frontContext) {
            frontContext.clearRect(0, 0, sceneWidth, sceneHeight);
            drawWalkers(frontContext, rearOverlayWalkers);
            drawWalkers(frontContext, frontWalkers);
        }
    }

    function advanceWalkers(walkers, dt) {
        for (let i = 0; i < walkers.length; i += 1) {
            const walker = walkers[i];
            walker.x += walker.direction * walker.speed * dt;
            if (walker.direction > 0 && walker.x > sceneWidth) {
                walker.x = -walker.width;
            } else if (walker.direction < 0 && walker.x + walker.width < 0) {
                walker.x = sceneWidth;
            }
        }
    }

    function canAnimate() {
        return !destroyed && !paused && !reducedMotion && inView && !pageHidden &&
            sprites.length > 0 && Boolean(rearContext) && Boolean(frontContext);
    }

    function stopLoop() {
        if (frameId !== null) {
            window.cancelAnimationFrame(frameId);
            frameId = null;
        }
        lastTimestamp = null;
    }

    function animationFrame(timestamp) {
        frameId = null;
        if (!canAnimate()) return;

        const dt = lastTimestamp === null ? 0 : Math.min((timestamp - lastTimestamp) / 1000, 0.1);
        lastTimestamp = timestamp;
        elapsed += dt;
        advanceWalkers(rearWalkers, dt);
        advanceWalkers(frontWalkers, dt);
        renderFrame();

        if (canAnimate()) {
            frameId = window.requestAnimationFrame(animationFrame);
        }
    }

    function syncAnimation() {
        if (!canAnimate()) {
            stopLoop();
            return;
        }
        if (frameId === null) {
            lastTimestamp = null;
            frameId = window.requestAnimationFrame(animationFrame);
        }
    }

    function setPaused(nextPaused) {
        paused = nextPaused;
        scene.setAttribute('aria-pressed', String(paused));
        scene.setAttribute('aria-label', paused ? 'Resume crowd animation' : 'Pause crowd animation');
        scene.setAttribute('title', paused ? 'Resume the crowd animation' : 'Pause the crowd animation');
        if (reducedMotion || !sprites.length) renderFrame();
        syncAnimation();
    }

    function togglePaused() {
        setPaused(!paused);
    }

    function handleSceneKeydown(event) {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            togglePaused();
        }
    }

    function handleResize() {
        configureCanvases();
        renderFrame();
        syncAnimation();
    }

    function handleVisibilityChange() {
        pageHidden = document.hidden;
        syncAnimation();
    }

    function handleMotionChange(event) {
        reducedMotion = event.matches;
        if (reducedMotion) {
            stopLoop();
            renderFrame();
        } else {
            syncAnimation();
        }
    }

    function handleBackToTop() {
        window.scrollTo({
            top: 0,
            behavior: motionQuery.matches ? 'auto' : 'smooth'
        });
        if (typeof window.updateScrollAnimations === 'function') {
            window.updateScrollAnimations();
        }
    }

    function handleIntersection(entries) {
        inView = entries.some(function (entry) {
            return entry.isIntersecting;
        });
        syncAnimation();
    }

    function removeListeners() {
        scene.removeEventListener('click', togglePaused);
        scene.removeEventListener('keydown', handleSceneKeydown);
        window.removeEventListener('resize', handleResize);
        document.removeEventListener('visibilitychange', handleVisibilityChange);
        backToTopButton.removeEventListener('click', handleBackToTop);
        window.removeEventListener('pagehide', handlePageHide);
        window.removeEventListener('pageshow', handlePageShow);
        if (typeof motionQuery.removeEventListener === 'function') {
            motionQuery.removeEventListener('change', handleMotionChange);
        } else if (typeof motionQuery.removeListener === 'function') {
            motionQuery.removeListener(handleMotionChange);
        }
    }

    function handlePageHide(event) {
        stopLoop();
        if (observer) observer.disconnect();
        if (!event.persisted) {
            destroyed = true;
            removeListeners();
        }
    }

    function handlePageShow(event) {
        if (!event.persisted || destroyed) return;
        if (observer) observer.observe(scene);
        else inView = true;
        pageHidden = document.hidden;
        syncAnimation();
    }

    scene.addEventListener('click', togglePaused);
    scene.addEventListener('keydown', handleSceneKeydown);
    window.addEventListener('resize', handleResize, { passive: true });
    document.addEventListener('visibilitychange', handleVisibilityChange);
    backToTopButton.addEventListener('click', handleBackToTop);
    window.addEventListener('pagehide', handlePageHide);
    window.addEventListener('pageshow', handlePageShow);
    if (typeof motionQuery.addEventListener === 'function') {
        motionQuery.addEventListener('change', handleMotionChange);
    } else if (typeof motionQuery.addListener === 'function') {
        motionQuery.addListener(handleMotionChange);
    }

    const observer = 'IntersectionObserver' in window
        ? new IntersectionObserver(handleIntersection, { threshold: 0.01 })
        : null;
    if (observer) observer.observe(scene);
    else inView = true;

    configureCanvases();
    renderFrame();

    loadImage('assets/footer/character.png', processCharacter);
    loadImage('assets/footer/crowd.png', function (image) {
        sprites = processCrowdSheet(image);
        configureCanvases();
        renderFrame();
        syncAnimation();
    });
})();
