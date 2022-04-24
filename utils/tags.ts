import { DeckTag } from "domains/tags";
import { toLower, uniq } from "lodash";

export class TagsConverter {
  static toArray(input: string): string[] {
    if (input.trim().length === 0) {
      return [];
    }

    return input.split(",").map((tag) => tag.trim());
  }

  static extractNames(tagObjects: DeckTag[]): string[] {
    return tagObjects.reduce<string[]>((tags, tagObj) => {
      if (tagObj.tag) {
        return [...tags, tagObj.tag.name];
      }

      return tags;
    }, []);
  }

  static toString(tagObjects: DeckTag[]): string {
    return this.extractNames(tagObjects).join(", ");
  }

  static joinWithTagObjects(tags: string[], tagObjects: DeckTag[]): string[] {
    return tags.concat(this.extractNames(tagObjects));
  }

  static normalize(tags: string[]): string[] {
    return uniq(tags.map(toLower));
  }
}
