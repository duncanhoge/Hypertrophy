# **Product Requirements Document: Core Usability Features**

| Feature Name | Core Usability Features (End Workout & Exercise Links) |
| :---- | :---- |
| **Status** | Proposed |
| **Author** | Gemini (Consultant) |
| **Date** | July 11, 2025 |
| **Initiative** | "Run" Phase: Core Experience & Usability |

## **1\. Overview**

This document outlines the requirements for two high-priority usability features designed to polish the in-workout experience:

1. **End Workout Early:** Provides users with a clear option to end their session prematurely without it counting towards their plan progression.  
2. **External Exercise Links:** Offers users immediate access to external resources (via Google search) to view the form for any given exercise.

These features will address key user needs for flexibility and guidance during their workouts.

## **2\. Goals & Success Metrics**

### **Goals**

* **Goal 1: Provide User Flexibility.** Allow users to gracefully exit a workout session if they are short on time or unable to complete it.  
* **Goal 2: Offer Instant Guidance.** Give users a low-friction way to look up exercise form without leaving the application context for long.  
* **Goal 3: Improve Data Integrity.** Ensure that incomplete workouts do not incorrectly contribute to the user's training block progression.

### **Success Metrics**

* **Metric 1: Successful Implementation.** Both the "End Workout Early" and "External Exercise Links" features are implemented and function as specified.  
* **Metric 2: Progression Integrity.** Workouts ended early correctly save their logs but do not increment the user's completedWorkoutCount.  
* **Metric 3: Link Clicks.** The external exercise links are used by users, which can be tracked via analytics events.

## **3\. User Stories**

* **As a user who is running out of time**, I want to be able to end my workout early and still have the sets I did complete saved to my history.  
* **As a user who is unsure about the form for an exercise**, I want a quick way to look it up so I can perform it safely and effectively.

## **4\. Functional & Technical Requirements**

### **Feature A: End Workout Early**

#### **4.1. FR1: UI Update \- "End Workout" Button**

* **Reference:** WorkoutSession.tsx  
* **Requirement:** A new, clearly labeled button, **"End Workout"**, must be added to the main workout session screen. It should be distinct from the "Next Exercise" or "Finish Workout" buttons. A good location would be in the screen's header or footer.

#### **4.2. FR2: Confirmation Modal**

* **Trigger:** Tapping the "End Workout" button **MUST** trigger a confirmation modal.  
* **Content:** The modal should be titled "End Workout Early?" with clear, concise text: "Your logged sets for this session will be saved to your history, but this workout will not count towards your plan's progress. Are you sure you want to end?"  
* **Actions:** The modal will have two buttons:  
  * **"End Workout"** (Primary, destructive action \- e.g., red color)  
  * **"Cancel"** (Secondary Action)

#### **4.3. FR3: Backend & State Logic**

* **Requirement:** If the user confirms, the application should perform the following actions:  
  1. Ensure all sets logged in the current session are saved to the user's history (this should already be happening).  
  2. The application **MUST NOT** increment the completedWorkoutCount in the user\_profiles table.  
  3. The user is navigated away from the workout session screen, likely back to the "Plan Homescreen."

### **Feature B: External Exercise Links**

#### **4.4. FR4: UI Update \- Linkable Exercise Titles**

* **Reference:** WorkoutSession.tsx  
* **Requirement:** The h3 (or equivalent) element that displays the current exercise name (e.g., "Dumbbell Bench Press") must be converted into a link.  
* **Visual Cue:** The linked title should have a subtle visual indicator that it is interactive, such as a small "link out" icon next to the text.

#### **4.5. FR5: Link Logic**

* **Requirement:** The link's href attribute must be a dynamically generated, pre-formatted Google search URL.  
* **URL Format:** https://www.google.com/search?q=\[Exercise Name\]+form (e.g., https://www.google.com/search?q=Dumbbell+Bench+Press+form). The exercise name should be properly URL-encoded to handle spaces and special characters.  
* **Behavior:** The link must be configured to open in a **new browser tab** (target="\_blank") to prevent the user from losing their place in the workout.