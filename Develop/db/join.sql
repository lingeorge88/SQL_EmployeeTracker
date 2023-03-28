-- ALTER TABLE role MODIFY department_id VARCHAR(30);
SELECT role.id, role.title, role.salary, department.name AS department
FROM role
LEFT JOIN department ON role.department_id = department.id;

SELECT employee.id, employee.first_name, employee.last_name, role.title AS title, department.name as department, role.salary as salary, CONCAT (manager.first_name, " ", manager.last_name) AS manager
FROM employee
LEFT JOIN role ON role.id = employee.role_id
LEFT JOIN department ON role.department_id = department.id
LEFT JOIN employee manager ON employee.manager_id = manager.id

