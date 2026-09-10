//> using scala 3.3.8
//> using jvm 21
//> using dep com.softwaremill.sttp.client4::core:4.0.26
//> using dep com.softwaremill.ox::core:1.0.6

import ox.{resourceScope, useCloseableInScope}
import sttp.client4.*
import sttp.client4.ws.SyncWebSocket
import sttp.client4.ws.sync.asWebSocketOrFail
import sttp.model.Uri

// snippet:start
val echo: Uri = uri"wss://ws.postman-echo.com/raw"

def greet(names: List[String])(ws: SyncWebSocket): List[String] =
  names.foreach(name => ws.sendText(s"hello, $name"))
  names.map(_ => ws.receiveText())

@main def run(): Unit = resourceScope:
  val backend = useCloseableInScope(DefaultSyncBackend())
  val response = basicRequest
    .get(echo)
    .response(asWebSocketOrFail(greet(List("ada", "grace"))))
    .send(backend)
  response.body.foreach(println)
// snippet:end
