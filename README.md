# CRM App For Volunteers (Platinum Volunteers)

This application allows people looking for volunteers to post open positions, and peeople looking to volunteer can see available positions and sign up.

This app is written in React and uses Amplify, Amazon EC2, Amazon Cognito, Amazon DynamoDB, Amazon S3 and API Gateway.

## Architecture Overview

![Architecture](public/AWS_Template.png)

## Prerequisites
+ [AWS Account](https://aws.amazon.com/mobile/details/)
+ [AWS CLI](https://aws.amazon.com/cli/)
+ [AWS Ampify CLI](https://docs.amplify.aws/cli/start/install)
+ [NodeJS](https://nodejs.org/en/download/) with [NPM](https://docs.npmjs.com/getting-started/installing-node)
+ [Docker](https://www.docker.com/)

## Getting Started

1. Clone this repo locally.

   ```bash
   git clone https://github.com/azrielb1/Platinum-Volunteers.git
   ```

2. Run cloudformation templates

   ```bash
   aws cloudformation create-stack --stack-name API-Lambda-DB --template-body file://./cloudformation/API-Lambda-DB/template.json --parameters ParameterKey=LambdaFuncName,ParameterValue=CRMLambda ParameterKey=UsersTableName,ParameterValue=CRMUsersTable ParameterKey=APIName,ParameterValue=CRMAPI ParameterKey=EnvironmentName,ParameterValue=Prod --capabilities CAPABILITY_IAM
   ```
   ```bash
   aws cloudformation create-stack --stack-name MicroServices --template-body file://./cloudformation/MicroServices/template.json
   ```
   
3. Complete API setup

   1. [enable cors](https://docs.aws.amazon.com/apigateway/latest/developerguide/how-to-cors.html)
   2. Add APIGateway as a trigger for the Lambda
      1. Open AWS Console and go to Lambda
      2. Choose CRMLambda
      3. Choose "Add Trigger" 
      4. Select API Gateway and choose the CRMAPI
   3. Add your endpoint URL to Platinum-Volunteers/src/APIFunctions.js as well as in Platinum-Volunteers/EC2_scripts/EventSuggesterMicroServ/APIHelperFunctions.js and Platinum-Volunteers/EC2_scripts/ProcessEventsMicroServ/APIHelperFunctions.js

4. Complete MicroServices setup

   1. Create Docker image for both sub-directories 

      ```bash
      cd ProcessEventsMicroServ
      docker build -t process_old_events .
      cd ../EventSuggesterMicroServ
      docker build -t Event_Suggester .
      cd ..
      ```

   2. [Push images to ECR](https://docs.aws.amazon.com/AmazonECR/latest/userguide/docker-push-ecr-image.html)

   3. Schedule task with ECS

      1. Go to [AWS ECS console](https://console.aws.amazon.com/ecs)
      2. Create new task definition
      3. Use the images you pushed to ECR
      4. [Schedule task](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/scheduling_tasks.html) to run every 6 hours on the cluster created by cloud formation

5. Set up Amplify

   1. Initialize the amplify project. 

      ```
      amplify init
      ```

   2. Configure an Amazon Cognito User Pool to manage user credentials.

      ```
      amplify add auth
      
      # When asked how you why do users to sign in choose "Email"
      ```

   3. Configure an Amazon S3 bucket to store avatars.

      ```
      amplify add storage
      ```

   4. Deploy your backend.

      ```
      amplify push
      
      # When asked if you would like to generate client code, you can
      # say no since we are using plain JavaScript.
      ```

   5. Go to the AWS Amplify console to set up the front end.

6. SET UP .ENV

   1. obtain a [open weather API key](https://openweathermap.org/api) and [Google Maps API key](https://developers.google.com/maps/documentation/javascript/get-api-key)
   2. enter them in the .env file

   
