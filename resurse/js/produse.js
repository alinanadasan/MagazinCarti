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

    const butonFiltreaza = document.getElementById("buton-filtreaza");
    const butonSortareCrescatoare = document.getElementById("sortare-crescatoare");
    const butonSortareDescrescatoare = document.getElementById("sortare-descrescatoare");
    const butonCalculeaza = document.getElementById("calculeaza-preturi");
    const butonResetare = document.getElementById("resetare-filtre");

    const spanNumarProduse = document.getElementById("numar-produse-afisate");
    const listaProduse = document.getElementById("lista-produse");

    const articoleProduse = Array.from(document.querySelectorAll(".produs-card"));
    const ordineInitiala = Array.from(articoleProduse);

    function normalizeazaText(text){
        return (text || "")
            .toString()
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "");
    }

    function curataEroriValidare(){
        textareaNume.classList.remove("input-invalid", "is-invalid");
        inputDescriere.classList.remove("input-invalid", "is-invalid");
        inputAutor.classList.remove("input-invalid", "is-invalid");
    }

    function textEsteValid(text){
        if (!text){
            return true;
        }

        return /^[a-zA-ZăâîșțĂÂÎȘȚ\s\-']+$/.test(text);
    }

    function cuvantEsteValid(text){
        if (!text){
            return true;
        }

        return /^[a-zA-ZăâîșțĂÂÎȘȚ\-']+$/.test(text);
    }

    function valideazaInputuri(){
        curataEroriValidare();

        let mesaje = [];

        let nume = textareaNume.value.trim();
        let cuvantDescriere = inputDescriere.value.trim();
        let autor = inputAutor.value.trim();

        if (!textEsteValid(nume)){
            mesaje.push("Câmpul pentru nume poate conține doar litere, spații, apostrof sau cratimă.");
            textareaNume.classList.add("input-invalid", "is-invalid");
        }

        if (!cuvantEsteValid(cuvantDescriere)){
            mesaje.push("Cuvântul din descriere trebuie să conțină doar litere, fără cifre sau spații.");
            inputDescriere.classList.add("input-invalid", "is-invalid");
        }

        if (!textEsteValid(autor)){
            mesaje.push("Autorul poate conține doar litere, spații, apostrof sau cratimă.");
            inputAutor.classList.add("input-invalid");
        }

        if (mesaje.length > 0){
            alert(mesaje.join("\n"));
            return false;
        }

        return true;
    }
    function corecteazaValidareLive(){
        if (textEsteValid(textareaNume.value.trim())){
            textareaNume.classList.remove("input-invalid", "is-invalid");
        }

        if (cuvantEsteValid(inputDescriere.value.trim())){
            inputDescriere.classList.remove("input-invalid", "is-invalid");
        }

        if (textEsteValid(inputAutor.value.trim())){
            inputAutor.classList.remove("input-invalid", "is-invalid");
        }
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

    function actualizeazaNumarProduse(){
        let numarAfisate = 0;

        for (let articol of articoleProduse){
            if (!articol.classList.contains("ascuns-filtrare")){
                numarAfisate++;
            }
        }

        spanNumarProduse.textContent = numarAfisate;
    }

    function filtreazaProduse(){
        if (!valideazaInputuri()){
            return;
        }

        const numeCautat = normalizeazaText(textareaNume.value.trim());
        const cuvantDescriere = normalizeazaText(inputDescriere.value.trim());
        const autorCautat = normalizeazaText(inputAutor.value.trim());
        const pretMaxim = Number(rangePret.value);
        const formatSelectat = obtineFormatSelectat();
        const doarNoutati = checkboxNoutati.checked;
        const limbaSelectata = selectLimba.value;
        const temeSelectate = obtineTemeSelectate();

        let numarAfisate = 0;

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

    function raportPaginiPret(articol){
        let pagini = Number(articol.dataset.pagini);
        let pret = Number(articol.dataset.pret);

        if (!pret){
            return 0;
        }

        return pagini / pret;
    }

    function sorteazaProduse(crescator){
        if (!valideazaInputuri()){
            return;
        }

        let articoleSortate = Array.from(articoleProduse);

        articoleSortate.sort(function(a, b){
            let numeA = normalizeazaText(a.dataset.nume);
            let numeB = normalizeazaText(b.dataset.nume);

            let comparatieNume = numeA.localeCompare(numeB, "ro");

            if (comparatieNume !== 0){
                return crescator ? comparatieNume : -comparatieNume;
            }

            let raportA = raportPaginiPret(a);
            let raportB = raportPaginiPret(b);

            return crescator ? raportA - raportB : raportB - raportA;
        });

        for (let articol of articoleSortate){
            listaProduse.appendChild(articol);
        }
    }

    function calculeazaMediaPreturilor(){
        if (!valideazaInputuri()){
            return;
        }

        let produseVizibile = articoleProduse.filter(function(articol){
            return !articol.classList.contains("ascuns-filtrare");
        });

        let divCalcul = document.createElement("div");
        divCalcul.className = "rezultat-calcul-produse";

        if (produseVizibile.length === 0){
            divCalcul.textContent = "Nu există produse afișate pentru calcul.";
        }
        else{
            let suma = 0;

            for (let articol of produseVizibile){
                suma += Number(articol.dataset.pret);
            }

            let media = suma / produseVizibile.length;

            divCalcul.textContent = `Media prețurilor produselor afișate este ${media.toFixed(2)} RON.`;
        }

        document.body.appendChild(divCalcul);

        setTimeout(function(){
            divCalcul.remove();
        }, 2000);
    }

    function reseteazaFiltre(){
        let confirmaResetare = confirm("Sigur vrei să resetezi toate filtrele și sortarea?");

        if (!confirmaResetare){
            return;
        }

        curataEroriValidare();

        textareaNume.value = "";
        inputDescriere.value = "";
        inputAutor.value = "";
        rangePret.value = rangePret.max;
        valoarePret.textContent = rangePret.value;
        checkboxNoutati.checked = false;
        selectLimba.value = "";

        for (let optiune of selectTeme.options){
            optiune.selected = false;
        }

        const radioOriceFormat = document.querySelector('input[name="filtru-format"][value=""]');

        if (radioOriceFormat){
            radioOriceFormat.checked = true;
        }

        for (let articol of articoleProduse){
            articol.classList.remove("ascuns-filtrare");
        }

        for (let articol of ordineInitiala){
            listaProduse.appendChild(articol);
        }

        actualizeazaNumarProduse();
    }
    
    textareaNume.addEventListener("input", corecteazaValidareLive);
    inputDescriere.addEventListener("input", corecteazaValidareLive);
    inputAutor.addEventListener("input", corecteazaValidareLive);

    rangePret.addEventListener("input", function(){
        valoarePret.textContent = rangePret.value;
    });

    butonFiltreaza.addEventListener("click", filtreazaProduse);

    butonSortareCrescatoare.addEventListener("click", function(){
        sorteazaProduse(true);
    });

    butonSortareDescrescatoare.addEventListener("click", function(){
        sorteazaProduse(false);
    });

    butonCalculeaza.addEventListener("click", calculeazaMediaPreturilor);

    butonResetare.addEventListener("click", reseteazaFiltre);

    valoarePret.textContent = rangePret.value;
    actualizeazaNumarProduse();
});