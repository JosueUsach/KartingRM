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
                sh 'sleep 8'
            }
        }

        stage('Run Tests') {
            steps {
                sh 'docker-compose exec backend_app ./mvnw test || true'
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
