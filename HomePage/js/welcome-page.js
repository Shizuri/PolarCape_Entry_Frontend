const urlParams = new URLSearchParams(window.location.search);
const name = urlParams.get('index-name');

document.getElementById('action-page-name').innerHTML = name