# Temporary Wiz Block-mode simulation fixture. Never apply this configuration.
resource "aws_security_group" "wiz_block_test" {
  name        = "wiz-block-mode-sim"
  description = "Temporary scanner test: publicly exposed SSH"

  ingress {
    description = "Intentional test finding; never deploy"
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}
