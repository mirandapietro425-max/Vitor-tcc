# Contrato de telemetria RastroPet

O app aceita uma mensagem JSON por notificação Bluetooth ou por linha serial. Nunca envie texto adicional junto do JSON.

## Payload

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

| Campo       | Tipo             | Obrigatório | Regra                                                               |
| ----------- | ---------------- | ----------: | ------------------------------------------------------------------- |
| `trackerId` | string           |         não | Identifica a coleira e fica vinculada ao animal no primeiro pacote. |
| `latitude`  | number           |         sim | Intervalo de `-90` a `90`.                                          |
| `longitude` | number           |         sim | Intervalo de `-180` a `180`.                                        |
| `battery`   | number           |         não | Percentual entre `0` e `100`.                                       |
| `timestamp` | ISO 8601 ou Unix | recomendado | Não pode estar mais de cinco minutos no futuro.                     |
| `accuracy`  | number           |         não | Precisão estimada em metros, igual ou maior que zero.               |

Também são aceitos `lat`, `lon`, `lng`, `ts`, `deviceId`, `batteryPercent` e `bateria` como aliases de compatibilidade.

## Bluetooth GATT

O firmware deve anunciar e expor:

- serviço: `7d5a1000-7d5a-4d8a-9f5d-4c9a6f5a1000`;
- característica: `7d5a1001-7d5a-4d8a-9f5d-4c9a6f5a1000`;
- propriedade: `notify`;
- conteúdo: UTF-8 do JSON.

## Arduino USB Serial

A conexão usa `9600` baud, 8N1. Envie um JSON completo por linha, com `\\n` ao final. O app acumula fragmentos e processa somente quando a linha termina, evitando aplicar mensagens incompletas.

## Regras de estado

- pacote válido recebido há até cinco minutos: **Sinal recebido**;
- último pacote entre cinco e vinte minutos: **Sinal desatualizado**;
- mais de vinte minutos sem pacote ou dispositivo desconectado: **Sem sinal**;
- sem pacote recebido: **Aguardando sinal**.

Pacotes com coordenadas inválidas, timestamp futuro, bateria fora do intervalo ou `trackerId` de outra coleira são recusados e não alteram o mapa.
