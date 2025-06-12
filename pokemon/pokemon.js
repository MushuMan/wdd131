const ditto = {
    id: 132,
    name: "ditto",
    type: "normal",
    abilities: ["limber", "imposter"],
    base_experience: 101,
    height: 3,
    weight: 40,
    stats: {
        hp: 48,
        attack: 48,
        defense: 48,
        special_attack: 48,
        special_defense: 48,
        speed: 48
    },
    sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/132.png",
    transform: function(){
        return this.sprite = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/shiny/132.png"
    }
};

const img1 = ditto.sprite
const img2 = ditto.transform()
const pokName = document.querySelector('#name');
pokName.textContent = ditto.name;
const pokAbility = document.querySelector('#ability');
pokAbility.textContent = ditto.abilities[1];
const pokImg = document.querySelector('#ditto');
pokImg.src = img1;

pokImg.addEventListener('click', function () {
    const currentImg = pokImg.src;
    if (currentImg.includes(img1)) {
        pokImg.src = img2;
    } else {
        pokImg.src = img1;
    }
});