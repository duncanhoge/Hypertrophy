# **Product Requirements Document: Time Unit (TU) System for Workout Volume**

| Feature Name | Time Unit (TU) System for Workout Volume |
| :---- | :---- |
| **Status** | Proposed |
| **Author** | Gemini (Consultant) |
| **Date** | July 11, 2025 |
| **Initiative** | "Run" Phase: Intelligent Coach |

## **1\. Overview**

This document outlines the requirements for implementing a **Time Unit (TU) System** to refine the workout volume selection feature. Currently, workout duration ("Short," "Standard," "Long") is determined by a fixed number of accessory exercises, which can lead to inconsistent workout lengths.

The TU system will replace this logic with a more sophisticated model that calculates workout volume based on the estimated effort and time required for each exercise. This ensures that all generated workouts have a consistent and predictable duration, aligning with user expectations.

## **2\. Goals & Success Metrics**

### **Goals**

* **Goal 1: Improve Workout Duration Accuracy.** Ensure that "Short," "Standard," and "Long" workout options consistently translate to their estimated time commitments.  
* **Goal 2: Enhance Generation Logic.** Evolve the PlanGenerationEngine from counting exercises to calculating total workout effort.  
* **Goal 3: Refine the Data Model.** Enrich the Exercise Dictionary with the data needed to power this more intelligent system.

### **Success Metrics**

* **Metric 1: Consistent Volume.** Generated "Standard" workouts consistently contain a similar total TU value (e.g., within a range of 14-16 TUs), regardless of the specific exercises chosen.  
* **Metric 2: Successful Implementation.** The PlanGenerationEngine is successfully refactored to use the new TU budget system instead of the fixed accessory count.  
* **Metric 3: Documentation Update.** The plan-generation.md and exercise-dictionary.md documents are updated to reflect the new TU system.

## **3\. User Stories**

* **As a user who selects a "Short" workout**, I expect the session to be genuinely short, even if it includes a heavy compound lift.  
* **As a user who selects a "Long" workout**, I expect it to be challenging and comprehensive, with a good mix of major and minor exercises.  
* **As a developer**, I want a more reliable system for controlling the output of the plan generator so that I can create more diverse and effective workout templates in the future.

## **4\. Functional & Technical Requirements**

### **4.1. FR1: Exercise Dictionary Schema Update**

The ExerciseDefinition interface in /data/exerciseDictionary.ts must be updated to include a new field.

* **New Field:** timeUnits: number  
* **Population Logic:** This field should be populated for every exercise in the dictionary based on its exerciseType. The following rules shall apply:  
  * If exerciseType is 'compound': timeUnits \= **3**  
  * If exerciseType is 'isolation': timeUnits \= **2**  
  * If exerciseType is 'core' (or similar single-joint, short-duration movements): timeUnits \= **1**

### **4.2. FR2: Volume Selection Logic Refactor**

The volume selection step in the plan generation wizard will remain the same for the user, but the underlying values will now map to a TU "budget."

* **TU Budget Mapping:**  
  * **Short:** 10-12 TUs  
  * **Standard:** 14-16 TUs  
  * **Long:** 18-20 TUs

### **4.3. FR3: Plan Generation Engine Update**

The core logic of the PlanGenerationEngine must be refactored to use the TU budget system.

* **Input:** The engine will now receive a tuBudget (e.g., 15\) instead of a volume string ('standard').  
* **Generation Process:**  
  1. Initialize a currentTuCount to 0\.  
  2. Add all exercises from the template's coreSlots to the workout plan. For each one, add its timeUnits value to currentTuCount.  
  3. Iteratively select exercises at random from the template's accessoryPool.  
  4. For each potential accessory, check if currentTuCount \+ accessory.timeUnits \<= tuBudget.  
  5. If it fits, add the accessory to the plan and update currentTuCount.  
  6. If it does not fit, discard it and try another accessory.  
  7. Continue this process until the budget is filled as much as possible.

### **4.4. FR4: Implementation Documentation**

* **Update docs/exercise-dictionary.md:** The documentation must be updated to include the new timeUnits field in the schema definition.  
* **Update docs/plan-generation.md:** The documentation must be updated to detail the new TU budget system, replacing the old accessory count logic.

## **5\. Strategic Context & Architectural Roadmap**

* **Phase:** This feature is the first key deliverable of the **"Run"** phase. It represents a significant step up in the intelligence of our generation engine.  
* **Dependencies:** This feature builds directly upon the coreSlots/accessoryPool architecture established in the "Walk" phase.  
* **Future Impact:** A robust TU system provides a more granular and powerful foundation for creating highly specialized future templates (e.g., "Express 20-Minute HIIT," "90-Minute Powerlifting Session") where precise control over workout duration and effort is critical.