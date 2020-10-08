const urlParams = new URLSearchParams(window.location.search);
const name = urlParams.get('index-name-input');

// A safe way to inject the text, unlike innerHTML
document.getElementById('action-page-name').textContent = name

const goBack = () => {
    history.back()
}