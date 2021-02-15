def dockerhub = "atiakhairunican/jenkinsback"
def image_name = "${dockerhub}:${BRANCH_NAME}"
def builder

pipeline {
    agent any

    stages {
        stage("Install dependencies") {
            steps {
                nodejs("node14") {
                    sh "npm install"
                }
            }
        }

        stage("Build docker") {
            steps {
                script {
                    builder = docker.build("${image_name}")
                }
            }
        }

        stage("Testing image") {
            steps {
                script {
                    builder.inside {
                        sh "echo passed."
                    }
                }
            }
        }

        stage("Push image") {
            steps {
                script {
                    builder.push()
                }
            }
        }

        stage("Development") {
            steps {
                script {
                    sshPublisher(
                        publishers: [
                            sshPublisherDesc(
                                configName: "terasdev",
                                verbose: true,
                                transfers: [
                                    sshTransfer(
                                        execCommand: "cd /home/atia/development/backend; docker pull ${image_name}; docker-compose down; docker-compose up -d",
                                        execTimeout: 1500000
                                    )
                                ]
                            )
                        ]
                    )
                }
            }
        }
    }
}