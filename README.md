# Dashboard Full (Mercado Livre)

Este app junta 2 relatórios do Full e transforma em um painel de ação.

## Entradas
1. Relatório geral de estoque (xlsx) com as abas:
   - Resumo
   - Para impulsionar vendas

2. Consolidado de movimentações (xlsx) com a aba:
   - Consolidado de movimentações

## Como rodar local
```bash
python -m venv .venv
# Windows: .venv\\Scripts\\activate
source .venv/bin/activate
pip install -r requirements.txt
streamlit run app.py
```

## Deploy no Streamlit Community Cloud
- Suba este projeto para um repositório no GitHub.
- No Streamlit Cloud, conecte no GitHub, escolha repo, branch e o arquivo `app.py`.
- Garanta que exista um `requirements.txt` com `openpyxl` para ler xlsx.
