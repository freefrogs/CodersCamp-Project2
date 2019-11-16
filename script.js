document.addEventListener('DOMContentLoaded', function() {
    const paletteArray = [
        ['rgb(109,177,176)', 'rgb(56,93,112)', 'rgb(105,84,127)', 'rgb(244,101,105)', 'rgb(255,160,132)'],
        ['rgb(11,87,171)', 'rgb(9,46,117)', 'rgb(232,119,59)', 'rgb(114,33,76)', 'rgb(45,21,57)'],
        ['rgb(182,47,43)', 'rgb(243,152,0)', 'rgb(196,179,3)', 'rgb(139,216,208)', 'rgb(49,103,105)'],
        ['rgb(246,172,13)', 'rgb(243,232,3)', 'rgb(4,193,225)', 'rgb(117,228,222)', 'rgb(214,235,179)'],
        ['rgb(79,53,56)', 'rgb(140,106,107)', 'rgb(220,163,143)', 'rgb(130,151,168)', 'rgb(91,130,163)'],
        ['rgb(69,67,18)', 'rgb(185,179,103)', 'rgb(251,192,194)', 'rgb(185,84,92)', 'rgb(76,4,26)'],
        ['rgb(166,50,95)', 'rgb(225,149,188)', 'rgb(222,220,225)', 'rgb(134,170,166)', 'rgb(65,108,117)'],
        ['rgb(254,235,70)', 'rgb(241,182,26)', 'rgb(143,106,149)', 'rgb(78,44,120)', 'rgb(23,2,67)'],
        ['rgb(34,18,31)', 'rgb(80,7,89)', 'rgb(22,179,230)', 'rgb(84,222,225)', 'rgb(29,108,103)']
    ];

    const patternsArray = [
        'images/patterns/bear.png',
        'images/patterns/cat.png',
        'images/patterns/fox.png',
        'images/patterns/lion.png',
        'images/patterns/swan.png'
    ];

    // Random
    const random = arr => Math.floor(Math.random()*arr.length);

    // Add color to button from data-color
    const  paletteButtons = document.querySelectorAll('.color');

    const addPalette = function() {
        [...paletteButtons].forEach(button => {
            let bgColor = button.dataset.color;
            button.style.backgroundColor = bgColor;
        });
    };
    addPalette();

    // Remove checked from color buttons
    const removeChecked = (arr) => arr.forEach(el => el.classList.remove('checked'));

    // Hide instruction box
    const close = document.querySelector('.instructionBtn');
    const instructionBox = document.querySelector('aside');
    const closeInstruction = () => instructionBox.style.display = 'none';
    close.addEventListener('click', closeInstruction);

    // Draw pattern
    const getPattern = function() {
        let index = random(patternsArray);
        let pattern = patternsArray[index];
        return pattern;
    };

    // Draw palette
    const paletteBtn = document.querySelector('.palette');
    const getPalette = function() {
        let index = random(paletteArray);
        let palette = Array.from(paletteArray[index]);
        
        for (let i = 0; i < paletteButtons.length; i++) {
            paletteButtons[i].dataset.color = palette[i];
        };
        removeChecked([...paletteButtons]);
        addPalette();
    };
    paletteBtn.addEventListener('click', getPalette);

    // Canvas
    const canvasBox = document.querySelector('.drawing_canvas');

    class Drawing {
        constructor(pattern) {
            this.img = new Image();
            this.img.addEventListener('load', () => {
                this.createCanvas();
                this.canDraw = false;
                this.lastX = 0;
                this.lastY = 0;
                this.setInitialDrawValue();
                this.setControls();
                this.bindControls();
            });
            this.img.src = 'images/patterns/transparent.png';
            this.pattern = pattern
        }

        createCanvas() {
            this.canvas = document.createElement('canvas');
            this.canvas.style.backgroundImage = `url(${this.pattern})`;
            this.canvas.width = canvasBox.offsetWidth;
            // I don't know why canvasBox.offsetWidth = 0, check letter
            this.canvas.height = document.documentElement.clientHeight;
            canvasBox.appendChild(this.canvas);
            this.ctx = this.canvas.getContext('2d');
        }

        setInitialDrawValue() {
            // Set pattern
            this.ctx.drawImage(this.img, 0, 0)
            // Initial drawing settings
            this.ctx.lineWidth = 5;
            this.ctx.lineJoin = 'round';
            this.ctx.lineCap = 'round';
            this.ctx.strokeStyle = 'rgb(246,172,13)';
        }

        setControls() {
            // Buttons - line thickness 
            this.bntsLine = [...document.querySelectorAll('.line')];
            this.bntsLine[0].classList.add('checked');
            // Buttons - line color
            this.btnsColor = [...document.querySelectorAll('.color')];
            this.btnsColor[0].classList.add('checked');
            this.colorPicker = document.querySelector('.user_color');
         }

        bindControls() {
            // Controls
            this.colorPicker.addEventListener('change', this.setColor1.bind(this));
            this.btnsColor.forEach(btn => btn.addEventListener('click', this.setColor2.bind(this)));
            this.bntsLine.forEach(btn => btn.addEventListener('click', this.setThickness.bind(this)));
            // Canvas with mouse
            this.canvas.addEventListener('mousemove', this.draw.bind(this));
            this.canvas.addEventListener('mousedown', this.startDraw.bind(this));
            this.canvas.addEventListener('mouseup', this.stopDraw.bind(this));
            this.canvas.addEventListener('mouseout', this.stopDraw.bind(this));
            // Canvas with mouse
            this.canvas.addEventListener("touchmove", this.touch.bind(this));
            this.canvas.addEventListener("touchstart", this.startTouch.bind(this));
            this.canvas.addEventListener("touchend", this.stopTouch.bind(this));
            // Add checked to current color & thickness button
            this.addChecked(this.bntsLine);
            this.addChecked(this.btnsColor);
        }

        addChecked(arr) {
            for (const btn of arr) {
                btn.addEventListener('click', (e) => {
                    e.currentTarget.classList.add('checked');
                    for (const el of arr) {
                        if (el !== e.currentTarget) {
                            el.classList.remove('checked');
                        }
                    };
                });
            };
        }

        // Set line color with color picker
        setColor1(e) {
            this.ctx.strokeStyle = e.target.value;
        }

        // Set line color with palette button
        setColor2(e) {
            this.ctx.strokeStyle = e.target.dataset.color;
        }

        // Set line thickness
        setThickness(e) {
            this.ctx.lineWidth = e.target.dataset.line;
        }

        // Preventing scrolling on document.body if the target of a touch event is the canvas
        scrollingPrevent(e) {
            if (e.target == this.canvas) {
                e.preventDefault();
            }
        }

        // Start drawing with mouse
        startDraw(e) {
            this.canDraw = true;
            const position = this.getMousePosition(e);
            [this.lastX, this.lastY] = [position.x, position.y];
        }

        // Start drawing with touch
        startTouch(e) {
            this.scrollingPrevent(e);
            this.canDraw = true;
            const position = this.getTouchPosition(e);
            [this.lastX, this.lastY] = [position.x, position.y];           
        }

        // Stop drawing with mouse
        stopDraw() {
            this.canDraw = false;
        }

        // Stop drawing with touch
        stopTouch(e) {
            this.scrollingPrevent(e);
            this.stopDraw();
        }

        // Drawing with mouse
        draw(e) {
            if (!this.canDraw) return;
            const position = this.getMousePosition(e);
            this.ctx.beginPath();
            this.ctx.moveTo(this.lastX, this.lastY);
            this.ctx.lineTo(position.x, position.y);
            this.ctx.stroke();
            [this.lastX, this.lastY] = [position.x, position.y];
        }

        // Drawing with touch
        touch(e) {
            this.scrollingPrevent(e);
            if (!this.canDraw) return;
            const position = this.getTouchPosition(e);
            this.ctx.beginPath();
            this.ctx.moveTo(this.lastX, this.lastY);
            this.ctx.lineTo(position.x, position.y);
            this.ctx.stroke();
            [this.lastX, this.lastY] = [position.x, position.y];
        }

        getMousePosition(e) {
            const rect = this.canvas.getBoundingClientRect();
            const scaleX = this.canvas.width / rect.width;
            const scaleY = this.canvas.height / rect.height;
            const X = (e.clientX - rect.left)*scaleX;
            const Y = (e.clientY - rect.top)*scaleY;
            return {
                x: X,
                y: Y
            };
        }

        getTouchPosition(e) {
            const rect = this.canvas.getBoundingClientRect();
            const scaleX = this.canvas.width / rect.width;
            const scaleY = this.canvas.height / rect.height;
            const X = (e.touches[0].clientX - rect.left)*scaleX;
            const Y = (e.touches[0].clientY - rect.top)*scaleY;
            return {
                x: X,
                y: Y
            }
        }
    };

    // Add first canvas
    const drawing = new Drawing(getPattern());

    // Clear Canvas, get new pattern
    const patternBtn = document.querySelector('.pattern');
    const newPattern = function() {
        // Add iniltial settings
        removeChecked([...document.querySelectorAll('.line')]);
        removeChecked([...paletteButtons]);
        for (let i = 0; i < [...paletteButtons].length; i++) {
            [...paletteButtons][i].dataset.color = paletteArray[3][i];
        };
        addPalette();
        // Delete old canvas
        let oldCanvas = document.querySelector('canvas');
        canvasBox.removeChild(oldCanvas);
        // Add new canvas
        const drawing = new Drawing(getPattern());
    };
    patternBtn.addEventListener('click', newPattern);
});