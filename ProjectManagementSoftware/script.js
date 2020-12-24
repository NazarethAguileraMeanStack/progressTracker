
class Project {
    constructor(name, minutesPerDay) {
        this.projectName = name;
        this.float = 5;
        this.numberOfTasks = 0;
        this.totalDuration = 0;
        this.tasks = [];
        this.MINUTES_PER_DAY = minutesPerDay;
        this.DOM.addProjectToDOM(name);
    }

    DOM = {
        addProjectToDOM: function(name) {
            this.addToNavBar(name);
            this.initializeSection(name);
            this.intializeHeader(name);
            this.generateBackgroundColor(name)
        },
        addToNavBar: function(name) {
            let nav = document.getElementById('nav');
            let newNavItem = document.createElement('a');
            newNavItem.setAttribute('href', `#${name}`);
            newNavItem.innerText = `${name}`;
            nav.appendChild(newNavItem);    
        },
        initializeSection: function(name) {
            let body = document.getElementById('root');
            let section = document.createElement('div');
            section.setAttribute('id', `${name}`);
            body.appendChild(section);    
        },
        intializeHeader: function(name) {
            let currentSection = document.getElementById(name);
            let header = document.createElement('h2');
            header.innerText = `${name}`;
            currentSection.appendChild(header);
        },
        generateBackgroundColor: function(name) {
            let section = document.getElementById(`${name}`);
            let r = this.generateColor();
            let g = this.generateColor();
            let b = this.generateColor();
            section.style.backgroundColor = `rgb(${r}, ${g}, ${b})`;
        },
        generateColor: function() {
            return 235 + Math.floor(Math.random() * 15);
        },
        display: {
            progressBar: function(percentComplete, name) {
                let percentDisplay = document.getElementById(`${name}`);
                let node = document.createElement('p');
                node.innerText = `${(percentComplete).toFixed(2)}%`;
                percentDisplay.appendChild(node);
                let progressBar = document.createElement('progress');
                progressBar.setAttribute('value', percentComplete);
                progressBar.setAttribute('max', 100);
                percentDisplay.appendChild(progressBar);
            },
            taskListTable: function(projectName, numOfTasks, tasksArray, totalDuration) {
                let section = document.getElementById(`${projectName}`);
                let table = document.createElement('table');
                table.innerHTML = `<thead>
                <th>#</th>
                <th>Task Name</th>
                <th>Task Duration</th>
                <th>% of total project</th>
                </thead>`;
                section.appendChild(table);
                let tableBody = document.createElement('tbody');
                for (let i = 0; i < numOfTasks; i++) {
                    let tableRow = document.createElement('tr');
                    if (tasksArray[i].isComplete === true) {
                        tableRow.classList.add('isComplete');
                    } else {
                        tableRow.classList.add('isNotStarted');
                    }
                    tableRow.innerHTML = `<td>${i + 1}</td>
                    <td>${tasksArray[i].name}</td>
                    <td>${tasksArray[i].duration} Minutes</td>
                    <td>${((tasksArray[i].duration / totalDuration) * 100).toFixed(2) }%</td>`;
                    tableBody.appendChild(tableRow);
                }
                table.appendChild(tableBody);
            },
            tableDistributionTable: function(projectName, days, minutesPerDay) {
                let section = document.getElementById(`${projectName}`);
                let subHeader = document.createElement('h2');
                subHeader.innerText = `${minutesPerDay} minutes per Day - ${days.length} Days`;
                section.appendChild(subHeader);
                let table = document.createElement('table');
                table.innerHTML = `<thead>
                <th>Day</th>
                <th>Task Names</th>
                <th>Total Minutes</th>
                </thead>`;
                section.appendChild(table);
                let tableBody = document.createElement('tbody');
                for (let i = 0; i < days.length; i++) {
                    let tableRow = document.createElement('tr');
                    tableRow.innerHTML = `<td>Day ${i + 1}</td>
                    <td>${days[i].list.map((element) => {
                        if (element.isDone === true) return `<p class='isComplete'>${element.taskName}</p>`;
                        else return `<p>${element.taskName}</p>`
                    }).join('')}</td>
                    <td>${days[i].totalTime}</td>`;
                    tableBody.appendChild(tableRow);
                }
                table.appendChild(tableBody);
            },
        }
    };


    addTask(taskName, taskDuration, isComplete) {
        if (taskDuration <= this.get_minutesPerDay()) {
            let task = {};
            task.name = taskName;
            task.duration = taskDuration;
            this.totalDuration += task.duration;
            task.isComplete = isComplete;
            this.tasks.push(task);
            this.numberOfTasks++;
        } else {
            let counter = 1;
            while (taskDuration > this.get_minutesPerDay()) {
                let task = {};
                task.name = (counter > 1) ? `${taskName} - (cont.${counter})`: `${taskName}`; 
                task.duration = this.get_minutesPerDay();
                this.totalDuration += task.duration;
                task.isComplete = isComplete;
                this.tasks.push(task);
                this.numberOfTasks++;
                counter++;
                taskDuration -= this.get_minutesPerDay();
            }
            if (taskDuration > 0) {
                let task = {};
                task.name = `${taskName} - (cont.${counter})`;
                task.duration = taskDuration;
                this.totalDuration += task.duration;
                task.isComplete = isComplete;
                this.tasks.push(task);
                this.numberOfTasks++;
            }
        }
        
    }

    get_float() {
        return this.float;
    }

    get_numberOfTasks() {
        return this.numberOfTasks;
    }

    get_totalDuration() {
        return this.totalDuration;
    }

    get_minutesPerDay() {
        return this.MINUTES_PER_DAY;
    }

    get_projectName() {
        return this.projectName;
    }

    calc_sumOfMinutesCompleted() {
        let totalMinutes = 0;
        for (let i = 0; i < this.tasks.length; i++) {
            if (this.tasks[i].isComplete) totalMinutes += this.tasks[i].duration;
        }

        return totalMinutes;
    }

    calc_tasksPerDay(numOfTasks, tasks, minutesPerDay, float) {
        let days = [];
        let day = [];
        let count = 0;

        for (let i = 0; i < numOfTasks - 1; i++) {
            day.push({taskName: tasks[i].name, isDone: tasks[i].isComplete});
            count += tasks[i].duration;
            if (count >= minutesPerDay || (count + tasks[i + 1].duration > (minutesPerDay + float))) {
                days.push({list: day, totalTime: count}); 
                count = 0;
                day = [];
            }
        }

        if (day.length !== 0) days.push({list: day, totalTime: count}); 
        if (days[days.length - 1].totalTime + tasks[tasks.length - 1].duration <= (minutesPerDay + float) ) {
            days[days.length - 1].list.push({taskName: tasks[tasks.length - 1].name, isDone: tasks[tasks.length - 1].isComplete});
            days[days.length - 1].totalTime += tasks[tasks.length - 1].duration
        } else {
            days.push({list: [{taskName: tasks[tasks.length - 1].name, isDone: tasks[tasks.length - 1].isComplete}], totalTime: tasks[tasks.length - 1].duration});
        }
        return days;
    }

    displayProgressBar() {
        let value = (this.calc_sumOfMinutesCompleted() / this.get_totalDuration()) * 100;
        this.DOM.display.progressBar(value, this.get_projectName());
    }
 

    displayTaskList() {
        let name = this.get_projectName();
        let numOfTasks = this.get_numberOfTasks();
        let tasksArray = this.tasks;
        let totalDuration = this.get_totalDuration();

        this.DOM.display.taskListTable(name, numOfTasks, tasksArray, totalDuration);
    
    }

    displayTaskDistribution() {
        let numOfTasks = this.get_numberOfTasks();
        let tasksArray = this.tasks;
        let minutesPerDay = this.get_minutesPerDay();
        let projectName = this.get_projectName();
        let float = this.get_float();

        let days = this.calc_tasksPerDay(numOfTasks, tasksArray, minutesPerDay, float);

        this.DOM.display.tableDistributionTable(projectName, days, minutesPerDay);

    }

    displayAll() {
        this.displayProgressBar();
        this.displayTaskList();
        this.displayTaskDistribution();
    }




}


// CompTIA(220 - 1001) Class
let core1 = new Project('CompTIA(220 - 1001) Class', 90);
core1.addTask('Write Mobile Device Flashcards', 84, false);
core1.addTask('Write Networking Flashcards', 110, false);
core1.addTask('Write Hardware Flashcards', 282, false);
core1.addTask('Write Virtualization and Cloud Computing Flashcards', 20, false);
core1.addTask('Write Hardware and Networking Troubleshooting Flashcards', 220, false);
core1.addTask('Study Mobile Device Flashcards', 168, false);

core1.displayAll();


let angularChallenge100 = new Project('100 Angular Challenge', 30);
angularChallenge100.addTask('Section 1: Introduction', 9, false);
angularChallenge100.addTask('Section 1: Tools We Use', 3, false);

angularChallenge100.addTask('Section 2: Github Repo / Source Code', 3, false);
angularChallenge100.addTask('Section 2: Updating Information', 3, false);
angularChallenge100.addTask('Section 2: Creating a New Project with Angular CLI', 4, false);
angularChallenge100.addTask('Section 2: Updating Versions', 5, false);
angularChallenge100.addTask('Section 2: Understanding Our Configuration', 6, false);
angularChallenge100.addTask('Section 2: Understanding our src setup', 7, false);
angularChallenge100.addTask('Section 2: Generating Components with CLI', 4, false);
angularChallenge100.addTask('Section 2: Configuring ng generate component to use scss', 5, false);
angularChallenge100.addTask('Section 2: Converting Application to SCSS', 3, false);
angularChallenge100.addTask('Section 2: How to Succeed with this Course', 3, false);

angularChallenge100.addTask('Section 3: Basic Toolbar', 15, false);
angularChallenge100.addTask('Section 3: Card', 15, false);
angularChallenge100.addTask('Section 3: Accordion', 17, false);
angularChallenge100.addTask('Section 3: Progress Bar', 13, false);
angularChallenge100.addTask('Section 3: Star Ratings', 15, false);
angularChallenge100.addTask('Section 3: Top of Page', 15, false);
angularChallenge100.addTask('Section 3: A. Basic Routing Setup', 11, false);
angularChallenge100.addTask('Section 3: B. Basic Routing Setup', 9, false);
angularChallenge100.addTask('Section 3: Lazy Loading Routes', 12, false);
angularChallenge100.addTask('Section 3: Truncate Pipe', 8, false);
angularChallenge100.addTask('Section 3: Loader Circular Component', 14, false);
angularChallenge100.addTask('Section 3: Credit Card Formater Pipe', 15, false);
angularChallenge100.addTask('Section 3: Credit Card Input Component', 19, false);
angularChallenge100.addTask('Section 3: Loader Loading Component', 19, false);
angularChallenge100.addTask('Section 3: Twitter Post Component', 17, false);
angularChallenge100.addTask('Section 3: LinkedIn Post Component', 17, false);
angularChallenge100.addTask('Section 3: Flatten Pipe', 11, false);
angularChallenge100.addTask('Section 3: Modal Component', 16, false);
angularChallenge100.addTask('Section 3: Debounce Click Directive', 13, false);
angularChallenge100.addTask('Section 3: Quote Component', 13, false);
angularChallenge100.addTask('Section 3: Toggle Component', 12, false);
angularChallenge100.addTask('Section 3: Filter Term Pipe', 9, false);
angularChallenge100.addTask('Section 3: Rich Text Viewer Component', 12, false);
angularChallenge100.addTask('Section 3: Debounce Search Component', 15, false);
angularChallenge100.addTask('Section 3: Search List Component', 18, false);
angularChallenge100.addTask('Section 3: Counter Component', 17, false);
angularChallenge100.addTask('Section 3: Simple Table', 15, false);
angularChallenge100.addTask('Section 3: Paging Component', 25, false);
angularChallenge100.addTask('Section 3: Tabs Component', 16, false);
angularChallenge100.addTask('Section 3: Ripple Directive', 15, false);
angularChallenge100.addTask('Section 3: Fade In Out Animation', 13, false);
angularChallenge100.addTask('Section 3: Sort Table Component', 27, false);
angularChallenge100.addTask('Section 3: Reactive Forms Emails Component', 32, false);
angularChallenge100.addTask('Section 3: Form Dirty Guard', 13, false);
angularChallenge100.addTask('Section 3: User Service', 17, false);
angularChallenge100.addTask('Section 3: Ribbon Component', 18, false);
angularChallenge100.addTask('Section 3: Button Toggle Component', 18, false);
angularChallenge100.addTask('Section 3: Banner Cut Out Component', 14, false);
angularChallenge100.addTask('Section 3: Scale Directive', 9, false);
angularChallenge100.addTask('Section 3: Snackbar Component', 20, false);
angularChallenge100.addTask('Section 3: Simple Popup Component', 15, false);
angularChallenge100.addTask('Section 3: Countdown Timer Component', 24, false);
angularChallenge100.addTask('Section 3: Snackbar Service', 13, false);
angularChallenge100.addTask('Section 3: Copy Directive', 13, false);
angularChallenge100.addTask('Section 3: Lazy Load Image Directive', 21, false);
angularChallenge100.addTask('Section 3: Footer Component', 18, false);
angularChallenge100.addTask('Section 3: Slide Right Animation', 9, false);
angularChallenge100.addTask('Section 3: Skeleton Loader Component', 14, false);
angularChallenge100.addTask('Section 3: Social Media Bar Component', 19, false);
angularChallenge100.addTask('Section 3: Bottom Sheet Component', 14, false);
angularChallenge100.addTask('Section 3: Fieldset Toggle Component', 10, false);
angularChallenge100.addTask('Section 3: Pill Component', 13, false);
angularChallenge100.addTask('Section 3: Pill Filter List Component', 20, false);
angularChallenge100.addTask('Section 3: Not Found Component', 16, false);
angularChallenge100.addTask('Section 3: Password Component', 23, false);
angularChallenge100.addTask('Section 3: Title Service', 17, false);
angularChallenge100.addTask('Section 3: Rich Text Pipe', 10, false);
angularChallenge100.addTask('Section 3: Sort By Pipe', 11, false);
angularChallenge100.addTask('Section 3: Sort By Key Pipe', 10, false);
angularChallenge100.addTask('Section 3: Overlay Component', 9, false);
angularChallenge100.addTask('Section 3: Local Storage Service', 16, false);
angularChallenge100.addTask('Section 3: Route Params', 13, false);
angularChallenge100.addTask('Section 3: Common Scripts', 12, false);
angularChallenge100.addTask('Section 3: Active Route UI', 9, false);
angularChallenge100.addTask('Section 3: Auto Focus Input Directive', 9, false);
angularChallenge100.addTask('Section 3: Testing Introduction', 6, false);
angularChallenge100.addTask('Section 3: Component Testing', 16, false);
angularChallenge100.addTask('Section 3: Guard Testing', 14, false);
angularChallenge100.addTask('Section 3: Pipe Testing', 10, false);
angularChallenge100.addTask('Section 3: Directive Testing', 18, false);
angularChallenge100.addTask('Section 3: Mock 3rd Party Http', 10, false);
angularChallenge100.addTask('Section 3: Service Testing', 16, false);
angularChallenge100.addTask('Section 3: Mock First Party Services', 10, false);
angularChallenge100.addTask('Section 3: Abstracting Services for Testing', 10, false);
angularChallenge100.addTask('Section 3: Testing Practcice x 75', 6, false);

angularChallenge100.addTask('Section 4: Good Job', 5, false);

angularChallenge100.addTask('Section 5: Bonus Lecture', 2, false);

angularChallenge100.displayAll();



// Udemy - Web Developer BootCamp
let webDevBootCamp = new Project('Udemy - Web Developer Bootcamp', 45);

webDevBootCamp.addTask('Section 9: What matters in this section', 5, true);
webDevBootCamp.addTask('Section 9: Opacity & The Alpha Channel', 9, true);
webDevBootCamp.addTask('Section 9: The Position Property', 12, true);
webDevBootCamp.addTask('Section 9: CSS Transitions', 13, true);
webDevBootCamp.addTask('Section 9: The Power of CSS Transformations', 15, true);
webDevBootCamp.addTask('Section 9: Fancy Button Hover Effect CodeAlong', 12, true);
webDevBootCamp.addTask('Section 9: The Truth About Background', 11, true);
webDevBootCamp.addTask('Section 9: Google Fonts is Amazing', 10, true);
webDevBootCamp.addTask('Section 9: Photo Blog CodeAlong Pt.1', 11, false);
webDevBootCamp.addTask('Section 9: Photo Blog CodeAlong Pt.2', 11, false);

webDevBootCamp.addTask('Section 10: What Matters In This Section', 5, false);
webDevBootCamp.addTask('Section 10: What on Earth is Flexbox', 6, false);
webDevBootCamp.addTask('Section 10: Flex-Direction', 8, false);
webDevBootCamp.addTask('Section 10: Justify-Content', 7, false);
webDevBootCamp.addTask('Section 10: Flex-Wrap', 6, false);
webDevBootCamp.addTask('Section 10: Align-Items', 10, false);
webDevBootCamp.addTask('Section 10: Align-Content & Align-Self', 7, false);
webDevBootCamp.addTask('Section 10: Flex-Basis, Grow & Shrink', 10, false);
webDevBootCamp.addTask('Section 10: Flex Shorthand', 8, false);
webDevBootCamp.addTask('Section 10: Responsive Design & Media Queries Intro', 9, false);
webDevBootCamp.addTask('Section 10: The Power of Media Queries', 11, false);
webDevBootCamp.addTask('Section 10: Building a Responsive Nav', 11, false);

webDevBootCamp.addTask('Section 11: Pricing Panel CodeAlong Pt.1', 6, false);
webDevBootCamp.addTask('Section 11: Pricing Panel CodeAlong Pt.2', 6, false);
webDevBootCamp.addTask('Section 11: Pricing Panel CodeAlong Pt.3', 6, false);
webDevBootCamp.addTask('Section 11: Pricing Panel CodeAlong Pt.4', 7, false);
webDevBootCamp.addTask('Section 11: Pricing Panel CodeAlong Pt.5', 6, false);
webDevBootCamp.addTask('Section 11: Pricing Panel CodeAlong Pt.6', 5, false);

webDevBootCamp.addTask('Section 12: What Matters In This Section', 5, false);
webDevBootCamp.addTask('Section 12: WTF Is Bootstrap', 10, false);
webDevBootCamp.addTask('Section 12: Including Bootstrap & Container', 12, false);
webDevBootCamp.addTask('Section 12: Bootstrap Buttons', 12, false);
webDevBootCamp.addTask('Section 12: Bootstrap Typography & Utlities', 10, false);
webDevBootCamp.addTask('Section 12: Badges, Alerts, & Button Groups', 14, false);
webDevBootCamp.addTask('Section 12: Coding Exercise 13: Boostrap Basics Practice', 10, false);
webDevBootCamp.addTask('Section 12: Intro to Bootstrap Grid', 10, false);
webDevBootCamp.addTask('Section 12: Coding Exercise 14: Bootstrap Grid Practice', 10, false);
webDevBootCamp.addTask('Section 12: Responsive Bootstrap Grids', 13, false);
webDevBootCamp.addTask('Section 12: Useful Grid Utilities', 10, false);
webDevBootCamp.addTask('Section 12: Bootstrap & Forms', 15, false);
webDevBootCamp.addTask('Section 12: Bootstrap Navbars', 16, false);
webDevBootCamp.addTask('Section 12: Bootstrap Icons!', 8, false);
webDevBootCamp.addTask('Section 12: Other Boostrap Utilities', 13, false);
webDevBootCamp.addTask('Section 12: A Mixed Bag of Other Bootstrap Stuff', 6, false);

webDevBootCamp.addTask('Section 14: What Matters In This Section', 4, false);
webDevBootCamp.addTask('Section 14: Why JavaScript is Awesome', 10, false);
webDevBootCamp.addTask('Section 14: Primitives & The Console', 9, false);
webDevBootCamp.addTask('Section 14: JavaScript Numbers', 10, false);
webDevBootCamp.addTask('Section 14: WTF is NaN', 5, false);
webDevBootCamp.addTask('Section 14: Quick Numbers Quiz', 4, false);
webDevBootCamp.addTask('Section 14: Variables & Let', 9, false);
webDevBootCamp.addTask('Section 14: Coding Exercise 15: Our First Variable Exercise', 10, false);
webDevBootCamp.addTask('Section 14: Updating Variables', 7, false);
webDevBootCamp.addTask('Section 14: Const & Var', 7, false);
webDevBootCamp.addTask('Section 14: Coding Exercise 16: Our First Constants Exercise', 10, false);
webDevBootCamp.addTask('Section 14: Quiz 3: Varibles', 10, false);
webDevBootCamp.addTask('Section 14: Booleans', 7, false);
webDevBootCamp.addTask('Section 14: Variables Naming and Conventions', 6, false);
webDevBootCamp.addTask('Section 14: Quiz 4: Quick Variable Quiz', 10, false);

webDevBootCamp.addTask('Section 15: What Matters In This Section', 4, false);
webDevBootCamp.addTask('Section 15: Introducing Strings', 4, false);
webDevBootCamp.addTask('Section 15: Coding Exercise 17: Our First String Variables', 10, false);
webDevBootCamp.addTask('Section 15: Indices & Length', 10, false);
webDevBootCamp.addTask('Section 15: Quiz 5: Strings Basics Quix', 10, false);
webDevBootCamp.addTask('Section 15: String Methods', 10, false);
webDevBootCamp.addTask('Section 15: Coding Exercise 18: Strings Methods', 10, false);
webDevBootCamp.addTask('Section 15: String Methods with Arguments', 12, false);
webDevBootCamp.addTask('Section 15: Coding Exercise 19: More String Methods', 10, false);
webDevBootCamp.addTask('Section 15: String Template Literals - SUPER USEFUL', 9, false);
webDevBootCamp.addTask('Section 15: Undefined & Null', 5, false);
webDevBootCamp.addTask('Section 15: Random Numbers & The Math Object', 10, false);
webDevBootCamp.addTask('Section 15: Coding Exercise 20: String Template Literal', 10, false);

webDevBootCamp.addTask('Section 16: What Matters In This Section', 4, false);
webDevBootCamp.addTask('Section 16: Decision Making with Code??', 4, false);
webDevBootCamp.addTask('Section 16: Comparison Operators', 7, false);
webDevBootCamp.addTask('Section 16: Equality: Triple vs Double Equals', 6, false);
webDevBootCamp.addTask('Section 16: Quiz 6: Comparison Quiz', 10, false);
webDevBootCamp.addTask('Section 16: Console, Alert, & Prompt', 7, false);
webDevBootCamp.addTask('Section 16: Running JavaScript from a Script', 8, false);
webDevBootCamp.addTask('Section 16: if statements', 8, false);
webDevBootCamp.addTask('Section 16: Coding Exercise 21: Our First Conditional Exercise', 10, false);
webDevBootCamp.addTask('Section 16: Else-If', 11, false);
webDevBootCamp.addTask('Section 16: Else', 11, false);
webDevBootCamp.addTask('Section 16: Coding Exercise 22: getColor Conditional', 10, false);
webDevBootCamp.addTask('Section 16: Nesting Conditions', 8, false);
webDevBootCamp.addTask('Section 16: Coding Exercise 23: Nested Conditionals', 10, false);
webDevBootCamp.addTask('Section 16: Truth-y & False-y Values', 7, false);
webDevBootCamp.addTask('Section 16: Logical AND', 7, false);
webDevBootCamp.addTask('Section 16: Coding Exercise 24: Logical and Mystery', 10, false);
webDevBootCamp.addTask('Section 16: Logical OR', 11, false);
webDevBootCamp.addTask('Section 16: Logical NOT', 8, false);

webDevBootCamp.addTask('Section 17: What Matters In This Section', 4, false);
webDevBootCamp.addTask('Section 17: Introducing Arrays', 10, false);
webDevBootCamp.addTask('Section 17: Coding Exercise 25: Lotto Numbers Exercise', 10, false);
webDevBootCamp.addTask('Section 17: Array Random Access', 10, false);
webDevBootCamp.addTask('Section 17: Coding Exercise 26: Array Access', 10, false);
webDevBootCamp.addTask('Section 17: Push & Pop', 10, false);
webDevBootCamp.addTask('Section 17: Shift & Unshift', 6, false);
webDevBootCamp.addTask('Section 17: Coding Exercise 27: Push/Pop/Shift/Unshift', 10, false);
webDevBootCamp.addTask('Section 17: Concat, indexOf, includes & reverse', 8, false);
webDevBootCamp.addTask('Section 17: Slice & Splice', 15, false);
webDevBootCamp.addTask('Section 17: Reference Types & Equality Testing', 8, false);
webDevBootCamp.addTask('Section 17: Arrays + Const', 6, false);
webDevBootCamp.addTask('Section 17: Multi-Dimensional Arrays', 6, false);
webDevBootCamp.addTask('Section 17: Coding Exercise 28: Nested Arrays Exercise', 10, false);

webDevBootCamp.addTask('Section 18: What Matters In This Section', 4, false);
webDevBootCamp.addTask('Section 18: Introducing Object Literals', 7, false);
webDevBootCamp.addTask('Section 18: Creating Object Literals', 6, false);
webDevBootCamp.addTask('Section 18: Coding Exercise 29: Our First Object', 10, false);
webDevBootCamp.addTask('Section 18: Accessing Data Out of Objects', 9, false);
webDevBootCamp.addTask('Section 18: Coding Exercise 30: Object Access Exercise', 10, false);
webDevBootCamp.addTask('Section 18: Modifying Objects', 7, false);
webDevBootCamp.addTask('Section 18: Nesting Arrays & Objects', 8, false);

webDevBootCamp.displayAll();



