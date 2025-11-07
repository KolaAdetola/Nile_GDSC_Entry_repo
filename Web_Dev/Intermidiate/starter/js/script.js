const light_mode = document.querySelector('.light_mode');
const body = document.querySelector('.body');

light_mode.onclick = () => {
    
    body.classList.toggle('dark_mode')
}
