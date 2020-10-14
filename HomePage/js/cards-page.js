// Constant values that are frozen so that they can't be mutated in any way
const ALL_CARD_TYPES = ['Artifact', 'Autobot', 'Card', 'Character', 'Conspiracy', 'Creature', 'Dragon', 'Elemental',
    'Enchantment', 'Goblin', 'Hero', 'Instant', 'Jaguar', 'Knights', 'Land', 'Phenomenon', 'Plane', 'Planeswalker',
    'Scheme', 'Sorcery', 'Specter', 'Summon', 'Tribal', 'Vanguard', 'Wolf', 'You’ll']
Object.freeze(ALL_CARD_TYPES)
const ALL_CARD_COLORS = ['White', 'Blue', 'Black', 'Red', 'Green']
Object.freeze(ALL_CARD_COLORS)

let loaded = false // Card load state
let cards = [] // All the cards cards
let filteredCards = [] // Filtered cards

const urlParams = new URLSearchParams(window.location.search);
const name = urlParams.get('index-name-input');

// A safe way to inject the text, unlike innerHTML
document.getElementById('cards-page-name').textContent = name

// The webpage is mounted on the DOM
let isMounted = true
// Load cards
const getCards = () => {
    const renderData = data => {
        data.forEach(card => {
            console.log('CARD: ', card)
            const theElement = document.querySelector('#the-element')
            const p = document.createElement('p');
            p.className = 'the-class'
            p.innerHTML = card.name
            theElement.append(p)
        })
    }

    // GET Request.
    fetch('https://api.magicthegathering.io/v1/cards?random=true&pageSize=100&language=English/')
        // Handle success
        // Convert to json
        .then(response => {
            if (isMounted) {
                console.log('loading')
                return response.json()
            }
        })
        .then(data => {
            if (isMounted) {
                cards = data.cards // Set cards data
                filteredCards = data.cards // Set filtered cards that will be displayed
                loaded = true // Cards are loaded
                renderData(data.cards)
            }
        })
        // Catch errors
        .catch(error => {
            if (isMounted) {
                console.log('Request Failed with error: ', error)
            }
        })

}

window.addEventListener('beforeunload', (event) => {
    // Set isMounted to false so that the fetch request does not happen
    // This prevents a memory leak scenario on a fast page unmount
    isMounted = false
})

getCards()

document.addEventListener('DOMContentLoaded', () => {

})

const newFetcher = () => {
    fetch('https://raw.githubusercontent.com/Shizuri/entry_frontend_react_polar/master/src/cards.json')
        .then(response => response.json())
        .then(data => renderData(data.cards))

    const renderData = data => {
        data.forEach(card => {
            console.log('CARD: ', card)
            const theElement = document.querySelector('#the-element')
            const span = document.createElement('span');
            span.className = 'the-class'
            span.innerHTML = card.name
            theElement.append(span)
        })
    }
}

const checkCards = () => {
    console.log('CARDS: ', cards)
}

// newFetcher()

// console.log('cards:', cards)

const goBack = () => {
    history.back()
}