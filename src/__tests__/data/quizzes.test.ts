/**
 * Tests for quiz data
 */

import { describe, it, expect } from 'vitest';
import { quizzes, getQuizByCountryId, getQuestionBanks } from '../../data/quizzes';
import { countries } from '../../data/countries';

describe('quizzes data', () => {
  describe('quizzes array', () => {
    it('should have 10 entries (one per country)', () => {
      expect(quizzes).toHaveLength(10);
    });

    it('should have a quiz for each country', () => {
      const countryIds = countries.map((c) => c.id);
      const quizCountryIds = quizzes.map((q) => q.countryId);

      countryIds.forEach((countryId) => {
        expect(quizCountryIds).toContain(countryId);
      });
    });

    it('should have unique quiz IDs', () => {
      const ids = quizzes.map((q) => q.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(ids.length);
    });
  });

  describe('quiz structure', () => {
    it('should have exactly 3 questions per quiz', () => {
      quizzes.forEach((quiz) => {
        expect(quiz.questions).toHaveLength(3);
      });
    });

    it('should have exactly 4 options per question', () => {
      quizzes.forEach((quiz) => {
        quiz.questions.forEach((question) => {
          expect(question.options).toHaveLength(4);
        });
      });
    });

    it('should have correctAnswer that is one of the options', () => {
      quizzes.forEach((quiz) => {
        quiz.questions.forEach((question) => {
          expect(question.options).toContain(question.correctAnswer);
        });
      });
    });

    it('should have unique question IDs within each quiz', () => {
      quizzes.forEach((quiz) => {
        const questionIds = quiz.questions.map((q) => q.id);
        const uniqueIds = new Set(questionIds);
        expect(uniqueIds.size).toBe(questionIds.length);
      });
    });

    it('should have non-empty questionText for each question', () => {
      quizzes.forEach((quiz) => {
        quiz.questions.forEach((question) => {
          expect(question.questionText.length).toBeGreaterThan(0);
        });
      });
    });

    it('should have non-empty funFact for each question', () => {
      quizzes.forEach((quiz) => {
        quiz.questions.forEach((question) => {
          expect(question.funFact.length).toBeGreaterThan(0);
        });
      });
    });

    it('should have a name matching the country ID (capitalized)', () => {
      quizzes.forEach((quiz) => {
        // Name should be the capitalized version of countryId
        const expectedName = quiz.countryId.charAt(0).toUpperCase() + quiz.countryId.slice(1);
        expect(quiz.name).toBe(expectedName);
      });
    });
  });

  describe('getQuizByCountryId', () => {
    it('should return correct quiz for valid country ID', () => {
      const franceQuiz = getQuizByCountryId('france');
      expect(franceQuiz).toBeDefined();
      expect(franceQuiz!.countryId).toBe('france');
      expect(franceQuiz!.name).toBe('France');
    });

    it('should return correct quiz for each country', () => {
      countries.forEach((country) => {
        const quiz = getQuizByCountryId(country.id);
        expect(quiz).toBeDefined();
        expect(quiz!.countryId).toBe(country.id);
        // Name should be the capitalized version of countryId
        const expectedName = country.id.charAt(0).toUpperCase() + country.id.slice(1);
        expect(quiz!.name).toBe(expectedName);
      });
    });

    it('should return undefined for invalid country ID', () => {
      const result = getQuizByCountryId('invalid-country');
      expect(result).toBeUndefined();
    });

    it('should return undefined for empty string', () => {
      const result = getQuizByCountryId('');
      expect(result).toBeUndefined();
    });
  });

  describe('quiz content verification', () => {
    it('should have France quiz with 3 questions from the question bank', () => {
      const quiz = getQuizByCountryId('france');
      const questionBanks = getQuestionBanks();
      const franceQuestions = questionBanks['france'];

      expect(quiz).toBeDefined();
      expect(quiz!.questions).toHaveLength(3);
      // All questions should come from the France question bank
      quiz!.questions.forEach((q) => {
        const foundInBank = franceQuestions.some(
          (bankQ) => bankQ.id === q.id && bankQ.correctAnswer === q.correctAnswer
        );
        expect(foundInBank).toBe(true);
      });
    });

    it('should have Germany quiz with 3 questions from the question bank', () => {
      const quiz = getQuizByCountryId('germany');
      const questionBanks = getQuestionBanks();
      const germanyQuestions = questionBanks['germany'];

      expect(quiz).toBeDefined();
      expect(quiz!.questions).toHaveLength(3);
      // All questions should come from the Germany question bank
      quiz!.questions.forEach((q) => {
        const foundInBank = germanyQuestions.some(
          (bankQ) => bankQ.id === q.id && bankQ.correctAnswer === q.correctAnswer
        );
        expect(foundInBank).toBe(true);
      });
    });

    it('should have Japan quiz with 3 questions from the question bank', () => {
      const quiz = getQuizByCountryId('japan');
      const questionBanks = getQuestionBanks();
      const japanQuestions = questionBanks['japan'];

      expect(quiz).toBeDefined();
      expect(quiz!.questions).toHaveLength(3);
      // All questions should come from the Japan question bank
      quiz!.questions.forEach((q) => {
        const foundInBank = japanQuestions.some(
          (bankQ) => bankQ.id === q.id && bankQ.correctAnswer === q.correctAnswer
        );
        expect(foundInBank).toBe(true);
      });
    });

    it('should have USA quiz with 3 questions from the question bank', () => {
      const quiz = getQuizByCountryId('usa');
      const questionBanks = getQuestionBanks();
      const usaQuestions = questionBanks['usa'];

      expect(quiz).toBeDefined();
      expect(quiz!.questions).toHaveLength(3);
      // All questions should come from the USA question bank
      quiz!.questions.forEach((q) => {
        const foundInBank = usaQuestions.some(
          (bankQ) => bankQ.id === q.id && bankQ.correctAnswer === q.correctAnswer
        );
        expect(foundInBank).toBe(true);
      });
    });
  });
});
