window.addEventListener("DOMContentLoaded", function(){
    let inputNume = document.getElementById("filtru-nume");
    let inputPretMax = document.getElementById("filtru-pret-max");
    let inputPaginiMin = document.getElementById("filtru-pagini-min");
    let selectLimba = document.getElementById("filtru-limba");
    let selectSemn = document.getElementById("filtru-semn");

    let articole = document.querySelectorAll(".produs-card");

    function filtreazaProduse(){
        let textNume = inputNume.value.trim().toLowerCase();
        let pretMax = inputPretMax.value ? Number(inputPretMax.value) : null;
        let paginiMin = inputPaginiMin.value ? Number(inputPaginiMin.value) : null;
        let limba = selectLimba.value;
        let semn = selectSemn.value;

        for (let articol of articole){
            let ok = true;

            let numeProdus = articol.dataset.nume;
            let pretProdus = Number(articol.dataset.pret);
            let paginiProdus = Number(articol.dataset.pagini);
            let limbaProdus = articol.dataset.limba;
            let semnProdus = articol.dataset.semn;

            if (textNume && !numeProdus.includes(textNume)){
                ok = false;
            }

            if (pretMax !== null && pretProdus > pretMax){
                ok = false;
            }

            if (paginiMin !== null && paginiProdus < paginiMin){
                ok = false;
            }

            if (limba && limbaProdus !== limba){
                ok = false;
            }

            if (semn && semnProdus !== semn){
                ok = false;
            }

            if (ok){
                articol.classList.remove("ascuns-filtrare");
            }
            else{
                articol.classList.add("ascuns-filtrare");
            }
        }
    }

    inputNume.addEventListener("input", filtreazaProduse);
    inputPretMax.addEventListener("input", filtreazaProduse);
    inputPaginiMin.addEventListener("input", filtreazaProduse);
    selectLimba.addEventListener("change", filtreazaProduse);
    selectSemn.addEventListener("change", filtreazaProduse);
});