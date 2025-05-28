import { describe, it, expect } from "vitest";
import {
  userSlice,
  setCurrentUser,
  setLoggedInOut,
  setToken,
} from "./userSlice";
import {
  initialState,
  demoUser,
} from "../../../tests/fixtures/userSliceFixtures";

describe("userSlice", () => {
  it("should set login state", () => {
    const state = userSlice.reducer(initialState, setLoggedInOut(true));
    expect(state).toEqual({
      ...initialState,
      isLoggedIn: true,
    });
  });

  it("should set current user", () => {
    const state = userSlice.reducer(initialState, setCurrentUser(demoUser));
    expect(state).toEqual({
      ...initialState,
      user: demoUser,
    });
  });
  it("should set token", () => {
    const token = "abc123";
    const state = userSlice.reducer(initialState, setToken(token));
    expect(state).toEqual({
      ...initialState,
      token,
    });
  });
});
