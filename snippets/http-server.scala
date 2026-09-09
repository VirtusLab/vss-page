//> using scala 3.3.8
//> using dep com.softwaremill.sttp.tapir::tapir-netty-server-sync:1.13.31
//> using dep com.softwaremill.sttp.tapir::tapir-jsoniter-scala:1.13.31
//> using dep com.github.plokhotnyuk.jsoniter-scala::jsoniter-scala-macros:2.40.1

import com.github.plokhotnyuk.jsoniter_scala.macros.ConfiguredJsonValueCodec
import sttp.shared.Identity
import sttp.tapir.*
import sttp.tapir.json.jsoniter.jsonBody
import sttp.tapir.server.ServerEndpoint
import sttp.tapir.server.netty.sync.NettySyncServer

// snippet:start
case class Forecast(city: String, tempC: Int, sunny: Boolean)
  derives ConfiguredJsonValueCodec, Schema
case class TooFarAhead(maxDays: Int) derives ConfiguredJsonValueCodec, Schema
val maxDays: Int = 14

val forecast: ServerEndpoint[Any, Identity] = endpoint.get
  .in("forecast" / path[String]("city")).in(query[Int]("days"))
  .out(jsonBody[Forecast]).errorOut(jsonBody[TooFarAhead])
  .handle: (city, days) =>
    if days > maxDays then Left(TooFarAhead(maxDays))
    else Right(Forecast(city, 21, sunny = true))

@main def run(): Unit =
  NettySyncServer().port(8080).addEndpoint(forecast).startAndWait()
// snippet:end
