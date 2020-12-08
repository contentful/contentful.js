import normalizeSelect from "../../../lib/utils/normalize-select";

describe("normalizeSelect", () => {
  test("normalizeSelect does nothing if sys is selected", () => {
    const query = {
      select: "fields.foo,sys"
    };
    const normalized = normalizeSelect(query);
    expect(normalized.select).toBe("fields.foo,sys");
  });

  test("normalizeSelect adds required properties if sys is not selected", () => {
    const query = {
      select: "fields.foo"
    };
    const normalized = normalizeSelect(query);
    expect(normalized.select).toBe("fields.foo,sys.id,sys.type");
  });

  test("normalizeSelect adds required properties if different sys properties are selected", () => {
    const query = {
      select: "fields.foo,sys.createdAt"
    };
    const normalized = normalizeSelect(query);
    expect(normalized.select).toBe("fields.foo,sys.createdAt,sys.id,sys.type");
  });

  test("normalizeSelect adds required properties if only some required sys properties are selected", () => {
    const query = {
      select: "fields.foo,sys.type"
    };
    const normalized = normalizeSelect(query);
    expect(normalized.select).toBe("fields.foo,sys.type,sys.id");
  });
});
