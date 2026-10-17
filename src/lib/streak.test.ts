import { test } from "node:test";
import assert from "node:assert/strict";
import {
  addDaysToTashkentString,
  displayStreak,
  nextStreak,
  tashkentDateString,
  tashkentHour,
  tashkentWeekdayIndex,
} from "./streak";

test("tashkentDateString: UTC 18:30 is already the next Tashkent day at UTC+5", () => {
  // 2026-03-04T18:30:00Z -> Tashkent 2026-03-04 23:30, still the same day
  assert.equal(tashkentDateString(new Date("2026-03-04T18:30:00Z")), "2026-03-04");
  // 2026-03-04T19:30:00Z -> Tashkent 2026-03-05 00:30, next day
  assert.equal(tashkentDateString(new Date("2026-03-04T19:30:00Z")), "2026-03-05");
});

test("nextStreak: same Tashkent day leaves streak unchanged", () => {
  const state = { streak: 3, bestStreak: 5, lastActiveOn: "2026-03-05" };
  const now = new Date("2026-03-05T10:00:00Z"); // Tashkent 15:00, same day
  assert.deepEqual(nextStreak(state, now), state);
});

test("nextStreak: next Tashkent day increments streak", () => {
  const state = { streak: 3, bestStreak: 5, lastActiveOn: "2026-03-05" };
  const now = new Date("2026-03-06T10:00:00Z");
  assert.deepEqual(nextStreak(state, now), {
    streak: 4,
    bestStreak: 5,
    lastActiveOn: "2026-03-06",
  });
});

test("nextStreak: a gap of more than one day resets to 1", () => {
  const state = { streak: 7, bestStreak: 7, lastActiveOn: "2026-03-01" };
  const now = new Date("2026-03-05T10:00:00Z");
  assert.deepEqual(nextStreak(state, now), {
    streak: 1,
    bestStreak: 7,
    lastActiveOn: "2026-03-05",
  });
});

test("nextStreak: bestStreak tracks the historical maximum", () => {
  const state = { streak: 2, bestStreak: 10, lastActiveOn: "2026-03-05" };
  const now = new Date("2026-03-06T10:00:00Z");
  assert.deepEqual(nextStreak(state, now), {
    streak: 3,
    bestStreak: 10,
    lastActiveOn: "2026-03-06",
  });
});

test("nextStreak: first-ever activity starts the streak at 1", () => {
  const state = { streak: 0, bestStreak: 0, lastActiveOn: null };
  const now = new Date("2026-03-05T10:00:00Z");
  assert.deepEqual(nextStreak(state, now), {
    streak: 1,
    bestStreak: 1,
    lastActiveOn: "2026-03-05",
  });
});

test("displayStreak: 0 when never active", () => {
  assert.equal(
    displayStreak({ streak: 0, bestStreak: 0, lastActiveOn: null }, new Date()),
    0,
  );
});

test("displayStreak: shows the streak when active today", () => {
  const state = { streak: 4, bestStreak: 4, lastActiveOn: "2026-03-05" };
  assert.equal(displayStreak(state, new Date("2026-03-05T10:00:00Z")), 4);
});

test("displayStreak: still shows the streak when active yesterday", () => {
  const state = { streak: 4, bestStreak: 4, lastActiveOn: "2026-03-05" };
  assert.equal(displayStreak(state, new Date("2026-03-06T10:00:00Z")), 4);
});

test("displayStreak: drops to 0 after a gap of two or more days", () => {
  const state = { streak: 4, bestStreak: 4, lastActiveOn: "2026-03-05" };
  assert.equal(displayStreak(state, new Date("2026-03-07T10:00:00Z")), 0);
});

test("tashkentWeekdayIndex: Monday is 0, Sunday is 6", () => {
  // 2024-01-01 was a Monday.
  assert.equal(tashkentWeekdayIndex(new Date("2024-01-01T10:00:00Z")), 0);
  assert.equal(tashkentWeekdayIndex(new Date("2024-01-07T10:00:00Z")), 6);
});

test("addDaysToTashkentString: adds and subtracts calendar days", () => {
  assert.equal(addDaysToTashkentString("2024-01-01", 6), "2024-01-07");
  assert.equal(addDaysToTashkentString("2024-01-07", -6), "2024-01-01");
});

test("Tashkent midnight boundary: just before and after local midnight", () => {
  // 2026-03-05T18:59:59Z = Tashkent 2026-03-05 23:59:59
  assert.equal(tashkentDateString(new Date("2026-03-05T18:59:59Z")), "2026-03-05");
  // 2026-03-05T19:00:00Z = Tashkent 2026-03-06 00:00:00
  assert.equal(tashkentDateString(new Date("2026-03-05T19:00:00Z")), "2026-03-06");
});

test("tashkentHour: UTC 10:00 is Tashkent 15:00 (UTC+5)", () => {
  assert.equal(tashkentHour(new Date("2026-03-05T10:00:00Z")), 15);
  // UTC 20:00 rolls past midnight to Tashkent 01:00
  assert.equal(tashkentHour(new Date("2026-03-05T20:00:00Z")), 1);
});
