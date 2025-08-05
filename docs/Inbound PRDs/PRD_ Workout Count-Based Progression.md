# **Product Requirements Document: Workout Count-Based Progression**

| Feature Name | Workout Count-Based Progression |
| :---- | :---- |
| **Status** | Proposed |
| **Author** | Gemini (Consultant) |
| **Date** | July 9, 2025 |
| **Initiative** | Core Progression Loop Refactor |

## **1\. Overview**

This document outlines the requirements for refactoring the training block progression system. Based on a strategic review, the current time-based model (tracking weeks) is being replaced with a more robust system based on the **number of workouts completed**.

This change ensures that a user's progression is tied directly to the work they have actually performed, gracefully handling missed workouts and providing a more accurate measure of readiness for the next training block. This PRD supersedes the time-based logic detailed in PRD\_BlockCompletion\_v1.

## **2\. Goals & Success Metrics**

### **Goals**

* **Goal 1: Improve Progression Accuracy.** Tie the "Level Up" trigger to work completed, not time elapsed.  
* **Goal 2: Increase User Flexibility.** Natively support users who miss workouts and provide manual overrides for edge cases.  
* **Goal 3: Refactor Core Logic.** Update the backend schema and client-side logic to reflect the new progression model.  
* **Goal 4: Improve Testability.** Enable developers and testers to easily trigger the level-up screen without completing a full training block.

### **Success Metrics**

* **Metric 1: Accurate Tracking.** The completedWorkoutCount accurately increments after each completed workout session.  
* **Metric 2: Successful Trigger.** The "Level Up" screen is reliably triggered when completedWorkoutCount equals targetWorkoutCount.  
* **Metric 3: Documentation Update.** All relevant architecture documents are updated to reflect this new count-based system.

## **3\. User Stories**

* **As a user who missed a week of training**, I want my progress to be based on the workouts I've actually done, so I don't get pushed to the next level before I'm ready.  
* **As a user**, I want to see a clear count of how many workouts I have left in my program to stay motivated.  
* **As a user who forgot to log a workout I did yesterday**, I want to be able to manually add it to my count so my progress is accurate.  
* **As a developer**, I want to be able to manually adjust the completed workout count so I can easily test the level-up functionality.

## **4\. Functional & Technical Requirements**

### **4.1. FR1: Backend Schema Refactor (Supabase)**

The user\_profiles table must be updated. The following fields are to be **removed or deprecated**:

* blockStartDate  
* blockDurationWeeks

They will be **replaced with**:

* targetWorkoutCount (integer): The total number of workouts required to complete the block.  
* completedWorkoutCount (integer): A counter for the number of workouts the user has completed in the current block. **Defaults to 0**.

### **4.2. FR2: Workout Count Management**

* **Target Calculation:** When a user starts a new training block, the application must calculate the targetWorkoutCount. The default logic will be: (Number of workout days in the plan) x 6\. (e.g., a 3-day/week plan has a target of 18; a 2-day/week plan has a target of 12). This value is then saved to the user's profile.  
* **Manual Adjustment UI:** The UI element that displays the workout progress (see FR3) will act as the entry point to an **"Edit Progress"** modal.  
* **Modal Content:** This modal will provide controls for adjusting both values:  
  * **Target Workouts:** A number input or stepper (+/-) to modify the targetWorkoutCount.  
  * **Completed Workouts:** A number input or stepper (+/-) to modify the completedWorkoutCount.  
* **Logic:** These controls will directly read from and write to the corresponding fields in the user's profile in the database.

### **4.3. FR3: UI Display Update**

* The UI element on the "Plan Homescreen" that previously showed "X weeks remaining" must be updated to show progress in the new format.  
* **Recommended Display:** **"X / Y Workouts Completed"** (e.g., "12 / 18 Workouts Completed"). A visual progress bar is also recommended.  
* This UI element will still serve as the entry point for editing the workout counts as described in FR2.

### **4.4. FR4: Workout Completion Logic**

* **Increment Trigger:** The completedWorkoutCount must be incremented by 1 when a user finishes a workout session.  
* **Definition of "Finished":** A session is considered finished when the user navigates away from the active workout screen after having logged **at least one set**. This prevents accidental increments. This logic should be handled robustly (e.g., when an "End Workout" button is tapped or when navigating back to the plan home).

### **4.5. FR5: Level Up Trigger Refactor**

* The core trigger logic for displaying the "Training Block Complete\!" screen must be changed.  
* **New Trigger:** The screen is displayed when completedWorkoutCount \>= targetWorkoutCount. All subsequent logic on the success screen (e.g., "Start Next Level") remains the same.

### **4.6. FR6: Implementation Documentation**

* All architecture documents that reference the old time-based progression system (especially docs/training-block-completion.md) must be updated to detail this new workout-count-based model, including the manual adjustment functionality.  
* The documentation should clearly explain the backend schema changes and the new client-side logic for calculating and tracking workout counts.