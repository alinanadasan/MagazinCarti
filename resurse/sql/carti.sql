DROP TABLE IF EXISTS carti;

DROP TYPE IF EXISTS categ_carte;
DROP TYPE IF EXISTS format_carte;
DROP TYPE IF EXISTS limba_carte;

CREATE TYPE categ_carte AS ENUM(
    'fictiune',
    'copii',
    'dezvoltare_personala',
    'educatie',
    'non_fictiune'
);

CREATE TYPE format_carte AS ENUM(
    'brosata',
    'cartonata',
    'ebook',
    'audiobook'
);

CREATE TYPE limba_carte AS ENUM(
    'romana',
    'engleza',
    'franceza'
);

CREATE TABLE IF NOT EXISTS carti (
    id serial PRIMARY KEY,
    nume VARCHAR(80) UNIQUE NOT NULL,
    autor VARCHAR(80) NOT NULL,
    descriere TEXT,
    pret NUMERIC(8,2) NOT NULL CHECK (pret >= 0),
    numar_pagini INT NOT NULL CHECK (numar_pagini >= 0),
    categorie categ_carte DEFAULT 'fictiune',
    format format_carte DEFAULT 'brosata',
    limba limba_carte DEFAULT 'romana',
    teme VARCHAR[],
    include_semn_carte BOOLEAN NOT NULL DEFAULT FALSE,
    imagine VARCHAR(300),
    editura VARCHAR(80),
    isbn VARCHAR(20),
    stoc INT NOT NULL DEFAULT 0 CHECK (stoc >= 0),
    data_publicare DATE,
    data_adaugare DATE DEFAULT current_date
);

INSERT INTO carti
(nume, autor, descriere, pret, numar_pagini, categorie, format, limba, teme, include_semn_carte, imagine, editura, isbn, stoc, data_publicare, data_adaugare)
VALUES

('Misterul din Bibliotecă',
 'Irina Popescu',
 'Un roman captivant despre un grup de cititori care descoperă un secret ascuns într-o bibliotecă veche.',
 49.90, 328, 'fictiune', 'cartonata', 'romana',
 '{"mister","aventura","biblioteca","prieteni"}',
 TRUE,
 '/resurse/imagini/produse/misterul-din-biblioteca.jpg',
 'Editura Aurora', '9786060000011', 12, '2021-09-15', '2024-02-10'),

('Umbre peste Oraș',
 'Andrei Marin',
 'O poveste urbană cu suspans, secrete de familie și alegeri care schimbă destine.',
 42.50, 286, 'fictiune', 'brosata', 'romana',
 '{"thriller","urban","suspans"}',
 FALSE,
 '/resurse/imagini/produse/umbre-peste-oras.jpg',
 'Editura Nord', '9786060000012', 18, '2020-05-20', '2024-03-01'),

('Jurnalul unei Veri',
 'Elena Ionescu',
 'Un roman cald despre prietenie, vacanță și descoperirea curajului de a începe din nou.',
 36.00, 214, 'fictiune', 'brosata', 'romana',
 '{"roman","prietenie","vara","emotie"}',
 TRUE,
 '/resurse/imagini/produse/jurnalul-unei-veri.jpg',
 'Editura Lira', '9786060000013', 25, '2022-07-01', '2024-03-18'),

('Povești pentru Somn Ușor',
 'Maria Dinu',
 'O colecție de povești scurte, blânde și ilustrate, potrivite pentru lectura de seară.',
 39.90, 96, 'copii', 'cartonata', 'romana',
 '{"povesti","copii","seara","ilustratii"}',
 TRUE,
 '/resurse/imagini/produse/povesti-pentru-somn-usor.jpg',
 'Editura Curcubeu', '9786060000014', 40, '2023-11-10', '2024-04-05'),

('Aventurile lui Puf',
 'Ioana Radu',
 'O carte veselă pentru copii, despre un motan curios care pornește într-o aventură prin oraș.',
 32.50, 84, 'copii', 'cartonata', 'romana',
 '{"animale","aventura","copii","ilustratii"}',
 FALSE,
 '/resurse/imagini/produse/aventurile-lui-puf.jpg',
 'Editura Curcubeu', '9786060000015', 30, '2021-03-12', '2024-04-12'),

('Atlasul Micilor Exploratori',
 'Radu Dumitrescu',
 'O introducere prietenoasă în geografie, cu hărți, curiozități și ilustrații pentru copii.',
 58.00, 144, 'copii', 'cartonata', 'romana',
 '{"geografie","educatie","harti","copii"}',
 TRUE,
 '/resurse/imagini/produse/atlasul-micilor-exploratori.jpg',
 'Editura Meridian', '9786060000016', 16, '2022-10-05', '2024-05-02'),

('Obiceiuri Mici, Rezultate Mari',
 'Clara Matei',
 'Un ghid practic despre organizare, disciplină și schimbări mici care pot produce rezultate importante.',
 44.90, 240, 'dezvoltare_personala', 'brosata', 'romana',
 '{"obiceiuri","organizare","productivitate"}',
 TRUE,
 '/resurse/imagini/produse/obiceiuri-mici-rezultate-mari.jpg',
 'Editura Focus', '9786060000017', 22, '2021-01-18', '2024-01-20'),

('Arta de a Citi Zilnic',
 'Victor Pavel',
 'O carte despre formarea rutinei de lectură și despre cum să alegi cărțile potrivite pentru tine.',
 37.00, 198, 'dezvoltare_personala', 'ebook', 'romana',
 '{"lectura","rutina","dezvoltare","carti"}',
 FALSE,
 '/resurse/imagini/produse/arta-de-a-citi-zilnic.jpg',
 'Editura Focus', '9786060000018', 60, '2023-02-14', '2024-02-22'),

('Mintea Calmă',
 'Sofia Neagu',
 'Un volum despre echilibru, atenție și construirea unui ritm mai liniștit în viața de zi cu zi.',
 46.50, 272, 'dezvoltare_personala', 'brosata', 'romana',
 '{"echilibru","mindfulness","calm","rutina"}',
 TRUE,
 '/resurse/imagini/produse/mintea-calma.jpg',
 'Editura Senin', '9786060000019', 14, '2022-09-09', '2024-06-01'),

('Gramatica pe Înțelesul Tuturor',
 'Adrian Stan',
 'Un ghid clar pentru recapitularea noțiunilor importante de gramatică română.',
 35.90, 176, 'educatie', 'brosata', 'romana',
 '{"gramatica","romana","scoala","exercitii"}',
 FALSE,
 '/resurse/imagini/produse/gramatica-pe-intelesul-tuturor.jpg',
 'Editura Didactica', '9786060000020', 35, '2019-08-25', '2024-01-11'),

('Matematica fără Teamă',
 'Mihai Georgescu',
 'Exerciții și explicații prietenoase pentru elevii care vor să înțeleagă matematica pas cu pas.',
 41.00, 220, 'educatie', 'brosata', 'romana',
 '{"matematica","exercitii","scoala","logica"}',
 TRUE,
 '/resurse/imagini/produse/matematica-fara-teama.jpg',
 'Editura Didactica', '9786060000021', 20, '2020-09-01', '2024-02-01'),

('Introducere în Programare Web',
 'Diana Ilie',
 'O carte pentru începători despre HTML, CSS, JavaScript și structura unei aplicații web.',
 65.00, 360, 'educatie', 'ebook', 'romana',
 '{"web","html","css","javascript","programare"}',
 FALSE,
 '/resurse/imagini/produse/introducere-in-programare-web.jpg',
 'Editura Tech', '9786060000022', 45, '2023-06-20', '2024-03-15'),

('Istoria Cărții',
 'Oana Marinescu',
 'O privire asupra apariției manuscriselor, tiparului și evoluției lecturii de-a lungul timpului.',
 52.00, 310, 'non_fictiune', 'cartonata', 'romana',
 '{"istorie","carte","tipar","cultura"}',
 TRUE,
 '/resurse/imagini/produse/istoria-cartii.jpg',
 'Editura Cultura', '9786060000023', 10, '2018-04-12', '2024-05-18'),

('Biblioteci Celebre ale Lumii',
 'Paul Enache',
 'Un album despre biblioteci spectaculoase, arhitectură, colecții rare și spații dedicate lecturii.',
 79.90, 256, 'non_fictiune', 'cartonata', 'romana',
 '{"biblioteci","arhitectura","cultura","album"}',
 FALSE,
 '/resurse/imagini/produse/biblioteci-celebre-ale-lumii.jpg',
 'Editura Meridian', '9786060000024', 8, '2021-12-03', '2024-06-12'),

('Cititori și Obiceiuri Moderne',
 'Nora Petrescu',
 'O analiză despre felul în care citim astăzi: cărți tipărite, ebook-uri, audiobook-uri și comunități online.',
 48.00, 232, 'non_fictiune', 'brosata', 'romana',
 '{"lectura","societate","ebook","audiobook"}',
 FALSE,
 '/resurse/imagini/produse/cititori-si-obiceiuri-moderne.jpg',
 'Editura Cultura', '9786060000025', 19, '2023-01-30', '2024-06-20'),

('The Quiet Shelf',
 'Emma Collins',
 'A gentle novel about a small bookshop, friendship and the books that help people find their way.',
 55.00, 304, 'fictiune', 'brosata', 'engleza',
 '{"bookshop","friendship","fiction","cozy"}',
 TRUE,
 '/resurse/imagini/produse/the-quiet-shelf.jpg',
 'North Star Books', '9786060000026', 11, '2022-08-08', '2024-04-22'),

('Le Jardin des Histoires',
 'Claire Martin',
 'Un roman scurt în limba franceză despre copilărie, memorie și povești transmise între generații.',
 47.50, 190, 'fictiune', 'brosata', 'franceza',
 '{"roman","familie","memorie","franceza"}',
 FALSE,
 '/resurse/imagini/produse/le-jardin-des-histoires.jpg',
 'Maison Lumiere', '9786060000027', 7, '2020-10-10', '2024-05-30'),

('Primele mele Experimente',
 'Laura Tudor',
 'Activități simple și sigure pentru copii curioși, explicate cu pași clari și ilustrații.',
 43.00, 128, 'copii', 'cartonata', 'romana',
 '{"stiinta","copii","experimente","educatie"}',
 TRUE,
 '/resurse/imagini/produse/primele-mele-experimente.jpg',
 'Editura Curcubeu', '9786060000028', 28, '2023-09-18', '2024-06-05');