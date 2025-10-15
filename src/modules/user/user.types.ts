// src/modules/user/user.types.ts
export type UserCreateDTO = {
  name: string;
  email: string;
  password: string;
  role?: 'ADMIN';
  userImage?: string;
};

export type UserLoginDTO = {
  email: string;
  password: string;
};

export type UserUpdateDTO = Partial<UserCreateDTO>;
