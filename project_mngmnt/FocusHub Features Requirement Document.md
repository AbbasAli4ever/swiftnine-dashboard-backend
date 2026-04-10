## FocusHub Features Requirement Document

## **1\. Project Overview**

Product Name: FocusHub

Tagline: Central place for productivity

### **Product Summary**

FocusHub is a team productivity and project management platform that helps users and teams organize their work in one place.

The main goal of FocusHub is to provide a simple, clean, and easy-to-use work management system where users can:

* manage tasks  
* collaborate with team members  
* track progress  
* organize projects  
* stay updated through notifications

# **2\. Goal**

The goal of focushub is to build a working productivity platform where users can:

* create an account  
* create a workspace  
* invite team members  
* create projects and lists  
* create and manage tasks  
* assign tasks  
* track task progress  
* comment on tasks  
* receive notifications  
* view tasks in List View and Board View  
* monitor simple productivity stats through a dashboard 

# **3\. Target Users**

FocusHub is designed for:

* Small teams  
* Startups  
* Agencies  
* Product teams  
* Designers  
* Developers  
* Project managers  
* Freelancers  
* Operations teams

# **4\. Feature List**

FocusHub Version 1 will include the following main modules:

1. Authentication & User Account  
2. Workspace Management  
3. Team Member Management  
4. Project / Space Management  
5. Task List Management  
6. Task Management  
7. Subtask Management  
8. Comments & Collaboration  
9. Notifications  
10. Views (List & Board calender)  
11. Dashboard  
12. File Attachments  
13. Search & Filters  
14. Basic Settings & Permissions

# **5\. Detailed Feature Requirements**

# **Feature 1: Authentication & User Account**

**Purpose:** Allow users to create accounts and securely log in to the platform.

### **1.1 Sign Up**

User can create a new account using:

* Google Sign Up or  
* Full Name  
* Email  
* Password

### **1.2 Login**

User can log in using:

* Google Login or  
* Email  
* Password

### **1.3 Forgot Password**

* User can enter their registered email  
* System sends password reset link to email  
* User can set a new password 

### **1.5 User Profile**

User can view and manage profile details:

* Full Name  
* Designation / Job Title  
* Email  
* Profile Picture  
* Current Status (**Online / Offline**)  
* Local Time  
* Short Bio (optional)  
* Change Password

### **1.6 Account Settings**

User can access settings such as:

* Profile settings   
  * change name avatar color and email will be disabled  
* Password settings  
* Notification preferences  
* Workspace switching

# **Feature 2: Workspace Management**

Purpose:A workspace is the main company/team area where all work is managed.

## **Features**

### **2.1 Create Workspace**

User can create a new workspace with:

* Workspace Name  
* Workspace Logo / Icon

### **2.2 Edit Workspace**

User can update:

* Workspace Name  
* Workspace Logo

### **2.3 Workspace Members**

User can manage members inside the workspace

### **2.4 Remove Workspace**

Workspace owner/admin can remove or archive workspace (optional in MVP)

# **Feature 3: Team Member Management**

**Purpose:**Allow teams to collaborate inside one workspace.

## **Features**

### **3.1 Invite Team Members**

Users can invite team members by:

* Email invite

### **3.2 Remove Team Members**

Workspace owner/admin can remove members

### **3.3 Member Roles**

Supported roles:

* **Owner**  
  * Full system control  
  * Can manage workspace, members, projects, and settings  
* **Admin**  
  * Can manage projects, lists, tasks, and members  
* **Member**  
  * Can create/update tasks and collaborate

### **3.4 Member Profile Visibility**

Team members can see:

* Name  
* Designation  
* Profile photo  
* Online/Offline status  
* Local time 

# **Module 4: Project / Space Management**

Purpose: Projects (or Spaces) are top-level containers used to organize work.

## **Features**

### **4.1 Create Project** 

User can create a new project/space with:

* Project Name  
* Color / Icon  
* Description

### **4.2 Edit Project** 

User can update:

* Project Name  
* Color / Icon  
* Description

### **4.3 Delete Project / Space**

Authorized users can delete project/space

### **4.4 Archive Project / Space**

Authorized users can archive projects instead of deleting permanently

# **Feature 5: Task List Management**

**Purpose:** Each project contains lists to organize tasks.

## **Features**

### **5.1 Create Task List**

User can create a new task list inside a project

### **5.2 Rename Task List**

User can rename any task list

### **5.3 Delete Task List**

Authorized users can delete a task list

### **5.4 Move Task List**

User can reorder / move lists

### **5.5 Archive Task List**

Lists can be archived instead of deleted

# **Feature 6: Task Management**

Purpose:Task management is the core feature of FocusHub.

## **Features**

### **6.1 Create Task**

User can create a task with the following fields:

* Task Title  
* Task Description  
* Task Status  
* Start Date  
* Due Date  
* Assignee  
* Priority  
* Tags / Labels  
* File Attachments

### **6.2 Edit Task**

User can update any editable task details

### **6.3 Delete Task**

Authorized users can delete tasks

### **6.4 Task Detail View**

Each task should open in a dedicated task detail panel/page showing:

* Task title  
* Description  
* Status  
* Assignee  
* Due date  
* Priority  
* Subtasks  
* Comments  
* Attachments  
* Activity log (recommended)  
* Created date  
* Updated date

### **6.5 Task ID**

Each task should have a unique ID  
 Example:

* FH-101  
* FH-102

### **6.6 Tags / Labels**

User can add tags like:

* Bug  
* Design  
* Backend  
* Frontend

# **Feature 7: Subtask Management**

Purpose: Break large tasks into smaller actionable items.

## **Features**

### **7.1 Create Subtasks**

User can create subtasks inside a task

### **7.2 Mark Subtask Complete**

User can mark subtasks as completed

### **7.3 Edit Subtask**

User can update subtask title/details

### **7.4 Delete Subtask**

User can remove subtasks

# **Feature 8: Task Status Workflow**

Purpose: Track task progress visually and clearly.

## **Features**

### **8.1 Default Task Statuses**

The system will support these default statuses:

* To Do  
* In Progress  
* Review  
* Completed

### **8.2 Change Task Status**

User can update task status anytime

### **8.3 Custom Statuses**

Workspace/project admin can create custom statuses

# **Feature 9: Task Assignment**

Purpose: Each task should clearly show responsibility.

## **Features**

### **9.1 Assign Task**

Task can be assigned to one user

### **9.2 Reassign Task**

Task assignee can be changed anytime

### **9.3 Assignee Avatar**

Assigned user profile picture/avatar should display on task card

# **Feature 10: Comments & Task Discussion**

**Purpose:** Allow team collaboration directly inside tasks.

## **Features**

### **10.1 Add Comments**

Users can add comments to tasks

### **10.2 Reply to Comments**

Users can reply to an existing comment

### **10.3 Mention Users**

Users can mention teammates using:

* `@username`

### **10.4 Edit / Delete Own Comment**

Users can manage their own comments

### **10.5 Comment Timestamps**

Each comment should show:

* Comment author  
* Date/time  
* Edited status (if users edit the comment)

# **Module 11: Notifications**

Purpose: Keep users updated on important task activity.

## **Features**

### **11.1 Notification Triggers**

Users should receive notifications when:

* a task is assigned to them  
* someone comments on their task  
* they are mentioned in a comment  
* task due date is near  
* task status changes  
* task is reassigned

### **11.2 Notification Center**

Users should have a notification center to view all notifications

### **11.3 Read / Unread Status**

Notifications should support:

* Read  
* Unread

### **11.4 Optional Future**

* Email notifications  
* Push notifications  
* Browser notifications 

# **Feature 12: Views**

Purpose: Allow users to manage work in different visual formats.

For MVP, FocusHub will support 2 main views:

* List View  
* Board View

## **12A. List View**

Purpose: Display tasks in a structured row-based layout.

**Features**

Each task row should display:

* Task Name  
* Status  
* Assignee  
* Due Date  
* Priority

**Actions**

Users can:

* sort tasks by due date  
* sort tasks by status  
* sort tasks by assignee  
* open task details  
* edit task quickly 

## **12B. Board View**

Purpose: Display tasks in Kanban-style columns.

### **Features**

* Columns based on task status  
* Drag & drop tasks between columns  
* Move tasks from:  
  * To Do  
  * In Progress  
  * Review  
  * Completed

### **Task Card Info**

Each board card should show:

* Task Title  
* Assignee  
* Due Date  
* Description  
* Priority  
* Tags (optional) 

# **Feature 13: Dashboard**

**Purpose:** Give users and managers a quick productivity overview.

**Features**

Dashboard should show:

* Total Tasks  
* Completed Tasks  
* Pending Tasks  
* Overdue Tasks  
* Tasks by Status

**Recommended Dashboard Widgets**

* Total task count  
* Completion summary  
* Status breakdown  
* My assigned tasks  
* Upcoming deadlines 

# **Feature 14: File Attachments**

**Purpose:** Allow users to attach important files to tasks.

## Features

### **14.1 Upload File**

Users can upload files inside tasks

### **14.2 View / Download File**

Users can view or download uploaded files

### **14.3 Delete File**

Authorized users can delete attachments

# **Feature 15: Search & Filters**

Purpose: Help users quickly find tasks and organize work.

## **Features**

### **15.1 Search**

Users can search tasks by:

* Task title  
* Keywords in description (recommended)  
* Tags (optional)

### **15.2 Filters**

Users can filter tasks by:

* Assignee  
* Status  
* Due Date  
* Priority  
* Tags (optional)

### **15.3 Sorting**

Users can sort tasks by:

* Due Date  
* Priority  
* Assignee  
* Status  
* Recently Updated

# **Feature 16: Activity Log** 

**Purpose:** Maintain task history and accountability.

## **Features**

System should track activity such as:

* Task created  
* Task updated  
* Task assigned  
* Status changed  
* Comment added  
* File attached  
* Due date changed 

This is a small but very useful feature and helps maintain a work record.

