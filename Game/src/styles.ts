import { getColorOnSpectrum } from "./app/utils";

export const text = "#110813";
export const primaryText = "#f7f3fc";
export const background = "#f8f2fa";
export const primary = "#a64cb8";
export const secondary = "#d4d79b";
export const accent = "#8ac873";
export const answer1 = "#d41938";
export const answer2 = "#1368ce";
export const answer3 = "#d89e00";
export const answer4 = "#26890c";
export const answer5 = "#0aa3a3";
export const answer6 = "#864cbf";

export const maxPlayersNeededToNotAnimate = 10;

export function getAnswerColorFromIndex(index: number, pictureQuestionNumberOfAnswerOptions = NaN) {
    return !isNaN(pictureQuestionNumberOfAnswerOptions) ?
        getColorOnSpectrum(index, 0, pictureQuestionNumberOfAnswerOptions, +30)
        :
        [answer1, answer2, answer3, answer4, answer5, answer6][index];
}