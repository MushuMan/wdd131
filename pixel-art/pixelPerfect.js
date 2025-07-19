const grid = document.getElementById('grid');
const colorPicker = document.getElementById('colorPicker');
const clearButton = document.getElementById('clearButton');
const palette = document.getElementById('palette');
const saveButton = document.getElementById('saveButton');
const rowsInput = document.getElementById('rowsInput');
// const columnsInput = document.getElementById('columnsInput');
// const pixelSizeInput = document.getElementById('pixelSizeInput');
const makeGridButton = document.getElementById('makeGridButton');
const eraserButton = document.getElementById('eraserButton');
const paintbrushButton = document.getElementById('paintbrushButton');
const eyedropperButton = document.getElementById('eyedropperButton');
const undoButton = document.getElementById('undoButton');
const redoButton = document.getElementById('redoButton');
let isPainting = false;
let currentTool = 'paintbrush';
let historyList = [];
let redoList = [];

const baseColors = [
    { name: 'red', hue: 0 },
    { name: 'yellow', hue: 60 },
    { name: 'green', hue: 120 },
    { name: 'cyan', hue: 180 },
    { name: 'blue', hue: 240 },
    { name: 'magenta', hue: 300},
    { name: 'black', hue: 0, isGray: true, lightnessValues: [10, 20, 30, 40] },
    { name: 'white', hue: 0, isGray: true, lightnessValues: [90, 95, 98, 100] }
];

function hslToHex(h, s, l) {
    s /= 100;
    l /= 100;
    let c = (1 - Math.abs(2 * l - 1)) * s;
    let x = c * (1 - Math.abs((h / 60) % 2 - 1));
    let m = l - c / 2;
    let r = 0, g = 0, b = 0
    if (h >= 0 && h < 60) {
        r = c; g = x; b = 0;
    } else if (h < 120) {
        r = x; g = c; b = 0;
    } else if (h < 180) {
        r = 0; g = c; b = x;
    } else if (h < 240) {
        r = 0; g = x; b = c;
    } else if (h < 300) {
        r = x; g = 0; b = c;
    } else {
        r = c; g = 0; b = x;
    };
    let toHex = val => Math.round((val + m) * 255).toString(16).padStart(2, '0');
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
};

function createPalette() {
    palette.innerHTML = '';
    const defaultLightness = [25, 45, 65, 85];
    baseColors.forEach(color => {
        let lightnessValues = color.lightnessValues || defaultLightness;
        lightnessValues.forEach(lightness => {
            let h = 0, s = 0, l = lightness;
            if (color.isGray) {
                h = 0;
                s = 0;
            } else if (typeof color.hue === 'number') {
                h = color.hue;
                s = 100;
            } else {
                console.warn('Skipping invalid color:', color);
                return;
            };
            let hexColor = hslToHex(h, s, l);
            let colorCell = document.createElement('div');
            colorCell.className = 'colorOption';
            colorCell.style.backgroundColor = hexColor;
            colorCell.setAttribute('data-color', hexColor);
            colorCell.title = `${color.name} ${l}%`;
            palette.appendChild(colorCell);
            console.log(`Generated ${hexColor} for ${color.name}`);
        });
    });
};

createPalette();

const colorOptions = palette.querySelectorAll('.colorOption');

function createGrid(rows, columns) {
    grid.innerHTML = '';
    const gridSize = 480;
    let pixelSize = gridSize / rows;
    grid.style.gridTemplateRows = `repeat(${rows}, ${pixelSize}px)`;
    grid.style.gridTemplateColumns = `repeat(${columns}, ${pixelSize}px)`;
    let totalCells = rows * columns;
    for (let i = 0; i < totalCells; i++) {
        let pixel = document.createElement('div');
        pixel.classList.add('pixel');
        pixel.style.width = `${pixelSize}px`;
        pixel.style.height = `${pixelSize}px`;
        pixel.addEventListener('mousedown', () => {
            isPainting = true;
            let previousColor = pixel.style.backgroundColor;
            let newColor = '';
            if (currentTool === 'paintbrush') {
                newColor = colorPicker.value;
                pixel.style.backgroundColor = newColor;
            } else if (currentTool === 'eraser') {
                newColor = '';
                pixel.style.backgroundColor = newColor;
            } else if (currentTool === 'eyedropper') {
                let color = pixel.style.backgroundColor;
                if (color) {
                    colorPicker.value = rgbToHex(color);
                    setActiveTool('paintbrush');
                };
            };
            if (previousColor !== newColor) {
                recordChange(pixel, previousColor, newColor);
            };
        });
        pixel.addEventListener('mouseenter', () => {
            if (isPainting) {
                let previousColor = pixel.style.backgroundColor;
                let newColor = '';
                if (currentTool === 'paintbrush') {
                    newColor = colorPicker.value;
                    pixel.style.backgroundColor = newColor;
                } else if (currentTool === 'eraser') {
                    newColor = '';
                    pixel.style.backgroundColor = newColor;
                };
                if (previousColor !== newColor) {
                    recordChange(pixel, previousColor, newColor);
                };
            };
        });
        pixel.addEventListener('dragstart', e => e.preventDefault());
        grid.appendChild(pixel);
        };
};

createGrid(parseInt(rowsInput.value), parseInt(rowsInput.value));

document.addEventListener('mouseup', () => {
    isPainting = false;
});

clearButton.addEventListener('click', () => {
    const pixels = document.querySelectorAll('.pixel');
    pixels.forEach(pixel => {
        pixel.style.backgroundColor = 'white';
    });
});

colorOptions.forEach(colorOption => {
    colorOption.addEventListener('click', () => {
        let color = colorOption.getAttribute('data-color');
        colorPicker.value = color;
    });
});

saveButton.addEventListener('click', () => {
    const grid = document.getElementById('grid');
    grid.style.gap = '0px';
    grid.style.border = 'none';
    grid.style.backgroundColor = 'white';
    grid.querySelectorAll('.pixel').forEach(pixel => {
        pixel.style.border = 'none';
    });
    html2canvas(grid, {
        backgroundColor: null,
        useCORS: true
    }).then(canvas => {
        const link = document.createElement('a');
        link.download = 'pixel-art.png';
        link.href = canvas.toDataURL('image/png');
        link.click();
    });
    grid.style.gap = '1px';
    grid.style.border = '2px solid grey';
    grid.style.backgroundColor = 'lightgrey';
    grid.querySelectorAll('.pixel').forEach(pixel => {
        pixel.style.border = '';
    });
});

makeGridButton.addEventListener('click', () => {
    let rows = parseInt(rowsInput.value);
    // let columns = parseInt(columnsInput.value);
    if (isNaN(rows) || rows < 1) rows = 16;
    createGrid(rows, rows);
});

function setActiveTool(tool) {
    currentTool = tool;
    [eraserButton, paintbrushButton, eyedropperButton].forEach(button => button.classList.remove('active'));
    if (tool === 'paintbrush') paintbrushButton.classList.add('active');
    if (tool === 'eraser') eraserButton.classList.add('active');
    if (tool === 'eyedropper') eyedropperButton.classList.add('active');
};

eraserButton.addEventListener('click', () => {
    currentTool = 'eraser';
    setActiveTool(currentTool);
}); 

paintbrushButton.addEventListener('click', () => {
    currentTool = 'paintbrush';
    setActiveTool(currentTool);
});

eyedropperButton.addEventListener('click', () => {
    currentTool = 'eyedropper';
    setActiveTool(currentTool);
});

function rgbToHex(rgb) {
    let match = rgb.match(/\d+/g);
    if (!match) return '#000000';
    return ('#' + match.slice(0, 3).map(x => parseInt(x).toString(16).padStart(2, '0')).join(''));
};

function recordChange(pixel, previousColor, newColor) {
    historyList.push({
        pixel: pixel,
        previousColor: previousColor,
        newColor: newColor
    });
    redoList = [];
};

undoButton.addEventListener('click', () => {
    let action = historyList.pop();
    if (action) {
        action.pixel.style.backgroundColor = action.previousColor;
        redoList.push(action);
    };
});

redoButton.addEventListener('click', () => {
    let action = redoList.pop();
    if (action) {
        action.pixel.style.backgroundColor = action.newColor;
        historyList.push(action);
    };
});