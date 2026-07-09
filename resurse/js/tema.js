window.addEventListener("DOMContentLoaded", function(){
    const switchTema = document.getElementById("switch-tema");

    if (!switchTema){
        return;
    }

    function aplicaTema(temaInchisa){
        document.body.classList.toggle("tema-inchisa", temaInchisa);
        document.documentElement.setAttribute("data-bs-theme", temaInchisa ? "dark" : "light");
        switchTema.checked = temaInchisa;
    }

    let temaSalvata = localStorage.getItem("tema-booknest");

    aplicaTema(temaSalvata === "inchisa");

    switchTema.addEventListener("change", function(){
        let temaInchisa = switchTema.checked;

        aplicaTema(temaInchisa);
        localStorage.setItem("tema-booknest", temaInchisa ? "inchisa" : "deschisa");
    });
});