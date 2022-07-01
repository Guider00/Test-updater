const setButton = document.getElementById('btn')
const titleInput = document.getElementById('title')
setButton.addEventListener('click', () => {
    const title = titleInput.value
    window.electronAPI.setTitle(title)
});

// var getAppVersion = async () => {
//     const appVersion = await window.electronAPI.getAppVersion('version')
//     document.getElementById('appVersion').innerText = appVersion;
// }
// if( document.getElementById('appVersion') ) {
//     document.addEventListener("DOMContentLoaded", getAppVersion)}


// var getIP = async () => {
//     const userIP = await window.electronAPI.getIP('ip')
//     document.getElementById('ip').innerText = userIP;
// }
// if( document.getElementById('ip') ) {
//     document.addEventListener("DOMContentLoaded", getIP)}


if( document.getElementById('next') ) {
    document.getElementById('next').addEventListener('click', () => {
        window.electronAPI.nextPage();
    })
}