def dockerhub = "atiakhairunican/jenkinsback"
def image_name = "${dockerhub}:${BRANCH_NAME}"
def builder

pipeline {
    agent any

    parameters {
        choice(
            choices: ['prod', 'dev'],
            description: '',
            name: 'REQUESTED_ACTION')
    }

    environment {
        compose_file = "docker-compose.yml"
    }

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

        stage("Production") {
            when {
                expression {
                    params.REQUESTED_ACTION == 'prod'
                }
            }
            steps {
                script {
                    sshPublisher(
                        publishers: [
                            sshPublisherDesc(
                                configName: "prodserver",
                                verbose: true,
                                transfers: [
                                    sshTransfer(
                                        execCommand: "cd /home/production/backend; docker-compose down; docker rmi ${image_name}; docker pull ${image_name}; docker-compose up -d",
                                        execTimeout: 1500000
                                    )
                                ]
                            )
                        ]
                    )
                }
            }
        }

        stage("Deployment") {
            when {
                expression {
                    params.REQUESTED_ACTION == 'dev'
                }
            }
            steps {
                script {
                    sshPublisher(
                        publishers: [
                            sshPublisherDesc(
                                configName: "devserver",
                                verbose: true,
                                transfers: [
                                    sshTransfer(
                                        execCommand: "cd /home/develop/kubernetes; docker-compose down; docker-compose up -d",
                                        execTimeout: 1500000
                                    )
                                ]
                            ),
                            sshPublisherDesc(
                                configName: "kubeserver",
                                verbose: true,
                                transfers: [
                                    sshTransfer(
                                        execCommand: "cd /home/kubernetes/kubernetes; sudo su; kubectl delete deployment.apps/backend; kubectl delete service/backend; kubectl apply -f backend.yaml",
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