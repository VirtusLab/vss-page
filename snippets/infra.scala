//> using scala 3.3.8
//> using jvm 21
//> using plugin org.virtuslab::besom-compiler-plugin:0.5.1
//> using dep org.virtuslab::besom-core:0.5.1
//> using dep org.virtuslab::besom-aws:7.7.0-core.0.5

import besom.*
import besom.api.aws.s3
import besom.api.aws.s3.inputs.BucketVersioningV2VersioningConfigurationArgs

// snippet:start
def storage(using Context): Stack =
  val bucket = s3.BucketV2("reports")

  val versioning = s3.BucketVersioningV2(
    "reports-versioning",
    s3.BucketVersioningV2Args(
      bucket = bucket.id,
      versioningConfiguration =
        BucketVersioningV2VersioningConfigurationArgs(status = "Enabled")
    )
  )

  Stack(versioning).exports(bucketName = bucket.bucket)

@main def run = Pulumi.run(storage)
// snippet:end
