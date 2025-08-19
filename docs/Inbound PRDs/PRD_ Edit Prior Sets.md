# **Product Requirements Document: Edit Prior Sets**

| Feature Name | Edit Prior Sets |
| :---- | :---- |
| **Status** | Proposed |
| **Author** | Gemini (Consultant) |
| **Date** | July 11, 2025 |
| **Initiative** | "Run" Phase: Core Experience & Usability |

## **1\. Overview**

This document outlines the requirements for allowing users to edit a previously logged set within an active workout session. Currently, once a set is logged, its data (weight, reps) is immutable for the duration of the workout. This feature addresses the common user error of inputting incorrect data, providing a simple and intuitive way to make corrections.

## **2\. Goals & Success Metrics**

### **Goals**

* **Goal 1: Improve User Experience.** Eliminate user frustration from data entry errors.  
* **Goal 2: Increase Data Accuracy.** Ensure the user's workout logs accurately reflect the work they have performed.  
* **Goal 3: Enhance UI Interactivity.** Make the workout session screen more dynamic and responsive to user needs.

### **Success Metrics**

* **Metric 1: Successful Edits.** Users can successfully edit and save changes to a previously logged set, with the changes reflected in both the UI and the Supabase database.  
* **Metric 2: Feature Adoption.** The feature is used by users, which can be tracked by logging edit events.  
* **Metric 3: Documentation Update.** The relevant architecture documents are updated to reflect this new functionality.

## **3\. User Stories**

* **As a user who just completed Set 2**, I realize I entered the wrong number of reps for Set 1, and I want to quickly correct it without disrupting my workout flow.  
* **As a user who increased the weight for my final set**, I want to be able to go back and adjust the weight I logged for the previous sets to reflect a warm-up, so my history is accurate.

## **4\. Functional & Technical Requirements**

### **4.1. FR1: UI Update \- Interactive Logged Sets**

* **Reference:** WorkoutSession.tsx  
* **Requirement:** The UI component that displays the list of logged sets for the current exercise must be made interactive. Each logged set item (e.g., "Set 1: 50 lbs x 10 reps") should be a tappable/clickable element.

### **4.2. FR2: Edit Modal**

* **Trigger:** Tapping on a logged set item will open a modal titled **"Edit Set"**.  
* **Content:** The modal will contain two pre-populated input fields:  
  * **Weight:** Filled with the weight value of the selected set.  
  * **Reps:** Filled with the reps value of the selected set.  
* **Actions:** The modal will have two buttons:  
  * **"Save Changes"** (Primary Action)  
  * **"Cancel"** (Secondary Action)

### **4.3. FR3: State Management & Backend Logic**

* **Reference:** useWorkoutLogger.ts and the Supabase workout\_logs table.  
* **Requirement:** A new function must be created to handle the update logic.  
* **Function Signature (Example):** updateLoggedSet(logId: string, newWeight: number, newReps: number)  
* **Logic:**  
  1. When the user taps "Save Changes," this function is called with the id of the log entry and the new values from the modal's input fields.  
  2. The function must perform an **UPDATE** operation on the workout\_logs table in Supabase, targeting the row with the matching id.  
  3. Upon successful update, the local state for the workout session must be refreshed to reflect the change, and the modal should close.  
  4. The function must include robust error handling in case the database update fails.

### **4.4. FR4: Implementation Documentation**

* The architecture document for the workout session (e.g., docs/workout-session.md if one exists, or a new one should be created) must be updated to include the user flow and technical logic for editing a prior set.  
* The documentation should detail the updateLoggedSet function and its interaction with the Supabase backend.