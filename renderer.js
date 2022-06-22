const setButton = document.getElementById('btn')
const titleInput = document.getElementById('title')
setButton.addEventListener('click', () => {
    const title = titleInput.value
    window.electronAPI.setTitle(title)
});

var getAppVersion = async () => {
    const appVersion = await window.electronAPI.getAppVersion('version')
    document.getElementById('appVersion').innerText = appVersion;
}
if( document.getElementById('appVersion') ) {
    document.addEventListener("DOMContentLoaded", getAppVersion)}
