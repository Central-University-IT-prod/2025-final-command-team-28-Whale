import { 
  LoginFormData, 
  UserRegisterFormData, 
  MentorRegisterFormData 
} from "../schemas";

const generateRandomEmail = (): string => {
  const domains = ['gmail.com', 'yandex.ru', 'mail.ru', 'outlook.com'];
  const randomString = Math.random().toString(36).substring(2, 10);
  const randomDomain = domains[Math.floor(Math.random() * domains.length)];
  return `${randomString}@${randomDomain}`;
};

const generateValidPassword = (): string => {
  const upperCaseLetters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const lowerCaseLetters = 'abcdefghijklmnopqrstuvwxyz';
  const numbers = '0123456789';
  
  const upperCase = upperCaseLetters[Math.floor(Math.random() * upperCaseLetters.length)];
  const number = numbers[Math.floor(Math.random() * numbers.length)];
  
  let remainingChars = '';
  for (let i = 0; i < 6; i++) {
    const allChars = lowerCaseLetters + upperCaseLetters + numbers;
    remainingChars += allChars[Math.floor(Math.random() * allChars.length)];
  }
  
  return upperCase + remainingChars + number;
};

const generateRandomSpecialization = (): string => {
  const specializations = [
    'Frontend-разработка',
    'Backend-разработка',
    'UI/UX дизайн',
    'DevOps',
    'Data Science',
    'Machine Learning',
    'Mobile Development',
    'QA инженер',
    'Project Management'
  ];
  
  return specializations[Math.floor(Math.random() * specializations.length)];
};

const generateRandomTags = (count: number = 3): string[] => {
  const allTags = [
    'JavaScript', 'TypeScript', 'React', 'Vue', 'Angular', 
    'Node.js', 'Python', 'Java', 'C#', 'PHP', 
    'Docker', 'Kubernetes', 'AWS', 'Azure', 'GCP',
    'SQL', 'MongoDB', 'Firebase', 'Redux', 'GraphQL',
    'HTML', 'CSS', 'Sass', 'Tailwind', 'Bootstrap'
  ];
  
  const result: string[] = [];
  const availableTags = [...allTags];
  
  for (let i = 0; i < Math.min(count, allTags.length); i++) {
    const randomIndex = Math.floor(Math.random() * availableTags.length);
    result.push(availableTags[randomIndex]);
    availableTags.splice(randomIndex, 1);
  }
  
  return result;
};

const generateRandomTelegramContact = (): string => {
  const usernames = ['user123', 'dev_mentor', 'tech_guru', 'coding_pro', 'webdev_master'];
  const username = usernames[Math.floor(Math.random() * usernames.length)];
  return `https://t.me/${username}`;
};


export const generateLoginData = (): LoginFormData => {
  return {
    email: generateRandomEmail(),
    password: generateValidPassword(),
    rememberMe: Math.random() > 0.5
  };
};

export const generateUserRegisterData = (): UserRegisterFormData => {
  const password = generateValidPassword();
  
  return {
    email: generateRandomEmail(),
    password,
    confirmPassword: password
  };
};

export const generateMentorRegisterData = (): MentorRegisterFormData => {
  const password = generateValidPassword();
  
  return {
    email: generateRandomEmail(),
    password,
    confirmPassword: password,
    specialization: generateRandomSpecialization(),
    contact: generateRandomTelegramContact(),
    tags: generateRandomTags()
  };
};

export const generateMockData = (count: number = 5) => {
  return {
    loginData: Array(count).fill(null).map(() => generateLoginData()),
    userData: Array(count).fill(null).map(() => generateUserRegisterData()),
    mentorData: Array(count).fill(null).map(() => generateMentorRegisterData())
  };
};
