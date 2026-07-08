const express = require("express");
const path= require("path");
const fs = require("fs");
const sass = require("sass");
const sharp = require("sharp");

app= express();
app.set("view engine", "ejs")

obGlobal={
    obErori:null,
    obImagini:null,
    folderScss: path.join(__dirname,"resurse/scss"),
    folderCss: path.join(__dirname,"resurse/css"),
    folderBackup: path.join(__dirname,"backup"),
}

console.log("Folder index.js", __dirname);
console.log("Folder curent (de lucru)", process.cwd());
console.log("Cale fisier", __filename);

let vect_foldere=[ "temp", "logs", "backup", "fisiere_uploadate" ]
for (let folder of vect_foldere){
    let caleFolder=path.join(__dirname, folder);
    if (!fs.existsSync(caleFolder)) {
        fs.mkdirSync(path.join(caleFolder), {recursive:true});   
    }
}

app.use("/resurse",express.static(path.join(__dirname, "resurse")));

app.get("/favicon.ico", function(req, res){
    res.sendFile(path.join(__dirname,"resurse", "ico", "favicon.ico"))
});

app.get(["/", "/index","/home"], async function(req, res){
    let galerie = await obtineGalerieStatica();

    res.render("pagini/index", {
        ip: req.ip,
        galerie: galerie
    });
});

function verificaErori(){
    let caleFisier = path.join(
        __dirname,
        "resurse",
        "json",
        "erori.json"
    );

    if (!fs.existsSync(caleFisier)){
        console.error(
            "Eroare: fisierul erori.json nu exista la calea:",
            caleFisier
        );

        process.exit(1);
    }

    let continut = fs
        .readFileSync(caleFisier)
        .toString("utf-8");

    let configuratieCorecta = true;

    let stivaObiecte = [];
    let esteInSir = false;
    let caracterEscape = false;
    let inceputSir = 0;

    for (let i = 0; i < continut.length; i++){
        let caracter = continut[i];

        if (esteInSir){
            if (caracterEscape){
                caracterEscape = false;
                continue;
            }

            if (caracter === "\\"){
                caracterEscape = true;
                continue;
            }

            if (caracter === '"'){
                let textSir = continut.substring(
                    inceputSir + 1,
                    i
                );

                esteInSir = false;

                let pozitieUrmatoare = i + 1;

                while (
                    pozitieUrmatoare < continut.length &&
                    /\s/.test(continut[pozitieUrmatoare])
                ){
                    pozitieUrmatoare++;
                }

                if (
                    continut[pozitieUrmatoare] === ":" &&
                    stivaObiecte.length > 0
                ){
                    let proprietatiObiect =
                        stivaObiecte[stivaObiecte.length - 1];

                    if (proprietatiObiect.includes(textSir)){
                        let linie = continut
                            .substring(0, inceputSir)
                            .split(/\r?\n/)
                            .length;

                        console.error(
                            `Eroare: proprietatea "${textSir}" apare de mai multe ori in acelasi obiect, in apropierea liniei ${linie}.`
                        );

                        configuratieCorecta = false;
                    }
                    else{
                        proprietatiObiect.push(textSir);
                    }
                }
            }

            continue;
        }

        if (caracter === '"'){
            esteInSir = true;
            inceputSir = i;
        }
        else if (caracter === "{"){
            stivaObiecte.push([]);
        }
        else if (caracter === "}"){
            stivaObiecte.pop();
        }
    }

    let erori;

    try{
        erori = JSON.parse(continut);
    }
    catch (eroare){
        console.error(
            "Eroare: fisierul erori.json nu contine JSON valid."
        );

        console.error(eroare.message);

        process.exit(1);
    }

    let proprietatiPrincipale = [
        "info_erori",
        "cale_baza",
        "eroare_default"
    ];

    for (let proprietate of proprietatiPrincipale){
        if (erori[proprietate] === undefined){
            console.error(
                `Eroare: proprietatea obligatorie "${proprietate}" lipseste din erori.json.`
            );

            configuratieCorecta = false;
        }
    }

    if (erori.eroare_default !== undefined){
        let proprietatiDefault = [
            "titlu",
            "text",
            "imagine"
        ];

        for (let proprietate of proprietatiDefault){
            if (
                erori.eroare_default[proprietate] === undefined
            ){
                console.error(
                    `Eroare: proprietatea "${proprietate}" lipseste din eroare_default.`
                );

                configuratieCorecta = false;
            }
        }
    }

    let caleBazaFizica = null;

    if (erori.cale_baza !== undefined){
        let caleBazaRelativa = erori.cale_baza.replace(
            /^[/\\]+/,
            ""
        );

        caleBazaFizica = path.join(
            __dirname,
            caleBazaRelativa
        );

        if (!fs.existsSync(caleBazaFizica)){
            console.error(
                "Eroare: folderul specificat prin cale_baza nu exista:",
                caleBazaFizica
            );

            configuratieCorecta = false;
        }
    }

    let obiecteErori = [];

    if (erori.eroare_default !== undefined){
        obiecteErori.push({
            nume: "eroare_default",
            eroare: erori.eroare_default
        });
    }

    if (Array.isArray(erori.info_erori)){
        for (let eroare of erori.info_erori){
            obiecteErori.push({
                nume: `eroarea ${eroare.identificator}`,
                eroare: eroare
            });
        }
    }

    let imaginiFolosite = {};

    for (let element of obiecteErori){
        if (element.eroare.imagine === undefined){
            console.error(
                `Eroare: pentru ${element.nume} nu este specificata proprietatea imagine.`
            );

            configuratieCorecta = false;
            continue;
        }

        let numeImagine = element.eroare.imagine;

        if (imaginiFolosite[numeImagine] === undefined){
            imaginiFolosite[numeImagine] = [];
        }

        imaginiFolosite[numeImagine].push(
            element.nume
        );

        if (caleBazaFizica !== null){
            let caleImagine = path.join(
                caleBazaFizica,
                numeImagine
            );

            if (!fs.existsSync(caleImagine)){
                console.error(
                    `Eroare: imaginea pentru ${element.nume} nu exista:`,
                    caleImagine
                );

                configuratieCorecta = false;
            }
        }
    }

    for (let numeImagine in imaginiFolosite){
        if (imaginiFolosite[numeImagine].length > 1){
            console.error(
                `Eroare: imaginea "${numeImagine}" este folosita de mai multe erori: ${imaginiFolosite[numeImagine].join(", ")}.`
            );

            configuratieCorecta = false;
        }
    }

    let identificatori = {};

    if (Array.isArray(erori.info_erori)){
        for (let eroare of erori.info_erori){
            let identificator = eroare.identificator;

            if (
                identificatori[identificator] === undefined
            ){
                identificatori[identificator] = [];
            }

            identificatori[identificator].push(
                eroare
            );
        }
    }

    for (let identificator in identificatori){
        if (
            identificatori[identificator].length > 1
        ){
            console.error(
                `Eroare: identificatorul ${identificator} este folosit de mai multe erori.`
            );

            for (
                let eroare of identificatori[identificator]
            ){
                let proprietatiEroare = {
                    status: eroare.status,
                    titlu: eroare.titlu,
                    text: eroare.text,
                    imagine: eroare.imagine
                };

                console.error(proprietatiEroare);
            }

            configuratieCorecta = false;
        }
    }

    if (!configuratieCorecta){
        console.error(
            "Configuratia din erori.json nu este corecta. Serverul se inchide."
        );

        process.exit(1);
    }

    console.log(
        "Fisierul erori.json a fost verificat cu succes."
    );

    return erori;
}


function initErori(){
    let erori = verificaErori();

    obGlobal.obErori = erori;

    let err_default = erori.eroare_default;

    err_default.imagine = path.posix.join(
        erori.cale_baza,
        err_default.imagine
    );

    for (let eroare of erori.info_erori){
        eroare.imagine = path.posix.join(
            erori.cale_baza,
            eroare.imagine
        );
    }
}

initErori()

function obtinePerioadaCurenta(){
    let dataCurenta = new Date();
    let ora = dataCurenta.getHours();

    if (ora >= 5 && ora < 12){
        return "dimineata";
    }

    if (ora >= 12 && ora < 20){
        return "zi";
    }

    return "noapte";
}

async function genereazaImagineGalerie(caleSursa, caleDestinatie, latime, inaltime){
    if (fs.existsSync(caleDestinatie)){
        return;
    }

    await sharp(caleSursa)
        .resize(latime, inaltime, {
            fit: "cover"
        })
        .toFile(caleDestinatie);
}

async function obtineGalerieStatica(){
    let caleJson = path.join(
        __dirname,
        "resurse",
        "json",
        "galerie.json"
    );

    let continut = fs
        .readFileSync(caleJson)
        .toString("utf-8");

    let galerie = JSON.parse(continut);

    let caleGalerieUrl = galerie.cale_galerie;

    let caleGalerieDisc = path.join(
        __dirname,
        caleGalerieUrl.replace(/^[/\\]+/, "")
    );

    let caleOriginale = path.join(
        caleGalerieDisc,
        "originale"
    );

    let caleMare = path.join(
        caleGalerieDisc,
        "mare"
    );

    let caleMediu = path.join(
        caleGalerieDisc,
        "mediu"
    );

    let caleMic = path.join(
        caleGalerieDisc,
        "mic"
    );

    fs.mkdirSync(caleMare, { recursive: true });
    fs.mkdirSync(caleMediu, { recursive: true });
    fs.mkdirSync(caleMic, { recursive: true });

    for (let imagine of galerie.imagini){
        let caleOriginala = path.join(
            caleOriginale,
            imagine.cale_relativa
        );

        let caleImagineMare = path.join(
            caleMare,
            imagine.cale_relativa
        );

        let caleImagineMediu = path.join(
            caleMediu,
            imagine.cale_relativa
        );

        let caleImagineMic = path.join(
            caleMic,
            imagine.cale_relativa
        );

        if (!fs.existsSync(caleOriginala)){
            console.warn(
                "Imagine lipsa pentru galerie:",
                caleOriginala
            );

            continue;
        }

        await genereazaImagineGalerie(
            caleOriginala,
            caleImagineMare,
            480,
            320
        );

        await genereazaImagineGalerie(
            caleOriginala,
            caleImagineMediu,
            360,
            240
        );

        await genereazaImagineGalerie(
            caleOriginala,
            caleImagineMic,
            240,
            160
        );

        imagine.cale_mare = path.posix.join(
            caleGalerieUrl,
            "mare",
            imagine.cale_relativa
        );

        imagine.cale_mediu = path.posix.join(
            caleGalerieUrl,
            "mediu",
            imagine.cale_relativa
        );

        imagine.cale_mic = path.posix.join(
            caleGalerieUrl,
            "mic",
            imagine.cale_relativa
        );

        imagine.alt = imagine.alt || imagine.nume;
    }

    let perioada = obtinePerioadaCurenta();

    let imaginiFiltrate = galerie.imagini.filter(function(imagine){
        return imagine.timp === perioada &&
            imagine.cale_mare &&
            imagine.cale_mediu &&
            imagine.cale_mic;
    });

    let numarImagini = imaginiFiltrate.length;

    numarImagini = numarImagini - numarImagini % 3;

    imaginiFiltrate = imaginiFiltrate.slice(
        0,
        numarImagini
    );

    if (imaginiFiltrate.length < 6){
        console.warn(
            `Galeria are doar ${imaginiFiltrate.length} imagini pentru perioada "${perioada}". Ne trebuie 6 imagini.`
        );
    }

    return {
        perioada: perioada,
        imagini: imaginiFiltrate
    };
}

function afisareEroare(res, identificator, titlu, text, imagine){
    //TO DO cautam eroarea dupa identificator
    let eroare= obGlobal.obErori.info_erori.find((elem) => 
        elem.identificator == identificator
    )
    //daca sunt setate titlu, text, imagine, le folosim, 
    //altfel folosim cele din fisierul json pentru eroarea gasita
    //daca nu o gasim, afisam eroarea default
    let errDefault= obGlobal.obErori.eroare_default;
    if(eroare?.status)
        res.status(eroare.identificator)
    res.render("pagini/eroare",{
        imagine: imagine || eroare?.imagine || errDefault.imagine,
        titlu: titlu || eroare?.titlu || errDefault.titlu,
        text: text || eroare?.text || errDefault.text,
    });

}

function compileazaScss(caleScss, caleCss){
    if(!caleCss){

        let numeFisExt=path.basename(caleScss); // "folder1/folder2/a.scss" -> "a.scss"
        let numeFis=numeFisExt.split(".")[0]   /// "a.scss"  -> ["a","scss"]
        caleCss=numeFis+".css"; // output: a.css
    }
    
    if (!path.isAbsolute(caleScss))
        caleScss=path.join(obGlobal.folderScss,caleScss )
    if (!path.isAbsolute(caleCss))
        caleCss=path.join(obGlobal.folderCss,caleCss )
    
    let caleBackup=path.join(obGlobal.folderBackup, "resurse/css");
    if (!fs.existsSync(caleBackup)) {
        fs.mkdirSync(caleBackup,{recursive:true})
    }
    
    // la acest punct avem cai absolute in caleScss si  caleCss

    let numeFisCss=path.basename(caleCss);
    if (fs.existsSync(caleCss)){
        fs.copyFileSync(caleCss, path.join(obGlobal.folderBackup, "resurse/css",numeFisCss ))// +(new Date()).getTime()
    }
    rez=sass.compile(caleScss, {"sourceMap":true});
    fs.writeFileSync(caleCss,rez.css)
    
}


//la pornirea serverului
vFisiere=fs.readdirSync(obGlobal.folderScss);
for( let numeFis of vFisiere ){
    if (path.extname(numeFis)==".scss"){
        compileazaScss(numeFis);
    }
}


fs.watch(obGlobal.folderScss, function(eveniment, numeFis){
    if (eveniment=="change" || eveniment=="rename"){
        let caleCompleta=path.join(obGlobal.folderScss, numeFis);
        if (fs.existsSync(caleCompleta)){
            compileazaScss(caleCompleta);
        }
    }
})

app.get("/eroare", function(req, res){
    afisareEroare(res, 404, "Titlu!!!")
});

app.get("/*pagina", async function(req, res){
    console.log("Cale pagina", req.url);
    if (req.url.startsWith("/resurse") && path.extname(req.url)==""){
        afisareEroare(res,403);
        return;
    }
    if (path.extname(req.url)==".ejs"){
        afisareEroare(res,400);
        return;
    }
    try{
        let datePagina = {
            ip: req.ip
        };

        if (req.url === "/galerie"){
            datePagina.galerie = await obtineGalerieStatica();
        }

        res.render("pagini" + req.url, datePagina, function(err, rezRandare){
            if (err){
                if (err.message.startsWith("Failed to lookup view")){
                    afisareEroare(res, 404)
                }
                else{
                    afisareEroare(res);
                }
            }
            else{
                res.send(rezRandare);
                console.log("Rezultat randare", rezRandare);
            }
        });
    }
    catch(err){
        if (err.message.includes("Cannot find module")){
            afisareEroare(res, 404)
        }
        else{
            afisareEroare(res);
        }
    }
});

app.listen(8080);
console.log("Serverul a pornit!");