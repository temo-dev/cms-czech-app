#!/usr/bin/env python3

from __future__ import annotations

import argparse
import subprocess
import tempfile
from pathlib import Path


VOICE = "Zuzana"
SILENCE_MS = 800


CLIPS = {
    "listening-task1-q1.wav": """[Muž]: Dobrý den, prosím vás, jak se dostanu k nádraží? Je to pěšky daleko?
[Žena]: Dobrý den. No to je hodně daleko, lepší bude jet autobusem nebo trolejbusem.
[Muž]: A kterým autobusem?
[Žena]: Autobusem číslo 20. Ale ten jezdí každých třicet minut.
[Muž]: Aha, děkuju. A tenhle autobus tam nejede?
[Žena]: Ne, tenhle k nádraží nejede.
[Muž]: A jinak to nejde?
[Žena]: No ještě taxíkem, ale to je moc drahé. Ale podívejte, tady vám přijíždí trolejbus číslo čtyři. Ten vlastně taky jezdí k nádraží.""",
    "listening-task1-q2.wav": """[Muž]: Ty, Heleno, co budete dělat v sobotu? Nechcete k nám přijít na návštěvu?
[Žena]: Děkuju za pozvání, Ludvíku, ale náš starší syn hraje fotbal a my se na něho chceme jít podívat.
[Muž]: To je škoda. Budeme na zahradě grilovat.
[Žena]: Ale můžeme přijít v neděli.
[Muž]: Bohužel na neděli už máme jiný program, jedeme do muzea.
[Žena]: No, tak se sejdeme příští sobotu. Budu slavit narozeniny. Můžeme se sejít v restauraci U Slunce.""",
    "listening-task1-q3.wav": """[Muž]: Ahoj, Ireno, jsem rád, že tě vidím. Jak se máš?
[Žena]: Ahoj, Romane! Mám se docela dobře, ale pořád mám moc práce. Koupili jsme dům se zahradou. A teď na jaře je na zahradě pořád co dělat.
[Muž]: A jak se vám tam líbí? Jsou tam děti spokojené?
[Žena]: Ale ano, jen by ještě chtěly bazén na zahradě.
[Muž]: Tak budete kupovat ještě bazén?
[Žena]: No, to určitě ne. Musíme koupit hlavně auto, protože zastávka autobusu je daleko a autobus jezdí jen pětkrát za den.""",
    "listening-task1-q4.wav": """[Žena]: Ahoj, Martine, jsi už doma?
[Muž]: Ahoj, Lído, ne, ještě jsem v práci. Potřebuješ něco?
[Žena]: Já jsem teď v akvaparku s dcerou a dostala jsem zprávu, že mám na poště balík a za hodinu zavírají. Nemůžeš pro něj na poštu dojít?
[Muž]: Bohužel ne, musím ještě něco dodělat v kanceláři, a hlavně mám auto v servisu, takže bych musel pěšky.
[Žena]: Tak to nevadí. Když nemůžeš, půjdu pro něj zítra ráno.""",
    "listening-task1-q5.wav": """[Žena]: Dobrý den, jdete k panu doktorovi? My dnes neordinujeme.
[Muž]: Dobrý den, ne, jdu na rehabilitaci a zapomněl jsem, kde to je. Je to tady v přízemí?
[Žena]: Ne, rehabilitace je v prvním poschodí v chodbě napravo. První dveře jsou laboratoř, pak je čekárna doktorky Horské a hned vedle je rehabilitace.
[Muž]: Aha, a není tam tak někde vedle rentgen?
[Žena]: Rentgen je sice taky v prvním poschodí, ale v chodbě nalevo.""",
    "listening-task2-q6.wav": """Vážení zákazníci, tento týden v našem supermarketu nabízíme velké slevy na některé druhy masa a mléčné výrobky z české bio farmy Dolní Dvůr u Olomouce. Na hovězí maso je sleva pět procent, na vepřové maso třináct procent a na kuřecí dokonce patnáct procent. O deset procent levněji koupíte tento týden mléko, jogurty a tvaroh a nezapomeňte si také koupit výborné sýry se slevou dvanáct procent.""",
    "listening-task2-q7.wav": """Chcete se konečně naučit češtinu? Pak studujte v jazykové škole Luisa v Liberci, která nabízí různé kurzy češtiny pro cizince. Kurzy pro začátečníky jsou vždy v pondělí, ve středu a v pátek od sedmnácti do dvaceti hodin. Kurzy pro mírně pokročilé se konají v úterý a ve čtvrtek od šestnácti do osmnácti hodin. Kurzy pro středně pokročilé se konají v pondělí a ve čtvrtek od patnácti do sedmnácti hodin.""",
    "listening-task2-q8.wav": """Vážení cestující, prosím pozor. Naše dopravní společnost Atlantik upravuje od příštího měsíce jízdní řád u autobusu do Karlových Varů. Autobus s odjezdem v devět hodin na trase Praha Florenc a Karlovy Vary hlavní nádraží nebude zastavovat ve městě Louny, ale pojede přes města Chomutov a Most.""",
    "listening-task2-q9.wav": """Pro naši novou japonskou restauraci v centru Prahy hledáme nové zaměstnance. Od prvního ledna přijmeme manažera restaurace. Nabízíme nástupní plat čtyřicet osm tisíc korun za měsíc plus odměny. Dále přijmeme na plný úvazek kuchaře, číšníky a jednu uklízečku. Číšníkům nabízíme třicet tisíc korun měsíčně plus odměny.""",
    "listening-task2-q10.wav": """A nyní předpověď počasí na víkend. V sobotu bude celý den zataženo, občas déšť, na horách bude sněžit. Nejvyšší denní teploty dva až čtyři stupně Celsia, na horách minus pět stupňů Celsia. Nejnižší noční teploty minus dva stupně, na horách minus deset stupňů. V neděli v noci teploty klesnou na nulu, na horách až na minus šest stupňů.""",
    "listening-task3-q11.wav": """Jsem Leila z Íránu. Jako dítě jsem měla ráda tanec, hodně jsem taky sportovala, hlavně plavala. Teď mám ale už několik let nový koníček, fotografuju přírodu, parky a květiny. Můj sen je mít svoji vlastní fotografickou výstavu.""",
    "listening-task3-q12.wav": """Jmenuju se Džamila a jsem z Kazachstánu. Už v dětství jsem měla hodně koníčků, často jsem sportovala, ráda jsem četla a taky jsem moc ráda kreslila. A kreslím stále, hlavně venku, v parku nebo v lese. Nejraději kreslím obrazy přírody.""",
    "listening-task3-q13.wav": """Jmenuju se Ivona a jsem z Bosny. Jako malá jsem se ve volném čase celý den dívala na televizi. Když jsem se naučila číst, tak jsem zase celé dny četla romány. Na televizi se už moc nedívám, ale knihy čtu pořád. Je to můj největší koníček.""",
    "listening-task3-q14.wav": """Jsem Hindi a pocházím z Maroka. Jako dítě jsem měla mnoho koníčků, četla jsem, malovala a hodně sportovala, hlavně běhala. Bavilo mě i vařit zdravá jídla. V současné době mám už jen jeden velký koníček – plavání. Každý den chodím plavat do bazénu naproti našemu domu.""",
    "listening-task3-q15.wav": """Ahoj, jsem z Gruzie, jmenuji se Naďa. Když jsem byla dítě, ráda jsem četla dětské časopisy a dívala jsem se na pohádky v televizi. Taky jsem se věnovala hudbě a sportovala, hlavně plavala a běhala. Teď mě ze všeho nejvíc baví vaření. Ráda připravuju různá dobrá jídla pro rodinu i pro kamarády.""",
    "listening-task4-q16.wav": """[Žena 1]: Dobrý den, chtěla bych nějaké bavlněné tričko. Máte něco pěkného?
[Žena 2]: Samozřejmě, podívejte se tady.
[Žena 1]: Líbí se mi tohle bílé tričko. Můžu si ho zkusit?""",
    "listening-task4-q17.wav": """[Muž 1]: Chtěl bych nějaké teplé rukavice.
[Muž 2]: Bohužel tady rukavice neprodáváme. Musíte do vedlejšího oddělení.""",
    "listening-task4-q18.wav": """[Žena]: Můžu vám pomoct?
[Muž]: Potřebuju kravatu na svatbu.
[Žena]: A jaký budete mít oblek a košili?""",
    "listening-task4-q19.wav": """[Žena 1]: Potřebuju nějaké šaty na svatbu. Moje sestra se vdává.
[Žena 2]: Dobře. A chcete dlouhé šaty, nebo krátké šaty?
[Žena 1]: To je jedno, ale musí být růžové.""",
    "listening-task4-q20.wav": """[Žena]: Dobrý den, chtěla bych nějaký zimní kabát.
[Muž]: Jakou velikost, prosím?
[Žena]: Asi L nebo XL.""",
    "listening-task5-message.wav": """Ahoj Lído, tady Eva. Lído, dostala jsem od své sestry Ivany k narozeninám dva lístky na balet. Ivana nemůže a já nechci jít sama. Nechceš jít se mnou? Vím, že máš balet moc ráda. Představení je ve čtvrtek dvacátého osmého dubna v Národním divadle. Začátek je v šest hodin večer. Potom můžeme jít na večeři. Znám jednu dobrou restauraci, jmenuje se Klášterní. Ozvi se mi prosím do středy do večera na telefon sedm sedm tři devět tři dva pět nula čtyři. Budu se těšit, ahoj.""",
}


def synthesize(voice: str, output_dir: Path) -> None:
    output_dir.mkdir(parents=True, exist_ok=True)
    for filename, text in CLIPS.items():
        repeated = f"{text} [[slnc {SILENCE_MS}]] {text}"
        with tempfile.TemporaryDirectory() as tmpdir:
            aiff_path = Path(tmpdir) / f"{Path(filename).stem}.aiff"
            wav_path = output_dir / filename
            subprocess.run(
                ["say", "-v", voice, "-o", str(aiff_path), repeated],
                check=True,
            )
            subprocess.run(
                ["afconvert", "-f", "WAVE", "-d", "LEI16", str(aiff_path), str(wav_path)],
                check=True,
            )


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument(
        "--output-dir",
        default="docs/product/exams/official-a2-2025/assets/audio",
    )
    parser.add_argument("--voice", default=VOICE)
    args = parser.parse_args()
    synthesize(args.voice, Path(args.output_dir))


if __name__ == "__main__":
    main()
