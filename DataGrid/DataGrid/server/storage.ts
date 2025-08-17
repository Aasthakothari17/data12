import { type User, type InsertUser, type Employee, type InsertEmployee } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getEmployees(): Promise<Employee[]>;
  getEmployee(id: string): Promise<Employee | undefined>;
  createEmployee(employee: InsertEmployee): Promise<Employee>;
  updateEmployee(id: string, employee: Partial<InsertEmployee>): Promise<Employee | undefined>;
  deleteEmployee(id: string): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private employees: Map<string, Employee>;

  constructor() {
    this.users = new Map();
    this.employees = new Map();
    
    // Initialize with sample data
    this.initializeSampleData();
  }

  private initializeSampleData() {
    const sampleEmployees: Employee[] = [
      {
        id: "1",
        name: "Sarah Johnson",
        email: "sarah.johnson@company.com",
        department: "Engineering",
        role: "Senior Developer",
        salary: 95000,
        status: "active",
        avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=200&h=200",
        employeeId: "EMP001",
        createdAt: new Date(),
      },
      {
        id: "2",
        name: "Michael Chen",
        email: "michael.chen@company.com",
        department: "Marketing",
        role: "Marketing Manager",
        salary: 85000,
        status: "active",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=200&h=200",
        employeeId: "EMP002",
        createdAt: new Date(),
      },
      {
        id: "3",
        name: "Emma Davis",
        email: "emma.davis@company.com",
        department: "Design",
        role: "UX Designer",
        salary: 78000,
        status: "on-leave",
        avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=200&h=200",
        employeeId: "EMP003",
        createdAt: new Date(),
      },
      {
        id: "4",
        name: "David Rodriguez",
        email: "david.rodriguez@company.com",
        department: "Sales",
        role: "Sales Representative",
        salary: 65000,
        status: "active",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=200&h=200",
        employeeId: "EMP004",
        createdAt: new Date(),
      },
      {
        id: "5",
        name: "Lisa Thompson",
        email: "lisa.thompson@company.com",
        department: "HR",
        role: "HR Manager",
        salary: 72000,
        status: "inactive",
        avatar: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=200&h=200",
        employeeId: "EMP005",
        createdAt: new Date(),
      }
    ];

    sampleEmployees.forEach(employee => {
      this.employees.set(employee.id, employee);
    });
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getEmployees(): Promise<Employee[]> {
    return Array.from(this.employees.values());
  }

  async getEmployee(id: string): Promise<Employee | undefined> {
    return this.employees.get(id);
  }

  async createEmployee(insertEmployee: InsertEmployee): Promise<Employee> {
    const id = randomUUID();
    const employee: Employee = { 
      ...insertEmployee, 
      id,
      createdAt: new Date()
    };
    this.employees.set(id, employee);
    return employee;
  }

  async updateEmployee(id: string, updateData: Partial<InsertEmployee>): Promise<Employee | undefined> {
    const employee = this.employees.get(id);
    if (!employee) return undefined;

    const updatedEmployee: Employee = { ...employee, ...updateData };
    this.employees.set(id, updatedEmployee);
    return updatedEmployee;
  }

  async deleteEmployee(id: string): Promise<boolean> {
    return this.employees.delete(id);
  }
}

export const storage = new MemStorage();
