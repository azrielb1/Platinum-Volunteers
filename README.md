# CRM App For Volunteers (Platinum Volunteers)

This application allows people looking for volunteers to post open positions, and peeople looking to volunteer can see available positions and sign up.

This app is written in React and uses Amplify, Amazon EC2, Amazon Cognito, Amazon DynamoDB, Amazon S3 and API Gateway.

## Architecture Overview

![Architecture](public/AWS_Template.png)

## Prerequisites
+ [AWS Account](https://aws.amazon.com/mobile/details/)
+ [AWS CLI](https://aws.amazon.com/cli/)
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

4. Complete MicroServices setup

5. Set up Amplify

6. SET UP .ENV

7. 
