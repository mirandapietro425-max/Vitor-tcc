# RastroPet

Painel web para acompanhar animais com **telemetria real** enviada por uma coleira GPS/Bluetooth ou por um Arduino conectado via USB. O projeto é uma SPA estática: os animais e as últimas posições ficam salvos no navegador, sem um backend obrigatório e sem posições de demonstração.

## O que já funciona

- mapa interativo real com Leaflet e OpenStreetMap;
- cadastro de animais e persistência no `localStorage`;
- integração Bluetooth Web GATT com notificações;
- integração Arduino/USB Serial com leitura contínua a 9600 baud;
- validação de latitude, longitude, bateria, precisão e timestamp;
- vinculação do `trackerId` ao animal para recusar pacotes de outra coleira;
- estados claros de **Aguardando sinal**, **Sinal recebido**, **Sinal desatualizado** e **Sem sinal**;
- última atualização, bateria, precisão e tipo de conexão visíveis no painel;
- teste manual do protocolo na página de cada animal;
- fallback seguro sem hardware: o mapa permanece vazio em vez de exibir uma localização inventada.

## Acesso local

A aplicação continua com um acesso local de demonstração:

- e-mail: `demo@rastropet.com`
- senha: `rastropet`

Os dados são locais ao navegador. Para autenticação multiusuário, histórico na nuvem, notificações e acesso remoto seria necessário adicionar uma API e um banco de dados.

## Protocolo do dispositivo

O mesmo objeto JSON é aceito pelas duas entradas:

```json
{
  "trackerId": "coleira-01",
  "latitude": -23.5614,
  "longitude": -46.6562,
  "battery": 82,
  "timestamp": "2026-09-10T16:00:00Z",
  "accuracy": 12
}
```

`latitude` e `longitude` são obrigatórios. `trackerId`, `battery`, `timestamp` e `accuracy` são opcionais, mas recomendados. O timestamp pode ser ISO 8601 ou Unix em segundos/milissegundos. Pacotes inválidos são recusados e não movem o marcador.

### Bluetooth GATT

- serviço: `7d5a1000-7d5a-4d8a-9f5d-4c9a6f5a1000`;
- característica de telemetria: `7d5a1001-7d5a-4d8a-9f5d-4c9a6f5a1000`;
- propriedade: `notify`;
- payload: UTF-8 com um objeto JSON por notificação.

O firmware deve anunciar o serviço acima e publicar a mensagem na característica quando houver um novo fix GPS.

### Arduino via USB

- porta serial: `9600 baud`, 8N1;
- encoding: UTF-8;
- framing: uma linha JSON por mensagem, finalizada com `\\n`.

Exemplo mínimo:

```cpp
Serial.begin(9600);
Serial.println(R"({"trackerId":"coleira-01","latitude":-23.5614,"longitude":-46.6562,"battery":82,"timestamp":"2026-09-10T16:00:00Z","accuracy":12})");
```

Na prática, o Arduino deve substituir os valores por leituras do módulo GPS e da bateria. A página de configurações do app também exibe o contrato completo.

## Rodar localmente

Como o projeto não depende de um bundler, basta servir a raiz por HTTP:

```bash
python3 -m http.server 4173
```

Abra `http://localhost:4173`. Para Bluetooth Web e Web Serial, use Chrome ou Edge em `localhost` ou em um domínio HTTPS. O mapa precisa de acesso à internet para carregar os tiles do OpenStreetMap.

## Publicar na Vercel

1. Importe `mirandapietro425-max/Vitor-tcc` na Vercel.
2. Use a raiz do repositório como **Root Directory**.
3. Não configure comando de build: os arquivos já são estáticos e prontos para servir.
4. Publique com o `vercel.json` existente para manter as rotas do SPA funcionando.

Os tiles públicos do OpenStreetMap devem ser usados de acordo com a [política de uso de tiles](https://operations.osmfoundation.org/policies/tiles/). Para tráfego maior, configure um provedor de tiles dedicado.
