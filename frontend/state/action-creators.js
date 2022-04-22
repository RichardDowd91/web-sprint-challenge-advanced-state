// ❗ You don't need to add extra action creators to achieve MVP
import * as types from './action-types'
import axios from 'axios'

export function moveClockwise(value) {
  return {type: types.MOVE_CLOCKWISE, payload: value }
 }

export function moveCounterClockwise(value) {
  return {type: types.MOVE_COUNTERCLOCKWISE, payload: value}
 }

export function selectAnswer(answer_id) { 
  return {type: types.SET_SELECTED_ANSWER, payload: answer_id}
}

export function setMessage(message) { 
  return {type: types.SET_INFO_MESSAGE, payload: message}
}

export function setQuiz(question) {
  return {type: types.SET_QUIZ_INTO_STATE, payload: question}
 }

export function inputChange(value) {
  return {type: types.INPUT_CHANGE, payload: value}
 }

export function resetForm() { 
  return {type: types.RESET_FORM}
}

// ❗ Async action creators
export function fetchQuiz() {
  return function (dispatch) {
    // First, dispatch an action to reset the quiz state (so the "Loading next quiz..." message can display)
    // On successful GET:
    // - Dispatch an action to send the obtained quiz to its state
    dispatch(setQuiz(null))
    axios.get('http://localhost:9000/api/quiz/next')
      .then(res => {
        dispatch(setQuiz(res.data))
      })
      .catch(err => {
        console.log(err);
        dispatch(setMessage(err.message))
      })
  }
}
export function postAnswer({ quiz_id, answer_id }) {
  return function (dispatch) {
    // On successful POST:
    // - Dispatch an action to reset the selected answer state
    // - Dispatch an action to set the server message to state
    // - Dispatch the fetching of the next quiz
    axios.post('http://localhost:9000/api/quiz/answer', { quiz_id, answer_id })
      .then(res => {
        dispatch(selectAnswer(null))
        dispatch(setMessage(res.data.message))
        dispatch(fetchQuiz())
        // dispatch(setQuiz(null))
      })
      .catch( err => {
        console.log(err);
        dispatch(setMessage(err.message))
      })
  }
}
export function postQuiz({ question_text, true_answer_text, false_answer_text }) {
  return function (dispatch) {
    // On successful POST:
    // - Dispatch the correct message to the the appropriate state
    // - Dispatch the resetting of the form
    axios.post('http://localhost:9000/api/quiz/new', { question_text, true_answer_text, false_answer_text })
      .then(res => {
        dispatch(setMessage(`Congrats: "${res.data.question}" is a great question!`))
        dispatch(resetForm())
      })
      .catch(err => {
        console.log(err);
        dispatch(setMessage(err.message))
      })
  }
}
// ❗ On promise rejections, use log statements or breakpoints, and put an appropriate error message in state