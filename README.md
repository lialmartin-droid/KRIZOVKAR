# Křížovkář

Česká webová aplikace generující nové křížovky. Otázky jsou z témat včelařství, chovu slepic, dílny a stavby, výroby, her, přírody a všeobecných znalostí.

## Co umí
- 227 ručně připravených otázek, 9 možností tématu (včetně vlastní směsi témat) a 3 úrovně obtížnosti.
- Algoritmus vytvoří při každém spuštění jiné křížení slov, vodorovné i svislé otázky a číslování.
- **Automaticky generovaná tajenka** z očíslovaných políček křížovky, která se odkrývá po správném vyplnění písmen; tajenky jsou volené podle tématu.
- Výběr políčka či otázky, kontrola chyb, odhalení písmene, vyhodnocení výsledku, čas.
- Automatické ukládání rozehrané křížovky včetně tajenky do `localStorage` telefonu/prohlížeče; existující rozehrané křížovky ze starší verze se zachovají.
- Mobilní použití, tmavý a světlý režim, PWA s offline cache po prvním načtení.
- Bez externích knihoven, účtů, API klíčů a serverové databáze.

## Nahrání na GitHub Pages
1. Rozbal ZIP. Do kořene **veřejného** repozitáře na GitHubu nahraj **obsah** složky (především `index.html`, všechny soubory `.js` a `styles.css`).
2. Otevři **Settings → Pages → Build and deployment**, jako Source vyber **Deploy from a branch** a jako branch `main` a složku `/(root)`.
3. Po publikování otevři odkaz od GitHub Pages v Safari na iPhonu. Přes **Sdílet → Přidat na plochu** ji můžeš používat jako aplikaci.

Důležité: stránka na GitHub Pages nepotřebuje žádné nastavení Apps Scriptu ani vlastní server. Pokud projekt otevíráš přímo ze souboru `index.html` na počítači (`file://`), modulové skripty mohou být zablokované prohlížečem. Pro lokální testování spusť ve složce `python -m http.server 8000` a otevři `http://localhost:8000`.

## Úprava otázek
Soubor `data.js`: každá otázka má formát `ODPOVĚĎ|Otázka|obtížnost`. Odpovědi piš jedním slovem, bez mezer, háčků a čárek a ideálně 3–11 znaků. Obtížnost je 1, 2 nebo 3. Slova by se neměla duplikovat ani mezi tématy.

## Soukromí
Žádná odpověď ani postup luštění se neodesílá na internet. Ukládá se jen v prohlížeči. Smazáním dat webu se rozehraná křížovka vymaže.
