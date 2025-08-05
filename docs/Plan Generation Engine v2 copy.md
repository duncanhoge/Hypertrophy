# **Product Requirements Document: Plan Generation Engine \- V2 Refinements**

| Feature Name | Plan Generation Engine \- V2 Refinements |
| :---- | :---- |
| **Status** | Proposed |
| **Author** | Gemini (Consultant) |
| **Date** | July 9, 2025 |
| **Initiative** | "Walk" Phase: Enhancing Plan Quality |

## **1\. Overview**

This document outlines the requirements for refining the **Plan Generation Engine**. Based on initial user feedback, two key areas for improvement have been identified:

1. **Workout Structure:** The current template logic can produce unbalanced workout days. We need to implement a more sophisticated template architecture to guarantee every generated session is physiologically sound and focused.  
2. **Workout Descriptions:** The user-facing descriptions for each workout day (e.g., "Push Focus") are too generic. They must be made more descriptive to clearly communicate the focus of the session to the user.

This PRD details the necessary changes to address these issues, significantly improving the quality and clarity of all user-generated plans.

## **2\. Goals & Success Metrics**

### **Goals**

* **Goal 1: Guarantee Workout Quality.** Ensure every generated workout day is well-balanced and aligned with established training principles.  
* **Goal 2: Improve User Understanding.** Provide users with clear, informative descriptions for each workout day so they understand its specific purpose.  
* **Goal 3: Enhance Template Architecture.** Evolve our template system to be more modular and intelligent.

### **Success Metrics**

* **Metric 1: Balanced Workouts.** All newly generated plans exhibit a clear, logical structure (e.g., a Push day only contains push, shoulder, and tricep movements).  
* **Metric 2: Descriptive Naming.** All workout days in a generated plan have a dynamic title reflecting the primary muscles worked (e.g., "Push Day: Chest & Shoulders").  
* **Metric 3: Documentation Update.** The plan-generation.md architecture document is updated to reflect these new refinements.

## **3\. Functional & Technical Requirements**

### **3.1. FR1: Advanced Template Architecture (Day-Specific Templates)**

The current single-template approach will be replaced by a more modular system using day-specific templates.

* **New Template Structure:** We will create three distinct day-type templates: pushDayTemplate, pullDayTemplate, and legsDayTemplate.  
  * **pushDayTemplate:** coreSlots will focus on horizontal\_press and vertical\_press. accessoryPool will contain tricep\_extension, lateral\_raise, and core patterns.  
  * **pullDayTemplate:** coreSlots will focus on horizontal\_pull and vertical\_pull. accessoryPool will contain bicep\_curl, rear\_delt\_flyes (horizontal\_abduction), and core patterns.  
  * **legsDayTemplate:** coreSlots will focus on squat and hinge. accessoryPool will contain lunge, calf\_raise, and core patterns.  
* **Generation Logic Update:** When a user selects a master plan template (e.g., "Full Body Hypertrophy \- 3 Day"), the engine will now assemble the plan by taking one of each required day-type template (e.g., 1 Push, 1 Pull, 1 Legs) to build the weekly schedule. This guarantees a balanced split.

### **3.2. FR2: Dynamic Workout Day Descriptions**

The engine must be enhanced to generate descriptive names for each workout day it creates.

* **Data Aggregation:** After the engine populates the slots for a given workout day, it must iterate through all the selected exercises for that day.  
* **Muscle Group Analysis:** The engine will create a unique, ordered list of all primaryMuscle groups from the day's exercises.  
* **Name Generation:** A new dayDescription field will be generated for the workout day. The logic will be:  
  * **Title:** Based on the day-type template used (e.g., "Push Day," "Pull Day").  
  * **Subtitle:** A concatenation of the top 2-3 primary muscle groups identified (e.g., "Chest, Shoulders & Triceps").  
  * **Final Output:** "Push Day: Chest, Shoulders & Triceps"  
* **UI Integration:** The UI must be updated to display this new, more descriptive dayDescription instead of the generic one.

### **3.3. FR3: Implementation Documentation**

* The existing docs/plan-generation.md document must be updated to reflect:  
  * The new day-specific template architecture (push, pull, legs).  
  * The logic and flow for the dynamic generation of workout day descriptions.