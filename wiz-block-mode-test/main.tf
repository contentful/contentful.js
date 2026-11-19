# Temporary scanner test fixture. These are non-functional test patterns, not real secrets.
resource "aws_instance" "test" {
  ami           = "ami-12345678"
  instance_type = "t2.micro"

  user_data = <<-EOF
    #!/bin/bash
    export AWS_ACCESS_KEY_ID=AKIAIOSFODNN7EXAMPLE
    export AWS_SECRET_ACCESS_KEY=wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
  EOF
}

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
