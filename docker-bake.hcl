group "default" {
  targets = [ "app" ]
}

target "_common" {
  dockerfile = "Dockerfile"
  
  platforms = [
    "linux/amd64",
    "linux/arm64",
  ]
}

target "app" {
  inherits = ["_common"]
  context = "."
  tags = [
    "michaelirwin244/ai-game",
  ]
}
