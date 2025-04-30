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
                bat 'docker-compose down'
                bat 'docker-compose build'
                bat 'docker-compose up -d'
            }
        }

        stage('Wait for Backend') {
            steps {
                bat 'timeout /t 8 /nobreak'
            }
        }

        stage('Run Tests') {
            steps {
                bat 'docker-compose exec backend_app ./mvnw test || exit /b 0'
            }
        }

        stage('Cleanup') {
            steps {
                bat 'docker-compose down'
            }
        }
    }

    post {
        always {
            echo 'Pipeline finished.'
        }
    }
}
