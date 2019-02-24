workflow "New workflow" {
  on = "pull_request_review"
  resolves = ["ssh"]
}

action "ssh" {
  uses = "ssh"
  runs = "ssh root@82.202.246.78"
}
