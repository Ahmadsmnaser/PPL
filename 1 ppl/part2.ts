import * as R from "ramda";
import { pipe } from "ramda";

const stringToArray = R.split("");

/* Question 1 */
export const countVowels: (str: string) => number = (str: string) => {
    const strArray = stringToArray(str)
    let filteredArray = strArray.filter((char) => {
        return char === "a" || char === "e" || char === "i" || char === "o" || char === "u" || char === "A" || char === "E" || char === "I" || char === "O" || char === "U";
    });
    return filteredArray.length;
};

/* Question 2 */
export const isPaired = (str: string): boolean => {
    const strArr = stringToArray(str);
    const filteredArr = strArr.filter(char => ['(', ')', '[', ']', '{', '}'].includes(char));

    const counter1 = filteredArr.reduce((acc:number, cur:string) =>
        cur === '(' ? acc + 1 : (cur === ')' && acc !== 0) ? acc - 1 : acc, 0);
    const counter2 = filteredArr.reduce((acc:number, cur:string) =>
        cur === '{' ? acc + 1 : (cur === '}' && acc !== 0) ? acc - 1 : acc, 0);
    const counter3 = filteredArr.reduce((acc:number, cur:string) =>
        cur === '[' ? acc + 1 : (cur === ']' && acc !== 0) ? acc - 1 : acc, 0);
    return counter1 === 0 && counter2 === 0 && counter3 === 0;
};

/* Question 3 */
export type WordTree = {
    root: string
    children: WordTree[]
}
const concatWithSpace = (acc: string, word: string): string =>
    acc === "" ? word : `${acc} ${word}`

const concatWordsInTree = (tree: WordTree): string[] => {
    const rootWords = [tree.root];
    const childrenWords = tree.children.map(concatWordsInTree);
    return [rootWords, ...childrenWords].reduce((acc, val) => acc.concat(val), []);
};
const concatWords = (words: string[]): string =>
    words.reduce(concatenateWithSpace);

const concatenateWithSpace = (str1: string, str2: string): string =>
    str1 + " " + str2;

export const treeToSentence: (tree: WordTree) => string = pipe(
    concatWordsInTree,
    concatWords
);