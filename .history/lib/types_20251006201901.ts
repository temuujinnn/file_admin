export interface Game {
  _id: string;
  title: string;
  description: string;
  path: string;
  imageUrl: string;
  mainTag: "Game" | "Software";
  additionalTags: (string | AdditionalTag)[];
  createdAt?: string;
  updatedAt?: string;
}

export interface AdditionalTag {
  _id: string;
  name: string;
  belongsTo?: string;
  createdAt?: string;
}

export interface User {
  _id: string;
  username?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  subscriptionEndDate?: string;
  isSubscribed: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}
