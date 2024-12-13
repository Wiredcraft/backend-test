// mock
const user = {
  name: "Test jest",
  email: `test${Date.now()}@gmail.com`,
  password: "!Test12345",
  dob: "1999/09/14",
  address: {
    street: "Avenida teste",
    number: 24,
    city: "Teste town",
  },
  location: {
    type: "Point",
    coordinates: [-46.625454, -23.533394],
  },
  description: "Test description",
};

const user2 = {
  name: "Test jest",
  email: `test${Date.now()}@hotmail.com`,
  password: "!Test12345",
  dob: "1999/09/14",
  address: {
    street: "Avenida teste",
    number: 24,
    city: "Teste town",
  },
  location: {
    type: "Point",
    coordinates: [-46.625454, -23.533394],
  },
  description: "Test description",
};

const user3 = {
  name: "Test jest",
  email: `test${Date.now()}@yahoo.com`,
  password: "!Test12345",
  dob: "1999/09/14",
  address: {
    street: "Avenida teste",
    number: 24,
    city: "Teste town",
  },
  location: {
    type: "Point",
    coordinates: [-46.625454, -23.533394],
  },
  description: "Test description",
};

const user4 = {
  name: "Test jest",
  email: `test${Date.now()}@outlook.com`,
  password: "!Test12345",
  dob: "1999/09/14",
  address: {
    street: "Avenida teste",
    number: 24,
    city: "Teste town",
  },
  location: {
    type: "Point",
    coordinates: [-46.625454, -23.533394],
  },
  description: "Test description",
};

export const userData = {
  name: user.name,
  email: user.email,
  password: user.password,
  dateBirth: user.dob,
  address: user.address,
  location: user.location,
  description: user.description,
};

export const userData2 = {
  name: user2.name,
  email: user2.email,
  password: user2.password,
  dateBirth: user2.dob,
  address: user2.address,
  location: user2.location,
  description: user2.description,
};

export const userData3 = {
  name: user3.name,
  email: user3.email,
  password: user3.password,
  dateBirth: user3.dob,
  address: user3.address,
  location: user3.location,
  description: user3.description,
};

export const userData4 = {
  name: user4.name,
  email: user4.email,
  password: user4.password,
  dateBirth: user4.dob,
  address: user4.address,
  location: user4.location,
  description: user4.description,
};
