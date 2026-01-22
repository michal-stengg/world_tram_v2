import { describe, test, expect, beforeEach } from 'vitest'
import { act } from '@testing-library/react'
import { useGameStore } from '../../stores/gameStore'
import { quizzes, getQuizByCountryId } from '../../data/quizzes'
import { countries } from '../../data/countries'
import { calculateQuizReward, getQuizRating } from '../../logic/quizzes'
import { STARTING_RESOURCES } from '../../data/constants'

describe('Phase 11: Country Quiz Integration', () => {
  beforeEach(() => {
    // Reset store to initial state
    act(() => {
      useGameStore.setState({
        currentQuiz: null,
        quizAnswers: new Map(),
        currentQuestionIndex: 0,
        lastQuizResult: null,
        resources: { ...STARTING_RESOURCES },
      })
    })
  })

  describe('Quiz Data', () => {
    test('all 10 countries have quizzes', () => {
      countries.forEach(country => {
        const quiz = getQuizByCountryId(country.id)
        expect(quiz).toBeDefined()
        expect(quiz!.countryId).toBe(country.id)
      })
    })

    test('each quiz has exactly 3 questions', () => {
      quizzes.forEach(quiz => {
        expect(quiz.questions).toHaveLength(3)
      })
    })

    test('each question has 4 options and a correctAnswer', () => {
      quizzes.forEach(quiz => {
        quiz.questions.forEach(question => {
          expect(question.options).toHaveLength(4)
          expect(question.correctAnswer).toBeDefined()
          expect(question.options).toContain(question.correctAnswer)
        })
      })
    })

    test('each country has exactly one quiz', () => {
      const countryIds = countries.map(c => c.id)
      const quizCountryIds = quizzes.map(q => q.countryId)

      // Every country ID should appear exactly once in quizzes
      countryIds.forEach(countryId => {
        const occurrences = quizCountryIds.filter(id => id === countryId).length
        expect(occurrences).toBe(1)
      })
    })

    test('all quizzes have required properties', () => {
      quizzes.forEach(quiz => {
        expect(quiz.id).toBeDefined()
        expect(quiz.countryId).toBeDefined()
        expect(quiz.name).toBeDefined()
        expect(quiz.questions).toBeDefined()
      })
    })

    test('all questions have required properties', () => {
      quizzes.forEach(quiz => {
        quiz.questions.forEach(question => {
          expect(question.id).toBeDefined()
          expect(question.questionText).toBeDefined()
          expect(question.options).toBeDefined()
          expect(question.correctAnswer).toBeDefined()
          expect(question.funFact).toBeDefined()
        })
      })
    })
  })

  describe('Starting Quiz', () => {
    test('startQuiz loads the correct country quiz', () => {
      const { startQuiz } = useGameStore.getState()

      act(() => {
        startQuiz('france')
      })

      const { currentQuiz } = useGameStore.getState()
      expect(currentQuiz).not.toBeNull()
      expect(currentQuiz!.countryId).toBe('france')
      expect(currentQuiz!.name).toBe('France')
    })

    test('startQuiz resets quiz answers map', () => {
      // First, set up some existing answers
      act(() => {
        useGameStore.setState({
          quizAnswers: new Map([['old-question', 'old-answer']]),
        })
      })

      const { startQuiz } = useGameStore.getState()

      act(() => {
        startQuiz('germany')
      })

      const { quizAnswers } = useGameStore.getState()
      expect(quizAnswers.size).toBe(0)
    })

    test('startQuiz sets currentQuestionIndex to 0', () => {
      // First, set up a different index
      act(() => {
        useGameStore.setState({
          currentQuestionIndex: 2,
        })
      })

      const { startQuiz } = useGameStore.getState()

      act(() => {
        startQuiz('japan')
      })

      const { currentQuestionIndex } = useGameStore.getState()
      expect(currentQuestionIndex).toBe(0)
    })

    test('startQuiz works for all countries', () => {
      countries.forEach(country => {
        act(() => {
          useGameStore.setState({ currentQuiz: null })
        })

        const { startQuiz } = useGameStore.getState()

        act(() => {
          startQuiz(country.id)
        })

        const { currentQuiz } = useGameStore.getState()
        expect(currentQuiz).not.toBeNull()
        expect(currentQuiz!.countryId).toBe(country.id)
      })
    })

    test('startQuiz does not set currentQuiz for invalid country', () => {
      const { startQuiz } = useGameStore.getState()

      act(() => {
        startQuiz('invalid-country')
      })

      const { currentQuiz } = useGameStore.getState()
      expect(currentQuiz).toBeNull()
    })
  })

  describe('Answering Questions', () => {
    test('answerQuestion records answers correctly', () => {
      const { startQuiz, answerQuestion } = useGameStore.getState()

      act(() => {
        startQuiz('france')
      })

      const { currentQuiz } = useGameStore.getState()
      const questionId = currentQuiz!.questions[0].id

      act(() => {
        answerQuestion(questionId, 'Eiffel Tower')
      })

      const { quizAnswers } = useGameStore.getState()
      expect(quizAnswers.get(questionId)).toBe('Eiffel Tower')
    })

    test('answers persist across multiple questions', () => {
      const { startQuiz, answerQuestion } = useGameStore.getState()

      act(() => {
        startQuiz('france')
      })

      const { currentQuiz } = useGameStore.getState()
      const q1Id = currentQuiz!.questions[0].id
      const q2Id = currentQuiz!.questions[1].id

      act(() => {
        answerQuestion(q1Id, 'Eiffel Tower')
      })
      act(() => {
        answerQuestion(q2Id, 'Croissants')
      })

      const { quizAnswers } = useGameStore.getState()
      expect(quizAnswers.get(q1Id)).toBe('Eiffel Tower')
      expect(quizAnswers.get(q2Id)).toBe('Croissants')
    })

    test('can answer all 3 questions', () => {
      const { startQuiz, answerQuestion } = useGameStore.getState()

      act(() => {
        startQuiz('france')
      })

      const { currentQuiz } = useGameStore.getState()

      act(() => {
        answerQuestion(currentQuiz!.questions[0].id, 'Eiffel Tower')
      })
      act(() => {
        answerQuestion(currentQuiz!.questions[1].id, 'Croissants')
      })
      act(() => {
        answerQuestion(currentQuiz!.questions[2].id, 'French')
      })

      const { quizAnswers } = useGameStore.getState()
      expect(quizAnswers.size).toBe(3)
    })

    test('can overwrite a previous answer', () => {
      const { startQuiz, answerQuestion } = useGameStore.getState()

      act(() => {
        startQuiz('france')
      })

      const { currentQuiz } = useGameStore.getState()
      const questionId = currentQuiz!.questions[0].id

      act(() => {
        answerQuestion(questionId, 'Big Ben')
      })
      act(() => {
        answerQuestion(questionId, 'Eiffel Tower')
      })

      const { quizAnswers } = useGameStore.getState()
      expect(quizAnswers.get(questionId)).toBe('Eiffel Tower')
      expect(quizAnswers.size).toBe(1)
    })
  })

  describe('Quiz Completion - Score Calculation', () => {
    test('3/3 correct gives reward = $30 and rating = "Quiz Master"', () => {
      expect(calculateQuizReward(3)).toBe(30)
      expect(getQuizRating(3)).toContain('Quiz Master')
    })

    test('2/3 correct gives reward = $20 and rating = "Great Job"', () => {
      expect(calculateQuizReward(2)).toBe(20)
      expect(getQuizRating(2)).toContain('Great Job')
    })

    test('1/3 correct gives reward = $10 and rating = "Good Try"', () => {
      expect(calculateQuizReward(1)).toBe(10)
      expect(getQuizRating(1)).toContain('Good Try')
    })

    test('0/3 correct gives reward = $5 and rating = "Keep Learning"', () => {
      expect(calculateQuizReward(0)).toBe(5)
      expect(getQuizRating(0)).toContain('Keep Learning')
    })

    test('completeQuiz calculates score correctly with all correct answers', () => {
      const { startQuiz, answerQuestion, completeQuiz } = useGameStore.getState()

      act(() => {
        startQuiz('france')
      })

      const { currentQuiz } = useGameStore.getState()

      // Answer all questions correctly
      act(() => {
        answerQuestion(currentQuiz!.questions[0].id, 'Eiffel Tower')
      })
      act(() => {
        answerQuestion(currentQuiz!.questions[1].id, 'Croissants')
      })
      act(() => {
        answerQuestion(currentQuiz!.questions[2].id, 'French')
      })
      act(() => {
        completeQuiz()
      })

      const { lastQuizResult } = useGameStore.getState()
      expect(lastQuizResult).not.toBeNull()
      expect(lastQuizResult!.score).toBe(3)
      expect(lastQuizResult!.reward).toBe(30)
      expect(lastQuizResult!.rating).toContain('Quiz Master')
    })

    test('completeQuiz calculates score correctly with 2 correct answers', () => {
      const { startQuiz, answerQuestion, completeQuiz } = useGameStore.getState()

      act(() => {
        startQuiz('france')
      })

      const { currentQuiz } = useGameStore.getState()

      // Answer 2 questions correctly, 1 wrong
      act(() => {
        answerQuestion(currentQuiz!.questions[0].id, 'Eiffel Tower') // correct
      })
      act(() => {
        answerQuestion(currentQuiz!.questions[1].id, 'Tacos') // wrong
      })
      act(() => {
        answerQuestion(currentQuiz!.questions[2].id, 'French') // correct
      })
      act(() => {
        completeQuiz()
      })

      const { lastQuizResult } = useGameStore.getState()
      expect(lastQuizResult!.score).toBe(2)
      expect(lastQuizResult!.reward).toBe(20)
    })

    test('completeQuiz calculates score correctly with 1 correct answer', () => {
      const { startQuiz, answerQuestion, completeQuiz } = useGameStore.getState()

      act(() => {
        startQuiz('france')
      })

      const { currentQuiz } = useGameStore.getState()

      // Answer 1 question correctly, 2 wrong
      act(() => {
        answerQuestion(currentQuiz!.questions[0].id, 'Big Ben') // wrong
      })
      act(() => {
        answerQuestion(currentQuiz!.questions[1].id, 'Tacos') // wrong
      })
      act(() => {
        answerQuestion(currentQuiz!.questions[2].id, 'French') // correct
      })
      act(() => {
        completeQuiz()
      })

      const { lastQuizResult } = useGameStore.getState()
      expect(lastQuizResult!.score).toBe(1)
      expect(lastQuizResult!.reward).toBe(10)
    })

    test('completeQuiz calculates score correctly with 0 correct answers', () => {
      const { startQuiz, answerQuestion, completeQuiz } = useGameStore.getState()

      act(() => {
        startQuiz('france')
      })

      const { currentQuiz } = useGameStore.getState()

      // Answer all questions wrong
      act(() => {
        answerQuestion(currentQuiz!.questions[0].id, 'Big Ben') // wrong
      })
      act(() => {
        answerQuestion(currentQuiz!.questions[1].id, 'Tacos') // wrong
      })
      act(() => {
        answerQuestion(currentQuiz!.questions[2].id, 'German') // wrong
      })
      act(() => {
        completeQuiz()
      })

      const { lastQuizResult } = useGameStore.getState()
      expect(lastQuizResult!.score).toBe(0)
      expect(lastQuizResult!.reward).toBe(5)
      expect(lastQuizResult!.rating).toContain('Keep Learning')
    })
  })

  describe('Reward Application', () => {
    test('completeQuiz applies money reward to resources', () => {
      const initialMoney = useGameStore.getState().resources.money
      const { startQuiz, answerQuestion, completeQuiz } = useGameStore.getState()

      act(() => {
        startQuiz('france')
      })

      const { currentQuiz } = useGameStore.getState()

      // Answer all correctly for max reward of $30
      act(() => {
        answerQuestion(currentQuiz!.questions[0].id, 'Eiffel Tower')
      })
      act(() => {
        answerQuestion(currentQuiz!.questions[1].id, 'Croissants')
      })
      act(() => {
        answerQuestion(currentQuiz!.questions[2].id, 'French')
      })
      act(() => {
        completeQuiz()
      })

      const { resources } = useGameStore.getState()
      expect(resources.money).toBe(initialMoney + 30)
    })

    test('initial money + reward = new money', () => {
      // Test with different initial money values
      act(() => {
        useGameStore.setState({
          resources: { ...STARTING_RESOURCES, money: 100 },
        })
      })

      const { startQuiz, answerQuestion, completeQuiz } = useGameStore.getState()

      act(() => {
        startQuiz('germany')
      })

      const { currentQuiz } = useGameStore.getState()

      // Answer 2 correctly for $20 reward
      act(() => {
        answerQuestion(currentQuiz!.questions[0].id, 'Cars') // correct
      })
      act(() => {
        answerQuestion(currentQuiz!.questions[1].id, 'Gummy bears') // correct
      })
      act(() => {
        answerQuestion(currentQuiz!.questions[2].id, 'Amazon') // wrong
      })
      act(() => {
        completeQuiz()
      })

      const { resources } = useGameStore.getState()
      expect(resources.money).toBe(100 + 20)
    })

    test('lastQuizResult is set correctly after completion', () => {
      const { startQuiz, answerQuestion, completeQuiz } = useGameStore.getState()

      act(() => {
        startQuiz('france')
      })

      const { currentQuiz } = useGameStore.getState()

      act(() => {
        answerQuestion(currentQuiz!.questions[0].id, 'Eiffel Tower')
      })
      act(() => {
        answerQuestion(currentQuiz!.questions[1].id, 'Croissants')
      })
      act(() => {
        answerQuestion(currentQuiz!.questions[2].id, 'French')
      })
      act(() => {
        completeQuiz()
      })

      const { lastQuizResult } = useGameStore.getState()
      expect(lastQuizResult).not.toBeNull()
      expect(lastQuizResult!.score).toBe(3)
      expect(lastQuizResult!.totalQuestions).toBe(3)
      expect(lastQuizResult!.reward).toBe(30)
      expect(lastQuizResult!.rating).toContain('Quiz Master')
    })

    test('completeQuiz clears currentQuiz', () => {
      const { startQuiz, answerQuestion, completeQuiz } = useGameStore.getState()

      act(() => {
        startQuiz('france')
      })

      expect(useGameStore.getState().currentQuiz).not.toBeNull()

      const { currentQuiz } = useGameStore.getState()

      act(() => {
        answerQuestion(currentQuiz!.questions[0].id, 'Eiffel Tower')
      })
      act(() => {
        answerQuestion(currentQuiz!.questions[1].id, 'Croissants')
      })
      act(() => {
        answerQuestion(currentQuiz!.questions[2].id, 'French')
      })
      act(() => {
        completeQuiz()
      })

      expect(useGameStore.getState().currentQuiz).toBeNull()
    })

    test('completeQuiz does nothing when no quiz is active', () => {
      const initialMoney = useGameStore.getState().resources.money
      const { completeQuiz } = useGameStore.getState()

      act(() => {
        completeQuiz()
      })

      const { resources, lastQuizResult } = useGameStore.getState()
      expect(resources.money).toBe(initialMoney)
      expect(lastQuizResult).toBeNull()
    })
  })

  describe('Skip Quiz', () => {
    test('skipQuiz clears quiz state', () => {
      const { startQuiz, answerQuestion, skipQuiz } = useGameStore.getState()

      act(() => {
        startQuiz('france')
      })

      const { currentQuiz } = useGameStore.getState()

      act(() => {
        answerQuestion(currentQuiz!.questions[0].id, 'Eiffel Tower')
      })
      act(() => {
        skipQuiz()
      })

      const state = useGameStore.getState()
      expect(state.currentQuiz).toBeNull()
      expect(state.quizAnswers.size).toBe(0)
      expect(state.currentQuestionIndex).toBe(0)
    })

    test('skipQuiz does not apply any reward', () => {
      const initialMoney = useGameStore.getState().resources.money
      const { startQuiz, skipQuiz } = useGameStore.getState()

      act(() => {
        startQuiz('france')
      })

      act(() => {
        skipQuiz()
      })

      const { resources } = useGameStore.getState()
      expect(resources.money).toBe(initialMoney)
    })

    test('money remains unchanged after skip', () => {
      act(() => {
        useGameStore.setState({
          resources: { ...STARTING_RESOURCES, money: 150 },
        })
      })

      const { startQuiz, answerQuestion, skipQuiz } = useGameStore.getState()

      act(() => {
        startQuiz('germany')
      })

      const { currentQuiz } = useGameStore.getState()

      // Answer some questions
      act(() => {
        answerQuestion(currentQuiz!.questions[0].id, 'Cars')
      })
      act(() => {
        answerQuestion(currentQuiz!.questions[1].id, 'Gummy bears')
      })

      // Skip instead of completing
      act(() => {
        skipQuiz()
      })

      const { resources } = useGameStore.getState()
      expect(resources.money).toBe(150)
    })

    test('skipQuiz can be called when no quiz is active', () => {
      const { skipQuiz } = useGameStore.getState()

      // Should not throw
      act(() => {
        skipQuiz()
      })

      const { currentQuiz } = useGameStore.getState()
      expect(currentQuiz).toBeNull()
    })
  })

  describe('Question Navigation', () => {
    test('nextQuestion increments currentQuestionIndex', () => {
      const { startQuiz, nextQuestion } = useGameStore.getState()

      act(() => {
        startQuiz('france')
      })

      expect(useGameStore.getState().currentQuestionIndex).toBe(0)

      act(() => {
        nextQuestion()
      })

      expect(useGameStore.getState().currentQuestionIndex).toBe(1)

      act(() => {
        nextQuestion()
      })

      expect(useGameStore.getState().currentQuestionIndex).toBe(2)
    })
  })

  describe('Store Initialization', () => {
    test('initializeGame resets quiz state', () => {
      const { startQuiz, answerQuestion, initializeGame } = useGameStore.getState()

      // Set up captain and train for initialization
      act(() => {
        useGameStore.setState({
          selectedCaptain: { id: 'test', name: 'Test', origin: 'Test', description: 'Test', portrait: '1', stats: { engineering: 1, food: 1, security: 1 } },
          selectedTrain: { id: 'test', name: 'Test', origin: 'Test', character: 'Test', sprite: '1', stats: { speed: 1, reliability: 1, power: 1 } },
        })
      })

      act(() => {
        startQuiz('france')
      })

      const { currentQuiz } = useGameStore.getState()

      act(() => {
        answerQuestion(currentQuiz!.questions[0].id, 'Eiffel Tower')
      })

      // Initialize game should reset quiz state
      act(() => {
        initializeGame()
      })

      const state = useGameStore.getState()
      expect(state.currentQuiz).toBeNull()
      expect(state.quizAnswers.size).toBe(0)
      expect(state.currentQuestionIndex).toBe(0)
      expect(state.lastQuizResult).toBeNull()
    })
  })

  describe('Quiz Data Consistency', () => {
    test('France quiz has correct questions', () => {
      const quiz = getQuizByCountryId('france')
      expect(quiz!.name).toBe('France')
      expect(quiz!.questions[0].correctAnswer).toBe('Eiffel Tower')
      expect(quiz!.questions[1].correctAnswer).toBe('Croissants')
      expect(quiz!.questions[2].correctAnswer).toBe('French')
    })

    test('Germany quiz has correct questions', () => {
      const quiz = getQuizByCountryId('germany')
      expect(quiz!.name).toBe('Germany')
      expect(quiz!.questions[0].correctAnswer).toBe('Cars')
      expect(quiz!.questions[1].correctAnswer).toBe('Gummy bears')
      expect(quiz!.questions[2].correctAnswer).toBe('Black Forest')
    })

    test('Japan quiz has correct questions', () => {
      const quiz = getQuizByCountryId('japan')
      expect(quiz!.name).toBe('Japan')
      expect(quiz!.questions[0].correctAnswer).toBe('Mount Fuji')
      expect(quiz!.questions[1].correctAnswer).toBe('Cherry blossoms')
      expect(quiz!.questions[2].correctAnswer).toBe('Bullet trains')
    })

    test('USA quiz has correct questions', () => {
      const quiz = getQuizByCountryId('usa')
      expect(quiz!.name).toBe('USA')
      expect(quiz!.questions[0].correctAnswer).toBe('Statue of Liberty')
      expect(quiz!.questions[1].correctAnswer).toBe('Mount Rushmore')
      expect(quiz!.questions[2].correctAnswer).toBe('Popcorn')
    })
  })
})
