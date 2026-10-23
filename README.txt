KŘÍŽOVKÁŘ 2.0 – KLASICKÁ KŘÍŽOVKA
==================================

SPUŠTĚNÍ V POČÍTAČI
- Rozbal ZIP.
- Dvojklikem otevři soubor index.html v prohlížeči.
- Internet k luštění není potřeba. Všechny soubory musí zůstat pohromadě.

GITHUB PAGES
- Na GitHub nahraj OBSAH této složky do kořene repozitáře.
  (Soubor index.html musí být přímo v kořeni repozitáře.)
- Settings → Pages → Deploy from a branch → main / (root).
- Pak otevři zveřejněnou GitHub Pages adresu.
- Na iPhonu použij Safari → Sdílet → Přidat na plochu.
- Po prvním načtení přes HTTPS aplikace pracuje také offline.

JAK HRÁT
- Klepni na políčko a piš. Druhým klepnutím na stejnou buňku změníš směr.
- Vodorovné i svislé odpovědi se kříží v jedné mřížce.
- Piš BEZ HÁČKŮ A ČÁREK (např. VCELA, VYBEH).
- Kliknutím na otázku vybereš slovo.
- Označené buňky 1, 2, 3... skládají tajenku v tom pořadí.
- Tajenka se automaticky odhaluje při správně vyřešených slovech.
- Svoji hru najdeš po opětovném otevření. Lze vyexportovat zálohu.

STRUKTURA SOUBORŮ
index.html                 - stránka
css/style.css              - styly (světlý/tmavý)
js/otazky.js               - české otázky, témata a odpovědi
js/krizovka.js             - sestavení jedné společné křížovky
js/app.js                  - ovládání, klávesnice, tajenka a ukládání
assets/                    - ikony aplikace
manifest.webmanifest       - přidání na plochu iPhonu
sw.js                      - offline ukládání pro GitHub Pages

POZNÁMKA
Tato verze je nově sestavená podle funkcí původního Křížovkáře 1.1,
protože jeho zdrojový ZIP nebyl v konverzaci dostupný. Původní zálohy
verze 1.1 nejsou automaticky kompatibilní se zálohami verze 2.0.
