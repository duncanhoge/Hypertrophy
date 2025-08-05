# **Product Requirements Document: Automated Level Up Progression**

| Feature Name | Automated Level Up Progression |
| :---- | :---- |
| **Status** | Proposed |
| **Author** | Gemini (Consultant) |
| **Date** | July 10, 2025 |
| **Initiative** | "Walk" Phase Capstone: Engine Integration |

## **1\. Overview**

This document outlines the requirements for integrating the **Plan Generation Engine** with the **Level Up Flow**. Currently, when a user completes a training block, they are manually progressed to a pre-defined "Level 2." This feature replaces that static link with a call to our dynamic engine.

The goal is to create a seamless, automated loop where the application programmatically generates a brand new, personalized training block for the user the moment they are ready to progress, fulfilling the core vision of the "Walk" phase.

## **2\. Goals & Success Metrics**

### **Goals**

* **Goal 1: Automate Progression.** Fully automate the creation of subsequent training blocks, eliminating the need for pre-made "levels."  
* **Goal 2: Deliver a Personalized Journey.** Ensure every new training block is fresh, varied, and tailored to the user's template and equipment choices.  
* **Goal 3: Unify Core Systems.** Integrate the Progression Trigger, Level Up UI, and Plan Generation Engine into a single, cohesive user experience.  
* **Goal 4: Ensure Template Integrity.** Guarantee that all generated plans adhere to the foundational structure of the chosen template.

### **Success Metrics**

* **Metric 1: Successful Generation.** 100% of users who tap "Start Next Level" on a custom plan have a new, unique plan successfully generated and saved to their profile.  
* **Metric 2: Variety Rule Adherence.** The newly generated plan correctly excludes exercises that were present in the user's previously completed block.  
* **Metric 3: Structural Adherence.** The generated plan's weekly structure correctly matches the dayRotation specified in its parent template.  
* **Metric 4: Seamless Transition.** The user's state (completedWorkoutCount, targetWorkoutCount, etc.) is correctly reset for their new block.

## **3\. User Stories**

* **As a user who has completed my custom plan**, I want the app to automatically create a new, challenging plan for me so I can continue making progress without having to re-enter all my settings.  
* **As a user starting a new level**, I want it to feel fresh and different from my last one, with new exercises to keep me engaged.  
* **As a user who finished a pre-made plan**, I want the option to either continue with the pre-made track or switch to a custom-generated plan.

## **4\. Functional & Technical Requirements**

### **4.1. FR1: "Start Next Level" Logic Refactor**

The primary logic for the "Start Next Level" button on the "Training Block Complete\!" screen must be refactored.

* **Context Check:** The system must first determine if the completed plan was a **pre-made plan** or a **user-generated plan**.  
* **If User-Generated Plan:**  
  1. **Retrieve Context:** The app must retrieve the templateId, volume setting, and equipment selection from the user's just-completed block.  
  2. **Retrieve History:** It must get the list of all exercise ids used in the completed block.  
  3. **Call Engine:** It will call the PlanGenerationEngine with these parameters, including the list of exercises to exclude. The engine must adhere to the template integrity rules specified in FR2.  
  4. **Save & Reset:** The newly generated plan object is saved to the user's activeGeneratedPlan field. The user's state is then reset for the new block (completedWorkoutCount to 0, targetWorkoutCount is recalculated, etc.).  
* **If Pre-Made Plan:** The existing logic remains. It will progress the user to the next pre-defined level if one exists. (See FR3 for enhancement).

### **4.2. FR2: Template Integrity Enforcement**

To ensure the structural goals of a template are always met, the template schema and generation logic must be enhanced.

* **Template Schema Update:** The main Workout Template data structure must be updated to include a new field: dayRotation: string\[\]. This array will define the sequence of required dayTypes for the weekly schedule.  
  * **Example:** For a 3-day Push/Pull/Legs plan, the field would be: dayRotation: \['push', 'pull', 'legs'\].  
* **Generation Logic Update:** When the PlanGenerationEngine is called, it must:  
  1. Read the dayRotation array from the selected template.  
  2. For each dayType in the array (e.g., 'push'), it must fetch the corresponding day-specific template (e.g., pushDayTemplate).  
  3. It will then populate that day-specific template according to the volume and equipment rules.  
  4. This process ensures the generated weekly plan is assembled with the correct sequence of workout types, guaranteeing a balanced and structurally sound program.

### **4.3. FR3: Enhanced Options for Pre-Made Plans**

To provide an "exit ramp" from the static track, the "Training Block Complete\!" screen for pre-made plans must be updated.

* **UI Update:** In addition to the existing "Start Level X" and "Restart Level" buttons, a new primary action button must be added: **"Create a Custom Plan"**.  
* **Logic:** Tapping this button will launch the PlanGenerationWizard, allowing the user to transition from a pre-made track to our new dynamic system.

### **4.4. FR4: UI & State Management**

* **Plan Storage:** The user\_profiles table needs to be able to store the context of the last generated plan. The activeGeneratedPlan JSON object should include metadata about the templateId, volume, and equipment used to create it, so this information can be used for the next generation cycle.  
* **Loading States:** The "Start Next Level" button should display a loading indicator while the generation engine is running to provide user feedback.

### **4.5. FR5: Implementation Documentation**

* All relevant architecture documents (plan-generation.md, training-block-completion.md) must be updated to detail this final, integrated progression flow.  
* The documentation should clearly map out the logic for both custom plan progression, the enhanced options for pre-made plans, and the new dayRotation requirement for template integrity.