window.addEventListener("DOMContentLoaded", function(){
    const DATA_NOUTATI = "2024-05-01";

    const textareaNume = document.getElementById("filtru-nume-start");
    const inputDescriere = document.getElementById("filtru-cuvant-descriere");
    const inputAutor = document.getElementById("filtru-autor");
    const rangePret = document.getElementById("filtru-pret");
    const valoarePret = document.getElementById("valoare-pret-selectat");
    const checkboxNoutati = document.getElementById("filtru-noutati");
    const selectLimba = document.getElementById("filtru-limba");
    const selectTeme = document.getElementById("filtru-teme");
    const butonResetare = document.getElementById("resetare-filtre");
    const spanNumarProduse = document.getElementById("numar-produse-afisate");

    const articoleProduse = document.querySelectorAll(".produs-card");

    function normalizeazaText(text){
        return (text || "")
            .toString()
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "");
    }

    function obtineFormatSelectat(){
        const radioSelectat = document.querySelector('input[name="filtru-format"]:checked');

        if (!radioSelectat){
            return "";
        }

        return radioSelectat.value;
    }

    function obtineTemeSelectate(){
        return Array.from(selectTeme.selectedOptions).map(function(optiune){
            return normalizeazaText(optiune.value);
        });
    }

    function filtreazaProduse(){
        const numeCautat = normalizeazaText(textareaNume.value.trim());
        const cuvantDescriere = normalizeazaText(inputDescriere.value.trim());
        const autorCautat = normalizeazaText(inputAutor.value.trim());
        const pretMaxim = Number(rangePret.value);
        const formatSelectat = obtineFormatSelectat();
        const doarNoutati = checkboxNoutati.checked;
        const limbaSelectata = selectLimba.value;
        const temeSelectate = obtineTemeSelectate();

        let numarAfisate = 0;

        valoarePret.textContent = rangePret.value;

        for (let articol of articoleProduse){
            let ok = true;

            const numeProdus = normalizeazaText(articol.dataset.nume);
            const descriereProdus = normalizeazaText(articol.dataset.descriere);
            const autorProdus = normalizeazaText(articol.dataset.autor);
            const pretProdus = Number(articol.dataset.pret);
            const formatProdus = articol.dataset.format;
            const limbaProdus = articol.dataset.limba;
            const dataAdaugare = articol.dataset.adaugare;

            const temeProdus = normalizeazaText(articol.dataset.teme)
                .split("|")
                .filter(function(tema){
                    return tema.length > 0;
                });

            if (numeCautat && !numeProdus.startsWith(numeCautat)){
                ok = false;
            }

            if (cuvantDescriere && !descriereProdus.includes(cuvantDescriere)){
                ok = false;
            }

            if (autorCautat && autorProdus !== autorCautat){
                ok = false;
            }

            if (pretProdus > pretMaxim){
                ok = false;
            }

            if (formatSelectat && formatProdus !== formatSelectat){
                ok = false;
            }

            if (doarNoutati && dataAdaugare < DATA_NOUTATI){
                ok = false;
            }

            if (limbaSelectata && limbaProdus !== limbaSelectata){
                ok = false;
            }

            if (temeSelectate.length > 0){
                for (let tema of temeSelectate){
                    if (!temeProdus.includes(tema)){
                        ok = false;
                        break;
                    }
                }
            }

            if (ok){
                articol.classList.remove("ascuns-filtrare");
                numarAfisate++;
            }
            else{
                articol.classList.add("ascuns-filtrare");
            }
        }

        spanNumarProduse.textContent = numarAfisate;
    }

    function reseteazaFiltre(){
        textareaNume.value = "";
        inputDescriere.value = "";
        inputAutor.value = "";
        rangePret.value = rangePret.max;
        checkboxNoutati.checked = false;
        selectLimba.value = "";

        for (let optiune of selectTeme.options){
            optiune.selected = false;
        }

        const radioOriceFormat = document.querySelector('input[name="filtru-format"][value=""]');

        if (radioOriceFormat){
            radioOriceFormat.checked = true;
        }

        filtreazaProduse();
    }

    textareaNume.addEventListener("input", filtreazaProduse);
    inputDescriere.addEventListener("input", filtreazaProduse);
    inputAutor.addEventListener("input", filtreazaProduse);
    rangePret.addEventListener("input", filtreazaProduse);
    checkboxNoutati.addEventListener("change", filtreazaProduse);
    selectLimba.addEventListener("change", filtreazaProduse);
    selectTeme.addEventListener("change", filtreazaProduse);
    butonResetare.addEventListener("click", reseteazaFiltre);

    const radioFormat = document.querySelectorAll('input[name="filtru-format"]');

    for (let radio of radioFormat){
        radio.addEventListener("change", filtreazaProduse);
    }

    filtreazaProduse();
});