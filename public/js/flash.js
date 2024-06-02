const flashMessage = document.getElementsByClassName("flash");
 
function opacity(i) {
    setTimeout(function() {
        flashMessage[0].style.opacity = (100 - i) + "%";
    }, 5 * i);
}

setTimeout(() => {
    for (let i = 0; i <= 100; i++)
        opacity(i);

    setTimeout(() => {
        flashMessage[0].remove();
    }, 5 * 102)
}, 2000);