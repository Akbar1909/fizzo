import { test } from "node:test";
import assert from "node:assert/strict";
import { checkAnswer, parseLenientNumber } from "./check-answer";
import type { OAnswer, Y2Answer } from "@/lib/content-types";

test("Y1: exact key match is correct", () => {
  assert.equal(checkAnswer("Y1", "A", "A").isCorrect, true);
});

test("Y1: wrong key is incorrect", () => {
  assert.equal(checkAnswer("Y1", "A", "B").isCorrect, false);
});

test("Y2: every pair must match", () => {
  const expected: Y2Answer = { "1": "C", "2": "A", "3": "D", "4": "B" };
  const result = checkAnswer("Y2", expected, { "1": "C", "2": "A", "3": "X", "4": "B" });
  assert.equal(result.isCorrect, false);
  assert.deepEqual(result.partResults, { "1": true, "2": true, "3": false, "4": true });
});

test("Y2: all pairs matching is correct", () => {
  const expected: Y2Answer = { "1": "C", "2": "A" };
  const result = checkAnswer("Y2", expected, { "1": "C", "2": "A" });
  assert.equal(result.isCorrect, true);
});

test("O: parses comma decimals leniently", () => {
  assert.equal(parseLenientNumber("3,6"), 3.6);
  assert.equal(parseLenientNumber(" 3.60 "), 3.6);
  assert.equal(parseLenientNumber("not a number"), null);
});

test("O: correct within relative tolerance", () => {
  const expected: OAnswer = { values: { a: 15 }, tolerance: 0.02 };
  assert.equal(checkAnswer("O", expected, { a: "15,2" }).isCorrect, true);
  assert.equal(checkAnswer("O", expected, { a: "20" }).isCorrect, false);
});

test("O: uses absolute tolerance when expected value is 0", () => {
  const expected: OAnswer = { values: { a: 0 }, tolerance: 0.05 };
  assert.equal(checkAnswer("O", expected, { a: "0.03" }).isCorrect, true);
  assert.equal(checkAnswer("O", expected, { a: "1" }).isCorrect, false);
});

test("O: all parts must be correct", () => {
  const expected: OAnswer = { values: { a: 15, b: 3.6 }, tolerance: 0.02 };
  const result = checkAnswer("O", expected, { a: "15", b: "10" });
  assert.equal(result.isCorrect, false);
  assert.deepEqual(result.partResults, { a: true, b: false });
});
