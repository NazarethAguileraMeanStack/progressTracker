
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






// Udemy - Web Developer BootCamp
let webDevBootCamp = new Project('Udemy - Web Developer Bootcamp', 45);
webDevBootCamp.addTask('Other Assorted Useful CSS Propteries', 0, true);
webDevBootCamp.addTask('What matters in this section', 3, true);
webDevBootCamp.addTask('Opacity & The Alpha Channel', 7, true);
webDevBootCamp.addTask('The Position Property', 10, true);
webDevBootCamp.addTask('CSS Transitions', 11, true);
webDevBootCamp.addTask('The Power of CSS Transformations', 13, true);
webDevBootCamp.addTask('Fancy Button Hover Effect CodeAlong', 10, true);
webDevBootCamp.addTask('The Truth About Background', 9, true);
webDevBootCamp.addTask('Google Fonts is Amazing', 8, true);
webDevBootCamp.addTask('Photo Blog CodeAlong Pt.1', 9, false);
webDevBootCamp.addTask('Photo Blog CodeAlong Pt.2', 9, false);

webDevBootCamp.displayAll();