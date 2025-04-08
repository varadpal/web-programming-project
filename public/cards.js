function hoverIn(x) {
    //text
  x.classList.add("bg-light", "text-black");
  x.classList.remove("bg-dark", "text-white");
}

function hoverOut(x) {
  x.classList.remove("bg-light", "text-black");
  x.classList.add("bg-dark", "text-white");
}
