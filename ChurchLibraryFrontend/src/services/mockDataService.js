// Mock data for development
const mockBooks = [
  {
    id: 1,
    title: "The Purpose Driven Life",
    author: "Rick Warren",
    isbn: "9780310205715",
    category: "Christian Living",
    publisher: "Zondervan",
    publicationYear: 2002,
    pages: 400,
    status: "Available",
    location: "Shelf A-1",
    copies: 3,
    availableCopies: 2,
  },
  {
    id: 2,
    title: "Mere Christianity",
    author: "C.S. Lewis",
    isbn: "9780060652920",
    category: "Theology",
    publisher: "HarperOne",
    publicationYear: 1952,
    pages: 256,
    status: "Borrowed",
    location: "Shelf B-1",
    copies: 2,
    availableCopies: 0,
  },
  {
    id: 3,
    title: "Jesus Calling",
    author: "Sarah Young",
    isbn: "9781591451884",
    category: "Devotional",
    publisher: "Thomas Nelson",
    publicationYear: 2004,
    pages: 384,
    status: "Available",
    location: "Shelf C-1",
    copies: 4,
    availableCopies: 3,
  },
];

const mockUsers = [
  {
    id: 1,
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    phone: "+1-555-0123",
    role: "admin",
    status: "active",
    joinDate: "2023-01-15",
    lastLogin: "2024-12-24",
  },
  {
    id: 2,
    firstName: "Jane",
    lastName: "Smith",
    email: "jane.smith@example.com",
    phone: "+1-555-0124",
    role: "user",
    status: "active",
    joinDate: "2023-03-20",
    lastLogin: "2024-12-23",
  },
  {
    id: 3,
    firstName: "Bob",
    lastName: "Johnson",
    email: "bob.johnson@example.com",
    phone: "+1-555-0125",
    role: "librarian",
    status: "active",
    joinDate: "2023-02-10",
    lastLogin: "2024-12-24",
  },
];

const mockStatistics = {
  dashboard: {
    totalBooks: 1250,
    totalUsers: 342,
    activeBorrowings: 89,
    overdueBooks: 12,
    newBooksThisMonth: 15,
  },
  reports: {
    monthlyStats: [
      { month: "Jan", borrows: 150, returns: 145 },
      { month: "Feb", borrows: 165, returns: 160 },
      { month: "Mar", borrows: 180, returns: 175 },
    ],
    topBooks: [
      { title: "The Purpose Driven Life", borrows: 45 },
      { title: "Mere Christianity", borrows: 38 },
      { title: "Jesus Calling", borrows: 32 },
    ],
  },
};

// Simulate API delays
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

class MockDataService {
  async getBooks(params = {}) {
    await delay(500);
    return { data: mockBooks, success: true };
  }

  async getBook(id) {
    await delay(300);
    const book = mockBooks.find((b) => b.id === parseInt(id));
    return { data: book, success: true };
  }

  async createBook(bookData) {
    await delay(400);
    const newBook = { id: mockBooks.length + 1, ...bookData };
    mockBooks.push(newBook);
    return { data: newBook, success: true };
  }

  async updateBook(id, bookData) {
    await delay(400);
    const index = mockBooks.findIndex((b) => b.id === parseInt(id));
    if (index !== -1) {
      mockBooks[index] = { ...mockBooks[index], ...bookData };
    }
    return { data: mockBooks[index], success: true };
  }

  async deleteBook(id) {
    await delay(300);
    const index = mockBooks.findIndex((b) => b.id === parseInt(id));
    if (index !== -1) {
      mockBooks.splice(index, 1);
    }
    return { success: true };
  }

  async getUsers(params = {}) {
    await delay(500);
    return { data: mockUsers, success: true };
  }

  async getUser(id) {
    await delay(300);
    const user = mockUsers.find((u) => u.id === parseInt(id));
    return { data: user, success: true };
  }

  async createUser(userData) {
    await delay(400);
    const newUser = { id: mockUsers.length + 1, ...userData };
    mockUsers.push(newUser);
    return { data: newUser, success: true };
  }

  async updateUser(id, userData) {
    await delay(400);
    const index = mockUsers.findIndex((u) => u.id === parseInt(id));
    if (index !== -1) {
      mockUsers[index] = { ...mockUsers[index], ...userData };
    }
    return { data: mockUsers[index], success: true };
  }

  async deleteUser(id) {
    await delay(300);
    const index = mockUsers.findIndex((u) => u.id === parseInt(id));
    if (index !== -1) {
      mockUsers.splice(index, 1);
    }
    return { success: true };
  }

  async getDashboardStats() {
    await delay(400);
    return { data: mockStatistics.dashboard, success: true };
  }

  async getReports(params = {}) {
    await delay(500);
    return { data: mockStatistics.reports, success: true };
  }
}

export default new MockDataService();
