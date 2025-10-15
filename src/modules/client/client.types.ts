// src/modules/client/client.types.ts
export type ClientCreateDTO = {
  firstName: string;
  lastName: string;
  address: string;
  dob: Date | string;
  email: string;
  cell: string;
  companyName: string;
  price: string;
  comments?: string | null;
};

export type ClientUpdateDTO = Partial<ClientCreateDTO>;
