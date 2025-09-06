import PowiainaNum from "../src/index";
import P from "../src/index";

describe("P", () => {
  describe("initialization", () => {
    it("should initialize with NaN by default", () => {
      let p = new P();
      expect(
        p.array.length == 1 && isNaN(p.array[0].repeat) && !p.small,
      ).toBeTruthy();
    });
    it("should initialize with numbers by default", () => {
      let p = new P(0.2);
      expect(
        p.sign == 1 && p.array.length == 1 && p.array[0].repeat == 5 && p.small,
      ).toBeTruthy();
      let q = new P(1.3);
      expect(
        q.sign == 1 &&
          q.array.length == 1 &&
          q.array[0].repeat == 1.3 &&
          !q.small,
      ).toBeTruthy();
      let r = new P(0);
      expect(
        r.sign == 0 &&
          r.array.length == 1 &&
          r.array[0].repeat == Infinity &&
          r.small,
      ).toBeTruthy();
      let s = new P(-0.5);
      expect(
        s.array.length == 1 &&
          s.array[0].repeat == 2 &&
          s.small &&
          s.sign == -1,
      ).toBeTruthy();
      let t = new P(-1);
      expect(
        t.array.length == 1 &&
          t.array[0].repeat == 1 &&
          !t.small &&
          t.sign == -1,
      ).toBeTruthy();
    });
    it("should initialize large numbers correctly", () => {
      let u = new P(1e18);
      expect(
        u.array.length == 2 &&
          u.array[0].repeat == 18 &&
          u.array[1].arrow == 1 &&
          !u.small &&
          u.sign == 1,
      ).toBeTruthy();
    });
    it("should initialize strings correctly", () => {
      let testnum = [
        "0",
        "1",
        "-1",
        "0.01",
        `0.${"0".repeat(1145)}1`, //1e-1146
        "1e15",
        "1e16",
      ].map((x) => new P(x));
      expect(testnum[0].sign).toBe(0);
      expect(testnum[0].small).toBeTruthy();
      expect(
        testnum[0].array.length == 1 && testnum[0].array[0].repeat == Infinity,
      ).toBeTruthy();

      expect(testnum[1].sign == 1).toBeTruthy();
      expect(testnum[1].small).toBeFalsy();
      expect(
        testnum[1].array.length == 1 && testnum[1].array[0].repeat == 1,
      ).toBeTruthy();

      expect(testnum[2].sign == -1).toBeTruthy();
      expect(testnum[2].small).toBeFalsy();
      expect(
        testnum[2].array.length == 1 && testnum[2].array[0].repeat == 1,
      ).toBeTruthy();

      expect(testnum[3].sign).toBe(1);
      expect(testnum[3].small).toBeTruthy();
      expect(testnum[3].array.length).toBe(1);
      expect(testnum[3].array[0].repeat).toBe(100);

      expect(testnum[4].sign).toBe(1);
      expect(testnum[4].small).toBeTruthy();
      expect(testnum[4].array.length).toBe(2);
      expect(testnum[4].array[0].repeat).toBe(1146);
      expect(testnum[4].array[1].arrow).toBe(1);

      expect(testnum[5].sign).toBe(1);
      expect(testnum[5].small).toBeFalsy();
      expect(testnum[5].array.length).toBe(1);
      expect(testnum[5].array[0].repeat).toBe(1e15);

      expect(testnum[6].sign).toBe(1);
      expect(testnum[6].small).toBeFalsy();
      expect(testnum[6].array.length).toBe(2);
      expect(testnum[6].array[0].repeat).toBe(16);
      expect(testnum[6].array[1].arrow).toBe(1);
    });
  });
  describe("toNumber", () => {
    it("should return zero", () => {
      expect(new P(0).toNumber()).toBe(0);
    });
    it("should return 1", () => {
      expect(new P(1).toNumber()).toBe(1);
    });
    it("should return -1", () => {
      expect(new P(-1).toNumber()).toBe(-1);
    });
    it("should return 1e16", () => {
      expect(new P(1e16).toNumber()).toBe(1e16);
    });
    it("should return inf", () => {
      expect(new P("10^^e114514").toNumber()).toBe(1 / 0);
    });
  });
  describe("addition", () => {
    let randomnumbers = new Array(300)
      .fill(0)
      .map(() => Math.random() * 20 - 10);
    for (let i = 0; i < 100; i++) {
      let a = Math.floor(Math.random() * 300);
      let b = Math.floor(Math.random() * 300);
      if (b == a && a != 0) {
        b = 0;
      } else if (b == a && a == 0) {
        b = 3;
      }
      it(`addition${i}`, () =>
        expect(
          new PowiainaNum(randomnumbers[a]).add(randomnumbers[b]).toNumber(),
        ).toBeCloseTo(randomnumbers[a] + randomnumbers[b], 7));
    }
  });
  describe("multiply", () => {
    let randomnumbers = new Array(300)
      .fill(0)
      .map(() => Math.random() * 1e16 - 2e16);
    for (let i = 0; i < 100; i++) {
      let a = Math.floor(Math.random() * 300);
      let b = Math.floor(Math.random() * 300);
      if (b == a && a != 0) {
        b = 0;
      } else if (b == a && a == 0) {
        b = 3;
      }
      it(`multiply${i}`, () =>
        expect(
          new PowiainaNum(randomnumbers[a]).mul(randomnumbers[b]).toNumber(),
        ).toBeCloseTo(randomnumbers[a] * randomnumbers[b], -24));
    }
  });
});
