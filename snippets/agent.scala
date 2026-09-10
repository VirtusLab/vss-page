//> using scala 3.3.8
//> using jvm 21
//> using dep com.softwaremill.sttp.ai::openai:0.11.0
//> using dep com.softwaremill.ox::core:1.0.6
//> using dep io.circe::circe-core:0.14.16
//> using dep com.softwaremill.sttp.tapir::tapir-core:1.13.31

import io.circe.Codec
import ox.{resourceScope, useCloseableInScope}
import sttp.ai.core.agent.{AgentFailure, AgentTool}
import sttp.ai.openai.OpenAI
import sttp.ai.openai.agent.OpenAIAgent
import sttp.ai.openai.requests.completions.chat.ChatRequestBody.ChatCompletionModel
import sttp.client4.DefaultSyncBackend
import sttp.tapir.Schema

// snippet:start
case class City(name: String) derives Codec.AsObject, Schema

def ask(question: String): Either[AgentFailure, String] = resourceScope:
  val weather = AgentTool.fromFunction("get_weather", "Current weather in a city"):
    (city: City) => s"22°C and sunny in ${city.name}"

  val agent = OpenAIAgent
    .synchronous(OpenAI.fromEnv, ChatCompletionModel.GPT4oMini)
    .maxIterations(5)
    .tools(weather)
    .build

  val backend = useCloseableInScope(DefaultSyncBackend())
  agent.run(question)(backend).finalAnswer
// snippet:end

@main def run(): Unit = println(ask("Should I take an umbrella to Krakow?"))
