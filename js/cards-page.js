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
let cardTypeSelectedValues = [] // The types selected in the multi select
let searchTerm = '' // The search term to search cards by name or text

const urlParams = new URLSearchParams(window.location.search)
const name = urlParams.get('name')

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
        fetch('https://api.magicthegathering.io/v1/cards?random=true&pageSize=100&language=English/')
        // fetch('https://raw.githubusercontent.com/Shizuri/entry_frontend_react_polar/master/src/cards.json') // mock api for testing
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
                    renderCards(data.cards)
                    document.getElementById('cards-page-content').style.display = 'flex'
                    document.getElementById('loading-cards').style.display = 'none'
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

// Function that renders the cards to the page
const renderCards = data => {
    // Get the element that will be updated
    const displayCardsContainer = document.querySelector('#display-cards-container')
    // Clear any previous data
    displayCardsContainer.replaceChildren()
    // Go through each element and append it in the list
    data.forEach(card => {
        // Create main card div
        const cardDiv = document.createElement('div')
        cardDiv.className = 'card'

        // Create card image panel div
        const cardImagePanelDiv = document.createElement('div')
        cardImagePanelDiv.className = 'card-image-panel'
        if(card.imageUrl){
            cardImagePanelDiv.innerHTML = `<div><img class="card-image" src=${card.imageUrl} alt=${card.name}</div>`
        } else {
            cardImagePanelDiv.innerHTML = `<div>
                                                <img class="card-image" src=images/MtGCardBack.jpg alt=${card.name}>
                                                <div class="card-image-not-found">Image not found</div>
                                           </div>`
        }
        // Append it ot the main card div
        cardDiv.appendChild(cardImagePanelDiv)

        // Create card data panel div
        const cardDataPanelDiv = document.createElement('div')
        cardDataPanelDiv.className = 'card-data-panel'
        // If the API provides a type adapt to the scenario where there is more than one.
        let types = '-no type-'
        if(card.types){
            types = card.types.length > 1 ? 'Types' : 'Type'
        }

        let colors = 'Card is colorless'
        if(card.colors.length > 0){
            colors = card.colors.length > 1 ? 'Colors:' : 'Color:'
        }
        cardDataPanelDiv.innerHTML = `<div class="card-data-panel">
                                        <div><strong>Name:</strong> ${card.name}</div>
                                        <div><strong>${types}:</strong> ${formatArrayOfStrings(card.types)}</div>
                                        <div><strong>Set name:</strong> ${card.setName}</div>
                                        <div><strong>${colors} </strong> ${formatArrayOfStrings(card.colors)}</div>
                                        <div><strong>Text:</strong> ${card.text}</div>
                                    </div>`
        // Append it ot the main card div
        cardDiv.appendChild(cardDataPanelDiv)

        // Append the main card div to the container div
        displayCardsContainer.appendChild(cardDiv)
    })

    document.getElementById('cards-number').textContent = filteredCards.length
}

// Helper function to get the elements in a multi select that are currently selected by the user
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

// Helper function to print out an array of string
const formatArrayOfStrings = arr => {
    if (!arr) {
        return `-- no data --`
    } else if (arr.length === 1) {
        return `${arr[0]}`
    } else {
        return arr.join(', ')
    }
}

// Sort the cards alphabetically
const handleSortingOrder = event => {
    const value = event.value
    switch (value) {
        case 'Ascending':
            filteredCards.sort((a, b) => a.name.localeCompare(b.name))
            break
        case 'Descending':
            filteredCards.sort((a, b) => b.name.localeCompare(a.name))
            break
        default:
            break
    }

    renderCards(filteredCards)
}

// Trigger when the search term changes to filter the cards. This way the user gets instant results without pressing Enter
document.getElementById('cards-name-filter-selector').oninput = element => {
    // save this into global val than check in filterCards
    searchTerm = element.target.value
    // Every time that the search term is changed, call the filter function and pass in the search term
    filterCards()
}

const filterCards = () => {
    // Reset filtered cards to be all cards and then start filtering
    filteredCards = cards

    // FILTER BY COLOR
    // Get the color element selector
    const colorSelector = document.getElementById('cards-color-selector')
    // Get the values selected by the user
    cardColorSelectedValues = getSelectedOptions(colorSelector)
    // Filter cards by card color
    const cardsFilteredByColor = filteredCards.filter(card => {
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

    // Update the list only if at least one item is selected
    if (cardColorSelectedValues.length > 0) {
        filteredCards = cardsFilteredByColor
    }

    // FILTER BY TYPE
    // Get the color element selector
    const typeSelector = document.getElementById('cards-type-selector')
    // Get the values selected by the user
    cardTypeSelectedValues = getSelectedOptions(typeSelector)
    // Filter cards by card color
    const cardsFilteredByType = filteredCards.filter(card => {
        // Check if the card has a type provided by the API
        if (card.types) {
            for (let i = 0; i < card.types.length; i++) {
                for (let j = 0; j < cardTypeSelectedValues.length; j++) {
                    if (card.types[i].toLowerCase().includes(cardTypeSelectedValues[j].toLowerCase())) {
                        // If any member of the card types array is found in the array of selected types, filter it in
                        // This will make sure that if the card has more than one type it will still be shown
                        return true
                    }
                }
            }
        }
        return false
    })

    // Update the list only if at least one item is selected
    if (cardTypeSelectedValues.length > 0) {
        filteredCards = cardsFilteredByType
    }

    // FILTER BY NAME OR TEXT
    const cardsFilteredByNameOrText = filteredCards.filter(card => {
        // Sometimes there is no entry for text, check for it
        if (card.name && card.text) {
            return (
                card.name.toLowerCase().includes(searchTerm.toLowerCase())
                || card.text.toLowerCase().includes(searchTerm.toLowerCase())
            )
        } else {
            // If there is no entry for text, filter just by name
            return (card.name.toLowerCase().includes(searchTerm.toLowerCase()))
        }
    })

    // Update the list only if at least one letter is typed in the search box
    if (searchTerm.length > 0) {
        filteredCards = cardsFilteredByNameOrText
    }

    renderCards(filteredCards)
}