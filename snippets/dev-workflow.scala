//> using scala 3.8.4
//> using jvm 21
//> using dep org.virtuslab::orca:0.1.6

import orca.{*, given}

// snippet:start
@main def run(args: String*): Unit = flow(OrcaArgs(args.toArray)):
  val plan = stage("Plan"):
    Plan.autonomous.from(userPrompt, planningAgent).value

  val session = codingAgent.session("implementer", seed = plan.brief)

  for task <- plan.tasks do
    stage(s"Task: ${task.title}"):
      session.run(task.description)
      reviewThenFix(
        coderSession = session,
        reviewers = allReviewers(reviewAgent),
        task = task
      )
// snippet:end
