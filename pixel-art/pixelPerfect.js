const grid = document.getElementById('grid');
const colorPicker = document.getElementById('colorPicker');
const clearButton = document.getElementById('clearButton');
const palette = document.getElementById('palette');
const colorOptions = palette.querySelectorAll('.colorOption');
const saveButton = document.getElementById('saveButton');
const rowsInput = document.getElementById('rowsInput');
const columnsInput = document.getElementById('columnsInput');
const pixelSizeInput = document.getElementById('pixelSizeInput');
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

function createGrid(rows, columns, pixelSize = 20) {
    grid.innerHTML = '';
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

createGrid(parseInt(rowsInput.value), parseInt(columnsInput.value));

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
    let columns = parseInt(columnsInput.value);
    let pixelSize = parseInt(pixelSizeInput.value);
    if (isNaN(rows) || rows < 1) rows = 16;
    if (isNaN(columns) || columns < 1) columns = 16;
    if (isNaN(pixelSize) || pixelSize < 5) pixelSize = 20;
    createGrid(rows, columns, pixelSize);
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