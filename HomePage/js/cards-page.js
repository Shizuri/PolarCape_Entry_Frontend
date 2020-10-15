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

let cardColorSelectedValues = [] // The colors selected in the multi select

const urlParams = new URLSearchParams(window.location.search)
const name = urlParams.get('index-name-input')

// A safe way to inject the text, unlike innerHTML
document.getElementById('cards-page-name').textContent = name

// The reason for this is that it ensures that the page loads as quickly as possible when the user first arrives at your site.
// All of our JavaScript will load after the DOM’s content has loaded.
document.addEventListener('DOMContentLoaded', () => {
    // The webpage is mounted on the DOM
    let isMounted = true
    // Load cards
    const getCards = () => {
        // GET Request.
        fetch('https://raw.githubusercontent.com/Shizuri/entry_frontend_react_polar/master/src/cards.json') // mock
            // fetch('https://api.magicthegathering.io/v1/cards?random=true&pageSize=100&language=English/')
            // Handle success
            // Convert to json
            .then(response => {
                if (isMounted) {
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
})

const goBack = () => {
    history.back()
}

const checkCards = () => {
    console.log('CARDS: ', cards)
}

const renderData = data => {
    // Get the element that will be updated
    const theElement = document.querySelector('#the-element')
    // Clear any previous data
    theElement.replaceChildren()
    // Go through each element and append it in the list
    data.forEach(card => {
        const div = document.createElement('div')
        div.className = 'the-class'
        div.innerHTML = `<strong>Name: </strong> ${card.name} <strong>Colors: </strong> ${card.colors} <strong>Types: </strong> ${card.types}`
        theElement.append(div)
    })
}

const getSelectedOptions = element => {
    let options = []
    let option = null
    let len = element.options.length

    for (let i = 0; i < len; i++) {
        option = element.options[i]
        if (option.selected) {
            options.push(option.value)
        }
    }

    return options
}

const sortCardsByColor = element => {
    // let colorSelector = document.getElementById('card-color-selector')

    cardColorSelectedValues = getSelectedOptions(element)
    // console.log(getSelectedOptions(element))

    // console.log(element)
    // console.log(colorSelector)
    // console.log(colorSelector.value)
    // console.log(colorSelector.target)

    // Filter by card color
    const cardColorSelectedValuesFilterResult = cards.filter(card => {
        // Check if the card has a color provided by the API
        if (card.colors) {
            for (let i = 0; i < card.colors.length; i++) {
                for (let j = 0; j < cardColorSelectedValues.length; j++) {
                    if (card.colors[i].toLowerCase().includes(cardColorSelectedValues[j].toLowerCase())) {
                        // If any member of the card types array is found in the array of selected types, filter it in
                        // This will make sure that if the card has more than one type it will still be shown
                        return true
                    }
                }
            }
        }
        return false
    })
    if (cardColorSelectedValues.length > 0) {
        filteredCards = cardColorSelectedValuesFilterResult
    }

    renderData(filteredCards)
}