pipeline {
    agent any

    environment {
        COMPOSE_FILE = 'docker-compose.yml'
    }

    stages {
        stage('Clone Repository') {
            steps {
                checkout scm
            }
        }

        stage('Build and Start Containers') {
            steps {
                sh 'docker-compose down'
                sh 'docker-compose build'
                sh 'docker-compose up -d'
            }
        }

        stage('Wait for Backend') {
            steps {
                // Optionally implement a healthcheck or polling to check service readiness
                sh 'echo "Waiting for backend to be ready..."'
                sh 'sleep 8'
            }
        }

        stage('Run Tests') {
            steps {
                catchError(buildResult: 'SUCCESS', stageResult: 'FAILURE') {
                    sh 'docker-compose exec backend_app ./mvnw test'
                }
            }
        }

        stage('Cleanup') {
            steps {
                sh 'docker-compose down'
            }
        }
    }

    post {
        always {
            echo 'Pipeline finished.'
        }
    }
}
