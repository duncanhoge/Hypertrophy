# **Product Requirements Document: Workout Plan Template Library**

| Feature Name | Workout Plan Template Library |  
| Status | Proposed |  
| Author | Gemini (Consultant) |  
| Date | October 10, 2025 |  
| Initiative | Product Scalability & User Choice |

## **1\. Overview & Business Need**

The Hypertrophy Hub application currently offers a single, curated progression path. To appeal to a wider range of users with different training philosophies, schedules, and preferences, we must expand our offerings. This document outlines the requirements for creating a library of distinct, selectable workout plan templates.

This feature will transform the "Plan Selection" screen into a true marketplace of training styles, clearly positioning the value of each option and allowing users to choose the path that best fits their goals and lifestyle.

## **2\. Goals & Success Metrics**

### **Goals**

* **Goal 1: Expand User Choice.** Introduce at least four new, distinct, and popular training templates.  
* **Goal 2: Clarify Template Value.** Enhance the plan selection UI to clearly communicate the style, benefits, and time commitment of each template.  
* **Goal 3: Create a Scalable Template Architecture.** Implement a data structure that makes it easy to add more templates in the future.

### **Success Metrics**

* **Metric 1: Template Implementation.** All new templates are implemented in the codebase and are selectable by the user.  
* **Metric 2: UI Enhancement.** The plan selection screen is updated to display the new metadata (description, tags, schedule) for each template card.  
* **Metric 3: User Engagement.** Post-launch, user selection is distributed across multiple templates, not just the default, indicating the new options are appealing.

## **3\. Functional & Technical Requirements**

### **3.1. FR1: Template Data Schema Enhancement**

The data structure for a workout plan must be enhanced to include metadata for the plan selection screen. Each plan file (e.g., /data/plans/upperLower.ts) will export an object with the following top-level properties:

| Field Name | Type | Description | Example |
| :---- | :---- | :---- | :---- |
| **id** | string | A unique identifier for the template. | 'upper\_lower\_4day' |
| **name** | string | The user-facing name of the template. | 'Upper/Lower Split' |
| **description** | string | A brief, benefit-oriented summary. | 'The perfect balance of frequency and volume, hitting every muscle group twice a week for optimal growth.' |
| **weeklySchedule** | string | The intended weekly training frequency. | '4 Days / Week' |
| **tags** | string\[\] | Keywords to help users categorize the plan. | \['Strength', 'Hypertrophy', 'Efficient'\] |
| **levels** | object\[\] | An array containing the actual training blocks (as currently implemented). | \[{ level: 1, name: 'Foundation', workouts: {...} }\] |

### **3.2. FR2: Plan Selection UI Update**

The plan selection screen must be updated to display the new metadata from FR1 on each plan's card. The layout should clearly present:

1. The name as the card title.  
2. The description as the main body text.  
3. The weeklySchedule and tags in a visually distinct footer section of the card.

### **3.3. FR3: New Template Implementation**

The following new templates must be created as distinct files in the /data/plans/ directory, conforming to the schema in FR1 and using exercises from the Exercise Dictionary. Each template should be implemented with at least one complete "Level 1" training block.

**Template 1: Hypertrophy Superset**

* **id**: hypertrophy\_superset\_3day  
* **name**: "Hypertrophy Superset"  
* **description**: "A time-efficient, high-intensity workout. Pair different muscle groups to maximize metabolic stress and muscle growth with minimal rest."  
* **weeklySchedule**: "3 Days / Week"  
* **tags**: \['High Intensity', 'Time-Efficient', 'Hypertrophy'\]  
* **Content**: Implement a 3-day Push/Pull/Core split using non-competing supersets.

**Template 2: Upper/Lower Split**

* **id**: upper\_lower\_4day  
* **name**: "Upper/Lower Split"  
* **description**: "The perfect balance of frequency and volume, hitting every muscle group twice a week for optimal growth and strength."  
* **weeklySchedule**: "4 Days / Week"  
* **tags**: \['Strength', 'Hypertrophy', 'Classic'\]  
* **Content**: Implement a 4-day split (Upper, Lower, Rest, Upper, Lower).

**Template 3: The Bodybuilder Split ("Bro Split")**

* **id**: bodybuilder\_split\_4day  
* **name**: "The Bodybuilder Split"  
* **description**: "The classic 'bro split'. Focus on one major muscle group per day for maximum volume, pump, and muscle isolation."  
* **weeklySchedule**: "4 Days / Week"  
* **tags**: \['Hypertrophy', 'Isolation', 'High Volume'\]  
* **Content**: Implement a 4-day split (Day 1: Chest & Triceps, Day 2: Back & Biceps, Day 3: Shoulders, Day 4: Core & Abs).

**Template 4: Push/Pull/Legs**

* **id**: push\_pull\_legs\_3day  
* **name**: "Push/Pull/Legs"  
* **description**: "A logical and synergistic split, grouping muscles by their function for efficient workouts and great recovery."  
* **weeklySchedule**: "3 Days / Week"  
* **tags**: \['Functional', 'Strength', 'Classic'\]  
* **Content**: Implement a 3-day split (Day 1: Push, Day 2: Pull, Day 3: Legs).

### **3.4. FR4: Implementation Documentation**

* A new architecture document, docs/workout-templates.md, must be created. It should detail the new template schema and explain how to add new templates to the library.  
* The main README.md must be updated to link to this new document.

### **Strategic Context & Architectural Roadmap**

* **Phase:** This feature is the first major step in the **"Walk"** phase. It builds directly upon the foundational architecture created in the "Crawl" phase.  
* **Forward Compatibility:** This template structure is the core of our automated generation engine. By defining these templates now, we are creating the "skeletons" that our future **Step 6 (Generation Logic)** will populate programmatically.