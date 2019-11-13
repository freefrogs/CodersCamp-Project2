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

    // Add color to button from data-color
    const  paletteButtons = document.querySelectorAll('.color');

    const addPalette = function() {
        [...paletteButtons].forEach(button => {
            let bgColor = button.dataset.color;
            button.style.backgroundColor = bgColor;
        });
    }

    addPalette();

    // Hide instruction box
    const close = document.querySelector('.instructionBtn');
    const instructionBox = document.querySelector('aside');

    const closeInstruction = () => instructionBox.style.display = 'none';

    close.addEventListener('click', closeInstruction);
});