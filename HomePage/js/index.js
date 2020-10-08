const bob = () => {
    console.log('test')
}

// Validation ↓
const indexName = document.getElementById('index-name')

indexName.addEventListener('input', function (event) {
    if (indexName.validity.patternMismatch) {
        indexName.setCustomValidity('The first character should be Uppercase')
    } else {
        indexName.setCustomValidity('')
    }
});