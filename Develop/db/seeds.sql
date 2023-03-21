USE company_db

INSERT INTO department (id, name)
VALUES  (1, 'Sales'),
        (2, 'Marketing'),
        (3, 'Engineering'),
        (4, 'Human Resources'),
        (5, 'Finance'),
        (6, 'Customer Support');

INSERT INTO role (id, title, salary, department_id) 
VALUES  (1, 'Sales Manager', 100000, 1),
        (2, 'Marketing Coordinator', 50000, 2),
        (3, 'Software Engineer', 80000, 3),
        (4, 'Human Resources Specialist', 60000, 4),
        (5, 'Financial Analyst', 70000, 5),
        (6, 'Customer Support Rep', 40000, 6);

-- Seed employee table
INSERT INTO employee (id, first_name, last_name, role_id, manager_id) 
VALUES  (1, 'John', 'Doe', 1, NULL),
        (2, 'Jane', 'Smith', 2, NULL),
        (3, 'Bob', 'Johnson', 3, NULL),
        (4, 'Mary', 'Williams', 4, 1),
        (5, 'James', 'Brown', 5, NULL),
        (6, 'Sarah', 'Davis', 6, 2);







