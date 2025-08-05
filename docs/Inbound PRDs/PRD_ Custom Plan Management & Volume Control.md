# **Product Requirements Document: Custom Plan Management & Volume Control**

| Feature Name | Custom Plan Management & Volume Control |
| :---- | :---- |
| **Status** | Proposed |
| **Author** | Gemini (Consultant) |
| **Date** | July 8, 2025 |
| **Initiative** | "Walk" Phase: Enhancing Plan Generation |

## **1\. Overview**

This document outlines the requirements for enhancing the **Plan Generation Engine**. Based on initial implementation, it's clear that users need more control over the plans they create. This PRD specifies three key features:

1. **Workout Volume Selection:** Allowing users to choose the length/difficulty of their workouts.  
2. **Rename Plan:** Giving users the ability to name their custom plans.  
3. **Delete Plan:** Providing a way for users to remove generated plans they no longer need.

These features will transform the generator from a simple creator into a flexible management tool.

## **2\. User Stories**

* **As a user with limited time**, I want to generate a shorter workout (\~30 minutes) so I can still be consistent with my training.  
* **As a user who wants a more challenging session**, I want to generate a longer workout with more exercises.  
* **As a user who has created multiple plans**, I want to give them descriptive names (e.g., "My Summer Shred Plan") so I can easily identify them.  
* **As a user who tried a custom plan and didn't like it**, I want to delete it to keep my plan list clean.

## **3\. Functional & Technical Requirements**

### **3.1. FR1: Workout Volume Selection**

The plan generation wizard must be updated to include a new step for selecting workout volume.

* **UI Step:** After selecting a Workout Template, a new step titled **"Select Workout Length"** will be presented.  
* **User Options:** The user will be shown 3 simple options:  
  * **Short** (\~30-40 minutes)  
  * **Standard** (\~45-55 minutes) \- *This should be the default selection.*  
  * **Long** (\~60+ minutes)  
* **Template Schema Update:** The Workout Template data structure needs to be updated. The slots array in each workout skeleton should be divided into two categories:  
  * coreSlots: An array of essential exercises (e.g., primary compound lifts) that are always included.  
  * accessoryPool: An array of optional isolation/accessory exercises.  
* **Generation Logic Update:** The Plan Generation Engine will now accept a volume parameter ('short', 'standard', 'long').  
  * The engine will always include all coreSlots.  
  * It will then select a variable number of exercises from the accessoryPool based on the chosen volume:  
    * 'short': 1 accessory  
    * 'standard': 2 accessories  
    * 'long': 3-4 accessories

### **3.2. FR2: Rename Plan Functionality**

* **Backend Schema Update:** The user\_profiles table in Supabase needs a new field for the activeGeneratedPlan object:  
  * customName: string | null  
* **UI \- Initial Naming:** In the final step of the generation wizard, after the plan is created, a text input field should appear, pre-filled with a default name (e.g., "My Custom Plan"). The user can edit this name before saving.  
* **UI \- Post-Creation Editing:** On the "Plan Homescreen" for a custom-generated plan, a new "Rename" option must be available (e.g., within a "kebab" menu or settings icon next to the plan title). This will open a prompt allowing the user to update the customName in the database.

### **3.3. FR3: Delete Plan Functionality**

* **UI:** In the same menu as the "Rename" option, a **"Delete Plan"** button must be available.  
* **Confirmation:** Tapping "Delete Plan" **MUST** trigger a confirmation modal. The text should be unambiguous: "Are you sure you want to permanently delete this plan? This action cannot be undone."  
* **Backend Logic:** If the user confirms, the application must set the activeGeneratedPlan field in their user\_profiles table to null, and clear any related state (currentPlanId, blockStartDate, etc.). This will effectively remove the plan and return the user to the main plan selection screen.

### **3.4. FR4: Implementation Documentation**

* The existing architecture document, docs/plan-generation.md (or a similar file), must be updated to reflect these new features, including the updated template schema and the new user flow for volume selection and plan management.