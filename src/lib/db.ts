// Утилиты для работы с локальной базой данных (localStorage)

export interface UserRole {
  id: string;
  name: string;
  permissions: string[];
  level: number; // Уровень доступа, чем выше, тем больше прав
}

export interface User {
  id: string;
  name: string;
  email: string;
  password: string; // В реальном приложении должен быть хеш пароля
  roleId: string;
  createdAt: string;
  lastLogin?: string;
}

export interface SCEObject {
  id: string;
  name: string;
  class: string;
  description: string;
  containment: string;
  procedures: string;
  discovery: string;
  addenda?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  color: string;
}

export interface Post {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  categoryId: string;
  authorId: string;
  authorName: string;
  date: string;
  readTime: number;
  published: boolean;
}

export interface Department {
  id: string;
  name: string;
  description: string;
}

export interface Position {
  id: string;
  name: string;
  departmentId: string;
  permissions: string[];
  level: number; // Уровень доступа
}

// Начальные данные для ролей
const defaultRoles: UserRole[] = [
  {
    id: 'admin',
    name: 'Администратор',
    permissions: ['all'],
    level: 10
  },
  {
    id: 'researcher',
    name: 'Исследователь',
    permissions: ['read:all', 'create:post', 'edit:post', 'create:object', 'edit:object'],
    level: 5
  },
  {
    id: 'reader',
    name: 'Читатель',
    permissions: ['read:public'],
    level: 1
  }
];

// Начальные данные для отделов
const defaultDepartments: Department[] = [
  {
    id: 'administration',
    name: 'Административный отдел',
    description: 'Управление Фондом SCE, координация работы отделов'
  },
  {
    id: 'research',
    name: 'Научный отдел',
    description: 'Исследование аномалий и разработка методов их содержания'
  },
  {
    id: 'security',
    name: 'Служба безопасности',
    description: 'Охрана объектов и контроль над содержащимися аномалиями'
  },
  {
    id: 'field',
    name: 'Полевой отдел',
    description: 'Обнаружение и захват аномалий'
  }
];

// Начальные данные для должностей
const defaultPositions: Position[] = [
  {
    id: 'director',
    name: 'Директор',
    departmentId: 'administration',
    permissions: ['all'],
    level: 10
  },
  {
    id: 'senior_researcher',
    name: 'Старший исследователь',
    departmentId: 'research',
    permissions: ['read:all', 'create:post', 'edit:post', 'create:object', 'edit:object'],
    level: 7
  },
  {
    id: 'security_chief',
    name: 'Начальник службы безопасности',
    departmentId: 'security',
    permissions: ['read:all', 'create:post', 'edit:post'],
    level: 7
  },
  {
    id: 'field_agent',
    name: 'Полевой агент',
    departmentId: 'field',
    permissions: ['read:all', 'create:post'],
    level: 5
  },
  {
    id: 'researcher',
    name: 'Исследователь',
    departmentId: 'research',
    permissions: ['read:all', 'create:post', 'edit:own:post'],
    level: 4
  },
  {
    id: 'security_officer',
    name: 'Офицер безопасности',
    departmentId: 'security',
    permissions: ['read:all'],
    level: 3
  },
  {
    id: 'intern',
    name: 'Стажер',
    departmentId: 'research',
    permissions: ['read:public'],
    level: 1
  }
];

// Начальные категории для постов
const defaultCategories: Category[] = [
  { id: 'research', name: 'Исследования', color: 'bg-blue-600' },
  { id: 'briefing', name: 'Брифинги', color: 'bg-green-600' },
  { id: 'incident', name: 'Инциденты', color: 'bg-red-600' },
  { id: 'protocol', name: 'Протоколы', color: 'bg-purple-600' }
];

// Инициализация базы данных
export const initDatabase = () => {
  // Инициализация ролей
  if (!localStorage.getItem('sce-roles')) {
    localStorage.setItem('sce-roles', JSON.stringify(defaultRoles));
  }

  // Инициализация отделов
  if (!localStorage.getItem('sce-departments')) {
    localStorage.setItem('sce-departments', JSON.stringify(defaultDepartments));
  }

  // Инициализация должностей
  if (!localStorage.getItem('sce-positions')) {
    localStorage.setItem('sce-positions', JSON.stringify(defaultPositions));
  }

  // Инициализация категорий
  if (!localStorage.getItem('sce-categories')) {
    localStorage.setItem('sce-categories', JSON.stringify(defaultCategories));
  }

  // Инициализация пустых коллекций
  if (!localStorage.getItem('sce-users')) {
    localStorage.setItem('sce-users', JSON.stringify([]));
  }

  if (!localStorage.getItem('sce-objects')) {
    localStorage.setItem('sce-objects', JSON.stringify([]));
  }

  if (!localStorage.getItem('sce-posts')) {
    localStorage.setItem('sce-posts', JSON.stringify([]));
  }
};

// Получение данных из базы
export const getUsers = (): User[] => {
  const users = localStorage.getItem('sce-users');
  return users ? JSON.parse(users) : [];
};

export const getUserById = (id: string): User | undefined => {
  const users = getUsers();
  return users.find(user => user.id === id);
};

export const getUserByEmail = (email: string): User | undefined => {
  const users = getUsers();
  return users.find(user => user.email === email);
};

export const getRoles = (): UserRole[] => {
  const roles = localStorage.getItem('sce-roles');
  return roles ? JSON.parse(roles) : defaultRoles;
};

export const getRoleById = (id: string): UserRole | undefined => {
  const roles = getRoles();
  return roles.find(role => role.id === id);
};

export const getDepartments = (): Department[] => {
  const departments = localStorage.getItem('sce-departments');
  return departments ? JSON.parse(departments) : defaultDepartments;
};

export const getPositions = (): Position[] => {
  const positions = localStorage.getItem('sce-positions');
  return positions ? JSON.parse(positions) : defaultPositions;
};

export const getObjects = (): SCEObject[] => {
  const objects = localStorage.getItem('sce-objects');
  return objects ? JSON.parse(objects) : [];
};

export const getObjectById = (id: string): SCEObject | undefined => {
  const objects = getObjects();
  return objects.find(obj => obj.id === id);
};

export const getPosts = (): Post[] => {
  const posts = localStorage.getItem('sce-posts');
  return posts ? JSON.parse(posts) : [];
};

export const getPostById = (id: string): Post | undefined => {
  const posts = getPosts();
  return posts.find(post => post.id === id);
};

export const getCategories = (): Category[] => {
  const categories = localStorage.getItem('sce-categories');
  return categories ? JSON.parse(categories) : defaultCategories;
};

export const getCategoryById = (id: string): Category | undefined => {
  const categories = getCategories();
  return categories.find(category => category.id === id);
};

// Добавление данных
export const addUser = (user: Omit<User, 'id' | 'createdAt'>): User => {
  const users = getUsers();
  const newUser: User = {
    ...user,
    id: `user-${Date.now()}`,
    createdAt: new Date().toISOString()
  };
  
  localStorage.setItem('sce-users', JSON.stringify([...users, newUser]));
  return newUser;
};

export const addObject = (obj: Omit<SCEObject, 'id' | 'createdAt' | 'updatedAt'>): SCEObject => {
  const objects = getObjects();
  const newObject: SCEObject = {
    ...obj,
    id: `sce-${objects.length + 1}`.padStart(7, '0'),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  localStorage.setItem('sce-objects', JSON.stringify([...objects, newObject]));
  return newObject;
};

export const addPost = (post: Omit<Post, 'id' | 'date'>): Post => {
  const posts = getPosts();
  const newPost: Post = {
    ...post,
    id: `post-${Date.now()}`,
    date: new Date().toISOString()
  };
  
  localStorage.setItem('sce-posts', JSON.stringify([...posts, newPost]));
  return newPost;
};

// Обновление данных
export const updateUser = (user: User): User => {
  const users = getUsers();
  const updatedUsers = users.map(u => u.id === user.id ? user : u);
  localStorage.setItem('sce-users', JSON.stringify(updatedUsers));
  return user;
};

export const updateObject = (obj: SCEObject): SCEObject => {
  const objects = getObjects();
  const updatedObj = { ...obj, updatedAt: new Date().toISOString() };
  const updatedObjects = objects.map(o => o.id === obj.id ? updatedObj : o);
  localStorage.setItem('sce-objects', JSON.stringify(updatedObjects));
  return updatedObj;
};

export const updatePost = (post: Post): Post => {
  const posts = getPosts();
  const updatedPosts = posts.map(p => p.id === post.id ? post : p);
  localStorage.setItem('sce-posts', JSON.stringify(updatedPosts));
  return post;
};

// Удаление данных
export const deleteUser = (id: string): boolean => {
  const users = getUsers();
  const filteredUsers = users.filter(user => user.id !== id);
  localStorage.setItem('sce-users', JSON.stringify(filteredUsers));
  return true;
};

export const deleteObject = (id: string): boolean => {
  const objects = getObjects();
  const filteredObjects = objects.filter(obj => obj.id !== id);
  localStorage.setItem('sce-objects', JSON.stringify(filteredObjects));
  return true;
};

export const deletePost = (id: string): boolean => {
  const posts = getPosts();
  const filteredPosts = posts.filter(post => post.id !== id);
  localStorage.setItem('sce-posts', JSON.stringify(filteredPosts));
  return true;
};

// Аутентификация
export const authenticateUser = (email: string, password: string): User | null => {
  const user = getUserByEmail(email);
  if (user && user.password === password) {
    // Обновляем время последнего входа
    updateUser({
      ...user,
      lastLogin: new Date().toISOString()
    });
    return user;
  }
  return null;
};

// Проверка прав доступа
export const hasPermission = (user: User, permission: string): boolean => {
  const role = getRoleById(user.roleId);
  if (!role) return false;
  
  // Администратор имеет все права
  if (role.permissions.includes('all')) return true;
  
  // Проверяем конкретное разрешение
  return role.permissions.includes(permission);
};

// Генерация следующего номера SCE-объекта
export const getNextObjectId = (): string => {
  const objects = getObjects();
  const nextNumber = objects.length + 1;
  return `sce-${nextNumber.toString().padStart(3, '0')}`;
};

// Очистка объектов SCE из базы
export const clearAllObjects = (): void => {
  localStorage.setItem('sce-objects', JSON.stringify([]));
};

// Инициализация базы данных при импорте модуля
initDatabase();

// Удаляем все объекты SCE из базы
clearAllObjects();
