const character = {
      name: "Snortleblat",
      class: "Swamp Beast Diplomat",
      level: 5,
      health: 100,
      image: "snortleblat.png",
      attacked() {
        if (this.health >= 20) {
          this.health -= 20;
        } else {
            alert('Character Died');
        }
      },
      levelUp() {
        this.level += 1;
        this.health += 20;
      }
    };

const cardHealth = document.querySelector('#health');
const cardLevel = document.querySelector('#level');
const cardClass = document.querySelector('#class');
const cardName = document.querySelector('.name');
const cardImg = document.querySelector('.image');
const attackedButton = document.querySelector('#attacked');
const levelUpButton = document.querySelector('#levelup');

cardHealth.textContent = character.health;
cardLevel.textContent = character.level;
cardClass.textContent = character.class;
cardName.textContent = character.name;
cardImg.src = character.image;

attackedButton.addEventListener('click', () => {
    character.attacked();
    cardHealth.textContent = character.health;
});

levelUpButton.addEventListener('click', () => {
    character.levelUp();
    cardLevel.textContent = character.level;
    cardHealth.textContent = character.health;
});