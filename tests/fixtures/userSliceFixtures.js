export const initialState = {
  isLoggedIn: false,
  token: "",
  user: null,
};
export const demoUser = {
  id: 1,
  name: "Thulio",
  email: "thulio@gmail.com",
  image: "user.png",
  questionsCount: 5,
  answersCount: 4,
};
export const authenticatedState = {
  isLoggedIn: true,
  token: "abc123",
  user: demoUser,
};
