# API Bartra Bot - Sldark23

Esta API está configurada especificamente para o repositório `Sldark23/bartra-cmds` na branch `main`.

## Configurações Atuais
- **Prefixo**: `ba!`
- **Repositório**: `https://github.com/Sldark23/bartra-cmds`
- **Branch**: `main`

## Como usar no BDFD
Crie um comando com gatilho `$alwaysReply` ou similar e use:

```
$httpGet[https://seu-projeto.vercel.app/executar?input=$message]
$httpResult
```

## Estrutura Necessária no GitHub
Para que a API funcione, seu repositório deve ter:
1. Um arquivo `config.json` na raiz.
2. Uma pasta `comandos/` com os arquivos `.txt`.

### Exemplo de `config.json`:
```json
{
  "comandos": [
    {
      "nome": "ping",
      "aliases": ["p", "latencia"],
      "arquivo": "ping.txt"
    }
  ]
}
```
