//> using scala 3.3.8
//> using jvm 21
//> using dep com.softwaremill.ox::core:1.0.6

import ox.flow.Flow
import scala.concurrent.duration.*

// snippet:start
case class Reading(sensor: String, tempC: Int)

val cycle: Vector[Int] = Vector(17, 19, 21, 23, 20)

def sensor(name: String, every: FiniteDuration): Flow[Reading] =
  Flow.tick(every).zipWithIndex
    .map((_, i) => Reading(name, cycle((i % cycle.size).toInt)))

def warmReadings(): List[Reading] =
  sensor("north", 10.millis)
    .merge(sensor("south", 25.millis))
    .filter(_.tempC >= 20)
    .take(6)
    .runToList()
// snippet:end

@main def run(): Unit = warmReadings().foreach(println)
