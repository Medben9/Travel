# Travel Booking System - README

## Overview
This repository contains the frontend and backend components of a comprehensive Travel Booking System that I've developed. The system is designed to manage reservations for various travel modes, such as flights, trains, and buses. The backend is implemented using MongoDB as the database, with advanced queries and aggregates, replicas for high availability, integration with Azure CosmosDB, and a CRUD application for user interaction.

## Table of Contents
1. [Project Structure](#project-structure)
2. [Backend Setup](#backend-setup)
   - [MongoDB Schema](#mongodb-schema)
   - [MongoDB Replicas](#mongodb-replicas)
   - [Azure CosmosDB Integration](#azure-cosmosdb-integration)
   - [Advanced Queries and Aggregates](#advanced-queries-and-aggregates)
3. [Frontend Setup](#frontend-setup)
   - [Application Features](#application-features)
   - [Technology Stack](#technology-stack)
   - [How to Run](#how-to-run)
4. [Presentation](#presentation)
   - [Schema Design](#schema-design)
   - [MongoDB Implementation](#mongodb-implementation)
   - [CosmosDB Integration](#cosmosdb-integration)
   - [Application Development](#application-development)
   - [Challenges and Lessons Learned](#challenges-and-lessons-learned)

## Project Structure
```
travel-booking-system
|-- backend
|   |-- src
|   |   |-- app.js
|   |-- .env
|   |-- package.json
|-- frontend
|   |-- public
|   |-- src
|   |   |-- components
|   |   |   |-- BookingForm.js
|   |   |   |-- ScheduleView.js
|   |   |   |-- ReservationList.js
|   |   |-- App.js
|   |   |-- index.js
|   |-- package.json
|-- presentation
|   |-- TravelBookingSystem_Presentation.pptx
|-- README.md
```

## Backend Setup

### MongoDB Schema
I've designed the MongoDB schema to represent entities like Flights, Passengers, and Reservations. Check out the backend/src/models directory for individual schema definitions.

### MongoDB Replicas
I've set up MongoDB replicas for data redundancy and high availability. Follow MongoDB documentation to configure replica sets.

### Azure CosmosDB Integration
Integration with Azure CosmosDB is established to showcase the process of migrating data from MongoDB to CosmosDB while maintaining consistency. Refer to Azure documentation for CosmosDB setup.

### Advanced Queries and Aggregates
Explore backend/src directory for API endpoints that perform advanced queries and aggregates as specified in the project requirements.

## Frontend Setup

### Application Features
The frontend provides a user interface for booking tickets, viewing schedules, managing reservations, and interacting with the MongoDB database.

### Technology Stack
I've used React for the frontend application and fetch for API communication with express server.

### How to Run
1. Clone the repository: `https://github.com/Medben9/Travel.git`
2. Navigate to the frontend directory: `cd frontend`
3. Install dependencies: `npm install`
4. Start the application: `npm start`
