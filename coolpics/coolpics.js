const menuButton = document.querySelector('.nav button');
function toggleMenu() {
    const menu = document.querySelector('.links');
    menu.classList.toggle('hide');
};

menuButton.addEventListener('click', toggleMenu);

function checkSize() {
    const nav = document.querySelector('.nav')
    if (window.innerWidth >= 1000) {
        nav.classList.remove('hide');
    } else {
        nav.classList.add('.hide');
    }
};

checkSize();
window.addEventListener('resize', checkSize);

const gallery = document.querySelector('.gallery');

gallery.addEventListener('click', (event) => {
    const clickedImg = event.target.closest('img');

    const src = clickedImg.getAttribute('src');
    const imgName = src.split('-')[0];
    const newImg = `${imgName}-full.jpeg`;

    const dialog = document.createElement('dialog');
    dialog.innerHTML = `<img src="${newImg}"><button class="close-viewer">X</button>`;
    document.body.appendChild(dialog);
    dialog.showModal();

    dialog.querySelector('.close-viewer').addEventListener('click', () => {
        dialog.close();
    });

    dialog.addEventListener('click', (dialogEvent) => {
        if (dialogEvent.target === dialog) {
            dialog.close();
        }
    });
});