// Custom validation for a better user experience
const indexName = document.getElementById('index-name-input')

indexName.addEventListener('input', function (event) {
    if (indexName.validity.patternMismatch) {
        indexName.setCustomValidity('The first character should be an Uppercase Letter')
    } else {
        indexName.setCustomValidity('')
    }
});