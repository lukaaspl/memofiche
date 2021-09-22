import { DetailedDeck } from "domains/deck";

export class TagsConverter {
  static toArray(input: string): string[] {
    if (input.trim().length === 0) {
      return [];
    }

    return input.split(",").map((tag) => tag.trim());
  }

  static toString(tagObjects: DetailedDeck["tags"]): string {
    return tagObjects
      .reduce<string[]>((tags, tagObj) => {
        if (tagObj.tag) {
          return [...tags, tagObj.tag.name];
        }

        return tags;
      }, [])
      .join(", ");
  }
}
