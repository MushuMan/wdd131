const students = [
    { last: 'Banks',
    first: 'Joao'
    },
    { last: 'Bingham',
    first: 'Brynlee'
    },
    { last: 'Cardiel',
    first: 'Jonathan'
    },
    { last: 'DeWitt',
    first: 'Luce'
    },
    { last: 'Durtschi',
    first: 'Dylan'
    },
    { last: 'Ericson',
    first: 'Amanda'
    },
    { last: 'Guo',
    first: 'Huanru'
    },
    { last: 'Gross',
    first: 'Gabriel'
    },
    { last: 'Hafen',
    first: 'Bronwyn'
    },
    { last: 'Hamblin',
    first: 'Jacob'
    },
    { last: 'Hatakenaka',
    first: 'Kosei'
    },
    { last: 'Haymond',
    first: 'Zachary'
    },
    { last: 'Hill',
    first: 'Tylar'
    },
    { last: 'Jones',
    first: 'Brayden'
    },
    { last: 'Jones',
    first: 'Kyle'
    },
    { last: 'Kinner',
    first: 'Sarah'
    },
    { last: 'Kokona',
    first: 'Alexander'
    },
    { last: 'Larsen',
    first: 'Joshua'
    },
    { last: 'Legg',
    first: 'Russell'
    },
    { last: 'Lewis',
    first: 'Teagan'
    },
    { last: 'Lucas',
    first: 'Thomas'
    },
    { last: 'Mackay',
    first: 'Levi'
    },
    { last: 'Maynes',
    first: 'William'
    },
    { last: 'Moffat',
    first: 'Luke'
    },
    { last: 'Morrell',
    first: 'Jaxon'
    },
    { last: 'Niemand',
    first: 'Samuel'
    },
    { last: 'Olisa',
    first: 'Benedict'
    },
    { last: 'Olson',
    first: 'Hayden'
    },
    { last: 'Palacios',
    first: 'Alexander'
    },
    { last: 'Patil',
    first: 'Raj'
    },
    { last: 'Petersen',
    first: 'Eric'
    },
    { last: 'Rich',
    first: 'Aaron'
    },
    { last: 'Schaefermeyer',
    first: 'Kelsey'
    },
    { last: 'Stubbs',
    first: 'Camden'
    },
    { last: 'Tenney',
    first: 'Isaac'
    },
    { last: 'Tolley',
    first: 'Joseph'
    },
    { last: 'Uchytil',
    first: 'Heber'
    },
    { last: 'Vickery',
    first: 'Mel'
    },
    { last: 'Zaugg',
    first: 'Nephi'
    },
    { last: 'Zhou',
    first: 'Shengjian'
    }
];

console.log(students[20].first);

const container = document.querySelector('#student_container');

students.forEach(function(item){
    let name = document.createElement('section');
    
    let html = `
    <p class='align'>${item.first}</p>
    <p class='align'>${item.last}</p>
    <hr>
    `;

    name.innerHTML = html;

    container.appendChild(name);
});