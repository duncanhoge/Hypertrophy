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


# **Developer Clarifications: Time Unit (TU) System**

This document provides clarification on the implementation details for the **PRD: Time Unit (TU) System for Workout Volume**.

## **Technical Implementation Questions**

### **1\. Exercise Dictionary Population**

**Question:** The PRD mentions exerciseType values of 'compound', 'isolation', and 'core', but the type definition is exerciseType: 'compound' | 'isolation'. Should I add 'core' as a third option, or infer 'core' exercises based on movement patterns?

**Answer:** **Add 'core' as a third option to the exerciseType field.**

* **Rationale:** This is the most explicit and maintainable approach. It makes the logic simple and avoids potential conflicts if we add new movement patterns in the future. Please update the TypeScript interface to be exerciseType: 'compound' | 'isolation' | 'core'.

### **2\. TU Budget Range Handling**

**Question:** The PRD specifies TU budget ranges (e.g., "Standard: 14-16 TUs"). Should I pick a fixed value, randomly select, or use the midpoint?

**Answer:** **Use a fixed value: the midpoint of each range.**

* **Rationale:** This ensures consistency and predictability in the generated workouts, which is the primary goal of this feature. Randomization adds unnecessary complexity.  
* **Implementation:**  
  * Short: **11 TUs**  
  * Standard: **15 TUs**  
  * Long: **19 TUs**

### **3\. Budget Overflow Logic**

**Question:** What should happen if the core exercises alone exceed the TU budget?

**Answer:** This scenario should be prevented at the template design level. However, the engine should handle it gracefully.

* **Rationale:** A template should never be designed where its required coreSlots exceed the "Short" TU budget. This is a design constraint for us as product managers.  
* **Implementation:** The generation logic should be:  
  1. Always add all coreSlots.  
  2. Then, fill the *remaining* budget with exercises from the accessoryPool.  
  3. If the coreSlots alone already exceed the budget for a given volume, the workout will simply consist of those core exercises, and no accessories will be added.

### **4\. Accessory Selection Strategy**

**Question:** For selecting from the accessoryPool, should I implement true randomization, use the existing shuffling logic, or prioritize certain types?

**Answer:** **Use the existing shuffling logic for consistency.**

* **Rationale:** True randomization can sometimes lead to strange clustering or feel less intentional. A shuffled selection is pseudo-random and sufficient for ensuring variety. We can explore prioritization in a future version.

### **5\. Interface Changes**

**Question:** Should the generateWorkoutPlan function signature change? Do we need to maintain backward compatibility?

**Answer:** **Yes, the function signature should change to accept a tuBudget: number**.

* **Rationale:** This refactor fundamentally changes the generation logic, so the internal API should reflect that. The UI layer will be responsible for mapping the user's string selection ("Standard") to the correct number (15) before calling the engine. No backward compatibility is needed for the old volume-based API, as this system replaces it entirely.

### **6\. Edge Cases**

**Question:** What happens if no accessories fit within the remaining budget? Should there be a minimum number of accessories?

**Answer:** **If no accessories fit, the workout consists of only the coreSlots.**

* **Rationale:** The TU budget is the primary constraint and must be respected. There should **not** be a minimum number of accessories that could violate the budget. The system will handle future exercises with unusual TU values correctly as long as they have a timeUnits property.

## **Data Validation Questions**

### **7\. Current Exercise Audit**

**Question:** Should I audit the current exercise dictionary to ensure all exercises have appropriate exerciseType classifications?

**Answer:** **Yes, please perform this audit.**

* **Rationale:** This is a crucial data integrity step. Please review all exercises in exerciseDictionary.ts and assign the correct exerciseType ('compound', 'isolation', or 'core') to each one. This will ensure the TU values are assigned correctly and the generator functions as intended.

### **8\. TU Value Validation**

**Question:** Should I add validation to ensure TU values are positive integers?

**Answer:** **Yes, please add a simple validation check.**

* **Rationale:** Good practice for data integrity. A simple test case or linter rule to ensure timeUnits is a positive integer greater than 0 is sufficient. No complex upper/lower bounds are needed at this time.

## **User Experience Questions**

### **9\. Volume Display**

**Question:** Should the UI continue to show "Short/Standard/Long" to users, or should we expose the TU concept?

**Answer:** **Continue to show "Short/Standard/Long".**

* **Rationale:** "Time Units" is our internal engineering and product concept. It's an abstraction that should not be exposed to the user. The user cares about the outcome (a short workout), not the implementation detail.  
* **Implementation:** Please update any relevant help text to mention that the workout durations are now more accurate thanks to a new, smarter engine.

### **10\. Testing Strategy**

**Question:** Would you like me to add logging to track actual TU totals? Should I create test cases?

**Answer:** **Yes to both.**

* **Rationale:** This is essential for validation. Please add logging (e.g., console.log during development) to output the final TU total of each generated workout. Please also create unit tests to verify that the generation engine correctly adheres to the TU budget for a variety of inputs.

## **Architecture Questions**

### **11\. Migration Strategy**

**Question:** Should I implement feature flags or gradual rollout? Do we need to handle existing generated plans?

**Answer:** **No feature flag is needed. Existing plans are unaffected.**

* **Rationale:** This feature only impacts the *generation of new plans*. It does not change the structure or rendering of any existing activeGeneratedPlan a user might have. When a user with an old generated plan "Levels Up," the new TU-based engine will simply kick in to generate their next level. The transition is seamless and does not require special handling for old plans.