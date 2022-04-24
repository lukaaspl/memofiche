import { DeckTag } from "domains/tags";
import { TagsConverter } from "../tags";

describe("TagsConverter", () => {
  test("converts comma-separated tags text to array with string trimmed elements", () => {
    const input = "languages,   self-development, english    ";
    const tags = TagsConverter.toArray(input);

    expect(tags).toStrictEqual(["languages", "self-development", "english"]);
  });

  test("converts array of tag objects to text ready to be put into the input", () => {
    const tagObjects: DeckTag[] = [
      { tag: { name: "languages" } },
      { tag: null }, // in case the tag object is invalid for some reason
      { tag: { name: "self-development" } },
      { tag: { name: "english" } },
    ];

    const tagsAsText = TagsConverter.toString(tagObjects);

    expect(tagsAsText).toBe("languages, self-development, english");
  });

  test("normalizes and removes duplicated tags", () => {
    const enteredTags = ["nutrition", "WORKOUT", "NuTrItIoN", "workout", "Gym"];
    const normalizedTags = TagsConverter.normalize(enteredTags);
    expect(normalizedTags).toStrictEqual(["nutrition", "workout", "gym"]);
  });
});
