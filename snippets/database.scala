//> using scala 3.8.2
//> using jvm 21
//> using dep ma.chinespirit::parlance:0.1.0
//> using dep com.h2database:h2:2.5.250

import ma.chinespirit.parlance.*
import org.h2.jdbcx.JdbcDataSource
import scala.language.implicitConversions

// snippet:start
@SqlName("reading")
@Table(SqlNameMapper.CamelToSnakeCase)
case class NewReading(city: String, tempC: Int)
  extends CreatorOf[Reading] derives DbCodec

@Table(SqlNameMapper.CamelToSnakeCase)
case class Reading(@Id id: Long, city: String, tempC: Int) derives EntityMeta

val readings: Repo[NewReading, Reading, Long] = Repo()

def insertAndFindWarmest(xa: Transactor[H2.type]): Option[Reading] = xa.transact:
  readings.create(NewReading("Krakow", 24))
  readings.create(NewReading("Oslo", 9))
  QueryBuilder.from[Reading].where(_.tempC > 20)
    .orderBy(_.tempC, SortOrder.Desc).first()
// snippet:end

def inMemory(): Transactor[H2.type] =
  val ds = JdbcDataSource()
  ds.setURL("jdbc:h2:mem:weather;DB_CLOSE_DELAY=-1")
  val xa = Transactor(H2, ds)
  xa.connect:
    sql"""create table reading(
            id bigint auto_increment primary key,
            city varchar(64), temp_c int)""".update.run()
  xa

@main def run(): Unit = println(insertAndFindWarmest(inMemory()))
