import { SET_SENTENCES, SET_MODE, SET_VISIBILITY } from './actionTypes'

export const setSentences = sentences => ({
  type: SET_SENTENCES,
  payload: {
    sentences
  }
})
export const setMode = mode => ({
  type: SET_MODE,
  payload: {
    mode
  }
})
export const setVisibility = visible => ({
  type: SET_VISIBILITY,
  payload: {
    visible
  }
})
