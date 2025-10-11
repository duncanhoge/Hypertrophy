# **Product Requirements Document: 'Antagonistic' Superset Template**

| Feature Name | 'Antagonistic' Superset Template |
| :---- | :---- |
| **Status** | Proposed |
| **Author** | Gemini (Consultant) |
| **Date** | October 10, 2025 |
| **Initiative** | Workout Template Expansion |
| **Related PRD** | PRD\_SupersetFlow\_v1, PRD\_WorkoutTemplates\_v1 |

## **1\. Overview & Business Need**

The current "Hypertrophy Superset" template uses a "Primary Lift \+ Accessory" pairing strategy. To broaden our app's appeal, we will introduce a new template based on a different training philosophy: **Antagonist Supersets**.

This involves pairing exercises for opposing muscle groups (e.g., Chest and Back, Biceps and Triceps). This PRD outlines the requirements for creating this new "Antagonistic Superset" template and teaching our generation engine the new pairing logic required to power it.

## **2\. Goals & Success Metrics**

### **Goals**

* **Goal 1: Implement the "Antagonistic Superset" Template.** Add a new, selectable template to the PlanGenerationWizard that is designed for this specific training style.  
* **Goal 2: Enhance the Engine with Antagonist Pairing Logic.** Teach the generation engine how to intelligently pair exercises based on opposing muscle groups.  
* **Goal 3: Enrich the Exercise Dictionary Schema.** Update the data model to support this new logic.

### **Success Metrics**

* **Metric 1: Correct Pairing.** When a user generates a plan using this template, the resulting workouts correctly pair exercises for opposing muscle groups.  
* **Metric 2: Template Availability.** The "Antagonistic Superset" appears as a distinct option in the PlanGenerationWizard with a clear name and description.  
* **Metric 3: Documentation Update.** The docs/workout-engine.md document is updated with the new schema and logic rules.

## **3\. User Stories**

* **As a user**, I want a high-volume workout that focuses on one or two specific body parts per day to maximize muscle pump and growth.  
* **As a user**, I want to try the advanced technique of supersetting opposing muscle groups to increase my workout intensity.  
* **As a user**, I want the app to automatically create a balanced workout for me based on this training style.

## **4\. Functional & Technical Requirements**

### **4.1. FR1: Exercise Dictionary Schema Enhancement**

To enable antagonist pairing, the schema for each exercise object in the Exercise Dictionary (/data/exerciseDictionary.ts) must be enhanced with one new property:

* **antagonistMuscle: string | null**: This field will store the primaryMuscle ID of the opposing muscle group.  
  * **Example 1:** For db\_press\_bench (where primaryMuscle is 'chest'), antagonistMuscle will be 'back'.  
  * **Example 2:** For db\_curl\_bicep (where primaryMuscle is 'biceps'), antagonistMuscle will be 'triceps'.  
  * **Example 3:** For bw\_plank (where primaryMuscle is 'core'), antagonistMuscle will be null as it has no direct antagonist.

This property must be added to all existing exercises in the dictionary where applicable.

### **4.2. FR2: New Template Definition**

A new template object must be added to the WORKOUT\_TEMPLATES array in /data/workoutTemplates.ts.

* **id**: 'antagonistic\_superset'  
* **name**: 'Antagonistic Superset'  
* **description**: 'A high-intensity workout that pairs opposing muscle groups (like Chest & Back or Biceps & Triceps). This technique increases workout density and delivers a unique muscle pump.'  
* **workoutType**: 'superset'  
* **tags**: \['High Intensity', 'Body Part Focus', 'Advanced'\]  
* **weeklySchedule**: \['Chest & Back', 'Shoulders & Core', 'Legs', 'Arms'\] (This is a 4-day split)  
* **template**: An array of workout skeletons that define the structure for each day.

### **4.3. FR3: New Engine Logic \- Antagonist Pairing Rule**

The plan generation engine must be updated with a new conditional rule.

* **Trigger:** When a user selects the template with id: 'antagonistic\_superset'.  
* **Logic:** The engine must use a new pairing strategy. When selecting the second exercise (1B) for a superset, it must find an exercise from the dictionary where its primaryMuscle matches the antagonistMuscle of the first exercise (1A).

### **4.4. FR4: Implementation Documentation**

* Update the architecture document, docs/workout-engine.md.  
* Add a new section titled "Antagonist Superset Logic" that details the new antagonistMuscle schema property and explains the pairing rule defined in FR3.

### **Strategic Context & Architectural Roadmap**

* **Phase:** This feature is a core part of the **"Walk"** phase. It makes our generation engine significantly smarter by teaching it a new, context-aware rule for program design.  
* **Forward Compatibility:** The addition of the antagonistMuscle property to our dictionary is a permanent enhancement. It enriches our data model and can be leveraged by future templates and features, making the entire system more intelligent and versatile.  
* 