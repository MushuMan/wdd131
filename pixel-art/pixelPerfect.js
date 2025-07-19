const grid = document.getElementById('grid');
const gridContainer = document.getElementById('gridContainer');
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
const toggleGridButton = document.getElementById('toggleGridButton');
const brushSizeInput = document.getElementById('brushSize');
let brushSize = parseInt(brushSizeInput.value);
let gridLinesVisible = true;
let isPainting = false;
let currentTool = 'paintbrush';
let historyList = [];
let redoList = [];
let scale = 1
let currentAction = null;
const minScale = 1;
const maxScale = 4;

gridContainer.addEventListener('wheel', (e) => {
    e.preventDefault();
    let rect = grid.getBoundingClientRect();
    let mouseX = e.clientX - rect.left;
    let mouseY = e.clientY - rect.top;
    let previousScale = scale;
    scale += e.deltaY < 0 ? 0.1 : -0.1;
    scale = Math.min(maxScale, Math.max(minScale, scale));
    let dx = mouseX / previousScale;
    let dy = mouseY / previousScale;
    grid.style.transformOrigin = `${dx}px ${dy}px`;
    grid.style.transform = `scale(${scale})`;
})

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
    for (let row = 0; row < rows; row++) {
        for (let column = 0; column < columns; column++) {
            let pixel = document.createElement('div');
            pixel.classList.add('pixel');
            pixel.style.width = `${pixelSize}px`;
            pixel.style.height = `${pixelSize}px`;
            pixel.dataset.row = row;
            pixel.dataset.col = column;
            pixel.addEventListener('mousedown', () => {
                isPainting = true;
                currentAction = [];
                redoList = [];
                let newColor = '';
                if (currentTool === 'paintbrush') {
                    newColor = colorPicker.value;
                    paintPixels(pixel, newColor);
                } else if (currentTool === 'eraser') {
                    newColor = '';
                    paintPixels(pixel, newColor);
                } else if (currentTool === 'eyedropper') {
                    let color = pixel.style.backgroundColor;
                    if (color) {
                        colorPicker.value = rgbToHex(color);
                        setActiveTool('paintbrush');
                    };
                };
            });
            pixel.addEventListener('mouseenter', () => {
                if (isPainting) {
                    let newColor = '';
                    if (currentTool === 'paintbrush') {
                        newColor = colorPicker.value;
                        paintPixels(pixel, newColor);
                    } else if (currentTool === 'eraser') {
                        newColor = '';
                        paintPixels(pixel, newColor);
                    };
                };
            });
            pixel.addEventListener('dragstart', e => e.preventDefault());
            grid.appendChild(pixel);
            };

            };
};

createGrid(parseInt(rowsInput.value), parseInt(rowsInput.value));

document.addEventListener('mouseup', () => {
    isPainting = false;
    if (currentAction && currentAction.length > 0) {
        recordChange();
    };
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
    grid.style.border = 'none';
    grid.style.backgroundColor = 'white';
    if (gridLinesVisible) {
        grid.querySelectorAll('.pixel').forEach(pixel => {
            pixel.classList.add('noGrid');
        });
    }
    html2canvas(grid, {
        backgroundColor: null,
        useCORS: true
    }).then(canvas => {
        const link = document.createElement('a');
        link.download = 'pixel-art.png';
        link.href = canvas.toDataURL('image/png');
        link.click();
    });
    grid.style.border = '2px solid grey';
    grid.style.backgroundColor = 'lightgrey';
    if (gridLinesVisible) {
        grid.querySelectorAll('.pixel').forEach(pixel => {
            pixel.classList.remove('noGrid');
        });
    };
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

function recordChange() {
    historyList.push([...currentAction]);
    currentAction = [];
};

undoButton.addEventListener('click', () => {
    if (historyList.length === 0) return;
    let lastAction = historyList.pop();
    redoList.push([...lastAction]);
    lastAction.forEach(change => {
        change.pixel.style.backgroundColor = change.previousColor;
    });
});

redoButton.addEventListener('click', () => {
    if (redoList.length === 0) return;
    let nextAction = redoList.pop();
    historyList.push([...nextAction]);
    nextAction.forEach(change => {
        change.pixel.style.backgroundColor = change.newColor;
    });
});

toggleGridButton.addEventListener('click', () => {
    gridLinesVisible = !gridLinesVisible;
    if (gridLinesVisible) {
        grid.classList.remove('noGrid');
        toggleGridButton.classList.remove('active');
    } else {
        grid.classList.add('noGrid');
        toggleGridButton.classList.add('active');
    };
});

brushSizeInput.addEventListener('input', () => {
    brushSize = parseInt(brushSizeInput.value);
});

function paintPixels(startPixel, color) {
    let startRow = parseInt(startPixel.dataset.row);
    let startColumn = parseInt(startPixel.dataset.col);
    let half = Math.floor(brushSize / 2);
    for (let r = startRow - half; r <= startRow + half; r++) {
        for (let c = startColumn - half; c <= startColumn + half; c++) {
            let target = document.querySelector(`.pixel[data-row="${r}"][data-col="${c}"]`);
            if (target) {
                let alreadyRecorded = currentAction.some(entry => entry.pixel === target);
                if (!alreadyRecorded) {
                    let previousColor = target.style.backgroundColor || '';
                    currentAction.push({
                        pixel: target,
                        previousColor: previousColor,
                        newColor: color
                    });
                } else {
                    alreadyRecorded.newColor = color;
                };
                target.style.backgroundColor = color;
            };
        };
    };
};