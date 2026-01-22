/**
 * Tests for quiz data
 */

import { describe, it, expect } from 'vitest';
import { quizzes, getQuizByCountryId } from '../../data/quizzes';
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

    it('should have a name matching the country name', () => {
      quizzes.forEach((quiz) => {
        const country = countries.find((c) => c.id === quiz.countryId);
        expect(country).toBeDefined();
        expect(quiz.name).toBe(country!.name);
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
        expect(quiz!.name).toBe(country.name);
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
    it('should have France quiz with correct content', () => {
      const quiz = getQuizByCountryId('france');
      expect(quiz).toBeDefined();
      expect(quiz!.questions[0].questionText).toBe('What is the famous tower in Paris?');
      expect(quiz!.questions[0].correctAnswer).toBe('Eiffel Tower');
    });

    it('should have Germany quiz with correct content', () => {
      const quiz = getQuizByCountryId('germany');
      expect(quiz).toBeDefined();
      expect(quiz!.questions[0].questionText).toBe('What is Germany famous for making?');
      expect(quiz!.questions[0].correctAnswer).toBe('Cars');
    });

    it('should have Japan quiz with correct content', () => {
      const quiz = getQuizByCountryId('japan');
      expect(quiz).toBeDefined();
      expect(quiz!.questions[0].questionText).toBe('What famous mountain is in Japan?');
      expect(quiz!.questions[0].correctAnswer).toBe('Mount Fuji');
    });

    it('should have USA quiz with correct content', () => {
      const quiz = getQuizByCountryId('usa');
      expect(quiz).toBeDefined();
      expect(quiz!.questions[0].questionText).toBe('What statue welcomes visitors to New York?');
      expect(quiz!.questions[0].correctAnswer).toBe('Statue of Liberty');
    });
  });
});
