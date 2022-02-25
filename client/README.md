## Клиент

Клиент раз в секунду запрашивает [https://fundraiseup.com/](https://fundraiseup.com/) и как только получает ответ, отправляет его серверу в таком формате.

```json
{
	"pingId": 1,
  "deliveryAttempt": 1,
	"date": 1589877226614,
	"responseTime": 247
}
```

- `pingId` — порядковый номер пинга сайта с момента запуска клиента
- `deliveryAttempt` — номер попытки доставки пинга
- `date` — момент пинга
- `responseTime` — время, за которое страница ответила

Клиент знает, что сервер работает из рук вон плохо, поэтому умеет переотправлять недоставленные сообщения с [экспоненциальной задержкой](https://ru.wikipedia.org/wiki/%D0%AD%D0%BA%D1%81%D0%BF%D0%BE%D0%BD%D0%B5%D0%BD%D1%86%D0%B8%D0%B0%D0%BB%D1%8C%D0%BD%D0%B0%D1%8F_%D0%B2%D1%8B%D0%B4%D0%B5%D1%80%D0%B6%D0%BA%D0%B0). Если сервер долго не отвечает, то клиент разрывает соединение через 10 секунд.

Клиент логгирует в терминал все попытки отправки и ответы сервера.

При остановке клиента, клиент выводит в консоль статистику обращений к серверу:

- сколько было сделано запросов,
- сколько из них завершились успехом,
- сколько было 500х ошибок,
- сколько запросов зависло.

## Запуск

### Параметры по умолчанию

```bash
npm run start
```

### Настраиваемые параметры

```bash
npm run start <server_host_name> <delay_base_ms>
```

где `<server_host_name>` имя хоста сервера, а `<delay_base_ms>` базовое значение для экспоненциальной задержки. По умолчанию `<server_host_name>` = localhost, `<delay_base_ms>` = 200.