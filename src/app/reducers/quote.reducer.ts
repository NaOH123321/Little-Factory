import { Quote } from './../domain';
import * as quoteAction from '../actions/quote.action';

export interface State {
    quote: Quote;
};

const initialState: State = {
    quote: {
        cn: "当你百分之百地相信一个人，最终可能出现两种结果：要么找到一生的伴侣，要么得到一生的教训",
        en: " When you fully trust a person without any doubt, you finally get one of the two results: a person for life, or a lesson for life",
        pic: "/assets/img/quote_fallback.jpg"
    }
};

export function reducer(state = initialState, action: quoteAction.QuoteActions): State {
    switch (action.type) {
        case quoteAction.QuoteActionTypes.QUOTE_SUCCESS: {
            return { ...state, quote: action.payload };
        }
        case quoteAction.QuoteActionTypes.QUOTE_FAIL:
        default: {
            return state;
        }
    }
}

export const getQuote = (state: State) => state.quote;