"""
Gera data/recursos.js a partir do "Relatório de publicação de recursos" exportado do RD.

Uso:
    python scripts/build_data.py caminho/relatorio.xlsx [data/recursos.js]

- Mantém apenas recursos com Visibilidade = "Público" (a interface é de acesso público).
- Campos com vários valores separados por ";" (Curso, UC, Área, Tipo) viram listas.
- Textos repetidos são guardados uma vez em dicionários e as linhas usam índices,
  o que deixa o arquivo bem menor (importante para o pacote SCORM).
"""
import json
import re
import sys
from datetime import datetime

import openpyxl

COLS = {
    "id": "ID do Recurso",
    "dep": "Departamentos",
    "cat": "Categoria",
    "tipo": "Tipo de Recurso",
    "area": "Área Tecnológica",
    "curso": "Curso",
    "uc": "Unidade Curricular",
    "vis": "Visibilidade",
    "dl": "Permite o download",
    "titulo": "Recurso",
    "autor": "Autoria",
    "criado": "Data de Criação",
    "atualizado": "Última Atualização",
}

# Palavras que ficam minúsculas no meio do nome
MINUSCULAS = {"a", "à", "ao", "aos", "as", "às", "com", "da", "das", "de", "do", "dos", "e", "em",
              "na", "nas", "no", "nos", "o", "os", "ou", "para", "por", "sem", "sob", "um", "uma"}
# Siglas que ficam maiúsculas
SIGLAS = {"TI", "CAD", "CAM", "CNC", "CLP", "NR", "SENAI", "IOT", "PCP", "ERP", "HTML", "CSS", "SQL",
          "BIM", "GTD", "CC", "EAD", "TV", "PLC", "IHM", "SST", "RH", "LGPD", "API", "UX", "UI", "BI",
          "PDV", "GLP", "GNV", "ABNT", "ISO", "QSMS", "SPDA", "PCI", "SMD", "CA", "CNH", "EPI", "EPC",
          "II", "III", "IV", "VI", "VII", "VIII", "IX", "XI", "XII", "5S", "3D", "2D", "AWS", "IA", "TCC"}


def titulo_bonito(s):
    """Converte 'TÉCNICO EM MECÂNICA' em 'Técnico em Mecânica' (só para textos todo em maiúsculas)."""
    if s != s.upper():
        # já vem em caixa mista: só ajusta as preposições ("Lógica De Programação" -> "Lógica de Programação")
        ps = s.split(" ")
        return " ".join(p.lower() if i > 0 and p.lower() in MINUSCULAS else p for i, p in enumerate(ps))
    palavras = s.split(" ")
    out = []
    for i, p in enumerate(palavras):
        base = re.sub(r"[^\wÀ-ÿ]", "", p)
        if base.upper() in SIGLAS or any(c.isdigit() for c in base):
            out.append(p)
        elif i > 0 and p.lower() in MINUSCULAS:
            out.append(p.lower())
        else:
            low = p.lower()
            # capitaliza após hífen/barra/parêntese também
            out.append(re.sub(r"(^|[-/(])([\wÀ-ÿ])", lambda m: m.group(1) + m.group(2).upper(), low))
    return " ".join(out)


def lista(v):
    if v is None:
        return []
    vals = []
    for p in str(v).split(";"):
        p = p.strip()
        if p and p != "-" and p not in vals:
            vals.append(p)
    return vals


def data_int(v):
    if not v or str(v).strip() == "-":
        return 0
    if isinstance(v, datetime):
        d = v
    else:
        try:
            d = datetime.strptime(str(v).strip()[:10], "%d/%m/%Y")
        except ValueError:
            return 0
    return int(d.strftime("%Y%m%d"))


class Dic:
    def __init__(self, bonito=False):
        self.items, self.idx, self.bonito = [], {}, bonito

    def __call__(self, v):
        key = v.upper() if self.bonito else v  # unifica variações de caixa
        if key not in self.idx:
            self.idx[key] = len(self.items)
            self.items.append(titulo_bonito(v) if self.bonito else v)
        return self.idx[key]


def main():
    src = sys.argv[1]
    out = sys.argv[2] if len(sys.argv) > 2 else "data/recursos.js"

    ws = openpyxl.load_workbook(src, read_only=True).worksheets[0]
    rows = ws.iter_rows(values_only=True)
    header = [str(h).strip() if h else "" for h in next(rows)]
    pos = {k: header.index(v) for k, v in COLS.items()}

    dics = {"dep": Dic(), "cat": Dic(), "tipo": Dic(), "area": Dic(), "curso": Dic(True), "uc": Dic(True), "autor": Dic()}
    linhas, total, vistos = [], 0, set()

    for r in rows:
        total += 1
        if str(r[pos["vis"]]).strip() != "Público":
            continue
        rid = r[pos["id"]]
        titulo = str(r[pos["titulo"]] or "").strip()
        if rid is None or rid in vistos or not titulo.strip(" ;-"):
            continue
        vistos.add(rid)
        dep = lista(r[pos["dep"]])
        autor = lista(r[pos["autor"]])
        linhas.append([
            int(rid),
            titulo,
            dics["cat"](str(r[pos["cat"]]).strip()),
            [dics["tipo"](v) for v in lista(r[pos["tipo"]])],
            [dics["area"](v) for v in lista(r[pos["area"]])],
            [dics["curso"](v) for v in lista(r[pos["curso"]])],
            [dics["uc"](v) for v in lista(r[pos["uc"]])],
            dics["dep"](dep[0]) if dep else -1,
            1 if str(r[pos["dl"]]).strip() == "Sim" else 0,
            dics["autor"](autor[0]) if autor else -1,
            max(data_int(r[pos["criado"]]), data_int(r[pos["atualizado"]])),
        ])

    payload = {
        "geradoEm": datetime.now().strftime("%d/%m/%Y"),
        "campos": ["id", "titulo", "cat", "tipos", "areas", "cursos", "ucs", "dep", "download", "autor", "data"],
        "dic": {k: d.items for k, d in dics.items()},
        "rows": linhas,
    }
    with open(out, "w", encoding="utf-8") as f:
        f.write("/* Gerado por scripts/build_data.py a partir do Relatório de publicação de recursos do RD.\n"
                "   Não editar à mão: rode o script de novo com a planilha atualizada. */\n")
        f.write("window.RD_DATA=")
        json.dump(payload, f, ensure_ascii=False, separators=(",", ":"))
        f.write(";\n")

    print(f"{total} linhas lidas, {len(linhas)} recursos públicos gravados em {out}")
    for k, d in dics.items():
        print(f"  {k}: {len(d.items)}")


if __name__ == "__main__":
    main()
