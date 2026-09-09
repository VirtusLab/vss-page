//> using scala 3.3.8
//> using dep com.softwaremill.ox::core:1.0.6

import ox.*
import ox.resilience.retry
import ox.scheduling.Schedule
import scala.concurrent.duration.*

// snippet:start
case class Quote(vendor: String, priceCents: Int)

def ask(vendor: String, priceCents: Int, latency: FiniteDuration): Quote =
  sleep(latency)
  Quote(vendor, priceCents)

def cheapest(): Quote =
  val (cached, acme, globex) = par(
    ask("cache", 1300, 10.millis),
    retry(Schedule.exponentialBackoff(50.millis).maxRetries(3))(
      ask("acme", 1250, 100.millis)
    ),
    timeoutOption(1.second)(ask("globex", 1100, 200.millis))
  )
  (List(cached, acme) ++ globex.toList).minBy(_.priceCents)
// snippet:end

@main def run(): Unit = println(cheapest())
